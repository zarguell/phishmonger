# Architecture Patterns

**Domain:** Phishing annotation tool with campaign management
**Researched:** 2026-01-22
**Milestone:** v1.2 Campaign Management

## Executive Summary

Campaign management introduces a **many-to-many relationship** between campaigns and projects, requiring careful state management design within the existing React + LocalStorage architecture. The integration strategy extends existing patterns (projects stored as individual records in LocalStorage) without breaking backward compatibility. New components follow established UI patterns (modals, dropdowns, panels) and reuse existing hooks (useCustomTechniques pattern for CRUD operations).

**Key architectural changes:**
1. **New data model layer**: Campaign entities with many-to-many project references
2. **LocalStorage schema evolution**: Add `phishmonger-campaigns` key, extend project metadata with `scheduledDate`
3. **State management expansion**: Campaign selection state alongside currentProject state
4. **New component families**: CampaignManager, CalendarView, DetailCarousel, CampaignSettings
5. **Export/import changes**: Campaign-level JSON (array of projects), iCal generation for calendar export

## Recommended Architecture

### Component Hierarchy

```
App.tsx (existing - minimal modification)
├── Edit Mode (existing)
│   ├── ProjectSettings (MODIFY - add campaign selector)
│   └── [existing editor components unchanged]
└── Campaign Mode (NEW)
    ├── CampaignManager (NEW - list/edit campaigns)
    ├── CalendarView (NEW - monthly calendar with campaign indicators)
    └── DetailCarousel (NEW - browse projects within selected campaign)
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         LocalStorage                             │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────────────┐    │
│  │ phishmonger-projects │  │ phishmonger-campaigns         │    │
│  │ ┌──────────────────┐ │  │ ┌──────────────────────────┐ │    │
│  │ │ Project[]        │ │  │ │ Campaign[]               │ │    │
│  │ │ - id             │ │  │ │ - id                     │ │    │
│  │ │ - metadata       │ │  │ │ - name                   │ │    │
│  │ │ - htmlSource     │ │  │ │ - projectIds[]           │ │    │
│  │ │ - annotations    │ │  │ │ - createdAt              │ │    │
│  │ │ - scoring        │ │  │ │ - description            │ │    │
│  │ │ - customTechniques│ │  │ └──────────────────────────┘ │    │
│  │ └──────────────────┘ │  │                               │    │
│  └──────────────────────┘  └──────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
           │                                     │
           │ loadProjects()                      │ loadCampaigns()
           │                                     │
           ▼                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                         App State                                │
│                                                                   │
│  const [projects, setProjects] = useState<Project[]>(...)       │
│  const [campaigns, setCampaigns] = useState<Campaign[]>(...)    │
│  const [currentProject, setCurrentProject] = useState<...>       │
│  const [selectedCampaign, setSelectedCampaign] = useState<...>   │
└─────────────────────────────────────────────────────────────────┘
           │                                     │
           │                                     │
           ▼                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Component Layer                             │
│                                                                   │
│  CampaignManager ──────────────────────────────────────────┐   │
│    - Displays list of campaigns                                │
│    - Filter projects by selectedCampaign.projectIds          │
│    - CRUD operations on campaigns                             │
└──────────────────────────────────────────────────────────┐   │
                                                             │   │
  CalendarView ──────────────────────────────────────────┐   │   │
    - Monthly calendar grid                                │   │   │
    - Shows campaigns on scheduledDate                     │   │   │
    - Click campaign → open DetailCarousel                 │   │   │
└──────────────────────────────────────────────────────┐   │   │
                                                       │   │   │
  DetailCarousel ───────────────────────────────────┐   │   │   │
    - Browse projects within selectedCampaign       │   │   │   │
    - Prev/Next navigation through projectIds[]     │   │   │   │
    - Load project data into existing Editor        │   │   │   │
    - Reuses Editor components (read-only mode)     │   │   │   │
└────────────────────────────────────────────────┐   │   │   │
                                                  │   │   │   │
  Export/Import ─────────────────────────────┐   │   │   │   │
    - Campaign export: JSON array of projects │   │   │   │   │
    - Campaign import: Merge into LocalStorage│   │   │   │   │
    - iCal export: Generate .ics from dates   │   │   │   │   │
└────────────────────────────────────────────┘   │   │   │   │
                                                  │   │   │   │
                         Existing Editor ────────┘   │   │   │
                           (unchanged)                │   │   │
                                                      │   │   │
                          ProjectSettings ────────────┘   │   │
                            (modified to add              │   │
                             campaign selector)           │   │
                                                          │   │
                                                          │   │
                         CampaignSettings (NEW) ──────────┘   │
                           - Add/remove projects to campaign  │
                           - Set scheduledDate per project    │
                           - Campaign metadata (name, desc)   │
└─────────────────────────────────────────────────────────────┘
```

## Component Boundaries

### New Components

| Component | Responsibility | Communicates With | State Needs |
|-----------|---------------|-------------------|-------------|
| **CampaignManager** | List all campaigns, create/edit/delete campaigns | CampaignSettings (modals), CalendarView (navigation) | Campaign list, selected campaign |
| **CalendarView** | Display monthly calendar with campaign indicators | CampaignManager (selection), DetailCarousel (drill-down) | Campaign list, current month |
| **DetailCarousel** | Browse projects within a campaign, prev/next navigation | Editor (project display), CampaignSettings (edit) | Selected campaign, current project index |
| **CampaignSettings** | Edit campaign metadata, add/remove projects, set scheduled dates | CampaignManager (parent), projects list | Selected campaign, all projects |
| **CampaignExporter** | Generate campaign JSON (array of projects) | CampaignManager (trigger) | Selected campaign, all projects |
| **iCalExporter** | Generate .ics file from campaign dates | CampaignManager (trigger) | Selected campaign |

