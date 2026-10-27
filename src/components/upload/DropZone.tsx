import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { toast } from 'sonner';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function DropZone({ onFileSelect, disabled = false }: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        toast.error('Only PDF files are accepted');
        return;
      }
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled,
  });

  const handleSelectSample = (sampleName: string) => {
    // Create a mock File object for the sample
    const sampleBlob = new Blob(['%PDF-1.4 Mock architectural blueprint content'], {
      type: 'application/pdf',
    });
    const sampleFile = new File([sampleBlob], sampleName, {
      type: 'application/pdf',
    });
    onFileSelect(sampleFile);
    toast.success(`Loaded sample: ${sampleName}`);
  };

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
          isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        <svg
          className="mb-4 h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {isDragActive ? (
          <p className="text-lg font-medium text-primary">Drop the PDF here...</p>
        ) : (
          <>
            <p className="text-lg font-medium text-gray-700">
              Drag & drop a PDF here, or click to browse
            </p>
            <p className="mt-1 text-sm text-gray-500">Only .pdf files accepted</p>
          </>
        )}
      </div>

      <div className="rounded-lg bg-gray-50 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Or try a sample architectural drawing:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectSample('sample_residential_villa_level_0.pdf');
            }}
            disabled={disabled}
            className="rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
          >
            📋 Villa Ground Floor Plan.pdf
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectSample('sample_commercial_office_level_2.pdf');
            }}
            disabled={disabled}
            className="rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
          >
            🏢 Commercial Office Level 2.pdf
          </button>
        </div>
      </div>
    </div>
  );
}
