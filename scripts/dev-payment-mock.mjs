// Mojkmet dev mock payment provider (Node).
// Mirrors deploy/index.php + lib.php (the PHP mock) so payments work end-to-end
// locally against `PAYMENT_MOCK_BASE_URL=http://localhost:8787` while the real
// api.mojkmet.eu vhost is still converging. State lives in the OS temp dir.
//
//   node scripts/dev-payment-mock.mjs
//
// Endpoints mirror the shared contract:
//   GET  /v1/health                -> {"ok":true,...}
//   POST /v1/payments/initiate     -> create payment  (X-API-Key)
//   GET  /v1/payments/status?ref=  -> payment status  (X-API-Key)
//   GET  /pay/<ref>                -> hosted payment page
//   POST /pay/<ref>/settle         -> mark paid + fire webhook
//   GET  /pay/<ref>/cancel         -> cancel + redirect back

import http from 'node:http'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const PORT = Number(process.env.PAYMENT_MOCK_PORT || 8787)
const SECRET = process.env.PAYMENT_MOCK_SECRET || 'dev-secret'
const PROVIDER = 'mojkmet-mockpay'
const BASE = `http://localhost:${PORT}`
const EXPIRE_SEC = 1800
const DATA_DIR = path.join(process.env.TEMP || '/tmp', 'mojkmet-mockpay')

function payPath(ref) {
  return path.join(DATA_DIR, `${String(ref).replace(/[^A-Za-z0-9]/g, '')}.json`)
}

function loadPay(ref) {
  try {
    const d = JSON.parse(fs.readFileSync(payPath(ref), 'utf8'))
    return d && typeof d === 'object' ? d : null
  } catch {
    return null
  }
}

function savePay(pay) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(payPath(pay.payment_ref), JSON.stringify(pay))
}

function view(pay) {
  return {
    payment_ref: pay.payment_ref,
    order_id: pay.order_id,
    amount_cents: pay.amount_cents,
    currency: pay.currency,
    status: pay.status,
    payment_url: `${BASE}/pay/${pay.payment_ref}`,
    created_at: new Date(pay.created_at * 1000).toISOString(),
    expires_at: new Date(pay.expires_at * 1000).toISOString(),
    paid_at: pay.paid_at ? new Date(pay.paid_at * 1000).toISOString() : null,
  }
}

function json(res, code, obj) {
  const body = JSON.stringify(obj)
  res.writeHead(code, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
  })
  res.end(body)
}

function redirect(res, url) {
  res.writeHead(302, { location: url })
  res.end()
}

function hmacSign(body) {
  return crypto.createHmac('sha256', SECRET).update(body).digest('hex')
}

async function postWebhook(pay) {
  const body = JSON.stringify({
    event: 'payment.confirmed',
    provider: PROVIDER,
    payment_ref: pay.payment_ref,
    order_id: pay.order_id,
    amount_cents: pay.amount_cents,
    currency: pay.currency,
    paid_at: new Date(pay.paid_at * 1000).toISOString(),
    issuer: 'Mojkmet (mock payment provider)',
  })
  try {
    const res = await fetch(pay.webhook_url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Payment-Provider': PROVIDER,
        'X-Payment-Signature': hmacSign(body),
      },
      body,
    })
    return [res.status, await res.text()]
  } catch (err) {
    return [0, String(err && err.message ? err.message : err)]
  }
}

