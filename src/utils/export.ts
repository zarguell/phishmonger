import html2canvas from 'html2canvas'

/**
 * Exports a DOM element as high-resolution PNG using html2canvas.
 * Per Phase 3 Research: scale: 2 for retina sharpness (3200px wide).
 *
 * @param element - The DOM element to capture (e.g., SlideWrapper)
 * @param filename - Base filename for the download (without extension)
 */
export async function exportSlideAsPNG(
  element: HTMLElement,
  filename: string
): Promise<void> {
  try {
        const canvas = await html2canvas(element, {
          scale: 2,                    // 2x for retina sharpness (3200px wide)
          useCORS: true,              // Handle cross-origin images if present
          logging: false,             // Disable console spam
          backgroundColor: '#FFFFFF', // White background
        } as any)

    // Convert canvas to PNG data URL
    const dataUrl = canvas.toDataURL('image/png')

    // Trigger download
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Export failed:', error)
    throw new Error('Failed to export slide as PNG')
  }
}

/**
 * Generates filename with timestamp.
 * Format: phish-analysis-{title}-{timestamp}.png
 */
export function generateExportFilename(projectTitle?: string): string {
  const sanitizedTitle = projectTitle
    ? projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'untitled'
  const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, -5)
  return `phish-analysis-${sanitizedTitle}-${timestamp}`
}