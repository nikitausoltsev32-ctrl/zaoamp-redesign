## 2024-05-22 - SSRF bypass due to URL parsing of IPv6 brackets
**Vulnerability:** In node, `new URL("http://[::1]").hostname` returns `"[::1]"`. The previous SSRF filtering checked for exactly `"::1"` and thus bypassed `[::1]`, opening up a critical SSRF vulnerability on loopback IP.
**Learning:** When performing URL sanitization and SSRF blocklisting against node `URL.hostname`, any IPv6 bracketed IP address will keep its brackets (`[`, `]`).
**Prevention:** Strip surrounding brackets via `.replace(/^\[|\]$/g, "")` before doing any matching or use a robust IP matching library.

## 2024-05-23 - Timing Attack on Token Verification
**Vulnerability:** In `app/api/admin/ai-leads/route.ts`, the `x-admin-token` was checked using a simple string comparison (`requestToken !== adminToken`).
**Learning:** Simple string comparisons return early on the first mismatched character. This allows an attacker to deduce the correct token character by character based on the response time.
**Prevention:** Use `crypto.timingSafeEqual` (converting strings to Buffers first) for comparing sensitive tokens or passwords to ensure constant-time comparison.
