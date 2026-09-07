"""Generate docs/.vitepress/data/rooms.ts from the room-checking CSV.

The sheet is 114 rooms x 20 equipment and software columns. Transcribing that by
hand would be 2280 chances to make a mistake, so it is machine-read instead:
run this after the CSV changes and diff the result.

    python3 scripts/build-rooms-data.py     # from the repo root

Every cell is kept as the sheet writes it, with three deliberate exceptions,
all of them spelling rather than data — see NOTES below.
"""
import csv
import pathlib
import re
import sys

CSV = pathlib.Path("ref/Summer Helpers 2026 - Room Equipment List.csv")
OUT = pathlib.Path("docs/.vitepress/data/rooms.ts")

# ---------------------------------------------------------------------------
# Columns
# ---------------------------------------------------------------------------

# CSV column index -> the key used in `rooms.ts` and in the `rooms.attr.*`
# translation keys. The sheet's own banner row files "PC with Dual Monitors" and
# "Notebook with Single Monitor" under `Display`; they are split out here into
# their own group because a reader looking for the lectern computer is not
# looking for a screen.
COLUMNS = [
    (3, "pcDual"),
    (4, "notebook"),
    (5, "projector"),
    (6, "displayPanel"),
    (7, "visualizer"),
    (8, "webcam"),
    (9, "ptz"),
    (10, "usbBluray"),
    (11, "cdRom"),
    (12, "wirelessGateway"),
    (13, "gooseneckMic"),
    (14, "irWirelessMic"),
    (15, "digitalWirelessMic"),
    (16, "wiredMic"),
    (17, "ceilingMic"),
    (18, "printer"),
    (19, "xclass"),
    (20, "spssAmos"),
    (21, "sdl"),
    (22, "matlab"),
]

# The order the detail panel renders, and the `rooms.group.*` keys.
GROUPS = [
    ("teachingStation", ["pcDual", "notebook"]),
    ("display", ["projector", "displayPanel", "visualizer"]),
    ("camera", ["webcam", "ptz"]),
    ("opticalDrive", ["usbBluray", "cdRom"]),
    ("network", ["wirelessGateway"]),
    ("mic", ["gooseneckMic", "irWirelessMic", "digitalWirelessMic", "wiredMic", "ceilingMic"]),
    ("printer", ["printer"]),
    ("software", ["xclass", "spssAmos", "sdl", "matlab"]),
]

# ---------------------------------------------------------------------------
# Cell vocabulary
# ---------------------------------------------------------------------------

# Every qualifier the sheet writes inside a cell, mapped to a `rooms.note.*`
# key. The English wording lives in `locales/en.ts`, so the Chinese pages get a
# translated qualifier rather than an English one left in place.
#
# NOTES — the three places the wording is not the sheet's byte-for-byte:
#   * `65" DIsplay`     -> `65" Display`, a stuck shift key.
#   * `all in one PC`   -> folded into `All in one PC`; the sheet writes the one
#                          phrase both ways.
#   * `Yes w/o monitor` -> "Without a monitor". It is rendered as the value of a
#                          row already labelled "PC with dual monitors", where a
#                          leading "Yes" says the opposite of what it means.
# The counts, the columns and which room has what are untouched. `ALL`, the CD
# drive cell for LCH204, is left exactly as the sheet shouts it: it is the one
# cell whose meaning the sheet does not make clear.
NOTES = {
    '108" LED Wall': "ledWall108",
    '163" LED Wall': "ledWall163",
    "2x2 video wall": "videoWall2x2",
    '42" Touch Screen in Discussion room': "touchScreen42Discussion",
    '43" Confident Monitor': "confidentMonitor43",
    '65" DIsplay': "display65",
    '75" Interactive Panel': "interactivePanel75",
    '85" Display': "display85",
    '85" Display in Classroom': "display85Classroom",
    '85" Display in Corridor': "display85Corridor",
    '85" Display in Discussion room': "display85Discussion",
    '86" Interactive Panel': "interactivePanel86",
    '98" Display': "display98",
    "ALL": "all",
    "All in one PC": "allInOnePc",
    "all in one PC": "allInOnePc",
    "B&W": "bw",
    "Colour": "colour",
    "DECT Mic": "dectMic",
    "Facing Student": "facingStudent",
    "Facing Teacher": "facingTeacher",
    "Handheld Mic": "handheldMic",
    "OCDM": "ocdm",
    "On-loan request": "onLoanRequest",
    "R2024a": "r2024a",
    "R2024b": "r2024b",
    "R2026a": "r2026a",
    "Rechargeable on lectern": "rechargeableOnLectern",
    "Single monitor": "singleMonitor",
    "Touch Panel": "touchPanel",
    "Yes w/o monitor": "noMonitor",
}


