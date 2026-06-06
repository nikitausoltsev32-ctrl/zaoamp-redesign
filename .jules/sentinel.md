## 2024-05-22 - SSRF bypass due to URL parsing of IPv6 brackets
**Vulnerability:** In node, `new URL("http://[::1]").hostname` returns `"[::1]"`. The previous SSRF filtering checked for exactly `"::1"` and thus bypassed `[::1]`, opening up a critical SSRF vulnerability on loopback IP.
**Learning:** When performing URL sanitization and SSRF blocklisting against node `URL.hostname`, any IPv6 bracketed IP address will keep its brackets (`[`, `]`).
**Prevention:** Strip surrounding brackets via `.replace(/^\[|\]$/g, "")` before doing any matching or use a robust IP matching library.

## 2024-06-06 - Timing attack bypass
**Vulnerability:** Admin endpoints checking an expected access token string using simple `!==` comparison (e.g. `requestToken !== adminToken`). This could be exploited via a timing attack by measuring the processing time for requests to gradually reconstruct the admin token, as standard string comparisons exit early as soon as the first non-matching character is found.
**Learning:** Checking for equality using simple operators for sensitive values is not a constant-time operation. Also Node's `crypto.timingSafeEqual` will throw an error if the passed Buffers are not the same length, which could bypass checks or leak length information depending on how the application handles that error.
**Prevention:** Use `crypto.timingSafeEqual`, but to avoid leaking the true string length, calculate whether the lengths are the same and always perform the check against buffers of identical length. e.g. `const compareBuffer = isLengthEqual ? providedBuffer : expectedBuffer; return crypto.timingSafeEqual(expectedBuffer, compareBuffer) && isLengthEqual;`
