# 第一次值班值班

无论被编排到哪一项职务，流程都是同样的五个步骤。

## 工作流程

1. **自行预订班次** —— [helperduty.top](https://helperduty.top)
2. **值班时签到** —— [ics.ln.edu.hk/helper](https://ics.ln.edu.hk/helper)
3. **执行职务** —— 柜台、打印机检查、电脑室检查等
4. **提交检查结果** —— 该项职务对应的 Microsoft Forms 检查表
5. **签退** —— [ics.ln.edu.hk/helper](https://ics.ln.edu.hk/helper)

::: warning 步骤由系统强制执行
没有预订班次就无法签到；没有提交检查结果就无法签退。漏做第 1 步或第 4 步，系统
都会拦截。
:::

## 1. 班次预订系统

**[helperduty.top](https://helperduty.top)**

| 栏位 | 内容 |
| --- | --- |
| 用户名称 | 你的用户名称（学生电邮地址） |
| 密码 | 你的**学号（Student ID）** |

::: warning 只限校园网络，或经 LUVPN
班次预订系统**只能在校园 Wi-Fi 网络内**使用；身处校外时必须先连接 **LUVPN**。
:::

::: danger 这个系统不要外传
它是一个**独立的私人数据库** —— 并没有与 LU 主要系统连接，所以密码是学号而
非 LU 密码。**不要向大学其他部门（例如 OSA）透露这个系统的存在。**
:::

日历设有日／周／月三种检视。每一栏代表一个职务时段 —— ITSC Service Counter、
LU Campus Printer、Computer Lab Helper 1–4、Lecture Room Helper 1–2、
Computer Lab and Lecture，以及 Hostel B / H / WJY Helper。

- **预订** —— 前往该日期，然后点击你想要的职务栏与时间列交界的空白格。
- **删除预订** —— 在日历中打开自己的预订并移除。每次请假都必须自行完成这一步。

![班次预订日历](/images/booking-calendar.jpg)
*每一栏是一个职务时段；点击空白格即可预订*

<VideoPlayer
  src="/videos/media1.mp4"
  ratio="1910 / 878"
  caption="预订班次 —— 选时段、设置开始与结束时间、选择房间，然后按 Save"
/>

<VideoPlayer
  src="/videos/media2.mp4"
  ratio="1912 / 874"
  caption="删除预订 —— 打开自己的纪录并删除"
/>

### 预订规则

| 规则 | 内容 |
| --- | --- |
| **柜台班次** | 最短可以 **30 分钟**为单位预订 |
| **维护检查** | 打印机、电脑室、课室及早上检查必须预订**整个时段** |
| **每周上限** | 系统会强制执行每周工时上限 —— 见[工时与薪酬](/zh-CN/guide/schedule-and-pay#工作时数) |
| **时间重叠** | 重叠的预订会被**直接拦截** |

只有 Paul 可以在特定理由下豁免工时上限。

### 请假与换班

1. 在 **WhatsApp 发出详细的请假信息** —— 姓名、日期、时间、职务及原因。
2. **找同学接班**。接班是**先到先得**。
3. **自行在预订系统删除**你的班次。

完整格式与例子见[工作注意事项](/zh-CN/guide/code-of-conduct#请假)。

## 2. 签到／签退

**[ics.ln.edu.hk/helper](https://ics.ln.edu.hk/helper)**

| 栏位 | 内容 |
| --- | --- |
| 用户名称 | 你的用户名称 |
| 密码 | 你的 **LU 密码** |

登入后选择 **Helper Sign in/out**，再选 **User Service Helper** 或
**Hostel Clinic Helper**，然后按 **Sign In (Desktop/AV)**。

::: warning 必须身在校园并连接校园网络
签到与签退只在你**实际身处校园并连接校园网络**时才有效。宿舍助理必须走到
**最近的课室大楼**才能签到／签退。
:::

![签到／签退登入页](/images/signin-login.jpg)

![Helper Sign in/out 选单](/images/signin-menu.jpg)
*选择 User Service Helper 或 Hostel Clinic Helper*

页面会显示你目前的位置、系统日期时间、用户状态，以及最近 20 次的签到／签退纪录。

![显示状态与近期纪录的签到页](/images/signin-page.jpg)
*你的状态与最近 20 次纪录*

::: tip 只有已订班的助理才能签到
如果你当天没有预订，页面会显示“No Booking Records Today”，你将无法签到。

![No Booking Records Today](/images/signin-no-booking.jpg)
:::

### 可供签到的房间

**电脑室：** SEKG02、SEKG03、SEK105、MB202、LBY301、LBY303、LCH201、LCH202、
LCH204、LCH206、LCH206A、LCH209、LCH213、LCH413。

**教室：** 完整名单涵盖 SEK、MB、LBY、LKK、WYL、LCH 及 LYH 各座，以及陈德泰大会堂
（AUD01）—— 详见签到页的“Available Sign in Classroom List”。

![可供签到的教室清单](/images/signin-classroom-list.jpg)
*签到页上的 Available Sign in Classroom List*

## 3–4. 执行职务并提交结果

每项职务都有自己的检查表。请在[职务](/zh-CN/duties/)下找出对应的一项。

## 5. 签退

如果你在提交结果之前尝试签退，页面会以红字显示尚未完成的工作，例如：

> **Missing the following work reports:**
> \*\*\* Printer Check \*\*\* (expected: 1, actual: 0)

![因未提交报告而无法签退](/images/signout-blocked.jpg)
*未提交检查结果就无法签退*

提交结果之后，页面会显示 **Duty Completed**，
**Sign Out (Desktop/AV)** 按钮便会可用。

![Duty Completed 与可用的签退按钮](/images/signout-completed.jpg)
*Duty Completed —— 现在可以签退*

### 签退之前

1. **提交该项职务的 Microsoft Form。**
2. **等待副本（CC）寄到你的学生电邮** —— 那封收据就是提交成功的凭证。
3. 然后才按 **Sign Out (Desktop/AV)**。

::: danger 一定要用自己的账户提交
每一份表格都必须**用自己的账户提交**。以他人名义提交的表格不会解除你的签退限制，
还会把检查记录算到别人头上。
:::

::: warning 必须准时签退
2 小时的检查 30 分钟就做完了？你可以立即提交表格，但**必须等到时间到才签退**。
每一次早退或迟退都会被记录，并计入你的助理表现统计。
:::

## 出错时怎么办

忘记签到或签退、重复签到、签退时间错误，或者超时工作？请填写
**“Abnormal sign in+out”** Excel 文件，记录以下内容：

| 栏位 | 填写内容 |
| --- | --- |
| Date | 出问题的日期 |
| Problem | 例如 Fail to Sign In／Fail to Sign Out／Sign in twice／Sign out wrong time |
| Name | 你的名字 |
| Responsible Timeslot | 例如 13:30–16:00 |
| Wrong Time | 实际被记录的时间 |
| Correct Time | 应该的正确时间 |
| Type | User service／Counter／Hostel Clinic／others |
| Status | 由主管在调整后填写 |

![Abnormal sign in+out 电子表格](/images/abnormal-signin-sheet.jpg)
*“Abnormal sign in+out”工作簿，每月一个工作表*

另外，凡是提早、迟到或超时**超过 15 分钟**，都必须通知主管。
