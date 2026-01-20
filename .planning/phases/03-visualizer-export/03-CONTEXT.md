# Phase 3: Visualizer & Export - Context

**Gathered:** 2026-01-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Create a slide-ready preview mode with floating annotation cards positioned dynamically alongside the email, connected by elbow-connector arrows through a shared vertical bus line. Export as high-resolution PNG (2x scale) with flexible height.

</domain>

<decisions>
## Implementation Decisions

### Annotation Placement — Floating Side-Cards

**Positioning Logic:**
- Cards appear in right column (640px width), fixed at **380px width**
- Each card vertically aligns to its lure's Y-coordinate initially
- Collision detection pushes overlapping cards down by **24px** gap
- Auto-grow height based on content (no minimum padding beyond title + badge)

**Card Content:**
- Technique name (bold, 16px)
- MITRE ID badge (pill style, see Badge Styling below)
- Explanation text (14px, wraps naturally)
- Subtle card shadow and rounded corners for modern feel

**Empty State:**
- Email displays normally in left column
- Right column shows "Ghost Card" with text: *"No annotations yet. Switch to Edit Mode to highlight lures."*

### Arrow Routing — Elbow Connectors with Bus Line Aesthetic

**Path Logic:**
- **Start:** Right edge of lure span `(lure_right, lure_center_y)`
- **Mid1:** Center of gutter bus line `(bus_x, lure_center_y)` — horizontal to bus
- **Mid2:** Same bus X at card Y `(bus_x, card_center_y)` — vertical through bus
- **End:** Left edge of annotation card `(card_left, card_center_y)` — horizontal to card

**Bus Line Calculation:**
- Email container width: 960px (60% of 1600px)
- Gutter width: 80px (remaining space between 60% and 40% columns)
- **Bus X:** `960px + 40px` = **1000px** (center of gutter)
- All vertical lines travel down `x = 1000px` for clean "bus line" aesthetic

**Styling:**
- Unified color: `#FF4500` (OrangeRed) for high contrast
- Stroke width: 2px
- Arrowhead: At card end (pointing left to explanation)
- SVG overlay: `pointer-events: none` over Slide Wrapper

### Preview Layout & Canvas

**Slide Wrapper:**
- Fixed width: **1600px**
- Flexible height: Auto-expands to fit content
- Background: White `#FFFFFF`

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│  Email Column (960px)  │  Gutter (80px)  │  Cards (640px)  │
│  (lures highlighted)   │  (bus line)     │  (380px cards)  │
├─────────────────────────────────────────────────────────────┤
│  [lure 1 highlighted] ────┬───────────────────────────────  │
│                           │ [Card 1]                         │
│  [email content]          │ Technique: Authority             │
│  [email content]          │ T1598 | This email claims...   │
│                           │                                  │
│  [lure 2 highlighted] ────┴─┬─────────────────────────────  │
│                             │ [Card 2]                       │
│  [email content]           │ Technique: Urgency             │
│  [email content]           │ T1566.001 | Time pressure...  │
└─────────────────────────────────────────────────────────────┘
```

**Card Spacing in Column:**
- 380px fixed width cards centered in 640px column (130px padding left/right)
- Horizontal elbow lines travel through that 130px space to reach cards

### Export Behavior

**Canvas Settings:**
- **Scale:** 2x (renders at 3200px wide for retina sharpness)
- **Width:** Fixed 1600px (internal), exported as 3200px
- **Height:** Auto-fit to full content
- **html2canvas option:** `{ scale: 2, useCORS: true, logging: false }`

**Filename Format:**
- `phish-analysis-{project_title}-{timestamp}.png`
- Example: `phish-analysis-urgent-password-reset-20260120-143522.png`

**Exported Image:**
- White background
- All highlights, cards, arrows, badges burned in
- Crisp text even when zoomed/cropped in presentations

### Technique Badge Styling

**CSS Specification:**
```css
border: 1px solid #FF4500;
color: #FF4500;
background: #FFF5F5;
border-radius: 12px;
padding: 2px 8px;
font-size: 12px;
font-weight: bold;
display: inline-block;
```

- Subtle background (`#FFF5F5` = light orange tint)
- Bordered pill for lighter visual weight than solid block
- Consistent "Danger Color" theme with arrows

### OpenCode's Discretion

- Exact CSS for card shadows and border radius (modern feel)
- Typography within cards (as long as readable and follows hierarchy)
- Loading state transition from Edit Mode to Preview Mode
- Button placement and styling for "Preview" toggle and "Export PNG" action
- Error handling if html2canvas fails (show toast notification)
- Whether to show technique icons/emojis alongside technique names (optional flourish)

</decisions>

<specifics>
## Specific Ideas

- "Bus line aesthetic" creates a technical, diagrammatic feel — like architecture diagrams or circuit schematics
- 2x export scale ensures presentations look crisp on 4K projectors
- Ghost card empty state teaches the workflow without breaking the layout mental model
- OrangeRed (#FF4500) unified color creates clear visual hierarchy — audience knows exactly where to look

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 3 scope (Visualizer & Export)

</deferred>

---

*Phase: 03-visualizer-export*
*Context gathered: 2026-01-20*
