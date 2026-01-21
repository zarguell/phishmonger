# Layout Collapse - Root Cause Analysis

## Issue Summary
Preview mode displays collapsed layout with text overlapping, annotation cards invisible/displaced, and arrows drawing to invalid coordinates.

## Root Cause

**AnnotationColumn uses absolute positioning without establishing a positioned context.**

### Technical Details

1. **Parent Element (.annotation-column)**
   - Located in: `src/index.css` lines 422-430
   - Has: `display: flex; flex-direction: column; gap: 24px;`
   - Missing: `position: relative;` and explicit height
   - Result: Collapses to `height: 0` when children are absolutely positioned

2. **Child Elements (Annotation Cards)**
   - Located in: `src/components/preview/AnnotationColumn.tsx` lines 33-38
   - Use: `position: absolute; top: [calculated]; left: 130px;`
   - Problem: Absolute positioning references nearest positioned ancestor, which is NOT the collapsed .annotation-column

3. **Coordinate System Failure**
   - Cards position relative to `.slide-wrapper` or `viewport` instead of `.annotation-column`
   - Cards render outside visible 640px column area (appear at y=0+ in wrong container)
   - ArrowOverlay's `getBoundingClientRect()` returns invalid coordinates
   - Arrows draw to (0,0) or off-screen positions → "big empty rectangles"

## Files Requiring Fixes

### 1. src/index.css (Lines 422-430)

**Current:**
```css
.annotation-column {
  width: 640px;
  flex-shrink: 0;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
```

**Fix Option A (Minimal):**
```css
.annotation-column {
  width: 640px;
  flex-shrink: 0;
  padding: 40px;
  box-sizing: border-box;
  position: relative; /* Establish positioning context */
  min-height: 900px;  /* Prevent collapse when children absolute */
}
```

**Fix Option B (Recommended - Remove absolute positioning):**
```css
.annotation-column {
  width: 640px;
  flex-shrink: 0;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px; /* Use flexbox gap instead of manual positioning */
}
```

### 2. src/components/preview/AnnotationColumn.tsx (Lines 23-43)

**Current (with absolute positioning):**
```tsx
return (
  <div className="annotation-column">
    {cardPositions.map((position) => {
      const annotation = annotations[position.lureId]
      if (!annotation) return null

      return (
        <AnnotationCard
          key={annotation.lureId}
          annotation={annotation}
          style={{
            position: 'absolute',
            top: position.y,
            left: '130px', // Center in 640px column
            width: '380px',
          }}
        />
      )
    })}
  </div>
)
```

**Fix (if using Option B above - remove absolute positioning):**
```tsx
return (
  <div className="annotation-column">
    {Object.values(annotations).map((annotation) => {
      return (
        <AnnotationCard
          key={annotation.lureId}
          annotation={annotation}
          // No style prop - let flexbox handle layout
        />
      )
    })}
  </div>
)
```

## Why This Happens

### CSS Absolute Positioning Rules

When an element has `position: absolute`:
1. It's removed from normal document flow
2. It positions relative to the **nearest positioned ancestor** (element with `position: relative`, `absolute`, `fixed`, or `sticky`)
3. If no positioned ancestor exists, it positions relative to the **initial containing block** (viewport)

### In This Case

```
.slide-wrapper (position: relative by default)
├── .email-column (renders normally)
└── .annotation-column (NO position: relative)
    └── cards (position: absolute)
        └── Position relative to .slide-wrapper, NOT .annotation-column
```

### Result

- `.annotation-column` has no content in normal flow → collapses to `height: 0`
- Cards position from top of `.slide-wrapper` (y=0) or viewport
- Cards at y=0, y=100, y=200... but column starts at y=0 with no height
- Cards render "in the void" outside the visible column area

## Symptom Chain

```
Parent lacks position: relative
    ↓
Parent collapses to height: 0
    ↓
Cards position outside column bounds
    ↓
Cards invisible/displaced in UI
    ↓
ArrowOverlay queries card positions with getBoundingClientRect
    ↓
Returns (0,0) or off-screen coordinates
    ↓
Arrows draw "big empty rectangles" to invalid locations
```

## Recommended Fix Approach

**Use flexbox layout instead of absolute positioning.**

### Advantages
1. Simpler - no manual Y calculations needed
2. Responsive - flexbox handles spacing automatically
3. Maintainable - no collision detection logic in useCardLayout hook
4. Robust - parent has natural height from content

### Changes Required
1. Add `position: relative` to `.annotation-column` (safety measure)
2. Remove `position: absolute` from AnnotationCard style props
3. Remove useCardLayout hook entirely (no longer needed)
4. Rely on flexbox `gap: 24px` for card spacing

### Alternative (Keep Absolute Positioning)

If absolute positioning is required for arrow routing:
1. Add `position: relative` to `.annotation-column`
2. Add `min-height: 900px` to `.annotation-column`
3. Ensure useCardLayout calculates total height and sets it on parent

## Debug Session

Full investigation details: `.planning/debug/layout-collapse-diagnosis.md`

## Verification Steps

After applying fix:
1. Open preview mode with annotations
2. Verify cards visible in right column (640px width)
3. Verify cards stacked vertically with 24px gap
4. Verify arrows connect from email text to card centers
5. Verify no text overlap or elements outside bounds
6. Export PNG and verify layout preserved
