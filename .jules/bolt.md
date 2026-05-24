## 2024-05-24 - Throttling Scroll Events in React Components
**Learning:** Frequent events like `scroll` can cause performance bottlenecks in React due to unnecessary re-renders when bound directly to state updates without throttling or debouncing, and without the `passive: true` option.
**Action:** Use `requestAnimationFrame` for throttling high-frequency event listeners like `scroll` and apply `{ passive: true }` to improve scroll performance.
## 2024-05-24 - Pausing Off-Screen Sliders
**Learning:** React components containing continuous auto-slide intervals (`setInterval` driving state updates) cause CPU overhead and unnecessary re-renders when off-screen.
**Action:** Use an Intersection Observer (like Framer Motion's `useInView`) to only run `setInterval` when the component is within the viewport.
