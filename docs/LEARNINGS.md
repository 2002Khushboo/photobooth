
---

## 🧠 docs/LEARNINGS.md (VERY important)

```md
# Learnings from React Photobooth Project

## 1. State vs Refs
- State updates are async and trigger re-renders
- Refs are synchronous and do not cause re-renders
- Avoid mixing refs and state for the same control flow

## 2. Timers & Closures
- `setTimeout` and `setInterval` capture stale state
- App flow should be driven by React state, not timers
- Timers should only trigger events, not make decisions

## 3. Single Source of Truth
- `photos.length` was the most reliable indicator of session progress
- Maintaining separate counters led to inconsistencies

## 4. React Strict Mode
- React runs certain logic twice in development
- Side-effect-heavy functions must be idempotent
- Bugs seen in dev may not appear in production
