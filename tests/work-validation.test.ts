import assert from "node:assert/strict"
import test from "node:test"

import { instagramUrlError, titleFromFilename } from "../lib/admin/work-validation"

test("accepts Instagram web URLs", () => {
  assert.equal(instagramUrlError("https://www.instagram.com/reel/ABC123/"), null)
  assert.equal(instagramUrlError("https://instagr.am/p/ABC123/"), null)
})

test("rejects missing, malformed, or non-Instagram URLs", () => {
  assert.match(instagramUrlError("")!, /Paste/)
  assert.match(instagramUrlError("instagram.com/reel/ABC123")!, /complete Instagram URL/)
  assert.match(instagramUrlError("https://example.com/video")!, /complete Instagram URL/)
})

test("derives a readable fallback title from the selected video", () => {
  assert.equal(titleFromFilename("summer_campaign-final.mp4"), "summer campaign final")
})
