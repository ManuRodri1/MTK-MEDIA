import assert from "node:assert/strict"
import { test } from "node:test"

import { validateDeleteMediaResponse } from "../lib/cloudinary/delete-response"

const mediaId = "a790959c-dd2b-47bb-86e0-e52ecf23b974"

test("accepts a complete response for the requested media", () => {
  const response = { success: true, mediaId, projectId: "project-1", cloudinaryResult: "ok" }
  assert.equal(validateDeleteMediaResponse(response, mediaId), response)
})

test("accepts Cloudinary's idempotent not-found deletion result", () => {
  assert.equal(validateDeleteMediaResponse({ success: true, mediaId, projectId: "project-1", cloudinaryResult: "not found" }, mediaId).cloudinaryResult, "not found")
})

test("rejects mismatched media identifiers", () => {
  assert.throws(() => validateDeleteMediaResponse({ success: true, mediaId: "other", projectId: "project-1", cloudinaryResult: "ok" }, mediaId), /invalid response/)
})

test("rejects partial or failed payloads", () => {
  assert.throws(() => validateDeleteMediaResponse({ success: false, mediaId }, mediaId), /invalid response/)
  assert.throws(() => validateDeleteMediaResponse(null, mediaId), /invalid response/)
})
