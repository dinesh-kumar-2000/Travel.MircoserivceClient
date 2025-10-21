import React, { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  presetColors?: string[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  presetColors = [
    '#3B82F6',
    '#EF4444',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
    '#84CC16',
    '#F97316',
    '#6366F1',
  ],
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        {/* Color Display */}
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="h-12 w-12 cursor-pointer rounded border-2 border-gray-300 hover:border-blue-500"
          style={{ backgroundColor: value }}
          title="Click to change color"
        />

        {/* Hex Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={7}
        />

        {/* Native Color Picker */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-12 cursor-pointer rounded border-2 border-gray-300"
        />
      </div>

      {/* Preset Colors */}
      {showPicker && (
        <div className="absolute z-10 mt-2 rounded-lg border border-gray-300 bg-white p-3 shadow-lg">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Preset Colors
          </p>
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onChange(color);
                  setShowPicker(false);
                }}
                className="h-8 w-8 cursor-pointer rounded border-2 border-gray-300 hover:border-blue-500"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
