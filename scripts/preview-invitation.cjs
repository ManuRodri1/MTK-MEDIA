// Local-only preview. Intercepts RSVP before Next; never calls the Sites backend.
const fs = require('node:fs')
const http = require('node:http')
const ts = require('typescript')
process.env.NODE_ENV = 'development'
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
}).outputText, filename)
const { handleRsvp } = require('../lib/invitation-rsvp.ts')
const next = require('next')
const port = 3107
const app = next({ dev: true, hostname: '127.0.0.1', port })
const records = new Map()
const mockFetch = async (_url, options) => {
  const row = JSON.parse(options.body)
  if (!records.has(row.email)) records.set(row.email, row)
  return Response.json({ ok: true })
}
app.prepare().then(() => {
  const handler = app.getRequestHandler()
  http.createServer(async (req, res) => {
    if (req.url === '/__preview__/records' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify([...records.values()]))
      return
    }
    if (req.url.split('?')[0] !== '/api/invitacion/rsvp') return handler(req, res)
    if (req.method !== 'POST') { res.writeHead(405); res.end(); return }
    try {
      const chunks = []
      let bytes = 0
      for await (const chunk of req) {
        bytes += chunk.length
        if (bytes > 4096) { res.writeHead(413); res.end(); return }
        chunks.push(chunk)
      }
      const request = new Request(`http://127.0.0.1:${port}/api/invitacion/rsvp`, {
        method: 'POST', headers: req.headers, body: Buffer.concat(chunks),
      })
      const response = await handleRsvp(request, mockFetch)
      res.writeHead(response.status, Object.fromEntries(response.headers))
      res.end(await response.text())
    } catch { res.writeHead(500); res.end() }
  }).listen(port, '127.0.0.1', () => console.log(`LOCAL MOCK ONLY: http://127.0.0.1:${port}/invitacion?lang=es`))
})
