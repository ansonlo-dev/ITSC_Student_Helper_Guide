const BASE = process.argv[2]
const list = await (await fetch('http://127.0.0.1:9223/json/list')).json()
const ws = new WebSocket(list.find((t: any) => t.type === 'page').webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0; const pending = new Map<number, (v: any) => void>()
ws.onmessage = (e) => { const m = JSON.parse(e.data as string)
  if (m.id && pending.has(m.id)) { pending.get(m.id)!(m); pending.delete(m.id) }
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error')
    console.log('CONSOLE ERROR:', JSON.stringify(m.params.args.map((a:any)=>a.value ?? a.description)).slice(0,200)) }
const send = (method: string, params: any = {}) => { const i = ++id
  ws.send(JSON.stringify({ id: i, method, params })); return new Promise<any>((r) => pending.set(i, r)) }
const ev = async (e: string) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true })
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: `${BASE}/guide/first-shift` }); await wait(5000); console.log("url:", await ev(`location.href`), "imgs:", await ev(`document.querySelectorAll(".vp-doc img").length`))
await ev(`document.querySelectorAll('.vp-doc img')[0].click()`); await wait(400)
const img = `document.querySelector('.lightbox__image')`
const scale = () => ev(`document.querySelector('.lightbox__scale').textContent`)
console.log('start:', await scale())
// listener sanity: does the element even receive our synthetic pointer events?
await ev(`window.__seen = []; const el = ${img};
  ['pointerdown','pointermove','pointerup'].forEach(t => el.addEventListener(t, e => window.__seen.push(t + ':' + e.pointerId)))`)
await ev(`${img}.dispatchEvent(new PointerEvent('pointerdown',{pointerId:2,clientX:600,clientY:400,bubbles:true,cancelable:true}))`)
await ev(`${img}.dispatchEvent(new PointerEvent('pointerdown',{pointerId:3,clientX:700,clientY:400,bubbles:true,cancelable:true}))`)
await ev(`${img}.dispatchEvent(new PointerEvent('pointermove',{pointerId:3,clientX:900,clientY:400,bubbles:true}))`)
await wait(300)
console.log('events seen:', await ev(`window.__seen.join(', ')`))
console.log('after pinch from 100%:', await scale())
ws.close()
