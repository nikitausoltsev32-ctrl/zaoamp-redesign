# SEO + GEO Roadmap — 2026-06-27

> **For workers:** Mixed plan — code tasks (file paths + checks), content tasks (article briefs), external tasks (manual actions). Steps use checkbox (`- [ ]`) syntax. Not pure TDD; code tasks still get a build/lint/visual check.

**Goal:** Convert the existing SEO foundation into measurable inbound leads — fix indexing leaks, add the missing Yandex commercial-ranking signals (reviews + AggregateRating), and close the broken GEO/off-site loop (publish, don't just generate).

**Current measured state (2026-06-27):**
- Google Search Console (3 mo): 22 clicks, 629 impressions, CTR 3.5%, avg position **11.2**. Indexed 23 / **not indexed 13**.
- Yandex Metrika (month): 42 visits = 32 direct + 7 Yandex + 3 Google. Search traffic time-on-site 7m43s (Yandex). **GEO/referral traffic: 0.**
- Robots 53% of hits (mostly Google Ad Checker — benign, no action).
- First inbound phone call received 2026-06-27. Exact query unknowable (Yandex encrypts ~90% of phrases); only revealed phrase this month: "нерудные материалы".

**Architecture of the work:** Four independent workstreams, run in priority order. WS1 (indexing) and WS3-publish (Dzen) are the fastest ROI — they unlock traffic already earned. WS2 (commercial factors) is the highest-ceiling but slowest to pay off (Yandex sandbox 4-6 mo).

## Global Constraints

- **Никаких выдуманных характеристик.** All numeric specs (Бк/кг, %, твёрдость, белизна, плотность) come only from `memory/product_specs.md` or pasporta in `public/documents/`. If a value is missing, ask the user — never invent. (Applies to every content task.)
- **Никаких выдуманных отзывов/рейтингов.** AggregateRating must reflect real collected reviews, not fabricated counts/scores.
- Content language: Russian. Audience: B2B snabженцы + builders.
- Off-site articles push to branch `content/auto`, never `main`. User reviews and merges.
- Site stack: Next.js App Router, TS. SEO content rendered via `components/sections/seo-long-content.tsx`; blog data in `lib/data/blog.ts`; keyword map in `lib/data/semantic-core.ts`.

---

## Workstream 1 — Stop the indexing leak (do first, ~1 day)

13 pages are in GSC "not indexed". Every non-indexed page is earned content producing zero impressions. This is the cheapest win.

### Task 1.1: Identify the 13 not-indexed pages and their reason

**Action (manual, GSC):**
- [ ] Open GSC → Indexing → Pages → click the "Not indexed" total.
- [ ] Record each reason bucket (e.g. "Crawled - currently not indexed", "Discovered - not indexed", "Duplicate without user-selected canonical", "Page with redirect", "Excluded by noindex").
- [ ] Export the list (button top-right) to `docs/seo/2026-06-27-not-indexed.csv`.

**Verify:** You have a 13-row list with URL + reason.

### Task 1.2: Triage by reason

- [ ] **"Page with redirect" / trailing-slash duplicates** → expected noise from the trailing-slash normalization. Confirm the canonical (slash) version IS indexed. No action if so.
- [ ] **"Duplicate, Google chose different canonical"** → check `canonical` tag on the page matches the URL you want. Fix in the page's `generateMetadata` if wrong.
- [ ] **"Crawled - currently not indexed"** → thin/low-value signal. These are candidates for the WS4 content additions, or for internal linking (Task 1.3).
- [ ] **"Discovered - not indexed"** → crawl-budget / low internal links. Fix via Task 1.3 + resubmit sitemap.

**Verify:** Each of the 13 has an assigned action (ignore / fix canonical / add content / add internal links).

### Task 1.3: Strengthen internal links to orphaned pages

**Files:**
- Inspect: `lib/data/navigation.ts`, category pages under `app/catalog/`, `components/sections/seo-long-content.tsx`
- Likely modify: category/landing pages to add contextual links to the not-indexed product/landing URLs.

- [ ] For each "Discovered/Crawled - not indexed" page, add at least one in-content link from an already-indexed, topically-related page (e.g. catalog page → its fraction product pages; application landing → relevant product).
- [ ] Run `npm run build` and confirm no broken links / type errors.

**Verify:** `npm run build` passes; each previously-orphaned URL is now linked from ≥1 indexed page.

### Task 1.4: Resubmit sitemap + request indexing

- [ ] Confirm `app/sitemap.ts` includes every URL from Task 1.1 that should be indexed. Add any missing.
- [ ] GSC → Sitemaps → resubmit `sitemap.xml`.
- [ ] For the 3-5 highest-value not-indexed pages (commercial product/category), use GSC URL Inspection → "Request indexing".
- [ ] In Yandex Webmaster → Индексирование → Переобход страниц, submit the same high-value URLs.

**Verify:** Sitemap shows "Success" with the new URL count; requested URLs show "Indexing requested".

---

## Workstream 2 — Yandex commercial factors (highest ceiling, start now, pays off over months)

Yandex ranks commercial queries heavily on commercial factors: reviews, prices, business profile completeness. The site currently has **no reviews and no AggregateRating anywhere** (confirmed: zero matches in codebase). This is the single biggest missing ranking signal for "купить" queries.

### Task 2.1: Collect real reviews (blocking — no fabrication)

**Action (manual, user):**
- [ ] Gather genuine reviews from existing customers (email, 2GIS, Yandex.Business, delivery notes). Need a minimum of 5 to justify an AggregateRating.
- [ ] For each: author name (or company), rating 1-5, date, text. Save to `lib/data/reviews.ts` as structured data.

**Verify:** ≥5 real reviews captured with author + rating + date.

> If fewer than 5 real reviews exist, STOP this workstream and prioritise collecting them (ask customers after delivery). Do not synthesize ratings — it violates a global constraint and risks Yandex/Google penalties.

### Task 2.2: Reviews data model + render

**Files:**
- Create: `lib/data/reviews.ts` (typed array: `{ author, rating, date, text, product? }`)
- Create: `components/sections/reviews-section.tsx`
- Modify: product pages / homepage to render the section.

- [ ] Define the `Review` type and export the real reviews from Task 2.1.
- [ ] Build the render component (list + average display).
- [ ] `npm run build` passes.

**Verify:** Reviews visible on page; build green.

### Task 2.3: AggregateRating + Review JSON-LD

**Files:**
- Modify: the product/Organization JSON-LD generator (search `generateProductSchema` / wherever Product schema lives) to add `aggregateRating` (`ratingValue` = real average, `reviewCount` = real count) and `review` array.

- [ ] Compute `ratingValue`/`reviewCount` from `reviews.ts` — never hardcode.
- [ ] Add `aggregateRating` + `review` to schema.
- [ ] Validate output in Google Rich Results Test and Yandex structured-data validator.

**Verify:** Rich Results Test shows valid AggregateRating with the real numbers.

### Task 2.4: Complete off-site business profiles (authority — lowest audit score)

**Action (manual):**
- [ ] **Yandex.Business** — the org profile is already linked via `sameAs` (commit `542fd48`). Complete it: all product categories, photos, prices/price-list, working hours, description. Enable review collection.
- [ ] **2ГИС** — register the company if not present; fill categories, photos, contacts.
- [ ] Confirm both URLs are in the Organization `sameAs` array (`grep -rn "sameAs" lib/`).

**Verify:** Both profiles published and complete; both in `sameAs`.

---

## Workstream 3 — Close the GEO loop (off-site content)

The off-site engine generates articles but **the one generated article was never published** (`content/dzen/2026-06-22-...md` → `status: generated`, `published_at:` empty). Generation without publication = zero backlinks, zero referral traffic. Fix the publish step before generating more.

### Task 3.1: Publish the already-generated Dzen article

**Action (manual + local script):**
- [ ] Review `content/dzen/2026-06-22-mramornaya-kroshka-dlya-shtukaturki-rashod.md` for accuracy against `memory/product_specs.md` (verify every number).
- [ ] Ensure it contains a contextual link back to amp-minerals.ru (the backlink — the whole point).
- [ ] Publish to Dzen. Either: log into Dzen and paste manually, or use the local Playwright flow `npm run post:dzen` (session in `scripts/.dzen-session.json`, gitignored). Per memory: Dzen has no public publish API and bans server IPs — local/manual only.
- [ ] After publishing, set `status: published`, fill `published_at:` and `url:` in the file's frontmatter, and mark the topic `published` in `content/topics.json`.

**Verify:** Article is live on Dzen with a working backlink; frontmatter + topics.json updated. Re-check Metrika referral traffic in 1-2 weeks.

### Task 3.2: Generate the 3 pending topics

`content/topics.json` has 3 pending: `mikrokaltsit-v-proizvodstve-lkm` (Dzen/b2b), `mramornyj-shheben-dlya-dorog-i-blagoustrojstva` (Dzen/builders), `kak-prinyat-partiyu-mramornoj-kroshki-na-obekte` (VC/b2b).

**Action:**
- [ ] Either run the scheduled cloud content agent (`docs/superpowers/content-agent-prompt.md` → pushes to `content/auto`), or generate manually with `scripts/generate-article.mjs`.
- [ ] Each article: real specs only, one contextual backlink to the most relevant on-site page (LKM article → `/catalog/muka`; щебень для дорог → `/primenenie/dorogi`; приёмка партии → `/catalog/kroshka`).
- [ ] User reviews on `content/auto`, merges, then publishes per Task 3.1 flow.

**Verify:** 3 articles generated, reviewed, and queued for publication; backlinks present.

### Task 3.3: Decide cadence

- [ ] Confirm the schedule for the cloud agent (memory says target 2×/week). Set it via `/schedule` or document the manual cadence. Off-site authority is the lowest-scoring audit area — consistency matters more than volume.

**Verify:** A documented, running cadence (not ad-hoc).

---

## Workstream 4 — New on-site content for measured impression gaps

These queries already earn impressions in GSC but have no dedicated page, so they rank ~position 20-40 and convert poorly. Each new article targets a real, observed query. Blog data lives in `lib/data/blog.ts` (currently 4 articles); pages render via `app/blog/[slug]/page.tsx`.

### Task 4.1: Article — "Применение мраморной муки"

**Target queries (live GSC):** `мраморная мука применение` (8 impr), `мраморная мука это`, `мука мраморная микрокальцит`.
**Intent:** informational → feeds Google AI Overviews + Yandex.

**Files:**
- Modify: `lib/data/blog.ts` (add entry)
- Test render: `app/blog/[slug]/page.tsx`

**Brief:**
- [ ] slug: `primenenie-mramornoj-muki`, title: "Применение мраморной муки и микрокальцита: 8 отраслей".
- [ ] Cover: ЛКМ, пластмассы, резинотехника, бумага, сухие смеси, с/х (известкование), герметики, наполнители. For each: what spec matters (CaCO₃ 98%, белизна 98% — from product_specs).
- [ ] Open with a 1-2 sentence definitional answer ("Мраморная мука — это…") for AI-Overview citability.
- [ ] Internal links to `/catalog/muka` and relevant product pages.
- [ ] FAQ block (3-4 Q&A) wrapped in FAQPage schema (reuse the product FAQ pattern from `e96e7e8`).
- [ ] `npm run build` passes; page renders at `/blog/primenenie-mramornoj-muki`.

**Verify:** Build green; FAQ schema validates; definitional lead sentence present.

### Task 4.2: Article — "Расход и упаковка мраморной крошки"

**Target queries (live GSC):** `калькулятор мраморной крошки`, `мраморная крошка формула`, `мраморная крошка биг бэг`, `крошка в упаковке купить`.
**Intent:** mixed informational/commercial.

**Files:** Modify `lib/data/blog.ts`.

**Brief:**
- [ ] slug: `rashod-i-upakovka-mramornoj-kroshki`, title: "Расход мраморной крошки на м²/м³ + варианты упаковки".
- [ ] Расход formula: насыпная плотность 1,25 тн/м³ (from product_specs) → kg per m² at given layer thickness. Show a worked example (e.g. дорожка слой 5 см).
- [ ] Packaging: навал, биг-бэг 500 кг / 1 т, мешки 25-50 кг (from llms.txt — already public). Table.
- [ ] Internal links to `/catalog/kroshka` + fraction products.
- [ ] If a calculator component exists, link it; if not, note as a possible follow-up (do NOT build it in this task — YAGNI).
- [ ] `npm run build` passes.

**Verify:** Build green; расход example uses 1,25 тн/м³; packaging table present.

### Task 4.3: Reassess after 4 weeks

- [ ] After 4 weeks live, re-pull GSC queries. Promote the next-highest impression query with no page into a new article. Repeat the WS4 pattern.

**Verify:** A data-driven next article chosen from fresh GSC data, not guessed.

---

## Priority order (recommended execution)

1. **WS1** (indexing) — fastest ROI, unlocks already-earned content. ~1 day.
2. **WS3.1** (publish the stuck Dzen article) — 1 hour, unblocks GEO entirely.
3. **WS4.1 + 4.2** (two articles for measured gaps) — direct impression→click upside.
4. **WS2** (reviews + AggregateRating + profiles) — highest ceiling, slowest; start collecting reviews NOW in parallel since it's user-blocked.
5. **WS3.2/3.3** (more off-site + cadence) — ongoing.

## Self-review notes

- Every content task cites `memory/product_specs.md` / llms.txt for numbers — no invented specs.
- AggregateRating gated on real reviews (Task 2.1 blocks 2.2-2.3).
- WS3 fixes the root cause of zero GEO traffic (generate-but-never-publish), not a symptom.
- WS4 articles target queries that are *observed* in GSC, not hypothetical.
- Open question for user: does a "калькулятор мраморной крошки" component already exist on the site? (query appears in GSC). If yes, Task 4.2 links it; if no, it's a candidate follow-up build.