def slug_type(name: str) -> str:
    """'Multi-purpose Hall' -> 'multiPurposeHall'."""
    words = re.split(r"[^A-Za-z0-9]+", name)
    words = [w for w in words if w]
    return words[0].lower() + "".join(w[0].upper() + w[1:].lower() for w in words[1:])


def slug_room(code: str) -> str:
    """'LCH414/2' -> 'lch414-2'. The anchor other pages deep-link to."""
    return re.sub(r"-+$", "", re.sub(r"[^a-z0-9]+", "-", code.lower()))


def parse_cell(cell: str, where: str) -> list[tuple[int | None, str | None]]:
    """One sheet cell -> a list of (count, note key).

    A cell holds one entry per line: `2`, `Yes`, `3 (On-loan request)`,
    `Single monitor`, or a bare `(all in one PC)` qualifying the line above it.
    """
    out = []
    for part in cell.split("\n"):
        part = part.strip()
        if not part:
            continue
        m = re.fullmatch(r"(\d+)\s*\((.+)\)", part)
        if m:
            out.append((int(m.group(1)), note_key(m.group(2).strip(), where)))
            continue
        if re.fullmatch(r"\d+", part):
            out.append((int(part), None))
            continue
        if part == "Yes":
            out.append((None, None))
            continue
        m = re.fullmatch(r"\((.+)\)", part)
        if m:
            part = m.group(1).strip()
        out.append((None, note_key(part, where)))
    return out


def note_key(text: str, where: str) -> str:
    if text not in NOTES:
        sys.exit(f"{where}: unknown qualifier {text!r} — add it to NOTES and to locales/*.ts")
    return NOTES[text]


def ts(value) -> str:
    if value is None:
        return "null"
    if isinstance(value, int):
        return str(value)
    return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"


