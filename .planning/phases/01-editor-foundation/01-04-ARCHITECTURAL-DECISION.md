## Decision: Split Editor/Viewer Architecture

**Date:** 2026-01-20
**Status:** Approved
**Plan:** 01-04
**Decision Point:** Architectural pivot during verification

---

### Current Implementation (Wrong)

**What was built (01-01, 01-02, 01-03):**

- Single Tiptap WYSIWYG editor with HTML preview panel
- LureMark as Tiptap Node extension (atom: true, inline: true)
- User selects text in the **editor** and clicks "Mark Lure" button
- HTML output derived from Tiptap document model
- Preview panel shows raw HTML source for debugging

**The problem:**
- Phishing emails come as raw HTML from victims
- Users need to paste the HTML directly, then see what the victim sees
- Marking lures should happen on the **rendered preview** (victim's view), not the source
- Current flow: edit in WYSIWYG → see HTML source (backwards)
- Desired flow: paste HTML → see rendered preview → mark lures in preview

---

### New Architecture (Correct)

**Components:**

1. **Mode Toggle:** Switch between two input modes
   - HTML Input Mode: Textarea for pasting raw HTML from phishing emails
   - Rich Text Mode: Tiptap WYSIWYG editor for typing formatted content

2. **Live Preview Pane:**
   - Renders the email as the victim would see it
   - Uses `dangerouslySetInnerHTML` with DOMPurify sanitization
   - Always visible regardless of input mode

3. **Lure Mark Creation:**
   - User selects text in **Preview pane** (not editor)
   - Clicks "Mark Lure" button
   - System gets selection range from rendered preview DOM
   - Finds corresponding position in HTML source
   - Injects `<span data-lure-id="UUID">` tags around selected text
   - Updates HTML source and re-renders preview to show highlights

4. **Lure Storage:**
   - Lure marks stored as `<span data-lure-id="UUID">` in the HTML source string
   - UUIDs persist in LocalStorage with the HTML content
   - No Tiptap extension needed for LureMark anymore

---

### Changes Required

**Remove:**
1. Tiptap LureMark extension (`src/extensions/LureMark.ts`)
2. "Mark Lure" button from editor toolbar
3. `data-lure-id` attribute handling in Tiptap document model

**Add:**
1. Mode toggle component (HTML input ↔ Rich Text input)
2. Live Preview pane component (renders HTML with highlights)
3. Selection-based Lure marking logic in Preview pane
4. DOM Range API integration for finding text positions
5. HTML string manipulation for injecting span tags
6. "Mark Lure" button positioned near Preview pane

**Modify:**
1. LocalStorage storage format (store HTML string, not Tiptap JSON)
2. App.tsx layout (three-column or split-view layout)
3. Editor component (simplified toolbar - no Lure Mark button)
4. Paste sanitization (apply to HTML textarea input mode)

---

### Technical Implementation Details

**Lure Mark Creation Flow:**

```typescript
// When user selects text in Preview pane and clicks "Mark Lure":
1. Get selection: window.getSelection()
2. Get Range from selection
3. Find text position in original HTML source:
   - Walk DOM nodes in Range
   - Count characters before selection
   - Map back to HTML string position
4. Insert <span data-lure-id="UUID"> at position
5. Update HTML source state
6. Re-render preview (highlights appear)
```

**HTML String Manipulation:**

```typescript
// Inject span around selected text:
const before = htmlSource.substring(0, startPosition)
const selected = htmlSource.substring(startPosition, endPosition)
const after = htmlSource.substring(endPosition)
const newHtml = `${before}<span data-lure-id="${uuid}">${selected}</span>${after}`
```

**Preview Rendering:**

```typescript
<div
  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlSource) }}
  className="preview-pane"
  onClick={handlePreviewClick}
/>
```

**Selection-based Marking:**

```typescript
const handleMarkLure = () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  // Find position in HTML source
  // Insert span tags
  // Update state
}
```

---

### Implications

**For Phase 1 (Editor Foundation):**

- Current implementation (01-01, 01-02, 01-03) needs significant rework
- May need new plans 01-05, 01-06 to implement correct architecture
- Requirements EDIT-01 through EDIT-06 still valid, just different implementation

**For Phase 2 (Annotation System):**

- Easier integration with Preview pane selection
- Technique annotations will link to `<span data-lure-id>` UUIDs
- Preview pane highlights will show which text has technique tags

**For Phase 3 (Visualizer):**

- Preview pane becomes the visualizer foundation
- Arrows can be positioned based on highlighted elements
- No need for separate editor/visualizer modes

**For Phase 5 (Data & Persistence):**

- LocalStorage stores HTML string (simpler than Tiptap JSON)
- Lure marks are just span tags in the HTML
- No special serialization/deserialization needed

---

### Validation

**This architecture is better because:**

1. **Matches user workflow:** Phishing emails come as HTML → paste → see victim view → mark lures
2. **Simpler:** Lure marks are just HTML spans, not Tiptap extension complexity
3. **More flexible:** Can handle any HTML structure without Tiptap constraints
4. **Preview-first:** Preview pane is central, not an afterthought

**User Decision:**
- Option B selected: Split Editor/Viewer with Toggle
- This is the correct direction for phishing email annotation workflow

---

### Next Steps

**Immediate actions:**
1. Document this decision in STATE.md under "Accumulated Context → Key Decisions Made"
2. Create new plans to implement the correct architecture:
   - 01-05: Build mode toggle and HTML input mode
   - 01-06: Build live preview pane with lure marking
   - 01-07: Verify complete workflow (or rename to 01-04 and redo)

**Backlog items:**
- Refactor or remove 01-01, 01-02, 01-03 implementation
- Keep Tiptap for rich text mode, but simplify (no LureMark extension)
- Update ROADMAP.md to reflect architectural changes
- Update REQUIREMENTS.md mapping to new implementation

---

*Decision recorded: 2026-01-20*
*User choice: Option B - Split Editor/Viewer with Toggle*
