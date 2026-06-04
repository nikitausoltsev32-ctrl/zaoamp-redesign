## 2024-05-22 - SSRF bypass due to URL parsing of IPv6 brackets
**Vulnerability:** In node, `new URL("http://[::1]").hostname` returns `"[::1]"`. The previous SSRF filtering checked for exactly `"::1"` and thus bypassed `[::1]`, opening up a critical SSRF vulnerability on loopback IP.
**Learning:** When performing URL sanitization and SSRF blocklisting against node `URL.hostname`, any IPv6 bracketed IP address will keep its brackets (`[`, `]`).
**Prevention:** Strip surrounding brackets via `.replace(/^\[|\]$/g, "")` before doing any matching or use a robust IP matching library.

## 2025-02-06 - Timing Attack via Short-Circuit Length Checks
**Vulnerability:** In `app/api/admin/ai-leads/route.ts`, token verification used a simple `!==` comparison, leaving it vulnerable to timing attacks. While `crypto.timingSafeEqual` was identified as a fix, the initial implementation was vulnerable due to short-circuit logic (`isLengthEqual && crypto.timingSafeEqual(...)`). If lengths mismatched, the timing safe check was entirely skipped, immediately leaking the length of the token through the time it took the server to respond.
**Learning:** `crypto.timingSafeEqual` mitigates timing attacks but requires buffers of identical lengths. Wrapping it in a length-check short-circuit entirely defeats its purpose.
**Prevention:** To prevent length-based timing leaks when comparing auth hashes or tokens, always execute `crypto.timingSafeEqual` even if lengths differ, for instance by comparing a buffer to itself when a mismatch is detected, and evaluate its result using standard logic (e.g., `const isValid = isLengthEqual && isTimingSafeEqual`).
