---
name: dzen-draft
description: Use when asked to prepare, create, or set up a Dzen article draft for the amp-minerals.ru channel (AMP IMPORT - EXPORT) from a content/dzen/*.md file — Claude drives the browser, the user publishes manually.
---

# dzen-draft

## Overview

Drive the user's already-logged-in Dzen studio through the browser to turn a
`content/dzen/<date>-<slug>.md` file into a **draft** article with photos. The user
reviews and publishes; Claude never publishes.

Channel: **AMP IMPORT - EXPORT**, id `6a391d4fd0b41a3347041428`.
Studio: `https://dzen.ru/profile/editor/id/6a391d4fd0b41a3347041428`.

Key facts:
- The Dzen article editor **autosaves to Черновики** ("Сохранено меньше минуты назад"). Filling the editor and leaving = draft saved. No explicit save needed.
- The orange **«Опубликовать»** button publishes. **Claude never clicks it** — the user does.
- Dzen detects bot automation. Move at a human pace, and if a CAPTCHA or bot-check appears, **stop and hand off to the user** (never solve it).

## Photos — REQUIRED

Every draft MUST get at least one photo (cover + ideally 1–2 in-body).

**Use only our own material photos from the site:**
- `public/images/products/*.jpg` — material close-ups by fraction.
- `public/images/quarry/*.jpg` — carrier/quarry shots (reinforce «производитель/карьер»).

Pick photos relevant to the article topic (table below). A quarry shot fits any article.
Generate a new image **only if no suitable site photo exists** — use an image-gen skill, and it must realistically depict our white-marble material (white marble chips/quarry), never a stock/granite look. Then add it.

| Article topic (slug fragment) | Site photos to use |
|---|---|
| `shtukaturki`, `kroshka`, `prinyat-partiyu` | `products/kroshka-0-5.jpg`, `products/2,0-3,0-mm-RU.jpg`, `products/0,5-1,0-mm-RU.jpg` + a `quarry/*` |
| `mikrokaltsit`, `muka`, `lkm` | `products/muka-0-0-2.jpg`, `products/2-500-мкм-RU.jpg`, `products/0-0,2-RU.jpg` |
| `shheben` (щебень) | `products/shheben-10-20.jpg`, `products/shheben-20-50.jpg` + a `quarry/*` |

## Workflow

1. **Read the source file** `content/dzen/<file>.md` — take the frontmatter `title` and the markdown body. Note the closing backlink line (`[amp-minerals.ru](...)`).
2. **Open studio** in a browser tab; confirm the header shows **AMP IMPORT - EXPORT** (logged in). If not logged in, stop — ask the user to log into Dzen.
3. **New article:** click **«Создать»** (or the top-right **+**) → **Статья**. Editor opens with a «Заголовок» field and a «Текст» block.
4. **Title:** click «Заголовок», type the article title.
5. **Body:** click the text area, paste the body. Markdown markers (`##`, `**`, `|tables|`) do NOT auto-format in Dzen — set headings/bold using the editor's inline toolbar (select text → choose heading), and rebuild any table as plain paragraphs or a list. Make the closing `amp-minerals.ru` a real hyperlink (select text → link tool → paste URL).
6. **Photos (REQUIRED):** insert via the image icon on a block (or the block **+** menu → image) → upload from disk with the file-upload browser tool, using the absolute path, e.g. `C:\Users\HomePc\.zaoamprepo\zaoamp-redesign\public\images\products\shheben-10-20.jpg`. Add a cover image + 1–2 in-body. Pick per the table above.
7. **Confirm draft saved** — wait for «Сохранено …». **Do NOT click «Опубликовать».**
8. **Report** to the user: draft title, which photos were added, and that it's in Черновики ready for them to publish.

## Common mistakes

- **Clicking «Опубликовать».** Never. The user publishes. Claude only leaves a draft.
- **Pasting markdown raw** — `##`/`**`/tables show as literal text. Format in the editor.
- **No photo.** Photos are required — never leave a text-only draft.
- **Wrong material in a generated image** — must be white marble, never granite/stock. Prefer site photos.
- **Pushing through a CAPTCHA / bot-check** — stop and hand to the user instead.

## Source of truth

Article content is pre-written in `content/dzen/*.md` (specs are pasport-accurate, with backlink + «производитель/карьер» framing). This skill only transfers it into a Dzen draft with photos. See the project `CLAUDE.md` for positioning rules.
