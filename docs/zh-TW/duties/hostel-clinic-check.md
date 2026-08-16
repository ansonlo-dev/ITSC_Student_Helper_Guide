# 宿舍網絡檢查

**每逢星期一及星期四，19:00 – 22:00**，於 **Hostel B、Hostel H 及
Hostel WJY**。每座宿舍一位助理。

此職務是宿舍網絡檢查 —— 在宿舍內實地量度校園網絡是否真的可用：Wi-Fi 連接、
多個地區網站的連通性、LU 服務、延遲及頻寬。

::: warning 每更提交兩次
檢查結果須於**晚上 8:30** 及**晚上 10:00** 各提交一次 —— 是兩次，不是一次。
表格本身亦註明：*「The test shall be carried out at 8:30pm.」*
:::

## 此職務的簽到方式

在 [ics.ln.edu.hk/helper](https://ics.ln.edu.hk/helper) 選擇
**Helper Sign in/out → Hostel Clinic Helper**（不是 User Service Helper）。
此職務的紀錄類型會顯示為 **HC**。

## 表格

**Hostel Clinic Checklist**，從 **→ Hostel Clinic Check ←** 開啟，共 25 題。

![檢查表連結頁，Hostel Clinic Check 已標示](/images/links-hostel-check.jpg)

![Hostel Clinic Checklist 表格](/images/hostel-form.jpg)
*Hostel Clinic Checklist*

### 身分資料

| # | 題目 | 填寫內容 |
| --- | --- | --- |
| 1 | **Name of Helper** | 助理姓名 |
| 2 | **Date and Time** | 必須是數字 —— 依照過往紀錄的格式填寫 |
| 3 | **Location** | 要具體，例如 *「Hall A 1/F Common Area」*，不能只寫「Hostel A」 |

### Wi-Fi 連接 —— Connect successfully／Cannot Connect successfully

| # | 網絡 |
| --- | --- |
| 4 | **WiFi Connection (LU)** |
| 5 | **WiFi Connection (LU-Advanced)** |

兩個網絡都必須測試 —— 它們是不同的 SSID，其中一個可以壞而另一個正常。

### 網站瀏覽 —— Can Access／Cannot Access

每一題針對不同地區或網絡路徑，這正是分辨局部故障的方法。

| # | 目標 | 網站 |
| --- | --- | --- |
| 6 | HARNET | www.cuhk.edu.hk |
| 7 | HKIX | www.pccw.com、www.google.com、www.twgrid.org |
| 8 | 中國 | www.taobao.com |
| 9 | 英國 | www.bbc.co.uk |
| 10 | 美國 | www.salesforce.com |
| 11 | 日本 | www.nissan.co.jp |
| 12 | 澳洲 | www.nla.gov.au |
| 13 | CERNET | www.edu.cn |
| 14 | TEIN3 | www.tein3.net |

::: tip 全部都要測，而且要誠實
這樣分散測試，目的是分辨「整個網絡壞了」與「某一條路由壞了」。省略麻煩的
幾項，就等於毀掉整個檢查的價值。
:::

### LU 服務 —— Can Access／Cannot Access

| # | 服務 |
| --- | --- |
| 15 | **LU Portal & SSB Login** —— myportal.ln.edu.hk → Banner Self Services |
| 16 | **LU VPN Login** |

### 串流

| # | 題目 | 作答 |
| --- | --- | --- |
| 17 | **Youtube Video Clip Browsing** —— www.youtube.com，**1080p 播放 3 分鐘** | **no delay**／**delay** |

必須以 1080p 完整播放三分鐘。一條播了一分鐘之後才開始卡的片，正是這一題想要
找出來的情況。

### Ping 測試 —— 填寫結果

在 Windows 執行 `ping <網站> -n 10`，MacBook 則執行 `ping -c 10 <網站>`，然後
把結果填入。表格附有 SharePoint 上的「How to Ping」指引。

| # | 目標 |
| --- | --- |
| 18 | www.google.com |
| 19 | www.taobao.com |
| 20 | www.bbc.co.uk |
| 21 | www.salesforce.com |
| 22 | souda-kyoto.jp |
| 23 | www.nla.gov.au |
| 24 | www.tein3.net |

::: warning 是十個封包，不是一個
`-n 10`／`-c 10` 很重要 —— 只 ping 一次完全看不出封包遺失或抖動。要填實際的
統計結果，不要靠估。
:::

### 速度測試

**25.** 使用 Wi-Fi 前往 <http://speedtest.ofca.gov.hk/speedtest.html>，記下
**確實數值**：

> (Latency) is xx ms; (Jitter) is xx ms; (Download) is xx Mbps; (Upload) is xx Mbps

必須照這個格式原數抄下。取整數或憑記憶填寫，就無法用來觀察跨週的趨勢變化。

## 若網絡故障

如實記錄在表格上 —— 檢查不合格是一項發現，不是你的過失 —— 然後呈報。網絡
問題請聯絡 **Max Yiu，2616-8412**，詳見
[聯絡與升級處理](/zh-TW/reference/contacts)。
