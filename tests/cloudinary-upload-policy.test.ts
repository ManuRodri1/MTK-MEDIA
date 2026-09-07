import assert from "node:assert/strict"
import test from "node:test"

import {
  getCloudinaryUploadChunks,
  LARGE_UPLOAD_CHUNK_BYTES,
  MAX_SIMPLE_VIDEO_BYTES,
  shouldUseChunkedCloudinaryUpload,
} from "../lib/cloudinary/upload"

test("videos larger than 100 MB use Cloudinary's chunked upload path", () => {
  assert.equal(shouldUseChunkedCloudinaryUpload("video", MAX_SIMPLE_VIDEO_BYTES), false)
  assert.equal(shouldUseChunkedCloudinaryUpload("video", MAX_SIMPLE_VIDEO_BYTES + 1), true)
  assert.equal(shouldUseChunkedCloudinaryUpload("image", MAX_SIMPLE_VIDEO_BYTES + 1), false)
})

test("large files are split into contiguous 8 MB ranges", () => {
  const fileSize = (LARGE_UPLOAD_CHUNK_BYTES * 2) + 17
  const chunks = getCloudinaryUploadChunks(fileSize)

  assert.deepEqual(chunks, [
    { start: 0, endExclusive: LARGE_UPLOAD_CHUNK_BYTES },
    { start: LARGE_UPLOAD_CHUNK_BYTES, endExclusive: LARGE_UPLOAD_CHUNK_BYTES * 2 },
    { start: LARGE_UPLOAD_CHUNK_BYTES * 2, endExclusive: fileSize },
  ])
})

test("chunk planning rejects invalid sizes", () => {
  assert.throws(() => getCloudinaryUploadChunks(0), /positive safe integer/)
  assert.throws(() => getCloudinaryUploadChunks(1, 0), /positive safe integer/)
})
