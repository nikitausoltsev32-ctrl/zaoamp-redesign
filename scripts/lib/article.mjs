import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

export function buildFrontmatter(topic, { backlinks = [] } = {}) {
  const lines = [
    '---',
    `title: "${topic.title.replace(/"/g, '\\"')}"`,
    `platform: ${topic.platform}`,
    `audience: ${topic.audience}`,
    'status: generated',
    'backlinks:',
    ...backlinks.map((b) => `  - "${b}"`),
    'published_at:',
    'url:',
    '---',
  ]
  return lines.join('\n')
}

export function articleFilePath(topic, date) {
  return `content/${topic.platform}/${date}-${topic.slug}.md`
}

export function writeArticle(topic, { date, backlinks = [], body }, root = process.cwd()) {
  const rel = articleFilePath(topic, date)
  const abs = join(root, rel)
  writeFileSync(abs, buildFrontmatter(topic, { backlinks }) + '\n' + body + '\n')
  return abs
}
