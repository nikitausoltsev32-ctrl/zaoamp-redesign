## 2024-05-22 - SSRF bypass due to URL parsing of IPv6 brackets
**Vulnerability:** In node, `new URL("http://[::1]").hostname` returns `"[::1]"`. The previous SSRF filtering checked for exactly `"::1"` and thus bypassed `[::1]`, opening up a critical SSRF vulnerability on loopback IP.
**Learning:** When performing URL sanitization and SSRF blocklisting against node `URL.hostname`, any IPv6 bracketed IP address will keep its brackets (`[`, `]`).
**Prevention:** Strip surrounding brackets via `.replace(/^\[|\]$/g, "")` before doing any matching or use a robust IP matching library.

## 2026-05-28 - DoS via lack of bounds checking before infinite loop structure
**Vulnerability:** The delivery calculator `POST /api/delivery/calculate` accepted user `weight` without validation or upper bounds checking and passed it into a `while (remaining > 0)` loop where `remaining` decreased by a fixed value each iteration. A malicious user passing `Infinity`, `NaN` or extremely large numbers like `10000000` could cause an infinite loop or excessive computation, resulting in a Denial of Service.
**Learning:** Math bounds logic such as `splitWeightIntoTrunks` without upfront strict bounds validation can quickly cause application DOS.
**Prevention:** Always validate and bound user inputs, especially when using variables in loops decrementing by constant bounds. Use `Number.isFinite(num)` and strict limit checks before executing any iteration.
