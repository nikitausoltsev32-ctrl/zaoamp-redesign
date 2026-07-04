# SEO/GEO Push + AI-Agent Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the indexing leak, publish the 4 already-generated off-site articles (currently 0 GEO/referral traffic despite content existing), ship the 2 content-gap blog articles, unblock the reviews/AggregateRating workstream, and raise AI sales-assistant recommendation quality with regression tests.

**Architecture:** Five independent workstreams from `docs/superpowers/plans/2026-06-27-seo-geo-roadmap.md`, re-scoped against current repo state (2026-07-05): WS1 (indexing, mostly manual/GSC), WS3 (publish 4 generated-but-unpublished articles), WS4 (1 of 2 content-gap articles remains), WS2 (reviews — blocked on manual collection), and a new AI-agent workstream (recommendation-quality regression tests, picked by user over lead-persistence/citability work).

**Tech Stack:** Next.js App Router (TS), `lib/data/blog.ts`, `lib/seo/schema.tsx`, `lib/ai/knowledge.ts`, `node:test` + `node:assert/strict` for unit tests, Dzen/VC manual publish via the `dzen-draft` skill.

## Global Constraints

- **Никаких выдуманных характеристик.** All numeric specs come only from `memory/product_specs.md` or `public/documents/` passports. Missing value → ask the user, never invent.
- **Никаких выдуманных отзывов/рейтингов.** AggregateRating must reflect real collected reviews only.
- Content language: Russian. Audience: B2B snabженцы + строители.
- Off-site articles are published manually (Dzen has no public API and bans server IPs) or via the local Playwright flow `npm run post:dzen` — never assume server-side auto-publish.
- `npm run build` must pass after every code task before commit.

---

## Workstream A — Publish the 4 stuck off-site articles (do first, unblocks GEO)

All 4 topics in `content/topics.json` are `status: generated` but **zero are published** (`published_at` empty in all 4 files). This is the root cause of 0 GEO/referral traffic measured in Yandex Metrika. Verified backlinks (`/catalog/kroshka/`, `/catalog/muka/`, `/catalog/shcheben/`) all resolve to real category slugs (`lib/data/categories.ts:4`) — no broken-link fix needed.

### Task A.1: Verify numeric claims in all 4 articles against product_specs.md

**Files:**
- Read: `content/dzen/2026-06-22-mramornaya-kroshka-dlya-shtukaturki-rashod.md`
- Read: `content/dzen/2026-06-27-mikrokaltsit-v-proizvodstve-lkm.md`
- Read: `content/dzen/2026-06-27-mramornyj-shheben-dlya-dorog-i-blagoustrojstva.md`
- Read: `content/vc/2026-06-27-kak-prinyat-partiyu-mramornoj-kroshki-na-obekte.md`
- Reference: `memory/product_specs.md`

- [ ] For each article, extract every numeric claim (%, Бк/кг, тн/м³, mm fractions) and check it against `memory/product_specs.md`. Flag anything not in that file — do not silently accept it.
- [ ] Fix any mismatched or unsourced number directly in the `.md` file (edit the article text).

**Verify:** Every numeric claim in all 4 articles traces to `memory/product_specs.md` or is removed.

### Task A.2: Publish article 1 — Дзен "мраморная крошка для штукатурки"

**Files:** `content/dzen/2026-06-22-mramornaya-kroshka-dlya-shtukaturki-rashod.md`

- [ ] Invoke the `dzen-draft` skill to prepare the Dzen draft for this file (Claude drives the browser to set up the draft; user publishes manually).
- [ ] After the user confirms publication, update the file frontmatter: set `status: published`, fill `published_at:` (ISO date) and `url:` (live Dzen URL).
- [ ] Update `content/topics.json` entry `mramornaya-kroshka-shtukaturka-raskhod` (or matching slug) to `"status": "published"`.

**Verify:** Frontmatter has `status: published`, non-empty `published_at` and `url`; `content/topics.json` matches.

### Task A.3: Publish article 2 — Дзен "микрокальцит в ЛКМ"

**Files:** `content/dzen/2026-06-27-mikrokaltsit-v-proizvodstve-lkm.md`

- [ ] Invoke the `dzen-draft` skill for this file.
- [ ] After publication, update frontmatter (`status: published`, `published_at`, `url`) and the matching entry in `content/topics.json`.

**Verify:** Same as Task A.2 for this file.

