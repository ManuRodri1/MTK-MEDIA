import assert from "node:assert/strict"
import { test } from "node:test"
import { handleRsvp } from "../lib/invitation-rsvp"

const url = "https://www.mtkmediagroup.com/api/invitacion/rsvp"
const payload = { name: "Guest Example", email: "guest@example.com", language: "es" }
function request(body: unknown = payload, headers: Record<string, string> = {}) {
  return new Request(url, { method: "POST", headers: { origin: "https://www.mtkmediagroup.com", "content-type": "application/json", ...headers }, body: JSON.stringify(body) })
}
const noFetch: typeof fetch = async () => { throw new Error("Unexpected upstream request") }

test("rejects foreign origins, missing origins and non-JSON submissions", async () => {
  assert.equal((await handleRsvp(request(payload, { origin: "https://example.org" }), noFetch)).status, 403)
  assert.equal((await handleRsvp(request(payload, { origin: "" }), noFetch)).status, 403)
  assert.equal((await handleRsvp(request(payload, { "content-type": "text/plain" }), noFetch)).status, 415)
})

test("validates every field before contacting D1", async () => {
  for (const body of [null, [], {}, { ...payload, name: " " }, { ...payload, email: "bad" }, { ...payload, language: "fr" }]) {
    assert.equal((await handleRsvp(request(body), noFetch)).status, 400)
  }
})

test("limits actual bytes without trusting Content-Length", async () => {
  assert.equal((await handleRsvp(request({ ...payload, name: "a".repeat(5000) }), noFetch)).status, 413)
})

test("normalizes fields, strips extra input and does not relay PII", async () => {
  const mock: typeof fetch = async (destination, options) => {
    assert.equal(String(destination), "https://mtk-subio-la-libra.gustavoreynosomtk.chatgpt.site/api/rsvp")
    assert.deepEqual(JSON.parse(options?.body as string), payload)
    assert.equal(options?.redirect, "error")
    assert.equal(options?.credentials, "omit")
    assert.equal(new Headers(options?.headers).get("origin"), "https://www.mtkmediagroup.com")
    return Response.json({ ok: true, email: "private@example.com", attendees: ["private"] })
  }
  const response = await handleRsvp(request({ ...payload, name: " Guest   Example ", email: " GUEST@example.com ", admin: true }), mock)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(response.headers.get("cache-control"), "no-store")
})

test("never reports success for upstream errors, login HTML, malformed JSON or false success", async () => {
  for (const upstream of [new Response("unavailable", { status: 503 }), new Response("<html>Login</html>"), new Response("{", { headers: { "content-type": "application/json" } }), Response.json({ ok: false }), Response.json({ success: true })]) {
    const response = await handleRsvp(request(), async () => upstream)
    assert.equal(response.status, 502)
    assert.equal((await response.json()).ok, false)
  }
  assert.equal((await handleRsvp(request(), noFetch)).status, 502)
  assert.equal((await handleRsvp(request(), async () => new Response(null, { status: 429 }))).status, 429)
})
