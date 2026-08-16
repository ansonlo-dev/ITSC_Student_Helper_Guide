# Hostel Clinic Check

**Every Monday and Thursday, 19:00 – 22:00**, in **Hostel B, Hostel H and
Hostel WJY**. One helper per hostel.

The duty is hostel network checking — measuring, from inside the hostels, whether
the campus network actually works: Wi-Fi association, reachability of sites in
several regions, LU services, latency and throughput.

::: warning Two submissions per shift
Submit the checking result at **8:30 pm** and again at **10:00 pm** — two times,
not one. The form itself notes: *"The test shall be carried out at 8:30pm."*
:::

## Signing in for this duty

At [ics.ln.edu.hk/helper](https://ics.ln.edu.hk/helper), choose
**Helper Sign in/out → Hostel Clinic Helper** (not User Service Helper). Records
for this duty appear with type **HC**.

## The form

**Hostel Clinic Checklist**, opened from **→ Hostel Clinic Check ←**.
25 questions.

![The checklist links page with Hostel Clinic Check highlighted](/images/links-hostel-check.jpg)

![The Hostel Clinic Checklist form](/images/hostel-form.jpg)
*The Hostel Clinic Checklist*

### Identification

| # | Question | What to put |
| --- | --- | --- |
| 1 | **Name of Helper** | |
| 2 | **Date and Time** | Must be a number — follow the format the previous entries use |
| 3 | **Location** | Be specific, e.g. *"Hall A 1/F Common Area"* — not just "Hostel A" |

### Wi-Fi association — Connect successfully / Cannot Connect successfully

| # | Network |
| --- | --- |
| 4 | **WiFi Connection (LU)** |
| 5 | **WiFi Connection (LU-Advanced)** |

Both networks must be tested — they are separate SSIDs and one can fail while
the other works.

### Website browsing — Can Access / Cannot Access

Each question targets a different region or network path, which is how a partial
outage gets identified.

| # | Target | Site |
| --- | --- | --- |
| 6 | HARNET | www.cuhk.edu.hk |
| 7 | HKIX | www.pccw.com, www.google.com, www.twgrid.org |
| 8 | China | www.taobao.com |
| 9 | England | www.bbc.co.uk |
| 10 | USA | www.salesforce.com |
| 11 | Japan | www.nissan.co.jp |
| 12 | Australia | www.nla.gov.au |
| 13 | CERNET | www.edu.cn |
| 14 | TEIN3 | www.tein3.net |

::: tip Test them all, honestly
The point of the spread is to tell "the internet is down" apart from "one route
is down". Skipping the awkward ones destroys the value of the whole check.
:::

### LU services — Can Access / Cannot Access

| # | Service |
| --- | --- |
| 15 | **LU Portal & SSB Login** — myportal.ln.edu.hk → Banner Self Services |
| 16 | **LU VPN Login** |

### Streaming

| # | Question | Answer |
| --- | --- | --- |
| 17 | **Youtube Video Clip Browsing** — www.youtube.com, **1080p for 3 minutes** | **no delay** / **delay** |

Play it at 1080p for the full three minutes. A stream that stutters only after a
minute is exactly what this question is looking for.

### Ping tests — enter the result

Run `ping <site> -n 10` on Windows, or `ping -c 10 <site>` on a MacBook, and type
the result in. The form links a "How to Ping" guide on SharePoint.

| # | Target |
| --- | --- |
| 18 | www.google.com |
| 19 | www.taobao.com |
| 20 | www.bbc.co.uk |
| 21 | www.salesforce.com |
| 22 | souda-kyoto.jp |
| 23 | www.nla.gov.au |
| 24 | www.tein3.net |

::: warning Ten packets, not one
`-n 10` / `-c 10` matters — a single ping tells you nothing about packet loss or
jitter. Record the summary line, not a guess.
:::

### Speed test

**25.** Using Wi-Fi, go to <http://speedtest.ofca.gov.hk/speedtest.html> and note
the **exact values**:

> (Latency) is xx ms; (Jitter) is xx ms; (Download) is xx Mbps; (Upload) is xx Mbps

Copy the numbers exactly in that format. Rounded or remembered figures are not
useful for spotting a trend across weeks.

## If the network is down

Record it honestly on the form — a failed check is a finding, not a mistake —
then report it. Network problems go to **Max Yiu, 2616-8412**; see
[Contacts & Escalation](/reference/contacts).
