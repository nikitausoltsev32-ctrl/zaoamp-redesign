## 2024-05-31 - Link Form Labels to Inputs
**Learning:** Found unlinked labels in form fields in `components/sections/samples-cta.tsx`. The labels and inputs were siblings, which makes implicit association fail for screen readers. Unlinked labels are a known recurring pattern in this codebase.
**Action:** Always verify that every `<label>` is explicitly linked to its corresponding input via `id` and `htmlFor` to prevent breaking screen reader associations.