### Modified Components

| Component | Modification | Integration Point |
|-----------|--------------|-------------------|
| **App.tsx** | Add `projects`, `campaigns` state, campaign view mode | New top-level state alongside existing `currentProject` |
| **ProjectSettings** | Add campaign selector dropdown | `onCampaignChange` prop, display current project's campaigns |
| **ExportButton** | Add campaign export option alongside single project export | Detect if in campaign context, export array format |

## Data Model

### Campaign Entity

```typescript
interface Campaign {
  id: string                    // UUID or timestamp-based ID
  name: string                  // Campaign name (e.g., "Q1 2026 Phishing Campaign")
  description?: string          // Optional description
  projectIds: string[]          // Array of project IDs (many-to-many)
  createdAt: string             // ISO 8601 timestamp
  updatedAt?: string            // ISO 8601 timestamp
}

interface Project {
  id: string                    // NEW: Add ID to project entity
  metadata: ProjectMetadata     // EXTENDED: Add scheduledDate field
  htmlSource: string
  annotations: Record<string, Annotation>
  scoring: ScoringData
  inputMode: InputMode
  customTechniques?: Record<string, CustomTechnique>
}

interface ProjectMetadata {
  title: string
  author: string
  createdAt: string
  updatedAt?: string
  scheduledDate?: string        // NEW: ISO 8601 date for calendar display
  campaignIds?: string[]        // NEW: Back-reference to campaigns (optional, for filtering)
}
```

### Many-to-Many Relationship

**Campaign → Projects**: `campaign.projectIds` array stores project IDs
**Project → Campaigns**: `project.metadata.campaignIds` array stores campaign IDs (optional, derived)

**Relationship maintenance:**
- Adding project to campaign: Push project ID to `campaign.projectIds`, push campaign ID to `project.metadata.campaignIds`
- Removing project from campaign: Filter out IDs from both arrays
- Deleting campaign: Remove campaign ID from all `project.metadata.campaignIds` (cleanup)

## LocalStorage Schema Evolution

### Current Schema (v1.1)

```javascript
localStorage = {
  'phishmonger-html-source': string,
  'phishmonger-input-mode': 'html' | 'richtext',
  'phishmonger-annotations': Record<string, Annotation>,
  'phishmonger-scoring': ScoringData,
  'phishmonger-metadata': ProjectMetadata,
  'phishmonger-custom-techniques': Record<string, CustomTechnique>,
  'phishmonger-arrow-style': string,
  'phishmonger-layout-template': string,
  'phishmonger-show-tags': boolean,
  'phishmonger-show-badge': boolean
}
```

### New Schema (v1.2)

```javascript
localStorage = {
  // === EXISTING KEYS (unchanged) ===
  'phishmonger-html-source': string,
  'phishmonger-input-mode': 'html' | 'richtext',
  'phishmonger-annotations': Record<string, Annotation>,
  'phishmonger-scoring': ScoringData,
  'phishmonger-metadata': ProjectMetadata,  // Now includes scheduledDate, campaignIds
  'phishmonger-custom-techniques': Record<string, CustomTechnique>,
  'phishmonger-arrow-style': string,
  'phishmonger-layout-template': string,
  'phishmonger-show-tags': boolean,
  'phishmonger-show-badge': boolean,

  // === NEW KEYS ===
  'phishmonger-projects': Project[],              // Array of all projects (was single project)
  'phishmonger-campaigns': Campaign[],            // Array of all campaigns
  'phishmonger-current-project-id': string,       // ID of currently loaded project
  'phishmonger-current-campaign-id': string,      // ID of selected campaign (optional)
  'phishmonger-view-mode': 'project' | 'campaign' // Which view is active
}
```

### Migration Strategy

**v1.1 → v1.2 migration (on first load after upgrade):**

```typescript
function migrateToCampaignSupport() {
  const existingMetadata = localStorage.getItem('phishmonger-metadata')
  const existingAnnotations = localStorage.getItem('phishmonger-annotations')
  const existingScoring = localStorage.getItem('phishmonger-scoring')
  const existingHtml = localStorage.getItem('phishmonger-html-source')
  const existingMode = localStorage.getItem('phishmonger-input-mode')
  const existingCustomTechniques = localStorage.getItem('phishmonger-custom-techniques')

  // Only migrate if legacy data exists and projects array doesn't
  if (existingMetadata && !localStorage.getItem('phishmonger-projects')) {
    const projectId = `project-${Date.now()}`

    // Create legacy project with new schema
    const legacyProject: Project = {
      id: projectId,
      metadata: JSON.parse(existingMetadata),
      htmlSource: existingHtml || '',
      annotations: JSON.parse(existingAnnotations || '{}'),
      scoring: JSON.parse(existingScoring || '{}'),
      inputMode: (existingMode as InputMode) || 'html',
      customTechniques: existingCustomTechniques ? JSON.parse(existingCustomTechniques) : undefined
    }

    // Store in projects array
    localStorage.setItem('phishmonger-projects', JSON.stringify([legacyProject]))
    localStorage.setItem('phishmonger-current-project-id', projectId)
    localStorage.setItem('phishmonger-view-mode', 'project')

    // Initialize empty campaigns array
    localStorage.setItem('phishmonger-campaigns', JSON.stringify([]))

    // Optionally clean up legacy keys (or keep for rollback)
    // localStorage.removeItem('phishmonger-metadata')
    // localStorage.removeItem('phishmonger-annotations')
    // ...
  }
}
```

