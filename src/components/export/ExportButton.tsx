import React, { useState } from 'react'
import { exportSlideAsPNG, generateExportFilename } from '../../utils/export'

interface ExportButtonProps {
  slideWrapperRef: React.RefObject<HTMLDivElement>
  projectTitle?: string
  disabled?: boolean
}

export function ExportButton({
  slideWrapperRef,
  projectTitle,
  disabled = false,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    if (!slideWrapperRef.current) {
      setError('Slide wrapper not found')
      return
    }

    setIsExporting(true)
    setError(null)

    try {
      const filename = generateExportFilename(projectTitle)
      await exportSlideAsPNG(slideWrapperRef.current, filename)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
      // TODO: Show toast notification (deferred to Phase 5)
      console.error('Export error:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="export-button-container">
      <button
        onClick={handleExport}
        disabled={disabled || isExporting}
        className="export-button"
        type="button"
      >
        {isExporting ? 'Exporting...' : 'Export PNG'}
      </button>
      {error && <div className="export-error">{error}</div>}
    </div>
  )
}