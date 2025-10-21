import React, { useRef, useState } from 'react';
import { Button } from '../common/Button';

interface UploadWidgetProps {
  onUpload: (file: File) => void | Promise<void>;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  multiple?: boolean;
  preview?: boolean;
  currentImage?: string;
  className?: string;
}

const UploadWidget: React.FC<UploadWidgetProps> = ({
  onUpload,
  accept = 'image/*',
  maxSize = 5,
  label = 'Upload Image',
  multiple = false,
  preview = true,
  currentImage,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImage || null
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError(null);

    // Create preview
    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Upload file
    try {
      setUploading(true);
      await onUpload(file);
    } catch (err) {
      setError('Failed to upload file');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-48 w-full rounded-lg border border-gray-300 object-cover"
          />
          <div className="absolute right-2 top-2 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClick}
              isLoading={uploading}
            >
              Change
            </Button>
            <Button variant="danger" size="sm" onClick={handleRemove}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-blue-500 hover:bg-blue-50"
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {uploading ? 'Uploading...' : label}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {accept.includes('image') ? 'PNG, JPG, GIF up to' : 'Files up to'}{' '}
            {maxSize}MB
          </p>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default UploadWidget;