### Task A.4: Publish article 3 — Дзен "мраморный щебень для дорог"

**Files:** `content/dzen/2026-06-27-mramornyj-shheben-dlya-dorog-i-blagoustrojstva.md`

- [ ] Invoke the `dzen-draft` skill for this file.
- [ ] After publication, update frontmatter and `content/topics.json`.

**Verify:** Same as Task A.2 for this file.

### Task A.5: Publish article 4 — VC.ru "приёмка партии крошки"

**Files:** `content/vc/2026-06-27-kak-prinyat-partiyu-mramornoj-kroshki-na-obekte.md`

- [ ] `dzen-draft` targets Dzen only — this article is `platform: vc`. Publish manually on vc.ru (no existing automation script for VC; do not build one now — YAGNI until a second VC article is queued).
- [ ] After publication, update frontmatter (`status: published`, `published_at`, `url`) and `content/topics.json`.

**Verify:** Same as Task A.2 for this file.

### Task A.6: Confirm publishing cadence

- [ ] With all 4 backlog articles published, confirm with the user whether the scheduled cloud content agent (`docs/superpowers/content-agent-prompt.md`) should keep generating at the previously-discussed 2×/week cadence, now that publishing (not just generation) is the bottleneck to watch.

**Verify:** Documented decision (keep cadence / pause until backlog absorbed).

---

## Workstream B — Stop the indexing leak (manual GSC audit, ~1 day)

Unchanged from the 2026-06-27 roadmap — this requires live GSC data this session doesn't have access to.

### Task B.1: Export not-indexed pages from GSC

**Action (manual, user in GSC):**
- [ ] Open GSC → Indexing → Pages → "Not indexed" total → export CSV to `docs/seo/2026-07-05-not-indexed.csv`.
- [ ] Record each reason bucket (Crawled-not-indexed / Discovered-not-indexed / Duplicate-canonical / Redirect / noindex).

**Verify:** CSV exists with URL + reason per row.

### Task B.2: Triage and fix

- [ ] "Duplicate, Google chose different canonical" → check `canonical` in the page's `generateMetadata`; fix if wrong.
- [ ] "Crawled/Discovered - not indexed" → add ≥1 contextual internal link from an already-indexed, topically related page (`lib/data/navigation.ts`, category pages under `app/catalog/`, `components/sections/seo-long-content.tsx`).
- [ ] Run `npm run build` after any link/canonical change — confirm no broken links or type errors.

**Verify:** `npm run build` passes; each previously-orphaned URL linked from ≥1 indexed page.

### Task B.3: Resubmit sitemap + request indexing

- [ ] Confirm `app/sitemap.ts` includes every URL from Task B.1 that should be indexed.
- [ ] GSC → Sitemaps → resubmit `sitemap.xml`.
- [ ] For the 3-5 highest-value URLs, GSC URL Inspection → "Request indexing"; same URLs in Yandex Webmaster → Индексирование → Переобход страниц.

**Verify:** Sitemap shows "Success"; requested URLs show "Indexing requested".

---

## Workstream C — Remaining content-gap article

Task 4.1 ("мраморная мука применение") from the 2026-06-27 roadmap is **already done** — `lib/data/blog.ts` has the `mramornaya-muka-primenenie` entry (uncommitted, +98 lines in current diff). Task 4.2 (расход/упаковка) is not started.

### Task C.1: Article — "Расход и упаковка мраморной крошки"

**Target queries (GSC):** `калькулятор мраморной крошки`, `мраморная крошка формула`, `мраморная крошка биг бэг`, `крошка в упаковке купить`.

**Files:**
- Modify: `lib/data/blog.ts` (add entry, follow the exact shape of the existing `mramornaya-muka-primenenie` entry: `slug`, `title`, `h1`, `excerpt`, `publishDate`, `category`, `readTime`, `authorSlug`, `sections`, `seo`, `relatedProducts`)

