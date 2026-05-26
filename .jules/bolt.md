## 2024-05-24 - Throttling Scroll Events in React Components
**Learning:** Frequent events like `scroll` can cause performance bottlenecks in React due to unnecessary re-renders when bound directly to state updates without throttling or debouncing, and without the `passive: true` option.
**Action:** Use `requestAnimationFrame` for throttling high-frequency event listeners like `scroll` and apply `{ passive: true }` to improve scroll performance.
## 2026-05-26 - Backend API Batching & Promise Caching
**Learning:** Found an O(N) sequential API call bottleneck in `/api/delivery/calculate` where splitting a large load (e.g., 100t) into multiple identical 20t trucks resulted in sequential identical requests to the external Dellin API.
**Action:** When processing multiple identical sub-tasks that require network requests, use a `Map` of promises (`Promise<T>`) alongside `Promise.all()` to cache identical in-flight requests and execute distinct ones concurrently.
