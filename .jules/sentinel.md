## 2024-05-22 - SSRF bypass due to URL parsing of IPv6 brackets
**Vulnerability:** In node, `new URL("http://[::1]").hostname` returns `"[::1]"`. The previous SSRF filtering checked for exactly `"::1"` and thus bypassed `[::1]`, opening up a critical SSRF vulnerability on loopback IP.
**Learning:** When performing URL sanitization and SSRF blocklisting against node `URL.hostname`, any IPv6 bracketed IP address will keep its brackets (`[`, `]`).
**Prevention:** Strip surrounding brackets via `.replace(/^\[|\]$/g, "")` before doing any matching or use a robust IP matching library.
## 2025-06-05 - Timing Attack in Admin Authentication
**Vulnerability:** Admin authentication token was compared using a strict inequality operator (`!==`), which is vulnerable to timing attacks that could allow an attacker to guess the token character by character.
**Learning:** Standard string comparisons exit early on mismatches, causing varying response times depending on how many characters matched.
**Prevention:** Always use `crypto.timingSafeEqual` for sensitive token/password comparisons, ensuring that length checks do not short-circuit the comparison by comparing a buffer to itself when lengths differ. Additionally, provide a fallback (e.g., `|| ''`) when passing environment variables to `Buffer.from` to avoid `TypeError` if undefined.
