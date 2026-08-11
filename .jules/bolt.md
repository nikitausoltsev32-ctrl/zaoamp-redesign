## 2024-05-24 - Throttling Scroll Events in React Components
**Learning:** Frequent events like `scroll` can cause performance bottlenecks in React due to unnecessary re-renders when bound directly to state updates without throttling or debouncing, and without the `passive: true` option.
**Action:** Use `requestAnimationFrame` for throttling high-frequency event listeners like `scroll` and apply `{ passive: true }` to improve scroll performance.

## 2026-06-02 - Throttling High-Frequency Mouse Events
**Learning:** High-frequency DOM events like `mousemove` cause excessive React re-renders and UI jank when updating state synchronously. Additionally, when using `requestAnimationFrame` to throttle these events, updating state directly from the event object inside the rAF callback can lead to stale data if events are dropped.
**Action:** Use `requestAnimationFrame` and a `ticking` ref to throttle high-frequency events, and synchronously store the latest event coordinates in a separate `lastPos` ref outside the rAF callback to ensure state always updates with the most recent data.
