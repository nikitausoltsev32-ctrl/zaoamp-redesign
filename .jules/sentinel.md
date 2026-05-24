## 2025-05-24 - Timing attack in admin token comparison
**Vulnerability:** Comparing sensitive tokens (like admin passwords or API keys) using standard string equality operators (`===` or `!==`) creates a timing vulnerability where attackers can guess the token length and contents character by character by measuring request latency.
**Learning:** This occurred because simple string comparison was used by default instead of a cryptographic constant-time comparison.
**Prevention:** Always use `crypto.timingSafeEqual` after verifying lengths when comparing secrets, passwords, or authentication tokens. Make sure to convert strings to Buffers first.
