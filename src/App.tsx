import { useState, useEffect, useRef, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { HTMLInput } from './components/HTMLInput'
import { Editor } from './components/Editor'
import type { InputMode } from './components/ModeToggle'
import { Preview } from './components/Preview'
import { LureList } from './components/LureList'
import { ScoringPanel } from './components/ScoringPanel'
import { ProjectSettings } from './components/ProjectSettings'
import { TechniqueLibrary } from './components/library/TechniqueLibrary'
import { SlideWrapper } from './components/preview/SlideWrapper'
import { EmailColumn } from './components/preview/EmailColumn'
import { AnnotationColumn } from './components/preview/AnnotationColumn'
import { ExportButton } from './components/export/ExportButton'
import { ArrowStyleSelector } from './components/visualizer/ArrowStyleSelector'
import { LayoutTemplateSelector, type LayoutTemplate } from './components/visualizer/LayoutTemplateSelector'
import { VisibilityToggles } from './components/visualizer/VisibilityToggles'
import { useUndoRedo } from './hooks/useUndoRedo'
import { useCustomTechniques } from './hooks/useCustomTechniques'
import { useCampaigns } from './hooks/useCampaigns'
import KeyboardShortcutHelp from './components/shortcuts/KeyboardShortcutHelp'
import { CampaignManager } from './components/campaign/CampaignManager'
import { CampaignEditor } from './components/campaign/CampaignEditor'
import { CampaignCarouselModal } from './components/campaign/CampaignCarouselModal'
import type { Annotation } from './types/annotations'
import type { ScoringData } from './types/scoring'
import type { ProjectMetadata } from './types/project'
import type { Campaign, CampaignPhish } from './types/campaign'
import type { Phish } from './types/phish'
import { loadAnnotations, saveAnnotations, loadScoring, saveScoring, loadPhishMetadata, savePhishMetadata, exportProjectJSON, downloadProjectJSON, importProjectJSON } from './utils/storage'
import type { ProjectJSON } from './utils/storage'
import { initializeSchema } from './utils/schemaVersion'
import { getStoragePercentage, isStorageNearQuota } from './utils/storageQuota'
import './index.css'

const STORAGE_KEY = 'phishmonger-html-source'
const MODE_KEY = 'phishmonger-input-mode'
const ARROW_STYLE_KEY = 'phishmonger-arrow-style'
const LAYOUT_TEMPLATE_KEY = 'phishmonger-layout-template'
const SHOW_TAGS_KEY = 'phishmonger-show-tags'
const SHOW_BADGE_KEY = 'phishmonger-show-badge'

/**
 * Merge custom techniques from imported project with existing local techniques
 *
 * Strategy:
 * - If imported technique ID doesn't exist locally, add it
 * - If imported technique ID exists locally, keep the newer one (based on createdAt timestamp)
 * - This allows sharing techniques across projects without data loss
 *
 * @param existing - Existing custom techniques from LocalStorage
 * @param imported - Custom techniques from imported project JSON
 * @returns Merged custom techniques
 */
function mergeCustomTechniques(
  existing: Record<string, any>,
  imported: Record<string, any>
): Record<string, any> {
  const merged = { ...existing }

  for (const [id, importedTechnique] of Object.entries(imported)) {
    const existingTechnique = merged[id]

    if (!existingTechnique) {
      // Add new technique
      merged[id] = importedTechnique
    } else {
      // Keep the newer version based on createdAt timestamp
      const importedTime = new Date(importedTechnique.createdAt).getTime()
      const existingTime = new Date(existingTechnique.createdAt).getTime()

      if (importedTime > existingTime) {
        merged[id] = importedTechnique
      }
      // If existing is newer, keep it (no action needed)
    }
  }

  return merged
}

type ViewMode = 'edit' | 'preview'
type ScaleMode = 'scroll' | 'fit'

function App() {
  // Initialize schema version on app mount
  useEffect(() => {
    initializeSchema();
  }, []);

  // Monitor storage quota usage
  useEffect(() => {
    // Update storage percentage on LocalStorage changes
    const updateStorage = () => {
      setStoragePercent(getStoragePercentage());
    };

    // Initial check
    updateStorage();

    // Listen for storage events (changes in other tabs)
    window.addEventListener('storage', updateStorage);
    return () => window.removeEventListener('storage', updateStorage);
  }, []);

  const [inputMode, setInputMode] = useState<InputMode>(() => {
    const savedMode = localStorage.getItem(MODE_KEY) as InputMode | null
    return savedMode || 'html'
  })
  const [htmlSource, setHtmlSource] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved || '<p>Start typing your phishing email here...</p>'
  })
  const {
    state: annotations,
    setState: setAnnotations,
    undo: undoAnnotations,
    redo: redoAnnotations,
    canUndo: canUndoAnnotations,
    canRedo: canRedoAnnotations
  } = useUndoRedo<Record<string, Annotation>>(loadAnnotations())
  const [scoring, setScoring] = useState<ScoringData>(() => {
    return loadScoring()
  })
  const [metadata, setMetadata] = useState<ProjectMetadata>(() => {
    return loadPhishMetadata()
  })
  const [storagePercent, setStoragePercent] = useState<number>(0)

  // Custom techniques management
  const { customTechniques } = useCustomTechniques()
  const { updateCampaign, updatePhishInCampaign } = useCampaigns()
  const [showCampaignManager, setShowCampaignManager] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | undefined>(undefined)
  const [showCampaignCarousel, setShowCampaignCarousel] = useState(false)
  const [carouselCampaign, setCarouselCampaign] = useState<Campaign | undefined>(undefined)
  const [editingCampaignPhish, setEditingCampaignPhish] = useState<{campaignId: string, phishId: string} | undefined>(undefined)
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const [scaleMode, setScaleMode] = useState<ScaleMode>('fit')
  const [layoutTemplate, setLayoutTemplate] = useState<LayoutTemplate>(() => {
    const savedTemplate = localStorage.getItem(LAYOUT_TEMPLATE_KEY) as LayoutTemplate | null
    return savedTemplate || 'balanced'
  })
  const [showTags, setShowTags] = useState(() => {
    const savedShowTags = localStorage.getItem(SHOW_TAGS_KEY)
    return savedShowTags === null ? true : savedShowTags === 'true'
  })
  const [showBadge, setShowBadge] = useState(() => {
    const savedShowBadge = localStorage.getItem(SHOW_BADGE_KEY)
    return savedShowBadge === null ? true : savedShowBadge === 'true'
  })
  const [arrowStyle, setArrowStyle] = useState(() => {
    const savedStyle = localStorage.getItem(ARROW_STYLE_KEY)
    return savedStyle || 'classic'
  })
  const [showShortcutHelp, setShowShortcutHelp] = useState(false)
  const [showTechniqueLibrary, setShowTechniqueLibrary] = useState(false)
  const slideWrapperRef = useRef<HTMLDivElement>(null)

  // Save to LocalStorage whenever htmlSource changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, htmlSource)
  }, [htmlSource])

  // Save input mode preference
  useEffect(() => {
    localStorage.setItem(MODE_KEY, inputMode)
  }, [inputMode])

  // Save arrow style preference
  useEffect(() => {
    localStorage.setItem(ARROW_STYLE_KEY, arrowStyle)
  }, [arrowStyle])

  // Save layout template preference
  useEffect(() => {
    localStorage.setItem(LAYOUT_TEMPLATE_KEY, layoutTemplate)
  }, [layoutTemplate])

  // Save show tags preference
  useEffect(() => {
    localStorage.setItem(SHOW_TAGS_KEY, showTags.toString())
  }, [showTags])

  // Save show badge preference
  useEffect(() => {
    localStorage.setItem(SHOW_BADGE_KEY, showBadge.toString())
  }, [showBadge])

  // Save annotations to LocalStorage
  useEffect(() => {
    saveAnnotations(annotations)
  }, [annotations])

  // Save scoring to LocalStorage
  useEffect(() => {
    saveScoring(scoring)
  }, [scoring])

  // Save metadata to LocalStorage
  useEffect(() => {
    savePhishMetadata(metadata)
  }, [metadata])

  // Build currentPhish Phish object from App state for campaign integration
  const currentPhish = useMemo<Phish>(() => {
    // Get or generate phish ID from localStorage
    let projectId = localStorage.getItem('phishmonger-project-id')
    if (!projectId) {
      projectId = crypto.randomUUID()
      localStorage.setItem('phishmonger-project-id', projectId)
    }

    return {
      id: projectId,
      metadata,
      htmlSource,
      annotations,
      scoring,
      inputMode,
    }
  }, [metadata, htmlSource, annotations, scoring, inputMode])

  // Global keyboard shortcuts for undo/redo (disabled in form inputs)
  useHotkeys('ctrl+z, cmd+z', (e) => {
    e.preventDefault()
    undoAnnotations()
  }, { enableOnFormTags: false }, [undoAnnotations])

  useHotkeys('ctrl+shift+z, ctrl+y, cmd+shift+z', (e) => {
    e.preventDefault()
    redoAnnotations()
  }, { enableOnFormTags: false }, [redoAnnotations])

  // Keyboard shortcut to open help modal (F1 = universal help key)
  useHotkeys('f1', (e) => {
    e.preventDefault()
    setShowShortcutHelp(true)
  }, { enableOnFormTags: true }, [])

  // Calculate scale factor for "fit to screen" mode
  useEffect(() => {
    if (viewMode === 'preview' && scaleMode === 'fit') {
      const updateScale = () => {
        const container = document.querySelector('.slide-container') as HTMLElement
        const slideWrapper = slideWrapperRef.current
        if (container && slideWrapper) {
          const containerWidth = container.clientWidth
          const slideWidth = 1600 // Fixed width of slide-wrapper
          const slideHeight = 900 // Fixed height of slide-wrapper
          const padding = 80 // Account for container padding
          
          const availableWidth = containerWidth - padding
          const availableHeight = window.innerHeight - 200 // Account for header and padding
          
          const scaleX = availableWidth / slideWidth
          const scaleY = availableHeight / slideHeight
          const scale = Math.min(scaleX, scaleY, 1) // Don't scale up, only down
          
          slideWrapper.style.setProperty('--scale-factor', scale.toString())
        }
      }

      updateScale()
      window.addEventListener('resize', updateScale)
      return () => window.removeEventListener('resize', updateScale)
    }
  }, [viewMode, scaleMode])

  const updateAnnotation = (lureId: string, updates: Partial<Annotation>) => {
    setAnnotations(prev => ({
      ...prev,
      [lureId]: {
        ...prev[lureId],
        ...updates,
        lureId,
        updatedAt: new Date().toISOString()
      }
    }))
  }

  const updateScoring = (updates: Partial<ScoringData>) => {
    setScoring(prev => ({
      ...prev,
      ...updates
    }))
  }

  const handleMarkLure = (updatedHtml: string) => {
    setHtmlSource(updatedHtml)
  }

  const handleRemoveLure = (lureId: string) => {
    // Remove all spans with matching data-lure-id from HTML source
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlSource, 'text/html')
    const lureElements = doc.querySelectorAll(`[data-lure-id="${lureId}"]`)

    lureElements.forEach((el) => {
      const parent = el.parentNode
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el)
        }
        parent.removeChild(el)
      }
    })

    setHtmlSource(doc.body.innerHTML)

    // Remove annotation
    setAnnotations(prev => {
      const { [lureId]: removed, ...rest } = prev
      return rest
    })
  }

  const handleUpdateMetadata = (updates: Partial<ProjectMetadata>) => {
    setMetadata(prev => ({
      ...prev,
      ...updates
    }))
  }

  const handleExportJSON = () => {
    const jsonString = exportProjectJSON(metadata, htmlSource, annotations, scoring, inputMode, customTechniques)
    const filename = `${metadata.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`
    downloadProjectJSON(jsonString, filename)
  }

  const handleImportJSON = (project: ProjectJSON) => {
    setMetadata(project.metadata)
    setHtmlSource(project.htmlSource)
    setAnnotations(project.annotations)
    setScoring(project.scoring)
    setInputMode(project.inputMode)

    // Merge custom techniques from imported project
    if (project.customTechniques) {
      const mergedTechniques = mergeCustomTechniques(customTechniques, project.customTechniques)

      // Save merged techniques to LocalStorage directly
      // The useCustomTechniques hook will pick up the changes on its next render cycle
      try {
        localStorage.setItem('phishmonger-custom-techniques', JSON.stringify(mergedTechniques))

        // Force the hook to reload by triggering a storage event
        // This causes useCustomTechniques' useEffect to run and load the merged data
        window.dispatchEvent(new Event('storage'))
      } catch (error) {
        console.error('Failed to merge custom techniques from imported project:', error)
      }
    }
  }

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setShowCampaignManager(false) // Close list, open editor
  }

  const handleCloseEditor = () => {
    setEditingCampaign(undefined)
    setShowCampaignManager(true) // Return to campaign list
  }

  const handleSaveCampaign = (campaignId: string, updates: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => {
    updateCampaign(campaignId, updates)
    setEditingCampaign(undefined)
    setShowCampaignManager(true) // Return to campaign list after save
  }

  const handleEditPhish = (campaignId: string, phish: CampaignPhish) => {
    // Load phish data into main editor state
    setHtmlSource(phish.htmlSource)
    setAnnotations(phish.annotations)
    setMetadata({
      title: phish.metadata?.title || 'Untitled Phish',
      author: phish.metadata?.author || '',
      createdAt: phish.metadata?.createdAt || new Date().toISOString(),
    })
    if (phish.scoring) {
      setScoring(phish.scoring)
    }

    // Store project ID for consistent identity
    localStorage.setItem('phishmonger-project-id', phish.id)

    // Track which campaign phish is being edited for save-to-campaign workflow
    setEditingCampaignPhish({ campaignId, phishId: phish.id })

    // Close campaign editor and return to main editor
    setEditingCampaign(undefined)
    setShowCampaignManager(false)
  }

  const handleSaveToCampaign = () => {
    if (!editingCampaignPhish) return

    const { campaignId, phishId } = editingCampaignPhish

    console.log('🐛 [SaveToCampaign] Starting save:', { campaignId, phishId })

    // Build updated phish from current editor state
    const updatedPhish: Partial<CampaignPhish> = {
      htmlSource,
      annotations,
      metadata: {
        title: metadata.title,
        author: metadata.author,
        createdAt: metadata.createdAt,
      },
      scoring,
      inputMode,
    }

    console.log('🐛 [SaveToCampaign] Updated phish data:', updatedPhish)

    // Update the phish within the campaign using the dedicated hook function
    updatePhishInCampaign(campaignId, phishId, updatedPhish)

    console.log('🐛 [SaveToCampaign] Called updatePhishInCampaign')

    // Clear editing state
    setEditingCampaignPhish(undefined)

    // Show success feedback
    alert('Saved to campaign!')
  }

  const handleViewCarousel = (campaign: Campaign) => {
    setCarouselCampaign(campaign)
    setShowCampaignCarousel(true)
    setShowCampaignManager(false) // Close campaign list when opening carousel
  }

  const handleCloseCarousel = () => {
    setShowCampaignCarousel(false)
    setCarouselCampaign(undefined)
  }

  if (viewMode === 'preview') {
    return (
      <div className="app app-preview-mode">
        {isStorageNearQuota() && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-amber-900 text-sm">
            <strong>Storage Warning:</strong> Using {storagePercent.toFixed(0)}% of available storage.
            Delete old campaigns or export data to free up space.
          </div>
        )}
        <header className="app-header">
          <h1>Phish Monger - Preview Mode</h1>
          <div className="header-actions">
            <div className="scale-toggle">
              <button
                className={scaleMode === 'fit' ? 'active' : ''}
                onClick={() => setScaleMode('fit')}
                type="button"
              >
                Scale to Fit
              </button>
              <button
                className={scaleMode === 'scroll' ? 'active' : ''}
                onClick={() => setScaleMode('scroll')}
                type="button"
              >
                Full Width
              </button>
            </div>
            <LayoutTemplateSelector
              currentTemplate={layoutTemplate}
              onTemplateChange={setLayoutTemplate}
            />
            <VisibilityToggles
              showTags={showTags}
              onTagsToggle={setShowTags}
              showNistBadge={showBadge}
              onNistBadgeToggle={setShowBadge}
            />
            <ArrowStyleSelector
              currentStyle={arrowStyle}
              onStyleChange={setArrowStyle}
            />
            <button
              onClick={() => setViewMode('edit')}
              className="back-to-edit-button"
              type="button"
            >
              Back to Edit
            </button>
            <ExportButton
              slideWrapperRef={slideWrapperRef}
              projectTitle="phish-analysis"
            />
          </div>
        </header>
        <main className="app-main app-main-preview">
          <div className={`slide-container scale-mode-${scaleMode}`}>
            <SlideWrapper
              ref={slideWrapperRef}
              annotations={annotations}
              scoring={scoring}
              showBadge={showBadge}
              layoutTemplate={layoutTemplate}
            >
              <EmailColumn htmlSource={htmlSource} annotations={annotations} arrowStyle={arrowStyle} />
              <AnnotationColumn
                annotations={annotations}
                arrowStyle={arrowStyle}
                showTags={showTags}
              />
            </SlideWrapper>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      {isStorageNearQuota() && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-amber-900 text-sm">
          <strong>Storage Warning:</strong> Using {storagePercent.toFixed(0)}% of available storage.
          Delete old campaigns or export data to free up space.
        </div>
      )}
      <header className="app-header">
        <div className="header-top">
          <h1>
            Phish Monger
            {editingCampaignPhish && (
              <span style={{
                fontSize: '14px',
                marginLeft: '16px',
                color: '#28a745',
                fontWeight: 'normal',
              }}>
                Editing Campaign Phish
              </span>
            )}
          </h1>
           <ProjectSettings
             metadata={metadata}
             onUpdate={handleUpdateMetadata}
             onExport={handleExportJSON}
             onImportFromFile={(file: File) => {
               const reader = new FileReader()
               reader.onload = (e) => {
                 try {
                   const json = e.target?.result as string
                   const project = importProjectJSON(json)
                   handleImportJSON(project)
                 } catch (error) {
                   // Error handled in ProjectSettings
                   throw error
                 }
               }
               reader.readAsText(file)
             }}
             onImportFromText={(jsonText: string) => {
               const project = importProjectJSON(jsonText)
               handleImportJSON(project)
             }}
             onOpenTechniqueLibrary={() => setShowTechniqueLibrary(true)}
           />
        </div>
        <p>Phishing Email Annotation Tool</p>
        <div className="header-actions">
          <button
            onClick={undoAnnotations}
            disabled={!canUndoAnnotations}
            title="Undo annotation edits (Ctrl+Z / Cmd+Z)"
            type="button"
          >
            Undo Annotation
          </button>
          <button
            onClick={redoAnnotations}
            disabled={!canRedoAnnotations}
            title="Redo annotation edits (Ctrl+Shift+Z / Ctrl+Y)"
            type="button"
          >
            Redo Annotation
          </button>
          {editingCampaignPhish && (
            <button
              onClick={handleSaveToCampaign}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
              type="button"
            >
              Save to Campaign
            </button>
          )}
          <button
            onClick={() => setShowCampaignManager(true)}
            type="button"
          >
            Campaigns
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className="preview-mode-button"
            type="button"
            disabled={Object.keys(annotations).length === 0}
          >
            Preview Mode
          </button>
          <button
            onClick={() => setShowShortcutHelp(true)}
            className="help-shortcuts-button"
            title="Press F1 for keyboard shortcuts"
            type="button"
          >
            ?
          </button>
        </div>
      </header>
      <main className="app-main">
        <div className="input-column">
          <div className="mode-toggle">
            <label className="mode-toggle-label">
              <input
                type="radio"
                name="inputMode"
                value="html"
                checked={inputMode === 'html'}
                onChange={(e) => setInputMode(e.target.value as InputMode)}
              />
              <span>HTML Input</span>
            </label>
            <label className="mode-toggle-label">
              <input
                type="radio"
                name="inputMode"
                value="richtext"
                checked={inputMode === 'richtext'}
                onChange={(e) => setInputMode(e.target.value as InputMode)}
              />
              <span>Rich Text</span>
            </label>
          </div>
          {inputMode === 'html' ? (
            <HTMLInput
              value={htmlSource}
              onChange={setHtmlSource}
            />
          ) : (
            <Editor
              content={htmlSource}
              onUpdate={setHtmlSource}
            />
          )}
        </div>
        <div className="preview-column">
          <Preview
            htmlSource={htmlSource}
            onUpdate={handleMarkLure}
          />
        </div>
        <div className="lure-list-column">
          <LureList
            htmlSource={htmlSource}
            onRemoveLure={handleRemoveLure}
            annotations={annotations}
            onUpdateAnnotation={updateAnnotation}
          />
        </div>
        <div className="scoring-column">
          <ScoringPanel
            scoring={scoring}
            onUpdate={updateScoring}
            showBadge={showBadge}
            onBadgeToggle={setShowBadge}
          />
        </div>
      </main>
      <KeyboardShortcutHelp
        isOpen={showShortcutHelp}
        onClose={() => setShowShortcutHelp(false)}
      />
      {showTechniqueLibrary && (
        <TechniqueLibrary
          onClose={() => setShowTechniqueLibrary(false)}
        />
      )}
      {showCampaignManager && (
        <CampaignManager
          isOpen={showCampaignManager}
          onClose={() => setShowCampaignManager(false)}
          onEditCampaign={handleEditCampaign}
          onCarousel={handleViewCarousel}
          currentProject={currentPhish}
        />
      )}
      {editingCampaign && (
        <CampaignEditor
          campaign={editingCampaign}
          onClose={handleCloseEditor}
          onSave={handleSaveCampaign}
          currentProject={currentPhish}
          onEditPhish={handleEditPhish}
        />
      )}
      {showCampaignCarousel && carouselCampaign && (
        <CampaignCarouselModal
          isOpen={showCampaignCarousel}
          onClose={handleCloseCarousel}
          campaign={carouselCampaign}
        />
      )}
    </div>
  )
}

export default App
