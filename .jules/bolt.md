## 2024-05-24 - Throttling Scroll Events in React Components
**Learning:** Frequent events like `scroll` can cause performance bottlenecks in React due to unnecessary re-renders when bound directly to state updates without throttling or debouncing, and without the `passive: true` option.
**Action:** Use `requestAnimationFrame` for throttling high-frequency event listeners like `scroll` and apply `{ passive: true }` to improve scroll performance.
## 2026-05-29 - Throttling High-Frequency Events with requestAnimationFrame
**Learning:** When throttling high-frequency events like `mousemove` with `requestAnimationFrame`, passing event properties directly into the rAF callback can lead to stale data if events are dropped while the lock (`ticking.current`) is true.
**Action:** Always synchronously store the latest event coordinates in a `useRef` (e.g., `lastPos.current = { x: e.clientX, y: e.clientY }`) outside the rAF callback, and use that ref inside the callback to ensure the visual update applies the most recent position.
