import { appendFile, mkdir } from 'fs/promises'
import path from 'path'
import type { AssistantLeadDraft } from './lead'

export interface AiLeadRecord {
  lead: AssistantLeadDraft
  pagePath: string
  sessionId: string
  capturedAt: string
}

const LEADS_DIR = path.join(process.cwd(), 'data', 'leads')
const LEADS_FILE = path.join(LEADS_DIR, 'ai-leads.jsonl')

export async function appendAiLead(record: AiLeadRecord): Promise<void> {
  await mkdir(LEADS_DIR, { recursive: true })
  await appendFile(LEADS_FILE, `${JSON.stringify(record)}\n`, 'utf8')
}
