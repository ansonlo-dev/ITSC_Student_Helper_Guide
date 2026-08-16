# 宿舍网络检查

**每逢星期一及星期四，19:00 – 22:00**，于 **Hostel B、Hostel H 及
Hostel WJY**。每座宿舍一位助理。

此职务是宿舍网络检查 —— 在宿舍内实地量度校园网络是否真的可用：Wi-Fi 连接、
多个地区网站的连通性、LU 服务、延迟及频宽。

::: warning 每更提交两次
检查结果须于**晚上 8:30** 及**晚上 10:00** 各提交一次 —— 是两次，不是一次。
表格本身亦注明：*“The test shall be carried out at 8:30pm.”*
:::

## 此职务的签到方式

在 [ics.ln.edu.hk/helper](https://ics.ln.edu.hk/helper) 选择
**Helper Sign in/out → Hostel Clinic Helper**（不是 User Service Helper）。
此职务的纪录类型会显示为 **HC**。

## 表格

**Hostel Clinic Checklist**，从 **→ Hostel Clinic Check ←** 开启，共 25 题。

### 身份资料

| # | 题目 | 填写内容 |
| --- | --- | --- |
| 1 | **Name of Helper** | 助理姓名 |
| 2 | **Date and Time** | 必须是数字 —— 依照过往纪录的格式填写 |
| 3 | **Location** | 要具体，例如 *“Hall A 1/F Common Area”*，不能只写“Hostel A” |

### Wi-Fi 连接 —— Connect successfully／Cannot Connect successfully

| # | 网络 |
| --- | --- |
| 4 | **WiFi Connection (LU)** |
| 5 | **WiFi Connection (LU-Advanced)** |

两个网络都必须测试 —— 它们是不同的 SSID，其中一个可以坏而另一个正常。

### 网站浏览 —— Can Access／Cannot Access

每一题针对不同地区或网络路径，这正是分辨局部故障的方法。

| # | 目标 | 网站 |
| --- | --- | --- |
| 6 | HARNET | www.cuhk.edu.hk |
| 7 | HKIX | www.pccw.com、www.google.com、www.twgrid.org |
| 8 | 中国 | www.taobao.com |
| 9 | 英国 | www.bbc.co.uk |
| 10 | 美国 | www.salesforce.com |
| 11 | 日本 | www.nissan.co.jp |
| 12 | 澳洲 | www.nla.gov.au |
| 13 | CERNET | www.edu.cn |
| 14 | TEIN3 | www.tein3.net |

::: tip 全部都要测，而且要诚实
这样分散测试，目的是分辨“整个网络坏了”与“某一条路由坏了”。省略麻烦的
几项，就等于毁掉整个检查的价值。
:::

### LU 服务 —— Can Access／Cannot Access

| # | 服务 |
| --- | --- |
| 15 | **LU Portal & SSB Login** —— myportal.ln.edu.hk → Banner Self Services |
| 16 | **LU VPN Login** |

### 串流

| # | 题目 | 作答 |
| --- | --- | --- |
| 17 | **Youtube Video Clip Browsing** —— www.youtube.com，**1080p 播放 3 分钟** | **no delay**／**delay** |

必须以 1080p 完整播放三分钟。一条播了一分钟之后才开始卡的片，正是这一题想要
找出来的情况。

### Ping 测试 —— 填写结果

在 Windows 执行 `ping <网站> -n 10`，MacBook 则执行 `ping -c 10 <网站>`，然后
把结果填入。表格附有 SharePoint 上的“How to Ping”指引。

| # | 目标 |
| --- | --- |
| 18 | www.google.com |
| 19 | www.taobao.com |
| 20 | www.bbc.co.uk |
| 21 | www.salesforce.com |
| 22 | souda-kyoto.jp |
| 23 | www.nla.gov.au |
| 24 | www.tein3.net |

::: warning 是十个封包，不是一个
`-n 10`／`-c 10` 很重要 —— 只 ping 一次完全看不出封包遗失或抖动。要填实际的
统计结果，不要靠估。
:::

### 速度测试

**25.** 使用 Wi-Fi 前往 <http://speedtest.ofca.gov.hk/speedtest.html>，记下
**确实数值**：

> (Latency) is xx ms; (Jitter) is xx ms; (Download) is xx Mbps; (Upload) is xx Mbps

必须照这个格式原数抄下。取整数或凭记忆填写，就无法用来观察跨周的趋势变化。

## 若网络故障

如实记录在表格上 —— 检查不合格是一项发现，不是你的过失 —— 然后上报。网络
问题请联系 **Max Yiu，2616-8412**，详见
[联系与升级处理](/zh-CN/reference/contacts)。
