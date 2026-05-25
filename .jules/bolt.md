## 2024-05-24 - Throttling Scroll Events in React Components
**Learning:** Frequent events like `scroll` can cause performance bottlenecks in React due to unnecessary re-renders when bound directly to state updates without throttling or debouncing, and without the `passive: true` option.
**Action:** Use `requestAnimationFrame` for throttling high-frequency event listeners like `scroll` and apply `{ passive: true }` to improve scroll performance.

## 2024-05-25 - Chat Widget Re-renders
**Learning:** In chat widgets, maintaining message history alongside uncontrolled or controlled text input can cause expensive animation/render bottlenecks when the full history array re-renders on every keystroke.
**Action:** Extract chat history rendering into a separate component and memoize the rendered output (e.g. via `useMemo` or `React.memo`) mapping strictly to the `messages` state, completely isolating it from the `input` state.
