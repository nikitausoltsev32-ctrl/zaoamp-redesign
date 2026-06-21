import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtempSync, readFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { buildFrontmatter, articleFilePath, writeArticle } from './article.mjs'

const topic = { slug: 'test-slug', title: 'Тест', platform: 'dzen', audience: 'b2b', status: 'pending' }

test('buildFrontmatter sets status generated and lists backlinks', () => {
  const fm = buildFrontmatter(topic, { backlinks: ['https://amp-minerals.ru/catalog/kroshka'] })
  assert.match(fm, /^---/)
  assert.match(fm, /status: generated/)
  assert.match(fm, /platform: dzen/)
  assert.match(fm, /https:\/\/amp-minerals\.ru\/catalog\/kroshka/)
  assert.match(fm, /published_at:/)
  assert.match(fm, /url:/)
})

test('articleFilePath uses platform folder, date and slug', () => {
  assert.equal(articleFilePath(topic, '2026-06-25'), 'content/dzen/2026-06-25-test-slug.md')
})

test('writeArticle writes frontmatter and body to disk', () => {
  const root = mkdtempSync(join(tmpdir(), 'art-'))
  mkdirSync(join(root, 'content', 'dzen'), { recursive: true })
  const path = writeArticle(topic, { date: '2026-06-25', backlinks: [], body: '# Привет\n\nТекст.' }, root)
  const content = readFileSync(path, 'utf8')
  assert.match(content, /status: generated/)
  assert.match(content, /# Привет/)
})
