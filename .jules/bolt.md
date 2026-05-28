## 2024-05-24 - Throttling Scroll Events in React Components
**Learning:** Frequent events like `scroll` can cause performance bottlenecks in React due to unnecessary re-renders when bound directly to state updates without throttling or debouncing, and without the `passive: true` option.
**Action:** Use `requestAnimationFrame` for throttling high-frequency event listeners like `scroll` and apply `{ passive: true }` to improve scroll performance.

## 2024-05-28 - Next.js Image Component Default Lazy Loading
**Learning:** Next.js `<Image />` components natively implement lazy loading by default. Explicitly adding the `loading="lazy"` attribute is completely redundant and provides no additional performance benefit. Furthermore, if these images are critical for the Largest Contentful Paint (LCP) and appear "above the fold", explicitly lazy-loading them is a performance anti-pattern.
**Action:** Do not manually add `loading="lazy"` to Next.js `<Image />` components. Rely on the built-in default behavior. Reserve explicit loading attributes for prioritizing above-the-fold images with `priority={true}` instead.