def main() -> None:
    if not CSV.exists():
        sys.exit(f"missing {CSV}")
    rows = list(csv.reader(CSV.open(encoding="utf-8-sig")))
    header, data = rows[1], rows[2:]
    if len(header) != 23:
        sys.exit(f"expected 23 columns, got {len(header)}")

    buildings, types, rooms = [], [], []
    for row in data:
        cell = lambda i: (row[i] if i < len(row) else "")  # noqa: E731 — short rows are blank tails
        building, room = row[0], row[1]
        if building not in buildings:
            buildings.append(building)
        type_key = slug_type(row[2])
        if (type_key, row[2]) not in types:
            types.append((type_key, row[2]))

        # 'AUD (Chan Tak Tai Auditorium)' -> code 'AUD', name 'Chan Tak Tai Auditorium'.
        m = re.fullmatch(r"(\S+)\s*\((.+)\)", room)
        code, name = (m.group(1), m.group(2)) if m else (room, None)

        equipment = {}
        for index, key in COLUMNS:
            specs = parse_cell(cell(index), f"{room}/{key}")
            if specs:
                equipment[key] = specs
        rooms.append((slug_room(code), building, code, name, type_key, equipment))

    ids = [r[0] for r in rooms]
    if len(set(ids)) != len(ids):
        sys.exit("duplicate room ids")

    order = [key for _, keys in GROUPS for key in keys]
    if sorted(order) != sorted(key for _, key in COLUMNS):
        sys.exit("GROUPS does not cover every column exactly once")

    out = [HEADER]
    out.append("export const BUILDINGS = [\n")
    out.append("".join(f"  {ts(b)},\n" for b in buildings))
    out.append("] as const\n\nexport type Building = (typeof BUILDINGS)[number]\n\n")

    out.append("/**\n * Room types, in the order the sheet first uses them. The sheet is not\n")
    out.append(" * consistent about the four computer-lab names — `Computer Lab`,\n")
    out.append(" * `Computer Laboratory`, `Computer Teaching Lab` and\n")
    out.append(" * `Teaching Computer Laboratory` all appear — and they are kept apart here\n")
    out.append(" * rather than merged, because merging would put words in the sheet's mouth.\n */\n")
    out.append("export const ROOM_TYPES = [\n")
    out.append("".join(f"  {ts(k)}, // {label}\n" for k, label in types))
    out.append("] as const\n\nexport type RoomType = (typeof ROOM_TYPES)[number]\n\n")

    out.append("/** Every column, in the eight groups the detail panel renders. */\n")
    out.append("export const ATTRIBUTE_GROUPS = {\n")
    for group, keys in GROUPS:
        inner = ", ".join(ts(k) for k in keys)
        line = f"  {group}: [{inner}],\n"
        if len(line) > 96:
            inner = "".join(f"    {ts(k)},\n" for k in keys)
            line = f"  {group}: [\n{inner}  ],\n"
        out.append(line)
    out.append("} as const\n\n")
    out.append("export type AttributeGroup = keyof typeof ATTRIBUTE_GROUPS\n")
    out.append("export type Attribute = (typeof ATTRIBUTE_GROUPS)[AttributeGroup][number]\n\n")
    out.append(SPEC_DOC)

    out.append("export const ROOMS: Room[] = [\n")
    for rid, building, code, name, type_key, equipment in rooms:
        out.append("  {\n")
        out.append(f"    id: {ts(rid)},\n")
        out.append(f"    building: {ts(building)},\n")
        out.append(f"    code: {ts(code)},\n")
        out.append(f"    name: {ts(name)},\n")
        out.append(f"    type: {ts(type_key)},\n")
        if not equipment:
            out.append("    equipment: {}\n")
        else:
            out.append("    equipment: {\n")
            entries = []
            for key, specs in equipment.items():
                items = ", ".join(
                    "{ count: %s, note: %s }" % (ts(c), ts(n)) for c, n in specs
                )
                line = f"      {key}: [{items}]"
                if len(line) > 96:
                    items = "".join(
                        "        { count: %s, note: %s },\n" % (ts(c), ts(n)) for c, n in specs
                    )
                    line = f"      {key}: [\n{items}      ]"
                entries.append(line)
            out.append(",\n".join(entries) + "\n")
            out.append("    }\n")
        out.append("  },\n")
    out.append("]\n")

    text = "".join(out)
    text = text.replace("  },\n]\n", "  }\n]\n")
    OUT.write_text(text, encoding="utf-8")
    print(f"{OUT}: {len(rooms)} rooms, {len(buildings)} buildings, {len(types)} room types")


HEADER = """// The teaching-room equipment and software list.
//
// GENERATED by `scripts/build-rooms-data.py` from
// `ref/Summer Helpers 2026 - Room Equipment List.csv`, the Summer Helpers 2026
// room-checking result. Do not edit by hand: change the CSV, re-run the script,
// and diff the result.
//
// Room codes are kept exactly as the sheet — and the door signs — write them,
// in every locale. Everything around them is a translation key: room types are
// `rooms.type.*`, column names `rooms.attr.*`, and the qualifiers the sheet
// writes inside a cell ("On-loan request", "Facing Teacher", `86" Interactive
// Panel") are `rooms.note.*`, so a Chinese page does not fall back to English
// halfway down a card.
//
// `RoomEquipment.vue` is the only reader.

"""

SPEC_DOC = """/**
 * One entry in a sheet cell.
 *
 * The sheet counts some things and ticks others: `3 (On-loan request)` becomes
 * `{ count: 3, note: 'onLoanRequest' }`, a bare `Yes` becomes
 * `{ count: null, note: null }`, and `Single monitor` becomes
 * `{ count: null, note: 'singleMonitor' }`. A cell holding two lines — a webcam
 * facing the teacher and one facing the students — becomes two entries.
 */
export interface Spec {
  /** How many, when the sheet gives a number. */
  count: number | null
  /** Key into `rooms.note.*`, when the sheet qualifies the entry. */
  note: string | null
}

export interface Room {
  /** Slug of the room code, and the anchor other pages deep-link to. */
  id: string
  building: Building
  /** Room code, as the rota and the door sign write it. */
  code: string
  /** The hall's name, for the three rooms the sheet names; null otherwise. */
  name: string | null
  type: RoomType
  /**
   * Only the columns the sheet fills in. A missing key means the cell is
   * blank — which is not the same as a confirmed "no", and the page says so.
   */
  equipment: Partial<Record<Attribute, Spec[]>>
}

"""

if __name__ == "__main__":
    main()
