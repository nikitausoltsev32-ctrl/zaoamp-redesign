## 2024-05-22 - SSRF bypass due to URL parsing of IPv6 brackets
**Vulnerability:** In node, `new URL("http://[::1]").hostname` returns `"[::1]"`. The previous SSRF filtering checked for exactly `"::1"` and thus bypassed `[::1]`, opening up a critical SSRF vulnerability on loopback IP.
**Learning:** When performing URL sanitization and SSRF blocklisting against node `URL.hostname`, any IPv6 bracketed IP address will keep its brackets (`[`, `]`).
**Prevention:** Strip surrounding brackets via `.replace(/^\[|\]$/g, "")` before doing any matching or use a robust IP matching library.
## 2024-05-31 - [Prevent Timing Attacks in Token Comparison]
**Vulnerability:** The API admin endpoint compared authorization tokens using the `!==` string comparison operator.
**Learning:** Standard string comparisons evaluate character-by-character and fail early, meaning an attacker can theoretically guess valid tokens character-by-character by measuring the server response times (timing attack).
**Prevention:** Always use `crypto.timingSafeEqual` for checking sensitive tokens, passwords, or signatures to ensure the evaluation takes a constant amount of time regardless of how much of the string matches.
