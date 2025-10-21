import React from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import ColorPicker from '../../shared/ColorPicker';
import RichTextEditor from '../../shared/RichTextEditor';
import UploadWidget from '../../shared/UploadWidget';

export interface Section {
  id: string;
  type:
    | 'hero'
    | 'about'
    | 'services'
    | 'gallery'
    | 'testimonials'
    | 'contact'
    | 'cta';
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonLink?: string;
  items?: any[];
  order: number;
  isActive: boolean;
}

interface SectionEditorProps {
  section: Section;
  onChange: (section: Section) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const handleChange = (field: keyof Section, value: any) => {
    onChange({ ...section, [field]: value });
  };

  const handleImageUpload = async (file: File) => {
    // Simulate upload - in real app, upload to server
    const url = URL.createObjectURL(file);
    handleChange('imageUrl', url);
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold capitalize text-gray-900">
            {section.type} Section
          </h3>
          <p className="text-sm text-gray-600">
            Configure this section's content and appearance
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move Up"
          >
            ↑
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onMoveDown}
            disabled={isLast}
            title="Move Down"
          >
            ↓
          </Button>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={section.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
          <Button variant="danger" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Section Content */}
      <div className="space-y-4">
        {/* Title */}
        <Input
          label="Title"
          value={section.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter section title"
        />

        {/* Subtitle */}
        {(section.type === 'hero' ||
          section.type === 'about' ||
          section.type === 'cta') && (
          <Input
            label="Subtitle"
            value={section.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            placeholder="Enter subtitle (optional)"
          />
        )}

        {/* Content */}
        {(section.type === 'about' || section.type === 'cta') && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Content
            </label>
            <RichTextEditor
              value={section.content || ''}
              onChange={(value) => handleChange('content', value)}
              placeholder="Enter section content"
              height="200px"
            />
          </div>
        )}

        {/* Image Upload */}
        {(section.type === 'hero' || section.type === 'about') && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Image
            </label>
            <UploadWidget
              onUpload={handleImageUpload}
              currentImage={section.imageUrl}
              label="Upload Section Image"
            />
          </div>
        )}

        {/* Background Color */}
        <ColorPicker
          label="Background Color"
          value={section.backgroundColor || '#FFFFFF'}
          onChange={(color) => handleChange('backgroundColor', color)}
        />

        {/* Text Color */}
        <ColorPicker
          label="Text Color"
          value={section.textColor || '#000000'}
          onChange={(color) => handleChange('textColor', color)}
        />

        {/* Call to Action Button */}
        {(section.type === 'hero' || section.type === 'cta') && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Button Text"
              value={section.buttonText || ''}
              onChange={(e) => handleChange('buttonText', e.target.value)}
              placeholder="e.g., Book Now"
            />
            <Input
              label="Button Link"
              value={section.buttonLink || ''}
              onChange={(e) => handleChange('buttonLink', e.target.value)}
              placeholder="e.g., /bookings"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionEditor;
