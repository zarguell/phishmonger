---
phase: 12-detail-carousel
verified: 2026-01-23T18:52:18Z
status: gaps_found
score: 5/6 must-haves verified
gaps:
  - truth: "Carousel maintains scroll position and selected card state"
    status: partial
    reason: "Scroll position capture/restoration mechanism is incomplete - modal's ref is on outer container, not the actual horizontal scroll container"
    artifacts:
      - path: "src/components/campaign/CampaignCarouselModal.tsx"
        issue: "carouselContainerRef is on outer div (overflowY: auto), but CampaignCarousel has its own internal scrollContainerRef (overflowX: scroll). The modal's useEffect tries to set scrollLeft on the wrong element."
      - path: "src/components/campaign/CampaignCarousel.tsx"
        issue: "scrollContainerRef is internal and not exposed to parent modal. Cannot be controlled from outside for scroll position restoration."
    missing:
      - "Forward ref pattern or scroll position callback from CampaignCarousel to parent modal"
      - "Use imperativeHandle to expose scroll container ref to parent"
      - "Or: Move scroll position state up to modal and pass initialScrollPosition prop to CampaignCarousel"
  - truth: "Carousel handles 20+ phishes without performance degradation"
    status: verified
    reason: "Uses lazy loading (loading='lazy') on images, native CSS scroll snap (GPU accelerated), no virtualization but acceptable for 20+ items with lazy loading"
---

# Phase 12: Detail Carousel Verification Report

**Phase Goal:** Users can browse campaign phishes horizontally without leaving campaign context
**Verified:** 2026-01-23T18:52:18Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                 | Status     | Evidence |
| --- | --------------------------------------------------------------------- | ---------- | -------- |
| 1   | User can view campaign phishes in horizontal scrollable carousel      | ✓ VERIFIED | CampaignCarousel.tsx lines 169-213 implement horizontal scroll with `overflowX: 'scroll'` and `scrollSnapType: 'x mandatory'` |
| 2   | User can navigate between phishes via prev/next buttons               | ✓ VERIFIED | Lines 98-166 implement prev/next buttons with smooth scrollBy (80% viewport width) |
| 3   | User can click carousel card to open phish in read-only editor mode   | ✓ VERIFIED | CampaignCarouselModal.tsx lines 44-52 handle card click, switch to readonly-editor view, ReadOnlyEditor.tsx renders full phish content |
| 4   | Carousel shows phish metadata (title, scheduled date, annotation count) | ✓ VERIFIED | CarouselCard.tsx lines 91-139 display title (truncated), formatted scheduled date, annotation count badge with proper pluralization |
| 5   | Carousel maintains scroll position and selected card state            | ⚠️ PARTIAL | State management exists (selectedPhishId, carouselScrollPosition) but scroll position restoration is broken - modal's ref targets wrong element |
| 6   | Carousel handles 20+ phishes without performance degradation          | ✓ VERIFIED | Uses `loading='lazy'` on images (line 64), native CSS scroll snap (GPU accelerated), no heavy computation per card |

**Score:** 5.5/6 truths verified (91%)

### Required Artifacts

