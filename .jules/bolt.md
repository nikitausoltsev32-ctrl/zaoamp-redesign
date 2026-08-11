## 2024-05-24 - Throttling Scroll Events in React Components
**Learning:** Frequent events like `scroll` can cause performance bottlenecks in React due to unnecessary re-renders when bound directly to state updates without throttling or debouncing, and without the `passive: true` option.
**Action:** Use `requestAnimationFrame` for throttling high-frequency event listeners like `scroll` and apply `{ passive: true }` to improve scroll performance.
## 2024-05-18 - Missing Import React Runtime Crash
**Learning:** Forgetting to import standard React hooks (like `useRef`) in Next.js will compile successfully but crash the component at runtime, resulting in a blank UI during verification.
**Action:** Always manually verify that all used hooks and functions are correctly imported at the top of the file before running verification or submitting a PR.
