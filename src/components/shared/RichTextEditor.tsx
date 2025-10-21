import React, { useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  height = '300px',
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (
    command: string,
    value: string | undefined = undefined
  ) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  return (
    <div className={`rounded-lg border border-gray-300 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-gray-300 bg-gray-50 p-2">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="rounded px-3 py-1 text-sm font-bold hover:bg-gray-200"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="rounded px-3 py-1 text-sm italic hover:bg-gray-200"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="rounded px-3 py-1 text-sm underline hover:bg-gray-200"
          title="Underline"
        >
          U
        </button>
        <div className="mx-1 w-px bg-gray-300" />
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="rounded px-3 py-1 text-sm hover:bg-gray-200"
          title="Align Left"
        >
          ≡
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="rounded px-3 py-1 text-sm hover:bg-gray-200"
          title="Align Center"
        >
          ≡
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="rounded px-3 py-1 text-sm hover:bg-gray-200"
          title="Align Right"
        >
          ≡
        </button>
        <div className="mx-1 w-px bg-gray-300" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="rounded px-3 py-1 text-sm hover:bg-gray-200"
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="rounded px-3 py-1 text-sm hover:bg-gray-200"
          title="Numbered List"
        >
          1.
        </button>
        <div className="mx-1 w-px bg-gray-300" />
        <select
          onChange={(e) => execCommand('formatBlock', e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-200"
          defaultValue=""
        >
          <option value="">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>
        <div className="mx-1 w-px bg-gray-300" />
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) execCommand('createLink', url);
          }}
          className="rounded px-3 py-1 text-sm hover:bg-gray-200"
          title="Insert Link"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          className="rounded px-3 py-1 text-sm hover:bg-gray-200"
          title="Clear Formatting"
        >
          ✕
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="prose max-w-none overflow-y-auto p-4 focus:outline-none"
        style={{ minHeight: height }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
