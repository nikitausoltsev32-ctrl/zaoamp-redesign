## 2024-05-21 - XSS in JSON-LD serialization
**Vulnerability:** Cross-Site Scripting (XSS) vulnerability was found in the JSON-LD serialization inside the `<script type="application/ld+json">` tag via `dangerouslySetInnerHTML`.
**Learning:** `JSON.stringify(data)` output does not escape HTML entities by default, meaning an attacker injecting `</script><script>alert(1)</script>` into product details or user data could trigger JavaScript execution when parsed by the browser.
**Prevention:** Always append `.replace(/</g, '\\u003c')` when embedding JSON within a `<script>` tag in React (especially with `dangerouslySetInnerHTML`) to safely escape the strings without breaking JSON format.
