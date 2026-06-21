import assert from 'node:assert/strict'
import test from 'node:test'
import { selectNextPending, markStatus } from './topics.mjs'

const fixture = () => ({
  queue: [
    { slug: 'a', title: 'A', platform: 'dzen', audience: 'b2b', status: 'generated' },
    { slug: 'b', title: 'B', platform: 'vc', audience: 'b2b', status: 'pending' },
    { slug: 'c', title: 'C', platform: 'dzen', audience: 'b2b', status: 'pending' },
  ],
})

test('selectNextPending returns first pending topic for the platform', () => {
  const t = selectNextPending(fixture(), 'dzen')
  assert.equal(t.slug, 'c')
})

test('selectNextPending returns null when none pending for platform', () => {
  const data = { queue: [{ slug: 'a', platform: 'dzen', status: 'generated' }] }
  assert.equal(selectNextPending(data, 'dzen'), null)
})

test('markStatus updates status and merges extra fields by slug', () => {
  const data = fixture()
  markStatus(data, 'c', 'published', { url: 'https://dzen.ru/a/x' })
  const topic = data.queue.find((q) => q.slug === 'c')
  assert.equal(topic.status, 'published')
  assert.equal(topic.url, 'https://dzen.ru/a/x')
})

test('markStatus throws on unknown slug', () => {
  assert.throws(() => markStatus(fixture(), 'zzz', 'published'))
})
