import { test } from "node:test"
import assert from "node:assert/strict"
import { videoPolicy } from "../lib/video-policy"

const inView = { autoPlay: true, reducedMotion: false, saveData: false, nearby: true, visible: true, hidden: false, requested: null }

test("visible default video may load and play", () => {
  assert.deepEqual(videoPolicy(inView), { permitted: true, load: true, play: true })
})
test("distant media does not load or play", () => {
  assert.deepEqual(videoPolicy({ ...inView, nearby: false, visible: false }), { permitted: true, load: false, play: false })
})
test("nearby secondary media can prepare but cannot play offscreen", () => {
  assert.equal(videoPolicy({ ...inView, visible: false }).load, true)
  assert.equal(videoPolicy({ ...inView, visible: false }).play, false)
})
for (const preference of ["reducedMotion", "saveData"] as const) {
  test(`${preference} holds the poster without loading video`, () => {
    assert.deepEqual(videoPolicy({ ...inView, [preference]: true }), { permitted: false, load: false, play: false })
  })
  test(`explicit play overrides ${preference}`, () => {
    assert.equal(videoPolicy({ ...inView, [preference]: true, requested: "play" }).play, true)
  })
}
test("explicit pause remains paused through visibility changes", () => {
  assert.equal(videoPolicy({ ...inView, requested: "pause" }).play, false)
  assert.equal(videoPolicy({ ...inView, requested: "pause", visible: false }).load, false)
})
test("hidden tab does not play or start loading, even after manual play", () => {
  assert.equal(videoPolicy({ ...inView, hidden: true, requested: "play" }).play, false)
  assert.equal(videoPolicy({ ...inView, hidden: true, requested: "play" }).load, false)
})
test("non-autoplay video waits for explicit intent", () => {
  assert.equal(videoPolicy({ ...inView, autoPlay: false }).load, false)
  assert.equal(videoPolicy({ ...inView, autoPlay: false, requested: "play" }).play, true)
})
