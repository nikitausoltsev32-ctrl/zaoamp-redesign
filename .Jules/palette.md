## 2026-05-24 - Accessibility on Radix UI Inputs
**Learning:** Found inputs (like `<Input>`) without associated `<label>` tags or `aria-label` attributes in `components/calculator.tsx` and `components/ai/ai-assistant-widget.tsx`. Although placeholders are present, they are insufficient for screen readers.
**Action:** When a `<label>` is not visually desired or structurally present around an input, ensure `aria-label` is explicitly provided.