function withStatus(pay) {
  const now = Date.now() / 1000
  if (pay.status === 'pending' && now > pay.expires_at) {
    pay.status = 'expired'
    savePay(pay)
  }
  return pay
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, BASE)
  const method = (req.method || 'GET').toUpperCase()
  const pathName = url.pathname

  if (pathName === '/v1/health') {
    json(res, 200, { ok: true, provider: PROVIDER, env: 'mock', time: new Date().toISOString() })
    return
  }

  if (pathName === '/v1/payments/initiate' && method === 'POST') {
    if (req.headers['x-api-key'] !== SECRET) {
      json(res, 401, { error: 'unauthorized' })
      return
    }
    const chunks = []
    for await (const c of req) chunks.push(c)
    let b = {}
    try {
      b = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    } catch {
      json(res, 400, { error: 'invalid_json' })
      return
    }

    const orderId = String(b.order_id || '').trim()
    const amount = b.amount_cents
    const cur = String(b.currency || '').toUpperCase()
    const wh = String(b.webhook_url || '').trim()
    const ret = String(b.return_url || '').trim()
    const idem = String(b.idempotency_key || '').trim()

    if (!orderId || orderId.length > 64) return json(res, 422, { error: 'invalid_order_id' })
    if (!Number.isInteger(amount) || amount < 1 || amount > 9999999999)
      return json(res, 422, { error: 'invalid_amount_cents' })
    if (cur !== 'EUR') return json(res, 422, { error: 'unsupported_currency' })
    const local = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//
    if (!/^https:\/\//.test(wh) && !local.test(wh)) return json(res, 422, { error: 'invalid_webhook_url' })
    if (!/^https:\/\//.test(ret) && !local.test(ret)) return json(res, 422, { error: 'invalid_return_url' })

    fs.mkdirSync(DATA_DIR, { recursive: true })
    if (idem) {
      for (const f of fs.readdirSync(DATA_DIR).filter((x) => x.endsWith('.json'))) {
        const d = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'))
        if (d.idempotency_key === idem) {
          if (d.order_id !== orderId || d.amount_cents !== amount)
            return json(res, 409, { error: 'idempotency_key_reused_with_different_parameters' })
          return json(res, 200, view(d))
        }
      }
    }

    const ref = `MKP${crypto.randomBytes(5).toString('hex').toUpperCase()}`
    const pay = {
      payment_ref: ref,
      order_id: orderId,
      amount_cents: amount,
      currency: 'EUR',
      status: 'pending',
      idempotency_key: idem,
      webhook_url: wh,
      return_url: ret,
      created_at: Math.floor(Date.now() / 1000),
      expires_at: Math.floor(Date.now() / 1000) + EXPIRE_SEC,
      paid_at: null,
      attempts: [],
    }
    savePay(pay)
    json(res, 201, view(pay))
    return
  }

  if (pathName === '/v1/payments/status' && method === 'GET') {
    if (req.headers['x-api-key'] !== SECRET) return json(res, 401, { error: 'unauthorized' })
    const pay = withStatus(loadPay(url.searchParams.get('ref') || ''))
    if (!pay) return json(res, 404, { error: 'not_found' })
    json(res, 200, view(pay))
    return
  }

  const settle = pathName.match(/^\/pay\/([A-Za-z0-9]+)\/settle$/)
  if (settle && method === 'POST') {
    let pay = withStatus(loadPay(settle[1]))
    if (!pay) {
      res.writeHead(404)
      res.end('<h1>Ne najdem plačila</h1>')
      return
    }
    const sep = pay.return_url.includes('?') ? '&' : '?'
    if (pay.paid_at || pay.status === 'paid') {
      redirect(res, `${pay.return_url}${sep}status=success&ref=${encodeURIComponent(pay.payment_ref)}`)
      return
    }
    if (pay.status === 'expired') {
      redirect(res, `${pay.return_url}${sep}status=expired&ref=${encodeURIComponent(pay.payment_ref)}`)
      return
    }
    pay.status = 'paid'
    pay.paid_at = Math.floor(Date.now() / 1000)
    const [code, text] = await postWebhook(pay)
    pay.attempts.push({ at: Date.now(), http: code, error: text })
    savePay(pay)
    if (code >= 200 && code < 300) {
      redirect(res, `${pay.return_url}${sep}status=success&ref=${encodeURIComponent(pay.payment_ref)}`)
      return
    }
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    res.end(
      `<h2>Plačilo zabeleženo</h2><p>Potrditev trgovini ni bila dostavljena (HTTP ${code}). Vrnite se na <a href="${pay.return_url}">trgovino</a>.</p>`
    )
    return
  }

  const cancel = pathName.match(/^\/pay\/([A-Za-z0-9]+)\/cancel$/)
  if (cancel && method === 'GET') {
    const pay = withStatus(loadPay(cancel[1]))
    if (pay && pay.status === 'pending') {
      pay.status = 'cancelled'
      savePay(pay)
    }
    const sep = (pay && pay.return_url.includes('?')) ? '&' : '?'
    redirect(res, `${pay?.return_url || '/'}${sep}status=cancelled`)
    return
  }

  const hosted = pathName.match(/^\/pay\/([A-Za-z0-9]+)$/)
  if (hosted) {
    const pay = withStatus(loadPay(hosted[1]))
    if (!pay) {
      res.writeHead(404)
      res.end('<h1>Plačilo ni bilo najdeno</h1>')
      return
    }
    const h = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
    if (pay.status !== 'pending') {
      const labels = {
        paid: 'Plačilo je bilo uspešno potrjeno.',
        cancelled: 'Plačilo ste preklicali.',
        expired: 'Plačilo je poteklo.',
      }
      const sep = pay.return_url.includes('?') ? '&' : '?'
      redirect(res, `${pay.return_url}${sep}status=${pay.status}&ref=${encodeURIComponent(pay.payment_ref)}`)
      return
    }
    const amount = (pay.amount_cents / 100).toFixed(2).replace('.', ',') + ' €'
    const css = 'body{font-family:system-ui,sans-serif;background:#f5f4f1;margin:0;display:grid;place-items:center;min-height:100vh}.card{background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.08);padding:2.5rem;width:min(26rem,92vw)}.big{font-size:2rem;font-weight:700;text-align:center;margin:.8rem 0 1.4rem}.row{display:flex;justify-content:space-between;margin:.6rem 0;color:#4b5563}button{width:100%;padding:.9rem;font-size:1rem;font-weight:600;border:0;border-radius:10px;cursor:pointer}.pay{background:#16a34a;color:#fff;margin-bottom:.6rem}.cancel{background:#e5e7eb;color:#374151}.muted{font-size:.8rem;color:#9ca3af;text-align:center;margin-top:1rem}'
    const html =
      `<!doctype html><html lang="sl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Plačilo · Mock</title><style>${css}</style></head><body><div class="card">` +
      `<h1 style="font-size:1.1rem;margin:0">Mojkmet (mock plačilo)</h1><div class="muted">Razvojni strežnik — brez pravega zaračunavanja</div>` +
      `<div class="big">${amount}</div>` +
      `<div class="row"><span>Naročilo</span><span>${h(pay.order_id)}</span></div>` +
      `<div class="row"><span>Sklic</span><span>${h(pay.payment_ref)}</span></div>` +
      `<form method="post" action="/pay/${h(pay.payment_ref)}/settle"><button class="pay" type="submit">Potrdi plačilo</button></form>` +
      `<a class="cancel" href="/pay/${h(pay.payment_ref)}/cancel" style="display:block;text-align:center;padding:.9rem;border-radius:10px;text-decoration:none;color:#374151;background:#e5e7eb">Prekliči</a>` +
      `</div></body></html>`
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    res.end(html)
    return
  }

  json(res, 404, { error: 'not_found', path: pathName, method })
})

server.listen(PORT, () => {
  console.log(`Mock payment provider on ${BASE} (secret: ${SECRET.slice(0, 4)}…)`)
  console.log(`Data dir: ${DATA_DIR}`)
})