- [ ] slug: `rashod-i-upakovka-mramornoj-kroshki`, title: "Расход мраморной крошки на м²/м³ и варианты упаковки".
- [ ] Расход formula: use насыпная плотность **1,25 тн/м³** (`memory/product_specs.md`) → worked example converting to kg per m² at a given layer thickness (e.g. дорожка слой 5 см → `0,05 м × 1250 кг/м³ = 62,5 кг/м²`).
- [ ] Packaging section: навал, биг-бэг 500 кг / 1 т, мешки (check `public/llms.txt` or `lib/data/products.ts` `specifications.packaging` per product for exact bag sizes actually offered — do not invent a size not present in the codebase).
- [ ] Internal links to `/catalog/kroshka/` and 1-2 fraction product pages.
- [ ] If a расход calculator component already exists on the site, link it; if not, note it as a possible follow-up — do NOT build one in this task (YAGNI, matches the original roadmap's open question).
- [ ] Add `seo.keywords` matching the target queries above.
- [ ] Run `npm run build` — passes, page renders at `/blog/rashod-i-upakovka-mramornoj-kroshki/`.

**Verify:** Build green; расход example uses 1,25 тн/м³; packaging table only lists real offered options.

---

## Workstream D — Reviews + AggregateRating (blocked, start collection now)

`grep -rn "aggregateRating"` confirms zero matches in `lib/seo/schema.tsx` (the only schema generator file) — still the single biggest missing Yandex commercial-ranking signal.

### Task D.1: Collect real reviews (blocking — no fabrication)

**Action (manual, user):**
- [ ] Gather ≥5 genuine reviews (email, 2GIS, Yandex.Business, delivery notes): author/company, rating 1-5, date, text.

**Verify:** ≥5 real reviews captured with author + rating + date.

> **STOP condition:** if fewer than 5 real reviews exist, do not proceed to Task D.2/D.3 — collecting reviews is the priority, not writing code around zero data.

### Task D.2: Reviews data model + render

**Files:**
- Create: `lib/data/reviews.ts`

```typescript
export interface Review {
  author: string
  rating: 1 | 2 | 3 | 4 | 5
  date: string // ISO 8601, e.g. '2026-07-01'
  text: string
  product?: string // product slug, optional
}

export const reviews: Review[] = [
  // populated from Task D.1 — real reviews only
]
```

- Create: `components/sections/reviews-section.tsx` (list + average rating display, follow the visual pattern of an existing section component, e.g. `components/sections/samples-cta.tsx` for structure/styling conventions)
- Modify: homepage (`app/page.tsx` or wherever sections are composed) to render `<ReviewsSection />`

- [ ] Define `Review` type, export real reviews from Task D.1.
- [ ] Build `ReviewsSection`: render list, compute and display average rating.
- [ ] `npm run build` passes.

**Verify:** Reviews visible on the page; build green.

### Task D.3: AggregateRating + Review JSON-LD

**Files:**
- Modify: `lib/seo/schema.tsx` — add a `generateAggregateRatingSchema(reviews: Review[])` helper and merge its output into `generateProductSchema` (and/or `generateOrganizationSchema`, per which entity the reviews are attached to)

```typescript
import type { Review } from '@/lib/data/reviews'

export function generateAggregateRatingSchema(productReviews: Review[]) {
  if (productReviews.length === 0) return undefined
  const ratingValue = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
  return {
    '@type': 'AggregateRating',
    ratingValue: Number(ratingValue.toFixed(1)),
    reviewCount: productReviews.length,
  }
}
```

- [ ] Wire `generateAggregateRatingSchema` into `generateProductSchema` (or Organization schema, whichever the reviews are scoped to) — `ratingValue`/`reviewCount` computed from `reviews.ts`, never hardcoded.
- [ ] Validate output in Google Rich Results Test and Yandex structured-data validator.

**Verify:** Rich Results Test shows valid AggregateRating with real numbers matching `reviews.ts`.

### Task D.4: Complete off-site business profiles

**Action (manual):**
- [ ] Yandex.Business — complete categories, photos, price list, hours; enable review collection.
- [ ] 2ГИС — register/complete categories, photos, contacts.
- [ ] Confirm both URLs remain in `generateOrganizationSchema`'s `sameAs` array (`lib/seo/schema.tsx:124`).

**Verify:** Both profiles complete; both in `sameAs`.

---

## Workstream E — AI-agent recommendation quality (regression tests)

`lib/ai/knowledge.ts` has no test coverage (unlike `lib/ai/lead.ts`, which has `lib/ai/lead.test.ts`). `findRelevantProducts`/`scoreProduct`/`buildRuleBasedAssistantReply` drive what the AI sales assistant recommends — changing `USE_CASE_RULES` today has zero regression protection. This task locks current intended behavior with tests (TDD), following the existing `lead.test.ts` pattern (`node:test` + `node:assert/strict`).

### Task E.1: Write failing tests for findRelevantProducts

**Files:**
- Create: `lib/ai/knowledge.test.ts`

- [ ] **Step 1: Write the test file**

```typescript
import assert from 'node:assert/strict'
import test from 'node:test'

import { findRelevantProducts } from './knowledge'

test('findRelevantProducts matches landscaping queries to crumb fractions', () => {
  const results = findRelevantProducts('нужна крошка для дорожек в саду')
  assert.ok(results.length > 0)
  assert.ok(results.every((product) => product.category === 'kroshka'))
})

test('findRelevantProducts matches drainage queries to coarse gravel', () => {
  const results = findRelevantProducts('щебень для дренажа фундамента')
  assert.ok(results.length > 0)
  assert.equal(results[0].category, 'scherb')
  assert.ok(['50-200 мм', '20-50 мм'].includes(results[0].fraction))
})

test('findRelevantProducts matches an exact fraction mention over keyword-only matches', () => {
  const results = findRelevantProducts('нужен щебень 10-20 мм для отсыпки')
  assert.equal(results[0].fraction, '10-20 мм')
})

test('findRelevantProducts matches paint/plastic queries to micro-calcite or marble flour', () => {
  const results = findRelevantProducts('микрокальцит для лакокрасочных материалов')
  assert.ok(results.length > 0)
  assert.equal(results[0].category, 'muika')
})

test('findRelevantProducts returns empty for unrelated queries', () => {
  const results = findRelevantProducts('какая сегодня погода')
  assert.equal(results.length, 0)
})
```

- [ ] **Step 2: Run to check current behavior**

Run: `node --test lib/ai/knowledge.test.ts`
Expected: some tests may already pass (rules exist today) — record which fail, if any. Do not "fix" `USE_CASE_RULES` speculatively; only touch it if a test above fails and the fix is a one-line pattern/slug correction.

- [ ] **Step 3: If any test fails, fix the minimal cause in `USE_CASE_RULES` or `scoreProduct` (`lib/ai/knowledge.ts`)**

- [ ] **Step 4: Run tests again**

Run: `node --test lib/ai/knowledge.test.ts`
Expected: all PASS

- [ ] **Step 5: Commit**

```bash
git add lib/ai/knowledge.test.ts lib/ai/knowledge.ts
git commit -m "test: lock AI assistant product-recommendation behavior"
```

### Task E.2: Wire knowledge tests into the existing test run

**Files:**
- Inspect: `package.json` scripts (check how `lib/ai/lead.test.ts` is currently run — likely `node --test` glob or a `test` script)

- [ ] Confirm `npm test` (or whatever script runs `lead.test.ts`) also picks up `lib/ai/knowledge.test.ts` without additional config (node's test runner glob-matches `*.test.ts` by default in most setups — verify, don't assume).
- [ ] If it does not, add `lib/ai/knowledge.test.ts` to the existing test glob/script in `package.json`.

**Verify:** `npm test` runs both `lead.test.ts` and `knowledge.test.ts`, all green.

---

## Priority order (recommended execution)

1. **Workstream A** (publish 4 stuck articles) — content already paid for, zero traffic captured; fastest ROI.
2. **Workstream B** (indexing) — cheapest win on already-earned impressions.
3. **Workstream E** (AI-agent regression tests) — protects an already-live customer-facing surface before further changes.
4. **Workstream C** (расход/упаковка article) — direct impression→click upside on measured gaps.
5. **Workstream D** (reviews/AggregateRating) — highest ceiling, slowest; start Task D.1 collection now in parallel, it's user-blocked not code-blocked.

## Self-review notes

- Workstream A supersedes the 2026-06-27 roadmap's WS3 — re-verified against current file state (all 4 articles generated, 0 published, backlinks correct) rather than trusting the stale "3 pending" note in memory.
- Workstream C only covers the one remaining content-gap article; Task 4.1 (мука) confirmed already implemented in the current diff, not re-planned.
- Workstream D repeats the 2026-06-27 roadmap's WS2 essentially unchanged — still correctly blocked on manual review collection, still zero AggregateRating in code today.
- Workstream E is new, scoped per user's explicit pick (recommendation quality) — deliberately excludes lead-persistence rebuild (Supabase removal) and does not invent new USE_CASE_RULES entries not already implied by existing product/category data.
- Every numeric content claim task (A.1, C.1) cites `memory/product_specs.md` — no invented specs.
- AggregateRating gated on real reviews (D.1 blocks D.2/D.3), matching the global constraint.
