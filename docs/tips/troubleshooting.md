# Troubleshooting Playbook

## Classroom equipment: the standard checks

When you receive a classroom equipment issue — especially about a **projector or
display panel** — perform these basic checks **with the user on the phone
first**, before submitting a ticket or asking for immediate help:

::: tip The four basic checks
1. **Turn on the AV system on the touch panel** and select the source,
   e.g. Desktop or Notebook.
2. **Turn on the computer, turn on the monitor(s), log in** to the computer.
3. **Power off the AV system and computer, then restart.**
4. **Check the computer display mode** by pressing `Windows` + `P` — usually
   select **"Extend"**.
:::

Most classroom calls are resolved by one of these four. Work through them in
order before escalating.

![The Windows Project menu](/images/windows-project-menu.jpg)
*`Windows` + `P` — pick **Extend***

## The faults you will actually meet

From the checking duties, in rough order of frequency:

| Fault | Fix |
| --- | --- |
| Projection mode not set to Duplicate / Extend | `Windows`+`P` → **Extend** |
| Power plug pulled out | Check the power bar under the desk — [walkthrough](#the-pc-will-not-power-on) |
| Monitor cable loose | Reseat at both ends |
| Touch panel volume muted or turned down | Unmute, raise it on the panel |
| Camera looks black | The **lens cover** is closed, or it is aimed away |
| Cannot log in to a PC | Usually no network — [fix it](#no-internet-or-the-pc-will-not-let-you-log-in), do not just note it |
| No sound from the speakers | Check the **output device** in Windows, the connections and the **Extron panel** — [walkthrough](#no-sound-—-check-the-output-device-not-just-the-volume) |
| Yellow label missing | Peeled off by a student; report it |

## The three you fix on the spot

These three account for most of the "it is broken" calls, and all three are
fixed without a ticket. Work them in this order: **power, then network, then
sound** — a machine with no power cannot be tested for anything else.

### The PC will not power on

Nine times out of ten the plug has been pulled out — by a cleaner, by a student
charging a phone, or by a foot under the desk.

1. **Look for any light** on the PC case, the monitor, and the power bar's own
   switch. All dark usually means no mains power; a lit case with a dark screen
   is a **monitor or cable** fault, not a power fault.
2. **Follow the cable to the power bar under the desk.** Check **both ends** —
   the socket on the bar and the inlet on the back of the PC. Push each one home
   until it seats.
3. **Check the power bar itself** — its switch on, and its own plug still in the
   wall socket. One loose bar takes out the PC, the monitor and often the
   neighbouring desk.
4. **The monitor has its own plug.** A PC that boots to a black screen is often
   just an unplugged or switched-off monitor.
5. **Try a different socket on the bar.** If it lives on one socket only, that
   socket is dead — note it.

If it stays dead with everything properly plugged in, stop and report it as
`Machine Name - Cannot Power On`. Do not open the case.

### No internet, or the PC will not let you log in

Login uses the campus network, so **"cannot log in" and "no internet" are
usually the same fault** — an unplugged LAN cable.

1. **Check the network icon** in the bottom-right of the taskbar. A globe or a
   red cross means no connection.
2. **Check the RJ45 cable at both ends** — the port on the back of the PC and
   the wall or floor socket. Push until it **clicks**. A snapped-off plastic
   clip lets the cable slide half out and look connected while it is not.
3. **Look at the small light beside the PC's network port.** No light at all
   points at the cable, the socket or the far end.
4. **Restart the PC** once the cable is seated — a machine that failed to reach
   the network at boot may not pick it up on its own.

::: warning Check the scope before you report a cable
If **every** machine in the room is offline, it is not a cable — that is a
network or service outage. Escalate it immediately rather than reseating
cables one desk at a time.
:::

A single machine still offline after all of the above is reported as
`Machine Name - Cannot Login`.

### No sound — check the output device, not just the volume

Sound has **two** volume controls in series — Windows and the AV system — and
Windows can be sending the audio to the wrong place entirely.

1. **The taskbar speaker icon.** Unmute it and raise it. A crossed-out speaker
   is the whole fault surprisingly often.
2. **Click the speaker icon and open the output list.** Windows lists every
   device it can play to, and an HDMI-connected projector or display panel
   appears as one of them. If the projector is selected, the sound is going to
   the projector instead of the room speakers — **select the room speakers /
   Extron output** instead.
3. **Check the app.** Right-click the speaker icon → **Volume mixer** — a
   browser tab or a player can be muted on its own while the system volume is
   fine.
4. **Then the AV side** — the touch panel volume and mute, and the **Extron
   panel**. Both have to be up.
5. **Re-test with a short YouTube clip**, ten seconds is enough, so you hear the
   speakers rather than assume them.

Test **from the PC as well as from the AV source** — sound that works on one and
not the other narrows the fault to that path, and that detail belongs in your
report.

## Testing a webcam in Zoom

Use **Zoom**, not the Windows Camera app — the built-in app freezes when you
switch between cameras, and in **LKKG0X** the camera cannot be changed there at
all. You do **not** need to sign in to Zoom; Settings works while signed out.

**1. Find Zoom in the system tray.** Click the arrow at the right of the taskbar
to open the hidden icons. Zoom is the blue **zm** icon — hovering it shows
"Zoom - not signed in", which is fine.

![The hidden icons tray with the Zoom icon](/images/zoom-tray-icon.jpg)
*Signed out is fine — you still get Settings*

**2. Right-click the Zoom icon and choose Settings…** Right-click, not
left-click; a left-click just opens the Zoom window.

![The Zoom tray menu, with Settings below Sign in](/images/zoom-tray-menu.jpg)
*Screenshot, Join meeting, Share screen, Sign in, then **Settings…***

**3. Open the Video tab.** The preview at the top is what the camera is seeing
right now. A black preview almost always means the **lens cover is closed** or
the camera has been turned away — check that before you report a fault.

![Zoom Settings on the Video tab, showing the camera preview](/images/zoom-settings-video.jpg)
*The preview shows the current camera; the Camera dropdown sits below it*

**4. Switch cameras in the Camera dropdown.** A room with two webcams lists both
here — select each in turn so that **Facing Teacher** and **Facing Students**
are tested separately. If a camera you expect is missing from the list, that is
itself a fault worth reporting.

![The Camera dropdown listing the connected webcam](/images/zoom-camera-dropdown.jpg)
*One entry means only one camera is connected*

::: tip While you are in there
Check the physical mount too — a loose tripod, or a camera held in place with
tape, is a fault even when the picture is perfect.
:::

## Before you escalate anything

Ask the user, in this order:

- What were you trying to do?
- What exactly happened instead? (Ask for the error message, word for word.)
- When did it last work?
- What changed since then?
- Does it happen every time, or only sometimes?

Then establish the scope — is it **this user**, **this machine**, or
**everyone**?

| Scope | Likely cause | Action |
| --- | --- | --- |
| One user, any machine | Account, permission | Self-service page, then duty staff |
| One machine, any user | Hardware, local config, cable | Check the machine |
| Everyone | Network or service outage | Escalate immediately |

A whole-room or whole-building fault is never something to debug machine by
machine — report it.

## Cheap things worth checking first

1. Is it powered on and plugged in — at **both** ends?
2. Right device, right port, right input source?
3. Caps Lock, keyboard layout, typo in the username
4. Is it on the right network?
5. Has it been restarted since the problem started?

## When to stop

::: warning Ask rather than guess
Ask full-time staff if there is anything you are uncertain of. **Seek help from
the duty staff first, then others.**
:::

Escalate straight away, without troubleshooting, when it involves:

- A whole lab, room, building or service being down
- Account permissions, security, or a suspected compromised account
- Possible data loss
- A user who is angry or wants to make a complaint

Specialist contacts are on [Contacts & Escalation](/reference/contacts).

## Log it

Whatever the outcome, record the enquiry on the
[Issue Received by ITSC Student Helper](https://forms.office.com/r/30WbQbDCSF)
form, and report faults found during a check on that duty's checklist. Include
room numbers and machine names — "the PC near the window" helps nobody.
