## 2024-05-24 - Throttling Scroll Events in React Components
**Learning:** Frequent events like `scroll` can cause performance bottlenecks in React due to unnecessary re-renders when bound directly to state updates without throttling or debouncing, and without the `passive: true` option.
**Action:** Use `requestAnimationFrame` for throttling high-frequency event listeners like `scroll` and apply `{ passive: true }` to improve scroll performance.
## 2024-05-24 - Throttling MouseMove Events in React Components
**Learning:** Frequent events like `mousemove` can cause performance bottlenecks in React due to unnecessary re-renders when bound directly to state updates without throttling. Additionally, when using `requestAnimationFrame` for throttling, it's crucial to synchronously store the latest event coordinates outside the rAF callback to prevent updating state with stale data from dropped events.
**Action:** Use `requestAnimationFrame` for throttling high-frequency event listeners like `mousemove` and always synchronously store the latest event coordinates in a `useRef` outside the rAF callback.
