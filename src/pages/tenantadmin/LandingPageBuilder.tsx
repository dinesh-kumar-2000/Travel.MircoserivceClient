import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import SectionEditor, {
  Section,
} from '../../components/tenantadmin/LandingPageBuilder/SectionEditor';
import SectionPreview from '../../components/tenantadmin/LandingPageBuilder/SectionPreview';

const LandingPageBuilder: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      type: 'hero',
      title: 'Welcome to Your Travel Portal',
      subtitle: 'Discover amazing destinations around the world',
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      buttonText: 'Start Exploring',
      buttonLink: '/search',
      order: 0,
      isActive: true,
    },
  ]);
  const [showPreview, setShowPreview] = useState(false);

  const addSection = (type: Section['type']) => {
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      order: sections.length,
      isActive: true,
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, updatedSection: Section) => {
    setSections(sections.map((s) => (s.id === id ? updatedSection : s)));
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex((s) => s.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[newIndex]] = [
      newSections[newIndex],
      newSections[index],
    ];

    // Update order
    newSections.forEach((s, i) => (s.order = i));
    setSections(newSections);
  };

  const handleSave = async () => {
    try {
      // API call to save landing page
      console.log('Saving landing page:', sections);
      alert('Landing page saved successfully!');
    } catch (error) {
      console.error('Failed to save landing page:', error);
      alert('Failed to save landing page');
    }
  };

  const handlePublish = async () => {
    try {
      // API call to publish landing page
      console.log('Publishing landing page:', sections);
      alert('Landing page published successfully!');
    } catch (error) {
      console.error('Failed to publish landing page:', error);
      alert('Failed to publish landing page');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Landing Page Builder
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Create and customize your tenant's landing page
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button variant="secondary" onClick={handleSave}>
              Save Draft
            </Button>
            <Button onClick={handlePublish}>Publish</Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-100px)]">
        {/* Editor Panel */}
        <div
          className={`${showPreview ? 'w-1/2' : 'w-full'} overflow-y-auto p-6`}
        >
          {/* Add Section */}
          <div className="mb-6 rounded-lg border border-gray-300 bg-white p-4">
            <h2 className="mb-3 text-lg font-semibold">Add New Section</h2>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => addSection('hero')}>
                + Hero
              </Button>
              <Button size="sm" onClick={() => addSection('about')}>
                + About
              </Button>
              <Button size="sm" onClick={() => addSection('services')}>
                + Services
              </Button>
              <Button size="sm" onClick={() => addSection('gallery')}>
                + Gallery
              </Button>
              <Button size="sm" onClick={() => addSection('testimonials')}>
                + Testimonials
              </Button>
              <Button size="sm" onClick={() => addSection('contact')}>
                + Contact
              </Button>
              <Button size="sm" onClick={() => addSection('cta')}>
                + Call to Action
              </Button>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.length > 0 ? (
              sections.map((section, index) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  onChange={(updated) => updateSection(section.id, updated)}
                  onDelete={() => deleteSection(section.id)}
                  onMoveUp={() => moveSection(section.id, 'up')}
                  onMoveDown={() => moveSection(section.id, 'down')}
                  isFirst={index === 0}
                  isLast={index === sections.length - 1}
                />
              ))
            ) : (
              <div className="rounded-lg border border-gray-300 bg-white py-12 text-center">
                <p className="text-gray-600">
                  No sections added yet. Click the buttons above to add
                  sections.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 overflow-hidden border-l border-gray-300">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-white">
              <span className="text-sm font-medium">Preview</span>
              <button
                onClick={() => setShowPreview(false)}
                className="text-white hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="h-[calc(100%-40px)] overflow-y-auto">
              <SectionPreview sections={sections} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPageBuilder;
