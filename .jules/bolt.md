## 2024-05-24 - Throttling Scroll Events in React Components
**Learning:** Frequent events like `scroll` can cause performance bottlenecks in React due to unnecessary re-renders when bound directly to state updates without throttling or debouncing, and without the `passive: true` option.
**Action:** Use `requestAnimationFrame` for throttling high-frequency event listeners like `scroll` and apply `{ passive: true }` to improve scroll performance.
## 2024-05-18 - Throttling React Events Safely
**Learning:** When throttling high-frequency events (like `mousemove` or `scroll`) in React using `requestAnimationFrame`, accessing the event object directly inside the async rAF callback can lead to stale or invalid data, especially if events fire faster than the browser's refresh rate.
**Action:** Always synchronously capture and store the necessary event payload (e.g., coordinates) into a mutable `useRef` (like `lastPos.current`) outside the rAF callback, so that when the animation frame actually fires and triggers a state update, it has guaranteed access to the absolute latest data.
