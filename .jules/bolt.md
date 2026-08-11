## 2024-05-24 - Throttling Scroll Events in React Components
**Learning:** Frequent events like `scroll` can cause performance bottlenecks in React due to unnecessary re-renders when bound directly to state updates without throttling or debouncing, and without the `passive: true` option.
**Action:** Use `requestAnimationFrame` for throttling high-frequency event listeners like `scroll` and apply `{ passive: true }` to improve scroll performance.

## 2026-06-05 - Framer Motion m Component Requirements
**Learning:** Replacing framer-motion `motion` components with `m` components to optimize bundle size will break animations (or crash) if the components are not wrapped in a `<LazyMotion>` provider higher up in the component tree.
**Action:** Before switching `motion` to `m`, verify that a `<LazyMotion>` provider exists and is wrapping the components being modified. If it's missing, ensure it's provided globally (e.g., in a layout) or at the local tree level.
