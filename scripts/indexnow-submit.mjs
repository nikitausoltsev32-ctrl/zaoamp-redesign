#!/usr/bin/env node
// Отправляет все URL из sitemap.xml в IndexNow (Bing + Яндекс).
// Запуск: node scripts/indexnow-submit.mjs
// Требует файл public/<key>.txt с этим же ключом (уже создан).

const SITE_URL = 'https://amp-minerals.ru'
const INDEXNOW_KEY = '97f01eb4529e97d700e12e4d050d246c'

async function getSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`)
  if (!res.ok) {
    throw new Error(`Не удалось получить sitemap.xml: ${res.status}`)
  }
  const xml = await res.text()
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
  return matches.map((m) => m[1])
}

async function submitToIndexNow(urls) {
  const body = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  }

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })

  console.log(`IndexNow: ${res.status} ${res.statusText}, отправлено URL: ${urls.length}`)
}

const urls = await getSitemapUrls()
await submitToIndexNow(urls)
