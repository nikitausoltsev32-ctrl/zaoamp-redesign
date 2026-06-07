## 2024-05-24 - Throttling Scroll Events in React Components
**Learning:** Frequent events like `scroll` can cause performance bottlenecks in React due to unnecessary re-renders when bound directly to state updates without throttling or debouncing, and without the `passive: true` option.
**Action:** Use `requestAnimationFrame` for throttling high-frequency event listeners like `scroll` and apply `{ passive: true }` to improve scroll performance.

## 2024-05-24 - Throttling High-Frequency React State Updates
**Learning:** Updating React state directly in high-frequency event handlers like `mousemove` causes excessive re-renders and CPU overhead.
**Action:** Use `requestAnimationFrame` combined with `useRef` to throttle state updates to the display refresh rate. Synchronously capture the latest event data in a `useRef` before the rAF callback to ensure the final render uses the most recent data.
