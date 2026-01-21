import { useState, useEffect, useMemo } from 'react';
import { Technique } from '../../types/annotations';
import { CustomTechnique, AnyTechnique, isCustomTechnique } from '../../types/library';
import { useCustomTechniques } from '../../hooks/useCustomTechniques';
import { CustomTechniqueEditor } from './CustomTechniqueEditor';

interface TechniqueLibraryProps {
  onClose: () => void;
}

export function TechniqueLibrary({ onClose }: TechniqueLibraryProps) {
  const { getAllTechniques, addCustomTechnique, updateCustomTechnique, deleteCustomTechnique } = useCustomTechniques();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTactic, setFilterTactic] = useState<string>('all');
  const [editingTechnique, setEditingTechnique] = useState<CustomTechnique | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Load built-in techniques (this would be imported from techniques.json)
  const [builtInTechniques, setBuiltInTechniques] = useState<Technique[]>([]);

  useEffect(() => {
    // Import techniques dynamically
    import('../../data/techniques.json').then(module => {
      setBuiltInTechniques(module.default);
    });
  }, []);

  // Get all techniques (built-in + custom)
  const allTechniques = useMemo(() => {
    return getAllTechniques(builtInTechniques);
  }, [getAllTechniques, builtInTechniques]);

  // Get all unique tactics for filter dropdown
  const allTactics = useMemo(() => {
    const tactics = new Set<string>();
    allTechniques.forEach(technique => {
      tactics.add(technique.tactic);
    });
    return Array.from(tactics).sort();
  }, [allTechniques]);

  // Filter techniques based on search and tactic filter
  const filteredTechniques = useMemo(() => {
    let filtered = allTechniques;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(technique =>
        technique.name.toLowerCase().includes(query) ||
        technique.id.toLowerCase().includes(query) ||
        technique.description.toLowerCase().includes(query)
      );
    }

    // Apply tactic filter
    if (filterTactic !== 'all') {
      filtered = filtered.filter(technique => technique.tactic === filterTactic);
    }

    return filtered;
  }, [allTechniques, searchQuery, filterTactic]);

  // Separate custom and built-in techniques for display
  const customTechniques = filteredTechniques.filter(isCustomTechnique);
  const builtInFiltered = filteredTechniques.filter(technique => !isCustomTechnique(technique));

  const handleCreateNew = () => {
    setEditingTechnique(null);
    setShowEditor(true);
  };

  const handleEdit = (technique: AnyTechnique) => {
    if (isCustomTechnique(technique)) {
      setEditingTechnique(technique);
      setShowEditor(true);
    }
  };

  const handleDelete = (technique: AnyTechnique) => {
    if (isCustomTechnique(technique)) {
      if (window.confirm(`Delete custom technique "${technique.name}"? This action cannot be undone.`)) {
        deleteCustomTechnique(technique.id);
      }
    }
  };

  const handleSave = (techniqueData: Omit<CustomTechnique, 'id' | 'isCustom' | 'createdAt'>) => {
    if (editingTechnique) {
      updateCustomTechnique(editingTechnique.id, techniqueData);
    } else {
      addCustomTechnique(techniqueData);
    }
    setShowEditor(false);
    setEditingTechnique(null);
  };

  const handleViewBuiltIn = (technique: AnyTechnique) => {
    if (!isCustomTechnique(technique) && technique.url) {
      window.open(technique.url, '_blank');
    }
  };

  const TechniqueCard = ({ technique, isCustom }: { technique: AnyTechnique; isCustom: boolean }) => (
    <div style={{
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      backgroundColor: 'white',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
            {technique.id} {isCustom && <span style={{ fontSize: '12px', color: '#666' }}>[Custom]</span>}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
            {technique.tactic}
          </div>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>
            {technique.name}
          </div>
          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
            {technique.description}
          </div>
          {isCustomTechnique(technique) && technique.organization && (
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
              Organization: {technique.organization}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
          {isCustom ? (
            <>
              <button
                onClick={() => handleEdit(technique)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  backgroundColor: '#f0f8ff',
                  border: '1px solid #0066cc',
                  borderRadius: '4px',
                  color: '#0066cc',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(technique)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  backgroundColor: '#fff0f0',
                  border: '1px solid #cc0000',
                  borderRadius: '4px',
                  color: '#cc0000',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </>
          ) : (
            technique.url && (
              <button
                onClick={() => handleViewBuiltIn(technique)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #6c757d',
                  borderRadius: '4px',
                  color: '#6c757d',
                  cursor: 'pointer',
                }}
              >
                View
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '1200px',
        height: '90%',
        maxHeight: '800px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e1e5e9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
            Technique Library
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        {/* Filters */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e1e5e9',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Search techniques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ minWidth: '200px' }}>
            <select
              value={filterTactic}
              onChange={(e) => setFilterTactic(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              <option value="all">All Tactics</option>
              {allTactics.map(tactic => (
                <option key={tactic} value={tactic}>{tactic}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreateNew}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Create New Technique
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
        }}>
          {/* Custom Techniques Section */}
          {customTechniques.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#333',
                borderBottom: '2px solid #0066cc',
                paddingBottom: '8px',
              }}>
                Custom Techniques ({customTechniques.length})
              </h3>
              {customTechniques.map(technique => (
                <TechniqueCard
                  key={technique.id}
                  technique={technique}
                  isCustom={true}
                />
              ))}
            </div>
          )}

          {/* Built-in Techniques Section */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#333',
              borderBottom: '2px solid #28a745',
              paddingBottom: '8px',
            }}>
              Built-in Techniques ({builtInFiltered.length})
            </h3>
            {builtInFiltered.length > 0 ? (
              builtInFiltered.map(technique => (
                <TechniqueCard
                  key={technique.id}
                  technique={technique}
                  isCustom={false}
                />
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#666',
                fontSize: '16px',
              }}>
                No built-in techniques match your search criteria.
              </div>
            )}
          </div>

          {/* Empty state when no techniques at all */}
          {filteredTechniques.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#666',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>
                No techniques found
              </div>
              <div style={{ fontSize: '14px' }}>
                Try adjusting your search or filter criteria.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Technique Editor Modal */}
      {showEditor && (
        <CustomTechniqueEditor
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false);
            setEditingTechnique(null);
          }}
          onSave={handleSave}
          editTechnique={editingTechnique || undefined}
          existingIds={Object.keys(customTechniques)}
        />
      )}
    </div>
  );
}