**Rollback strategy:** Keep legacy keys until user confirms migration successful, or provide "Export All Projects" feature before cleanup.

## State Management Updates

### App.tsx State Expansion

```typescript
// === EXISTING STATE (unchanged) ===
const [inputMode, setInputMode] = useState<InputMode>(...)
const [htmlSource, setHtmlSource] = useState(...)
const [annotations, setAnnotations] = useUndoRedo<Record<string, Annotation>>(...)
const [scoring, setScoring] = useState<ScoringData>(...)
const [metadata, setMetadata] = useState<ProjectMetadata>(...)
const { customTechniques } = useCustomTechniques()
const [viewMode, setViewMode] = useState<ViewMode>('edit' | 'preview')

// === NEW STATE ===
const [appMode, setAppMode] = useState<'project' | 'campaign'>('project')
const [projects, setProjects] = useState<Project[]>(() => loadProjects())
const [campaigns, setCampaigns] = useState<Campaign[]>(() => loadCampaigns())
const [currentProjectId, setCurrentProjectId] = useState<string>(() => loadCurrentProjectId())
const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)

// Derived state (computed for convenience)
const currentProject = useMemo(() =>
  projects.find(p => p.id === currentProjectId) || null,
  [projects, currentProjectId]
)

const selectedCampaign = useMemo(() =>
  campaigns.find(c => c.id === selectedCampaignId) || null,
  [campaigns, selectedCampaignId]
)

const campaignProjects = useMemo(() =>
  selectedCampaign
    ? projects.filter(p => selectedCampaign.projectIds.includes(p.id))
    : [],
  [projects, selectedCampaign]
)
```

### Campaign CRUD Operations (New Hook Pattern)

Following the `useCustomTechniques` pattern:

```typescript
// src/hooks/useCampaigns.ts
export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(...)

  const addCampaign = (name: string, description?: string): string => {
    const id = `campaign-${Date.now()}`
    const newCampaign: Campaign = {
      id,
      name,
      description,
      projectIds: [],
      createdAt: new Date().toISOString()
    }
    setCampaigns(prev => [...prev, newCampaign])
    saveCampaigns([...campaigns, newCampaign])
    return id
  }

  const updateCampaign = (id: string, updates: Partial<Campaign>) => { ... }
  const deleteCampaign = (id: string) => { ... }
  const addProjectToCampaign = (campaignId: string, projectId: string) => { ... }
  const removeProjectFromCampaign = (campaignId: string, projectId: string) => { ... }

  return { campaigns, addCampaign, updateCampaign, deleteCampaign, addProjectToCampaign, removeProjectFromCampaign }
}
```

## Patterns to Follow

### Pattern 1: Hook-Based CRUD (from useCustomTechniques)

**What:** Centralize entity CRUD operations in custom hooks with LocalStorage persistence

**When:** Creating new entities (Campaign, Project list management)

**Example:**

```typescript
// src/hooks/useCampaigns.ts
export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => loadCampaigns())
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('phishmonger-campaigns')
    if (stored) {
      setCampaigns(JSON.parse(stored))
    }
    setIsLoaded(true)
  }, [])

  const saveToStorage = useCallback((data: Campaign[]) => {
    localStorage.setItem('phishmonger-campaigns', JSON.stringify(data))
  }, [])

  const addCampaign = useCallback((name: string, description?: string): string => {
    const id = `campaign-${Date.now()}`
    const newCampaign: Campaign = {
      id, name, description, projectIds: [], createdAt: new Date().toISOString()
    }
    const updated = [...campaigns, newCampaign]
    setCampaigns(updated)
    saveToStorage(updated)
    return id
  }, [campaigns, saveToStorage])

  // ... other CRUD operations

  return { campaigns, isLoaded, addCampaign, updateCampaign, deleteCampaign }
}
```

**Why this pattern:**
- Consistent with existing codebase (useCustomTechniques)
- Encapsulates persistence logic
- Easy to test (mockable hooks)
- Prevents race conditions with useCallback dependencies

### Pattern 2: Derived State with useMemo

**What:** Compute filtered/transformed data using `useMemo` to prevent recalculation

**When:** Filtering projects by campaign, computing campaign statistics

**Example:**

```typescript
const campaignProjects = useMemo(() =>
  selectedCampaign
    ? projects.filter(p => selectedCampaign.projectIds.includes(p.id))
    : [],
  [projects, selectedCampaign]
)

const campaignStats = useMemo(() =>
  campaignProjects.reduce((acc, p) => ({
    totalPhish: acc.totalPhish + 1,
    avgDifficulty: acc.avgDifficulty + (p.scoring.visualCues + p.scoring.languageCues) / 2
  }), { totalPhish: 0, avgDifficulty: 0 }),
  [campaignProjects]
)
```

### Pattern 3: Modal Overlays for Settings (from TechniqueLibrary)

**What:** Use modal overlays for complex forms/settings instead of inline panels