| Artifact                                            | Expected                                              | Status        | Details |
| --------------------------------------------------- | ----------------------------------------------------- | ------------- | ------- |
| `src/components/campaign/CampaignCarousel.tsx`      | Main carousel with scroll snap and navigation         | ✓ VERIFIED    | 216 lines, implements horizontal scroll, snap points, prev/next buttons, keyboard navigation |
| `src/components/campaign/CarouselCard.tsx`          | Individual phish card with thumbnail and metadata     | ✓ VERIFIED    | 143 lines, displays thumbnail (with fallback), title, scheduled date, annotation count, selection state |
| `src/components/campaign/ReadOnlyEditor.tsx`        | Read-only viewer for phish content                    | ✓ VERIFIED    | 194 lines, reuses EmailColumn and AnnotationColumn, no editing controls, back button, copy HTML feature |
| `src/components/campaign/CampaignCarouselModal.tsx` | Modal container with view switching                   | ⚠️ PARTIAL    | 160 lines, modal structure correct, view switching works, but scroll position preservation has implementation bug |
| `src/App.tsx`                                       | Integration with state management                     | ✓ VERIFIED    | Imports CampaignCarouselModal, has showCampaignCarousel/carouselCampaign state, handleViewCarousel/handleCloseCarousel handlers |
| `src/components/campaign/CampaignCard.tsx`          | View Carousel button                                  | ✓ VERIFIED    | Has onViewCarousel prop, button renders with purple (#8b5cf6) styling, conditional on phishes.length > 0 |
| `src/components/campaign/CampaignManager.tsx`       | onCarousel prop pass-through                          | ✓ VERIFIED    | Accepts onCarousel prop (line 11), passes to CampaignCard (line 313) |

### Key Link Verification

| From                           | To                                     | Via                                        | Status        | Details |
| ------------------------------ | -------------------------------------- | ------------------------------------------ | ------------- | ------- |
| CampaignCarousel.tsx           | src/types/campaign.ts                  | Campaign type import                       | ✓ VERIFIED    | Line 3: `import { Campaign } from '../../types/campaign'` |
| CampaignCarousel.tsx           | CarouselCard.tsx                       | Component composition and click callback   | ✓ VERIFIED    | Line 4: imports CarouselCard, line 206-210: renders cards with onClick handler |
| CampaignCarousel.tsx           | scrollContainerRef                     | Keyboard event scrollBy                    | ✓ VERIFIED    | Lines 36-44: useHotkeys for arrowleft/arrowright, calls scrollLeft/scrollRight |
| ReadOnlyEditor.tsx             | src/components/preview/EmailColumn.tsx | Reuse email rendering                      | ✓ VERIFIED    | Line 4: imports EmailColumn, line 176-180: renders with htmlSource and annotations |
| ReadOnlyEditor.tsx             | src/components/preview/AnnotationColumn.tsx | Reuse annotation rendering          | ✓ VERIFIED    | Line 5: imports AnnotationColumn, line 182-186: renders with showTags=true |
| CampaignCarouselModal.tsx      | CampaignCarousel.tsx                   | Conditional rendering                      | ✓ VERIFIED    | Line 3: imports CampaignCarousel, lines 143-148: renders when viewMode === 'carousel' |
| CampaignCarouselModal.tsx      | ReadOnlyEditor.tsx                     | Conditional rendering                      | ✓ VERIFIED    | Line 4: imports ReadOnlyEditor, lines 150-154: renders when viewMode === 'readonly-editor' |
| App.tsx                        | CampaignCarouselModal.tsx              | Import and conditional rendering           | ✓ VERIFIED    | Line 24: imports CampaignCarouselModal, lines 709-714: renders conditionally |
| App.tsx                        | CampaignManager.tsx                    | onCarousel prop callback                   | ✓ VERIFIED    | Line with `onCarousel={handleViewCarousel}` passes handler to CampaignManager |
| CampaignManager.tsx            | CampaignCard.tsx                       | onCarousel prop pass-through               | ✓ VERIFIED    | Line 313: `onViewCarousel={onCarousel ? () => onCarousel(campaign) : undefined}` |
| **CampaignCarouselModal.tsx**  | **CampaignCarousel scroll position**   | **carouselContainerRef → scrollContainerRef** | **✗ BROKEN** | Modal's ref (line 29) is on outer container div with `overflowY: auto`, but CampaignCarousel's scrollContainerRef (line 12 in CampaignCarousel.tsx) is internal and not accessible. Scroll position capture (line 46-47) and restoration (line 33-35) target wrong element |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
| ----------- | ------ | -------------- |
| VIS-01      | ⚠️ PARTIAL | Scroll position preservation doesn't work - ref targets wrong container element |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| None found | - | - | - | All code follows best practices |

### Human Verification Required

### 1. End-to-End Carousel Workflow

**Test:** Click "Campaigns" button → Find campaign with phishes → Click "View Carousel" → Use mouse/touch to scroll → Click prev/next buttons → Press ArrowLeft/ArrowRight → Click phish card → Verify read-only editor opens → Click "Back to Carousel" → Verify scroll position preserved → Close modal

**Expected:** Smooth horizontal scrolling, cards snap to positions, keyboard navigation works, editor shows full phish content, returning to carousel shows previously scrolled position (not reset to start)

**Why human:** Scroll position restoration bug exists in code - need to verify if user-noticeable or if workaround exists

### 2. Performance with 20+ Phishes

**Test:** Create campaign with 20+ phishes → Open carousel → Scroll through all cards → Check for lag/jank

**Expected:** Smooth scrolling, lazy loading images as needed, no frame drops

**Why human:** Cannot programmatically verify perceived performance, only that optimizations are in place

### 3. Visual Polish and Interaction Feel

**Test:** Hover over cards → Click to select → Navigate with buttons → Check focus states with keyboard

**Expected:** Smooth transitions (0.2s), hover lift effect, blue border on selected, visible focus outline for accessibility

**Why human:** Visual appearance and interaction smoothness cannot be verified via code inspection

### Gaps Summary

**1 Critical Gap:** Scroll Position Preservation (PARTIAL)

The scroll position capture and restoration mechanism in CampaignCarouselModal.tsx is structurally incomplete:

- **What exists:** State management (carouselScrollPosition), capture on card click (line 46-47), restoration useEffect (line 32-35)
- **What's wrong:** The modal's `carouselContainerRef` is attached to the outer container div with `overflowY: auto` (line 139), but the actual horizontal scroll container is the internal `scrollContainerRef` inside CampaignCarousel.tsx (line 169-181)
- **Impact:** When returning from read-only editor to carousel, the scroll position is set on the wrong element (outer container instead of inner scroll container). The horizontal scroll position is NOT restored.

**Root cause:** Missing forward ref pattern or callback to expose CampaignCarousel's internal scroll position to parent modal.

**Fix options:**
1. Use `useImperativeHandle` in CampaignCarousel to expose scroll container ref to parent
2. Add `onScrollPositionChange` callback prop to CampaignCarousel that reports scroll position to parent
3. Move scroll position state entirely to modal and pass `initialScrollPosition` prop to CampaignCarousel
4. Add ref forwarding to CampaignCarousel component

**Non-blocking but recommended:** The feature is partially functional - state exists and selection highlighting works, only scroll position restoration is broken.

---

**5 of 6 core truths fully verified. 1 truth has implementation bug preventing scroll position restoration.**

_Verified: 2026-01-23T18:52:18Z_
_Verifier: Claude (gsd-verifier)_
