import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DEFAULT_PATH = join(__dirname, '..', '..', 'content', 'topics.json')

export function readTopics(path = DEFAULT_PATH) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

export function selectNextPending(data, platform) {
  return data.queue.find((t) => t.status === 'pending' && t.platform === platform) ?? null
}

export function markStatus(data, slug, status, fields = {}) {
  const topic = data.queue.find((t) => t.slug === slug)
  if (!topic) throw new Error(`Topic not found: ${slug}`)
  topic.status = status
  Object.assign(topic, fields)
  return data
}

export function writeTopics(data, path = DEFAULT_PATH) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
}
