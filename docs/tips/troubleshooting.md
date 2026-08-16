# Troubleshooting Playbook

A method beats memorised fixes. Follow these steps and you can make progress on
a problem you have never seen before.

## 1. Understand the problem

Ask, in this order:

- What were you trying to do?
- What exactly happened instead? (Ask for the error message, word for word.)
- When did it last work?
- What changed since then — a new password, a new device, an update?
- Does it happen every time, or only sometimes?

::: tip Get the error message
"It gave an error" is not information. Ask the user to show you the screen or
read the message out. Most errors tell you the answer directly.
:::

## 2. Define the scope

This single question saves the most time:

> Is it **this user**, **this machine**, or **everyone**?

| Scope | Likely cause | Action |
| --- | --- | --- |
| One user, any machine | Account, quota, permission | Check the account |
| One machine, any user | Hardware, local config, cable | Check the machine |
| Everyone | Network, server, service outage | Escalate immediately |

## 3. Check the cheap things first

In rough order of how often they are the answer:

1. Is it powered on and plugged in — at **both** ends?
2. Is it the right device, right port, right input?
3. Caps Lock, keyboard layout, typo in the username
4. Is it connected to the network / on the right Wi-Fi?
5. Has it been restarted since the problem started?
6. Is there an announced outage or maintenance window?

## 4. Isolate by swapping

Prove where the fault is by replacing one variable at a time:

- Same user, different machine
- Different user, same machine
- Different cable, port, or adapter
- Different browser, or a private window

## 5. Fix, then verify

- Change one thing, then test. Never batch changes.
- Have the **user** confirm it works, doing the thing they originally wanted.
- Undo anything you tried that did not help.

## 6. Know when to stop

::: warning The 15-minute rule
If you have made no real progress in 15 minutes, or a queue is forming,
escalate. Escalating is not failing — leaving a user stuck is.
:::

Escalate immediately, without troubleshooting, when it involves:

- A whole lab, building, or service being down
- Account permissions, security, or a suspected compromise
- Possible data loss
- A user who is angry or wants to make a complaint

## 7. Log it

Write down: what the user reported, the scope, what you tried, what fixed it,
and anything still outstanding. Include machine names and room numbers — "the
PC near the window" helps nobody.
