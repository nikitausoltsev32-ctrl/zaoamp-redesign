## 2024-05-18 - Optimize React Scroll Listeners
**Learning:** Next.js header component scroll listener was missing requestAnimationFrame throttling and passive true.
**Action:** Use requestAnimationFrame and { passive: true } for scroll events to prevent blocking main thread and prevent scroll jank.
