import assert from "node:assert/strict"
import test from "node:test"
import { selectFeaturedWork, selectHomepageWork, toWorkItems } from "../lib/work-items"
import type { PublicProject } from "../lib/public-work"

function project(index: number, featured = false): PublicProject {
  return {
    id: `qa-${index}`, slug: `qa-${index}`, title: `QA fixture ${index}`, short_description: null, description: null,
    project_type: "video" as PublicProject["project_type"], project_date: "2025-06-15", instagram_url: null, external_url: null,
    is_featured: featured, sort_order: index, published_at: null, client: { name: "QA client", slug: "qa-client" }, services: [],
    media: [{ id: `media-${index}`, media_type: "video", media_role: "hero", cloudinary_url: "https://res.cloudinary.com/test/video/upload/v1/qa.mp4", thumbnail_url: null,
      width: 720, height: 1280, duration_seconds: 30, alt_text: null, caption: null, is_cover: true, is_featured: false, sort_order: 0, processing_status: "ready" }],
  }
}

for (const count of [0, 1, 2, 5, 20, 30]) {
  test(`preserves all ${count} projects without a three-item ceiling`, () => {
    const items = toWorkItems(Array.from({ length: count }, (_, index) => project(index)))
    assert.equal(selectFeaturedWork(items).length, count)
    assert.equal(new Set(items.map((item) => item.id)).size, count)
  })
}
test("featured curation is independent of the complete library", () => {
  const items = toWorkItems([project(2, true), project(0), project(1, true)])
  assert.deepEqual(selectFeaturedWork(items).map((item) => item.order), [1, 2])
  assert.equal(items.length, 3)
  assert.equal(selectFeaturedWork(items, { limit: 1 }).length, 1)
  assert.equal(selectFeaturedWork(toWorkItems([project(1)]), { fallbackToAll: false }).length, 0)
})
test("video adapter preserves dimensions and supplies a poster without loading video", () => {
  const [item] = toWorkItems([project(0)])
  assert.equal(item.ratio, 9 / 16)
  assert.equal(item.year, "2025")
  assert.match(item.posterUrl, /so_1.*qa\.jpg$/)
  assert.match(item.videoUrl!, /qa\.mp4$/)
})
test("excludes unusable media and preserves a supplied cover", () => {
  const empty = project(0); empty.media = []
  const supplied = project(1); supplied.media[0].thumbnail_url = "https://example.com/approved-cover.jpg"
  const items = toWorkItems([empty, supplied])
  assert.equal(items.length, 1)
  assert.equal(items[0].posterUrl, "https://example.com/approved-cover.jpg")
})
test("hides empty and generated placeholder titles", () => {
  const blank = project(0); blank.title = "  "
  const generated = project(1); generated.title = "VIDEO01"
  const named = project(2); named.title = "Backstage in Santo Domingo"
  assert.deepEqual(toWorkItems([blank, generated, named]).map((item) => item.title), [null, null, "Backstage in Santo Domingo"])
})
test("homepage curation prefers featured work and fills to four", () => {
  const items = toWorkItems([project(0), project(1, true), project(2), project(3, true), project(4)])
  assert.deepEqual(selectHomepageWork(items).map((item) => item.order), [1, 3, 0, 2])
})
