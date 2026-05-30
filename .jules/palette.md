## 2024-05-30 - Explicitly linking labels to inputs
**Learning:** Wrapping an input with a `<label>` provides an implicit association, but some screen readers or specific UI patterns may not handle it robustly or reliably. Similarly, labels positioned purely visually adjacent to an input without explicit linking fail accessibility standards.
**Action:** Always link `<label>` elements explicitly to their corresponding `<input>` or `<select>` elements using the `htmlFor` attribute on the label and a matching `id` on the input. This is particularly crucial for robust accessibility in forms.
