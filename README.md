# Phish Monger

A client-side Single Page Application that enables security trainers to annotate phishing emails with technique explanations, generate visual slides with numbered badges, and calculate phishing difficulty using the NIST Phish Scale.

## Core Value

Security trainers can create visual, annotated phishing training materials that clearly highlight deceptive techniques with educational context — without manual layout work.

## Features

- **Email Editor**: Compose or paste phishing emails using a rich text editor with Tiptap integration
- **Technique Annotations**: Mark text in emails and map to MITRE ATT&CK techniques and persuasion principles
- **Visual Slides**: Generate numbered badge overlays connecting lures to explanations
- **NIST Phish Scale Scoring**: Calculate phishing difficulty with cues and premise alignment
- **Export Options**: Export to high-resolution PNG images or JSON project files
- **Local Storage**: Persist projects locally in the browser
- **Import/Export**: Load and save project data

## Distribution Methods

PhishMonger is available in multiple formats:

### Web App (PWA)
Access the latest hosted version on [Cloudflare Workers](https://phishmonger.useast01.workers.dev/). Supports offline installation on mobile devices (iOS Safari, Android Chrome). Source code is all client side/browser, we never store your phishing simulations server side.

### Single HTML File
Download a self-contained HTML file from the [GitHub Releases](https://github.com/zarguell/phishmonger/releases/latest). Works completely offline - no internet connection required after download. Simply open the file in any modern web browser.

### Desktop Apps
Download native desktop applications for your platform from [GitHub Releases](https://github.com/zarguell/phishmonger/releases/latest):
- **macOS**: .app bundle
- **Windows**: Installer (.exe)
- **Linux**: .deb package and .AppImage

All desktop versions work offline and integrate with your operating system.

## Local Installation / Development

1. Clone the repository:
   ```bash
   git clone https://github.com/zarguell/phishmonger.git
   cd phishmonger
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173` (or the port shown in the terminal)

## Usage

1. **Compose Email**: Use the editor to create or paste a phishing email
2. **Mark Lures**: Select text and annotate it with technique explanations
3. **Score Difficulty**: Use the NIST Phish Scale to rate the phishing attempt
4. **Preview & Export**: View the visual layout and export to PNG or JSON

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Editor**: Tiptap with custom extensions
- **Styling**: CSS Modules
- **Build Tool**: Vite
- **PWA**: vite-plugin-pwa
- **Desktop**: Tauri
- **Security**: DOMPurify for HTML sanitization
- **Export**: html2canvas for image generation

## Releases

Releases are automatically created when version tags are pushed to the repository. Each release includes:

- Single self-contained HTML file
- macOS desktop application
- Windows installer
- Linux packages (.deb and .AppImage)
- SHA256 checksums for all artifacts

### Verifying Checksums

After downloading artifacts, verify their integrity using the provided `SHA256SUMS.txt`:

```bash
# Download the checksums file
wget https://github.com/zarguell/phishmonger/releases/download/v1.4.0/SHA256SUMS.txt

# Verify all downloads
sha256sum -c SHA256SUMS.txt
```

### Creating a New Release

To create a new release:

1. Update version numbers in `package.json` and `src-tauri/tauri.conf.json`
2. Commit your changes
3. Create and push a version tag:
   ```bash
   git tag v1.5.0
   git push origin v1.5.0
   ```

GitHub Actions will automatically build all artifacts and create the release.

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Editor**: Tiptap with custom extensions
- **Styling**: CSS Modules
- **Build Tool**: Vite
- **Security**: DOMPurify for HTML sanitization
- **Export**: html2canvas for image generation

## Project Structure

```
src/
├── components/          # React components
│   ├── annotation/     # Annotation-related components
│   ├── export/         # Export functionality
│   ├── library/        # Technique library
│   ├── preview/        # Preview mode components
│   ├── visualizer/     # Visualization controls
│   └── ...
├── data/               # Static JSON data (techniques, persuasion)
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── extensions/         # Tiptap editor extensions
```

## Contributing

This project is currently in active development. Contributions are welcome for:

- Bug fixes
- Feature enhancements
- Documentation improvements

## Context

Built for security teams creating phishing awareness training materials. The tool bridges the gap between raw phishing emails and educational slides by automating annotation layout and providing standard technique references.
