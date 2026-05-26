## 2024-05-22 - SSRF bypass due to URL parsing of IPv6 brackets
**Vulnerability:** In node, `new URL("http://[::1]").hostname` returns `"[::1]"`. The previous SSRF filtering checked for exactly `"::1"` and thus bypassed `[::1]`, opening up a critical SSRF vulnerability on loopback IP.
**Learning:** When performing URL sanitization and SSRF blocklisting against node `URL.hostname`, any IPv6 bracketed IP address will keep its brackets (`[`, `]`).
**Prevention:** Strip surrounding brackets via `.replace(/^\[|\]$/g, "")` before doing any matching or use a robust IP matching library.

## 2024-05-26 - Timing attack on token validation
**Vulnerability:** String comparison operator `!==` was used to validate an admin token. This operator performs a short-circuit comparison and returns as soon as it encounters a mismatch, making it vulnerable to a timing attack where an attacker can progressively guess characters by measuring the time the server takes to respond.
**Learning:** Comparing tokens or secrets directly with `===` or `!==` in security-critical environments allows attackers to reconstruct secrets.
**Prevention:** Always use `crypto.timingSafeEqual` with buffers for token matching, ensuring you check the buffers' lengths before comparison to avoid runtime exceptions since `timingSafeEqual` expects identical buffer sizes.
