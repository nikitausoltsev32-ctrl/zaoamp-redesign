## 2024-05-22 - SSRF bypass due to URL parsing of IPv6 brackets
**Vulnerability:** In node, `new URL("http://[::1]").hostname` returns `"[::1]"`. The previous SSRF filtering checked for exactly `"::1"` and thus bypassed `[::1]`, opening up a critical SSRF vulnerability on loopback IP.
**Learning:** When performing URL sanitization and SSRF blocklisting against node `URL.hostname`, any IPv6 bracketed IP address will keep its brackets (`[`, `]`).
**Prevention:** Strip surrounding brackets via `.replace(/^\[|\]$/g, "")` before doing any matching or use a robust IP matching library.

## 2025-06-03 - Timing attack in admin token verification
**Vulnerability:** The admin endpoint was verifying tokens using simple string comparison (`requestToken !== adminToken`).
**Learning:** String comparison in JavaScript returns as soon as a character mismatch is found. This leaks information about the length of the matching prefix through execution time differences, allowing an attacker to deduce the token character by character.
**Prevention:** Always use `crypto.timingSafeEqual` (converting strings to `Buffer` first and ensuring equal length) when comparing secrets, passwords, or authentication tokens in Node.js/Next.js.
