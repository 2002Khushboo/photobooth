# Bugs & Fixes

---

## Bug 1: Countdown Loop Never Ends
**Cause:** Control flow was split across timers and state  
**Fix:** State (`photos.length`) became the single source of truth

---

## Bug 2: Photo Strip Missing Last Image
**Cause:** Using stale `photos` state after `setPhotos`  
**Fix:** Used locally computed `updatedPhotos` instead

---

## Bug 3: Counter Stuck at 1/4
**Cause:** Timer closures capturing stale state  
**Fix:** Removed redundant counters and derived UI from state