**When:** CampaignSettings, CampaignEditor

**Example:**

```typescript
{showCampaignSettings && selectedCampaign && (
  <CampaignSettings
    campaign={selectedCampaign}
    availableProjects={projects}
    onClose={() => setShowCampaignSettings(false)}
    onUpdate={handleUpdateCampaign}
  />
)}
```

**Why this pattern:**
- Consistent UX with existing modals (TechniqueLibrary, KeyboardShortcutHelp)
- Focus management handled by parent (easy to implement with `onClose`)
- Visual hierarchy: settings overlay → dismiss to return to main view

### Pattern 4: Component Props Interface Pattern

**What:** Define explicit Props interfaces for all components

**When:** Creating new components

**Example:**

```typescript
interface CampaignManagerProps {
  campaigns: Campaign[]
  selectedCampaignId: string | null
  onCampaignSelect: (id: string) => void
  onCampaignCreate: () => void
  onCampaignDelete: (id: string) => void
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({
  campaigns,
  selectedCampaignId,
  onCampaignSelect,
  onCampaignCreate,
  onCampaignDelete
}) => { ... }
```

**Why this pattern:**
- Type safety prevents prop mismatches
- Self-documenting component contracts
- Easy to refactor (IDE tracks all usages)

### Pattern 5: Data Loading on Mount with useEffect

**What:** Load data from LocalStorage in useEffect on component mount

**When:** Initializing state from persistence

**Example:**

```typescript
const [projects, setProjects] = useState<Project[]>([])

useEffect(() => {
  const stored = localStorage.getItem('phishmonger-projects')
  if (stored) {
    try {
      setProjects(JSON.parse(stored))
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }
}, [])
```

**Why this pattern:**
- Consistent with existing code (App.tsx, useCustomTechniques)
- Handles LocalStorage errors gracefully
- Idempotent (safe to re-run)

## Anti-Patterns to Avoid

### Anti-Pattern 1: Prop Drilling Campaign/Project State

**What:** Passing `campaigns` and `projects` through multiple component layers

**Why bad:** Creates tight coupling, makes refactoring difficult

**Instead:** Use custom hooks to access data directly from LocalStorage, or lift state to App.tsx and pass via React Context (if depth > 3 levels)

**Example of anti-pattern:**

```typescript
// BAD: Prop drilling through 4 layers
<App>
  <CampaignManager campaigns={campaigns} onCampaignSelect={...} />
    <CalendarView campaigns={campaigns} onCampaignSelect={...} />
      <DetailCarousel campaigns={campaigns} projects={projects} />
        <ProjectCard campaigns={campaigns} projects={projects} />
```

**Better approach:**

```typescript
// GOOD: Hook-based data access
const { campaigns, selectCampaign } = useCampaigns()
const { projects } = useProjects()

// Or: Context for deeply nested components
<CampaignContext.Provider value={{ campaigns, selectCampaign }}>
  <App />
</CampaignContext.Provider>
```

### Anti-Pattern 2: Storing Derived Data in LocalStorage

**What:** Saving filtered lists or computed stats to LocalStorage

**Why bad:** Data becomes stale when source changes, wastes storage space

**Instead:** Compute derived data on-the-fly with `useMemo`

**Example of anti-pattern:**

```typescript
// BAD: Storing filtered list
localStorage.setItem('phishmonger-campaign-projects', JSON.stringify(campaignProjects))
```

**Better approach:**

```typescript
// GOOD: Compute when needed
const campaignProjects = useMemo(() =>
  projects.filter(p => selectedCampaign.projectIds.includes(p.id)),
  [projects, selectedCampaign]
)
```

### Anti-Pattern 3: Tight Coupling Between Editor and Campaign Views

**What:** Editor components directly accessing campaign state

**Why bad:** Breaks single responsibility, makes Editor unusable outside campaign context

**Instead:** Keep Editor stateless, pass all data via props

**Example of anti-pattern:**

```typescript
// BAD: Editor directly reads campaign state
const Editor = () => {
  const campaigns = loadCampaigns() // Tight coupling
  return ...
}
```

**Better approach:**

```typescript
// GOOD: Editor receives data via props
interface EditorProps {
  project: Project
  onUpdate: (updates: Partial<Project>) => void
  campaignContext?: { name: string; scheduledDate?: string } // Optional context display
}

const Editor: React.FC<EditorProps> = ({ project, onUpdate, campaignContext }) => { ... }
```

### Anti-Pattern 4: Inverse Many-to-Many Synchronization

**What:** Storing `campaign.projectIds` but not updating `project.campaignIds` (or vice versa)

**Why bad:** Relationships become inconsistent, filtering breaks

**Instead:** Always update both sides of relationship atomically

**Example of anti-pattern:**

```typescript
// BAD: Only updates campaign side
const addProjectToCampaign = (campaignId: string, projectId: string) => {
  const campaign = campaigns.find(c => c.id === campaignId)
  campaign.projectIds.push(projectId)
  saveCampaigns(campaigns)
  // Oops! project.campaignIds not updated
}
```

**Better approach:**

