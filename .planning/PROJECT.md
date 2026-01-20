# Phish Monger

## What This Is

A client-side Single Page Application that enables security trainers to annotate phishing emails with technique explanations, generate visual slides with arrow annotations, and calculate phishing difficulty using the NIST Phish Scale. Users mark text in emails, map techniques to MITRE ATT&CK, and export high-res PNGs for training materials.

## Core Value

Security trainers can create visual, annotated phishing training materials that clearly highlight deceptive techniques with educational context — without manual layout work.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Editor with Tiptap integration for email composition
- [ ] Custom "Lure Mark" extension wrapping text in spans with IDs
- [ ] Sanitized paste feature using DOMPurify
- [ ] Technique library sidebar with pre-loaded common techniques
- [ ] MITRE ATT&CK ID mapping for each annotation
- [ ] NIST Phish Scale scoring interface (cues + premise alignment)
- [ ] Visualizer with SVG arrow overlay connecting lures to explanations
- [ ] html2canvas export to PNG with burned-in annotations
- [ ] JSON export with full project structure
- [ ] LocalStorage persistence for projects
- [ ] Full preview mode before export

### Out of Scope

- User accounts/authentication — LocalStorage-only, no cloud sync
- Real-time collaboration — Single-user tool
- Email sending — Creation/annotation only
- Mobile app — Web-first, desktop-focused design
- Backend API — Purely client-side

## Context

Built for security teams creating phishing awareness training materials. The tool bridges the gap between raw phishing emails and educational slides by automating annotation layout and providing standard technique references (MITRE ATT&CK, NIST Phish Scale). DOM-based association ensures arrows track with text across screen sizes.

## Constraints

- **Tech stack:** React + Vite, Tiptap editor, html2canvas, DOMPurify — Chosen for client-side simplicity and modularity
- **Hosting:** Static only (Netlify/GitHub Pages) — No server required
- **Data persistence:** LocalStorage only — No cloud sync or user accounts
- **Browser support:** Modern browsers with ES2020+ — Chrome/Firefox/Safari/Edge
- **Single user:** No authentication or multi-user features

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tiptap over other editors | Mark API makes span wrapping trivial; headless allows custom UI | — Pending |
| DOM-based annotation over coordinate-based | Arrows track with text layout changes; more robust | — Pending |
| Client-side only with LocalStorage | Privacy (no data leaves browser), no infra complexity | — Pending |

---
*Last updated: 2025-01-20 after initialization*
