# Room Equipment

What is installed in every teaching room ITSC looks after — **114 rooms** across
**eight buildings**, and the **20 things** the room-checking sheet records for
each one, from the lectern PC down to which version of Matlab is on it.

::: tip This is the reference, not the duty
For the **checks** — what to test, in what order, and where to file the result —
see [Lecture Room Check](/duties/lecture-room-check) and
[Computer Lab Check](/duties/lab-support). This page is what sits behind them:
what a room is supposed to have, so you know whether something is missing or was
never there in the first place.
:::

## The list

Narrow it down first — pick a building, a room type, or the piece of equipment
you are looking for — then open a room for all twenty rows. The number on each
chip is how many rooms it would leave you with, so "which rooms have a PTZ
camera" is answered before you even click.

The search box matches room codes, room types **and** equipment, so `LKK205`,
`Tutorial Room` and `video wall` all work.

<RoomEquipment />

## Reading the sheet

### A blank cell is a blank, not a "no"

Most of the 2,280 cells are empty, and an empty cell only means the person doing
the round wrote nothing there. Usually the room does not have the thing — but it
is not a confirmed no, and it is not evidence when a lecturer says something has
gone missing. Go and look.

### "On-loan request" means it is not standing in the room

Nearly every wireless-microphone cell carries this note. Read the count as what
can be **requested**, not what you will find in the teacher's cabinet — the mic
comes from the counter, like everything else on
[Equipment on Loan](/duties/av-equipment).

That is how the sheet can list three IR mics for **LKK107, LKK108 and LKK110**
while [Morning Check](/duties/morning-check#microphone-sound-test) says those
rooms have no wireless mic at all. Both are right: nothing is in the room, three
can be brought to it.

The digital wireless mics are the other way round — where the sheet says
**Rechargeable on lectern**, the mic really is in the room, sitting on its
charger. That is the case in 14 rooms.

### Seventeen rooms have nothing recorded at all

**LCH101, LCH103, LCH104, LCH105, LCH106, LCH110, LCH111, LCH117, LCH118,
LCH214, LCHUG04B, LCHUG08, LCHUG09, LCHUG10, LCHUG11, LCHUG12** and
**SEKG02/1** carry no equipment in any of the sixteen equipment columns — no
computer, no projector, nothing. They are still on the list because the sheet
lists them. Do not promise a lecturer a projector in one of them without looking
first.

### The sheet has four names for a computer lab

`Computer Lab`, `Computer Laboratory`, `Computer Teaching Lab` and
`Teaching Computer Laboratory` all appear, and they are kept apart in the room
type menu rather than merged — merging would put words in the sheet's mouth. If
a type filter returns fewer rooms than you expected, try its near-twin.

### One cell the sheet does not explain

**LCH204**'s CD-ROM cell says `ALL` rather than a number. Every other optical
drive cell is a count. Take it as read on site rather than from here.

## The software columns

| Column | Where | Notes |
| --- | --- | --- |
| **SPSS & AMOS** | **110 of the 114 rooms** | Everywhere except the four language laboratories — **LBY301, LBY303, LCH201, LCH202** |
| **XClass** | **9 rooms** | LBY301, LBY303, LCH201, LCH202, LCH206, LCH209, MB202, SEK105, SEKG03 |
| **SDL** | **5 rooms** | LBY301, LBY303, LCH201, LCH202, LCH206 |
| **Matlab** | **16 rooms** | The sheet records the release for twelve of them — **R2024a**, **R2024b** or **R2026a** — and just "Yes" for LCH206A, LCH209, LYH111 and SEKG03 |

Both the SPSS and the XClass lists match
[Systems & Links](/reference/links#software-coverage) exactly, which is a useful
sign that this sheet and the training notes are describing the same campus.

::: warning SPSS is ticked in rooms with no computer
Twenty of the rooms marked **SPSS & AMOS** have no computer recorded at all. The
column is best read as "on the standard image", not "confirmed in this room".
:::

## Printers

Twelve rooms hold a printer, **15 machines** in total — exactly the set in the
[Printer Directory](/facilities/printers), which carries the IP addresses, the
queue settings and what each machine can actually do. This page tells you a room
has one; that page tells you how to use it.

## Where the sheet and the guide disagree

One room, so far: **WYL314**. The sheet records it as a **Meeting Room** with a
**PC without a monitor**, while
[Systems & Links](/reference/links#rooms-that-behave-differently) calls it a
conference room where a notebook stands in for the teacher PC. Different rounds,
different years. Check it on site and tell your supervisor which is current.

## Where this comes from

`ref/Summer Helpers 2026 - Room Equipment List.csv`, the Room Equipment List
sheet of the **Summer Helpers 2026 room-checking result**, machine-read into
`docs/.vitepress/data/rooms.ts` by `scripts/build-rooms-data.py`. Every one of
the 2,280 cells is carried across as the sheet writes it; room codes are kept
exactly as the sheet — and the door signs — write them, in every language.

::: info Keep this current
When the room check runs again, drop the new CSV into `ref/`, re-run
`python3 scripts/build-rooms-data.py` and diff the result. Do not edit
`rooms.ts` by hand — it says so at the top of the file.
:::