```typescript
// GOOD: Updates both sides atomically
const addProjectToCampaign = (campaignId: string, projectId: string) => {
  const updatedCampaigns = campaigns.map(c =>
    c.id === campaignId
      ? { ...c, projectIds: [...c.projectIds, projectId] }
      : c
  )

  const updatedProjects = projects.map(p =>
    p.id === projectId
      ? { ...p, metadata: { ...p.metadata, campaignIds: [...(p.metadata.campaignIds || []), campaignId] } }
      : p
  )

  setCampaigns(updatedCampaigns)
  setProjects(updatedProjects)
  saveCampaigns(updatedCampaigns)
  saveProjects(updatedProjects)
}
```

### Anti-Pattern 5: Ignoring Migration Edge Cases

**What:** Assuming v1.1 LocalStorage always has valid data

**Why bad:** Migration crashes on corrupted/missing data, user loses work

**Instead:** Defensive parsing with fallbacks, validate before migration

**Example of anti-pattern:**

```typescript
// BAD: No error handling
const legacyMetadata = JSON.parse(localStorage.getItem('phishmonger-metadata')!)
```

**Better approach:**

```typescript
// GOOD: Defensive parsing with fallback
const migrateToCampaignSupport = () => {
  try {
    const metadataStr = localStorage.getItem('phishmonger-metadata')
    if (!metadataStr) return // Nothing to migrate

    const metadata = JSON.parse(metadataStr)
    if (!metadata.title || !metadata.createdAt) {
      console.warn('Invalid metadata format, skipping migration')
      return
    }

    // Proceed with migration...
  } catch (error) {
    console.error('Migration failed:', error)
    // Keep legacy data intact for manual recovery
  }
}
```

## JSON Export/Import Changes

### Single Project Export (existing, unchanged)

```typescript
// Current format (v1.1)
{
  "metadata": { "title": "...", "author": "...", "createdAt": "..." },
  "htmlSource": "...",
  "annotations": { ... },
  "scoring": { ... },
  "inputMode": "html",
  "customTechniques": { ... }
}
```

### Campaign Export (NEW)

```typescript
// New format (v1.2) - Array of projects with campaign metadata
{
  "format": "phishmonger-campaign",
  "version": "1.2",
  "campaign": {
    "id": "campaign-123",
    "name": "Q1 2026 Phishing Campaign",
    "description": "Monthly phishing exercises",
    "createdAt": "2026-01-22T10:00:00Z"
  },
  "projects": [
    {
      "id": "project-456",
      "metadata": {
        "title": "CEO Fraud Email",
        "author": "Security Team",
        "createdAt": "2026-01-15T09:00:00Z",
        "scheduledDate": "2026-02-01", // NEW: Campaign scheduling
        "campaignIds": ["campaign-123"]
      },
      "htmlSource": "...",
      "annotations": { ... },
      "scoring": { ... },
      "inputMode": "html",
      "customTechniques": { ... }
    },
    // ... more projects
  ]
}
```

### Import Handling

**Single project import (existing):**
- Merge project into `phishmonger-projects` array
- Generate new ID if conflict
- Merge custom techniques using existing `mergeCustomTechniques()` logic

**Campaign import (NEW):**
- Validate campaign structure (format, version, campaign metadata)
- Merge all projects into `phishmonger-projects` array
- Create campaign record in `phishmonger-campaigns`
- Re-map project IDs to campaign's `projectIds` array
- Merge custom techniques across all projects
- Handle ID collisions (append timestamp if conflict)

**Import validation:**

```typescript
function importCampaignJSON(jsonString: string): CampaignImport {
  const parsed = JSON.parse(jsonString)

  // Validate format
  if (parsed.format !== 'phishmonger-campaign') {
    throw new Error('Invalid campaign format')
  }

  if (!parsed.campaign || !Array.isArray(parsed.projects)) {
    throw new Error('Invalid campaign structure')
  }

  // Validate each project
  parsed.projects.forEach(project => {
    if (!project.metadata?.title || !project.htmlSource) {
      throw new Error('Invalid project in campaign')
    }
  })

  return parsed
}
```

## iCal Export Integration

### Library Choice: [adamgibbons/ics](https://github.com/adamgibbons/ics)

**Why this library:**
- Pure JavaScript (works in browser after build)
- Simple API for event generation
- RFC 5545 compliant (standard iCalendar format)
- Lightweight (~15KB minified)
- TypeScript support (via `@types/ics`)

