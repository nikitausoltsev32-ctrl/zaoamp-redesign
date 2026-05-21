## 2023-10-27 - Passive Event Listeners for Scroll Events
**Learning:** React components that attach global `scroll` event listeners on `window` (like headers tracking scroll position for visual updates) can cause main thread blocking and scroll jank, especially on mobile devices.
**Action:** Always add `{ passive: true }` to `window.addEventListener('scroll', handler)` unless `preventDefault()` is absolutely required. This lets the browser optimize scrolling independent of the JS execution.
