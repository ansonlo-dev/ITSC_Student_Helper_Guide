# Printer Directory

Every **ITSC** printer on the main campus and what each one can actually do: the
**15 machines** in our labs, classrooms and copier rooms. The Library's printers
and the Learning Commons copier in LYH208 belong to other offices and are not
listed here — a fault on those goes to the office that runs them, not to us.

::: tip This is the reference, not the duty
For the printer **duty** — four rounds a day, jams, paper and toner — see
[Printer Check](/duties/printing). This page is what sits behind it: which
machine does colour, what its address is, and what to tell a student who wants to
print from their own laptop.
:::

## What printing costs

The fee is **the same on every charged printer on campus**, paid with an Octopus
card at the machine:

| | Single-sided | Double-sided |
| --- | --- | --- |
| **B&W, A4** | HK$0.3 | HK$0.4 |
| **B&W, A3** | HK$0.6 | HK$0.8 |
| **Colour, A4** | HK$2.5 | HK$3.5 |
| **Colour, A3** | HK$5.0 | HK$7.0 |

The exception is the **HP printers in the ITSC labs and classrooms**: those are
**free**, but the user brings their own paper, and they are **black and white,
A4 only**.

::: warning A physical Octopus card only
The readers **do not support NFC**. Octopus on a phone or a watch will not work,
no matter how the user holds it against the reader. They need the plastic card.
:::

## The directory

Filter it down first — colour, A3, "from my own laptop", free — then open a card
for the addresses and the full capability list.

<PrinterDirectory />

::: info The host names say NAB, the rooms say LCH
`prn-lab-nab201`, `prn-lab-nab206` and the rest are the printers in **LCH201**,
**LCH206** and so on — the block was renamed and the host names were not. Same
mismatch as the **NAB206A** in the printer guidelines, which is **LCH206A**. Go
by the room code on your rota, not by the host name.
:::

## Printing from a personal device

Everything below needs the **campus network** — campus Wi-Fi, or LUVPN from off
campus.

### Every RICOH job needs a print password

**All RICOH printers hold the job until a print password is entered at the
machine.** If none was set when the job was submitted, the job never appears in
the printer's list and the user stands there believing nothing was sent.

- On a **campus Windows PC**, the print password may be available in the
  printer's settings dialog.
- If it is not, **print to PDF first, then print the PDF** — that route always
  raises the password prompt.

### Upload a PDF to the printer's own web page

Works from any device with a browser, which is why it is the easiest thing to
tell a student on a phone.

1. Open the printer's **IP address** in a browser.
2. Choose **Print** in the left sidebar.
3. Upload the PDF.

The directory marks this **Its web page (upload a PDF)**. It is confirmed on the
HP units in **LBY303, LCH201, LCH204, LCH206 and LCH209**.

### RICOH Smart Device Connector, from a phone

For the RICOH copiers, install **RICOH Smart Device Connector** on the phone, add
the printer by its **host name**, and print the PDF from the app. Android and
iOS both work.

### Add the queue by hand on a personal computer

Each card carries the exact address and driver that were made to work, for
example `socket://10.2.124.11:9100` with *HP LaserJet P3010 Series Postscript*
for the HP units, or `lpd://203.188.127.234` with *Ricoh IM 7000 PDF* for the
copiers. These were tested on **Ubuntu 24.04**; the same address works from any
system that can add a printer by URI.

For Windows and macOS the sheet records **"?"** rather than a tick — installing
the model's driver ought to be enough, but nobody has confirmed it. Say that to
the user rather than promising it will work.

## Things that catch people out

- **Older HP LaserJet P3015 units may have duplex switched off** by default. It
  is in the printer's settings, not a fault.
- **One machine cannot scan to email**: the **SEKG02 B&W Copier 01**. Every
  other copier in our labs can.
- **The colour copiers in SEKG02 and LCH206A are the new Ricoh C6010 units** and
  behave differently from the rest — see
  [The new colour copiers](/duties/printing#the-new-colour-copiers).
- **MB202 closes at 17:00**, so its copier is unreachable on the later printer
  check sessions.

## Where this comes from

`ref/LU printers (main campus).xlsx`, transcribed into
`docs/.vitepress/data/printers.ts` — the sheet's rows for the capabilities, and
its cell comments for the queue addresses and the phone instructions. Only the
rows whose Department is **ITSC** are carried across. Room codes are kept exactly
as the sheet and the signage write them, in every language.

::: info Keep this current
When the workbook is updated, diff it against `printers.ts` rather than editing
from memory, and add the new fact here as well if it changes what you would tell
a user.
:::
