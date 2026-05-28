## 2024-05-28 - Unlinked Form Labels Pattern
**Learning:** Found a recurring pattern where `<label>` tags lack `htmlFor` attributes and `<Input>` components lack `id`s, breaking screen reader associations.
**Action:** Always verify that every label in the codebase is explicitly linked to its input via `id` and `htmlFor`, or implicitly by wrapping the input.