**Alternative:** [ical-generator](https://www.jsdelivr.com/package/npm/ical-generator) (more features, but larger bundle size)

### Implementation Pattern

```typescript
// src/utils/exportIcal.ts
import { createEvents } from 'ics'

interface CampaignEvent {
  projectTitle: string
  scheduledDate: string // ISO date string (YYYY-MM-DD)
  campaignName: string
  description?: string
}

export function exportCampaignToIcal(
  campaign: Campaign,
  projects: Project[]
): string {
  const events = campaign.projectIds.map(projectId => {
    const project = projects.find(p => p.id === projectId)
    if (!project || !project.metadata.scheduledDate) return null

    const date = new Date(project.metadata.scheduledDate)

    return {
      start: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
      end: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
      title: project.metadata.title,
      description: `Campaign: ${campaign.name}\n${project.metadata.title}`,
      location: 'Phishing Training',
      status: 'CONFIRMED',
      busyStatus: 'BUSY'
    }
  }).filter(Boolean)

  const { error, value } = createEvents(events)

  if (error) {
    throw new Error(`iCal generation failed: ${error}`)
  }

  return value // iCal string
}

export function downloadIcal(icalString: string, filename: string) {
  const blob = new Blob([icalString], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
```

**Usage in CampaignManager:**

```typescript
const handleExportIcal = () => {
  try {
    const icalString = exportCampaignToIcal(selectedCampaign, projects)
    downloadIcal(selectedCampaign.name.replace(/[^a-z0-9]/gi, '-'), 'campaign')
  } catch (error) {
    console.error('Failed to export iCal:', error)
    // Show error toast
  }
}
```

## Scalability Considerations

### At 10 Projects (Current Use Case)

**Approach:** Store all projects in single LocalStorage key
**LocalStorage size:** ~5MB (10 projects × ~500KB each with HTML/annotations)
**Performance:** Instant load, no pagination needed

### At 100 Projects (Power User)

**Concerns:**
- LocalStorage size: ~50MB (approaching 50-100MB browser limit)
- Load time: Parsing 100 projects from JSON takes ~1-2 seconds
- Search/filter: O(n) array scans acceptable for 100 items

**Mitigations:**
- Add pagination to CampaignManager (show 20 campaigns per page)
- Add project search/filter input (debounced)
- Consider lazy loading project HTML/annotations (load metadata only initially)

### At 1,000 Projects (Enterprise)

**Concerns:**
- LocalStorage size: ~500MB (exceeds browser limits)
- Load time: ~10-20 seconds for full load
- Memory usage: All projects in memory = high heap pressure

**Approach:** This is beyond LocalStorage capabilities, requires backend

**Solution:** Defer to v2.0 with backend API
- IndexDB for client-side storage (larger limits, async API)
- Or server-side storage with pagination
- Campaign-level lazy loading (only load projects when campaign selected)

**Current recommendation:** Design v1.2 for ≤100 projects, document limits in UI

## Integration Points with Existing Components

### 1. ProjectSettings Integration

**Current:** Single project metadata editor (title, author, dates)

**v1.2 changes:** Add campaign selector dropdown

```typescript
interface ProjectSettingsProps {
  metadata: ProjectMetadata
  onUpdate: (metadata: ProjectMetadata) => void
  // ... existing props
  campaigns?: Campaign[]              // NEW
  projectCampaigns?: Campaign[]       // NEW (filtered list)
  onCampaignToggle?: (campaignId: string) => void // NEW
}

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  metadata,
  onUpdate,
  campaigns = [],
  projectCampaigns = [],
  onCampaignToggle,
  // ... existing props
}) => {
  return (
    <div className="project-settings">
      {/* Existing fields */}
      <input value={metadata.title} onChange={...} />
      <input value={metadata.author} onChange={...} />

      {/* NEW: Campaign selector */}
      <div className="campaign-selector">
        <label>Assign to Campaigns</label>
        <select multiple value={metadata.campaignIds || []} onChange={...}>
          {campaigns.map(campaign => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>
      </div>

      {/* NEW: Scheduled date picker */}
      <div className="scheduled-date">
        <label>Scheduled Date</label>
        <input
          type="date"
          value={metadata.scheduledDate || ''}
          onChange={(e) => onUpdate({ ...metadata, scheduledDate: e.target.value })}
        />
      </div>
    </div>
  )
}
```

### 2. ExportButton Integration

**Current:** Exports single project as JSON

**v1.2 changes:** Add campaign export option when in campaign context

```typescript
interface ExportButtonProps {
  slideWrapperRef: RefObject<HTMLDivElement>
  projectTitle: string
  // ... existing props
  campaign?: Campaign           // NEW
  projects?: Project[]          // NEW
  exportMode?: 'project' | 'campaign' // NEW
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  slideWrapperRef,
  projectTitle,
  campaign,
  projects = [],
  exportMode = 'project',
  // ... existing props
}) => {
  const handleExportProject = () => {
    // Existing single project export
  }

  const handleExportCampaign = () => {
    if (!campaign) return
    const campaignProjects = projects.filter(p => campaign.projectIds.includes(p.id))
    const jsonString = exportCampaignJSON(campaign, campaignProjects)
    downloadCampaignJSON(jsonString, campaign.name)
  }

  return (
    <div className="export-button-group">
      <button onClick={handleExportProject}>Export Project</button>
      {exportMode === 'campaign' && campaign && (
        <>
          <button onClick={handleExportCampaign}>Export Campaign JSON</button>
          <button onClick={handleExportIcal}>Export iCal</button>
        </>
      )}
    </div>
  )
}
```

### 3. Editor Component Reuse

**Current:** Editor loads single project from App state

**v1.2 changes:** Support read-only mode for DetailCarousel browsing

```typescript
interface EditorProps {
  project: Project
  onUpdate?: (updates: Partial<Project>) => void
  readOnly?: boolean // NEW
}

export const Editor: React.FC<EditorProps> = ({
  project,
  onUpdate,
  readOnly = false // NEW: Disable editing in carousel view
}) => {
  return (
    <div className={`editor ${readOnly ? 'read-only' : ''}`}>
      {/* Existing editor UI */}
      {readOnly ? (
        <div className="read-only-banner">View Mode - Edit in Project Settings</div>
      ) : (
        <button onClick={...}>Save Changes</button>
      )}
    </div>
  )
}
```

## Suggested Build Order

### Phase 1: Data Model & Storage Foundation (1-2 days)

**Goal:** Establish campaign/project persistence without UI

1. **Type definitions** (`src/types/campaign.ts`)
   - Define `Campaign` interface
   - Extend `Project` with `id`, `scheduledDate`, `campaignIds`
   - Export/import types for campaign JSON

2. **Storage utilities** (`src/utils/storage.ts`)
   - Add `loadCampaigns()`, `saveCampaigns()`
   - Add `loadProjects()`, `saveProjects()`
   - Implement migration function (`migrateToCampaignSupport()`)
   - Add campaign JSON export/import (`exportCampaignJSON()`, `importCampaignJSON()`)

3. **Custom hook** (`src/hooks/useCampaigns.ts`)
   - Implement CRUD operations (add, update, delete)
   - Relationship management (addProjectToCampaign, removeProjectFromCampaign)
   - LocalStorage persistence wrapper

**Verification:** Unit tests for CRUD operations, migration script handles v1.1 data

### Phase 2: Campaign Manager UI (2-3 days)

**Goal:** Create campaign list and CRUD interface

1. **CampaignManager component** (`src/components/campaign/CampaignManager.tsx`)
   - List all campaigns (table or card layout)
   - Create new campaign button
   - Edit/delete campaign actions
   - Select campaign action

2. **CampaignSettings modal** (`src/components/campaign/CampaignSettings.tsx`)
   - Campaign metadata form (name, description)
   - Project assignment (multi-select dropdown)
   - Scheduled date picker per project
   - Save/cancel actions

3. **App.tsx integration**
   - Add `appMode` state ('project' | 'campaign')
   - Add navigation between project editor and campaign manager
   - Integrate `useCampaigns` hook
   - Trigger migration on mount

**Verification:** Can create campaign, assign projects, set dates, persist across reload

### Phase 3: Calendar View (2-3 days)

**Goal:** Visual calendar showing campaign schedule

1. **CalendarView component** (`src/components/campaign/CalendarView.tsx`)
   - Monthly calendar grid (use lightweight library or build custom)
   - Show campaigns on scheduled dates (dots or badges)
   - Month navigation (prev/next)
   - Click campaign → open DetailCarousel

2. **Date utilities** (`src/utils/dates.ts`)
   - Parse ISO dates for calendar display
   - Get start/end of month
   - Format dates for display

**Verification:** Calendar displays campaigns, click navigates to detail view

### Phase 4: Detail Carousel (2-3 days)

**Goal:** Browse projects within campaign in read-only mode

1. **DetailCarousel component** (`src/components/campaign/DetailCarousel.tsx`)
   - Display selected project (reuse Editor component in read-only mode)
   - Prev/next navigation through `campaign.projectIds`
   - Campaign context header (name, scheduled date)
   - "Edit in Project Mode" button (switches to Editor)

2. **Editor component modification**
   - Add `readOnly` prop
   - Disable editing controls in read-only mode
   - Show "View Only" banner

**Verification:** Can navigate projects, read-only view works, edit button switches modes

### Phase 5: Export Features (1-2 days)

**Goal:** Campaign JSON export and iCal generation

1. **Campaign export** (`src/utils/export.ts`)
   - Implement `exportCampaignJSON()` (array of projects + campaign metadata)
   - Implement `downloadCampaignJSON()` (file download)

2. **iCal export** (`src/utils/exportIcal.ts`)
   - Install `ics` library and types
   - Implement `exportCampaignToIcal()`
   - Implement `downloadIcal()`

3. **UI integration**
   - Add "Export Campaign JSON" button to CampaignManager
   - Add "Export iCal" button to CampaignManager
   - Update ExportButton to support campaign context

**Verification:** Exported JSON imports correctly, iCal file opens in Outlook/Google Calendar

### Phase 6: Polish & Testing (1-2 days)

**Goal:** Edge cases, error handling, UX refinement

1. **Error handling**
   - Migration failures (corrupted LocalStorage)
   - Import validation errors
   - iCal generation failures

2. **Edge cases**
   - Empty campaigns (no projects)
   - Projects without scheduled dates
   - Orphaned project IDs (deleted projects still in campaign.projectIds)
   - ID collisions during import

3. **UX polish**
   - Loading states (initial load, migration)
   - Empty states (no campaigns, no projects)
   - Confirmation dialogs (delete campaign, remove project)
   - Keyboard shortcuts (ESC to close modals, arrow keys in carousel)

**Verification:** No crashes on corrupted data, smooth UX flows, keyboard navigation works

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                              BROWSER                                    │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                         React App (App.tsx)                      │  │
│  │                                                                  │  │
│  │  ┌───────────────────────────────────────────────────────────┐  │  │
│  │  │  App Mode State ('project' | 'campaign')                  │  │  │
│  │  └───────────────────────────────────────────────────────────┘  │  │
│  │                         │                                        │  │
│  │          ┌──────────────┴──────────────┐                        │  │
│  │          ▼                             ▼                        │  │
│  │  ┌──────────────────┐        ┌────────────────────┐            │  │
│  │  │  Project Mode    │        │  Campaign Mode     │            │  │
│  │  │  (existing)      │        │  (new)             │            │  │
│  │  │                  │        │                    │            │  │
│  │  │  ┌────────────┐  │        │  ┌──────────────┐ │            │  │
│  │  │  │ Editor     │  │        │  │CampaignMgr   │ │            │  │
│  │  │  │ Preview    │  │        │  │CalendarView  │ │            │  │
│  │  │  │ LureList   │  │        │  │DetailCarousel│ │            │  │
│  │  │  └────────────┘  │        │  └──────────────┘ │            │  │
│  │  └──────────────────┘        └────────────────────┘            │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                          │                                            │
│  ┌───────────────────────┴───────────────────────────────────────┐    │
│  │                    Custom Hooks Layer                          │    │
│  │                                                                  │    │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐│    │
│  │  │ useProjects      │  │ useCampaigns     │  │useCustomTech ││    │
│  │  │ (new)            │  │ (new)            │  │ (existing)   ││    │
│  │  └──────────────────┘  └──────────────────┘  └──────────────┘│    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                          │                                            │
│  ┌───────────────────────┴───────────────────────────────────────┐    │
│  │                    Storage Utilities                           │    │
│  │                                                                  │    │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐│    │
│  │  │loadProjects()    │  │loadCampaigns()   │  │loadAnnot.()  ││    │
│  │  │saveProjects()    │  │saveCampaigns()   │  │saveAnnot.()  ││    │
│  │  │migrateToV12()    │  │exportCampaign()  │  │ (existing)   ││    │
│  │  └──────────────────┘  └──────────────────┘  └──────────────┘│    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                          │                                            │
│  ┌───────────────────────┴───────────────────────────────────────┐    │
│  │                    LocalStorage                                │    │
│  │                                                                  │    │
│  │  phishmonger-projects    [Project array]                        │    │
│  │  phishmonger-campaigns   [Campaign array]                       │    │
│  │  phishmonger-annotations {Record<string, Annotation>}           │    │
│  │  phishmonger-custom-techniques {Record<string, CustomTech>}    │    │
│  │  phishmonger-view-mode   'project' | 'campaign'                │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

## Sources

### High Confidence (Official Documentation)

- [React Design Patterns 2026](https://trio.dev/essential-react-design-patterns/) - React Context and Provider patterns for state management
- [React State Management 2025](https://www.developerway.com/posts/react-state-management-2025) - Modern patterns for local vs shared state
- [Modern Guide to React State Patterns](https://blog.logrocket.com/modern-guide-react-state-patterns/) - Built-in hooks and third-party libraries
- [Form State Management in React](https://hazalrukenbudak.medium.com/form-state-management-in-react-patterns-trade-offs-and-best-practices-0decd425e30a) - State, validation, and side effects

### Medium Confidence (WebSearch + Verification)

- [Best React Scheduler Component Libraries](https://blog.logrocket.com/best-react-scheduler-component-libraries/) - FullCalendar as lightweight option
- [adamgibbons/ics - GitHub](https://github.com/adamgibbons/ics) - iCalendar file generator for Node.js/Browser
- [ical-generator CDN](https://www.jsdelivr.com/package/npm/ical-generator) - Alternative iCal library
- [Stack Overflow: JS library for iCal format](https://stackoverflow.com/questions/6619032/javascript-library-to-generate-ical-format) - Community discussion on iCal generation

### Low Confidence (WebSearch Only - Needs Verification)

- Various React UI library comparison articles (2026-focused) - Mention lightweight calendar components but don't provide specific recommendations for LocalStorage-based apps
- React state management patterns articles (general, not campaign-specific) - Provide high-level patterns but don't address many-to-many relationship handling

### Internal Sources (Codebase Analysis)

- `/Users/zach/localcode/phishmonger/src/App.tsx` - Existing state management patterns, single-project architecture
- `/Users/zach/localcode/phishmonger/src/utils/storage.ts` - Current LocalStorage schema, JSON export/import patterns
- `/Users/zach/localcode/phishmonger/src/hooks/useCustomTechniques.ts` - CRUD hook pattern to follow
- `/Users/zach/localcode/phishmonger/src/types/project.ts` - Project metadata structure to extend
- `/Users/zach/localcode/phishmonger/.planning/milestones/v1.1-REQUIREMENTS.md` - Existing feature set (v1.1 complete)
- `/Users/zach/localcode/phishmonger/.planning/PROJECT.md` - v1.2 campaign management requirements

### Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Data model design | HIGH | Based on existing codebase patterns, verified with storage.ts |
| LocalStorage schema | HIGH | Direct extension of current schema, migration strategy explicit |
| Component architecture | HIGH | Follows existing UI patterns (modals, hooks) from codebase |
| State management patterns | MEDIUM | General React patterns from 2025/2026 sources, needs prototype testing |
| iCal library choice | MEDIUM | Based on GitHub popularity, needs integration testing |
| Calendar UI library | LOW | WebSearch results inconclusive, recommend building custom simple calendar |
| Many-to-many synchronization | HIGH | Explicit anti-patterns documented, atomic updates specified |

### Gaps to Address

1. **Calendar UI library**: WebSearch didn't find definitive lightweight calendar for LocalStorage apps. **Recommendation:** Build simple custom calendar grid (7×5 grid) using CSS grid, avoid heavy dependencies like FullCalendar.

2. **Many-to-many state patterns**: General React state articles don't cover campaign-specific relationship management. **Recommendation:** Follow explicit CRUD hook pattern from `useCustomTechniques`, test synchronization edge cases during Phase 1.

3. **Large-scale performance**: Articles discuss general scalability but not LocalStorage-specific limits for campaign data. **Recommendation:** Document 100-project limit in UI, defer to v2.0 backend for enterprise scale.

4. **iCal library browser compatibility**: Library docs show Node.js usage, need browser build verification. **Recommendation:** Test `ics` library with Vite bundler in Phase 5, fallback to manual iCal string generation if build fails.
