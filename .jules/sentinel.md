## 2024-05-22 - SSRF bypass due to URL parsing of IPv6 brackets
**Vulnerability:** In node, `new URL("http://[::1]").hostname` returns `"[::1]"`. The previous SSRF filtering checked for exactly `"::1"` and thus bypassed `[::1]`, opening up a critical SSRF vulnerability on loopback IP.
**Learning:** When performing URL sanitization and SSRF blocklisting against node `URL.hostname`, any IPv6 bracketed IP address will keep its brackets (`[`, `]`).
**Prevention:** Strip surrounding brackets via `.replace(/^\[|\]$/g, "")` before doing any matching or use a robust IP matching library.

## 2026-05-27 - Additional SSRF bypass via IPv4-mapped IPv6 and unspecified IPv6 addresses
**Vulnerability:** The AI Assistant web context crawler blocked IPv6 loopback (`::1`) and specific hex prefix patterns (like `fc`, `fd`), but failed to block the IPv6 unspecified address (`::`) and IPv4-mapped IPv6 addresses (`::ffff:127.0.0.1`). Attackers could bypass SSRF IP checks using these representations.
**Learning:** Checking for loopback requires catching all variations of node's `URL.hostname` parsing behavior. `URL` preserves raw IPv6 strings (like `[::ffff:127.0.0.1]`), leaving string filters vulnerable if they only match exact, common loopback formats.
**Prevention:** Always use exhaustive blocklisting for edge IPv6 inputs (like `::` and `::ffff:` patterns) alongside strict IPv4 loopback checks, or better yet, rely on standardized networking libraries for IP validation.
