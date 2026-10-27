import { useState } from 'react';
import { toast } from 'sonner';
import DropZone from '@/components/upload/DropZone';
import ConversionOptions from '@/components/upload/ConversionOptions';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import { uploadFile } from '@/lib/api';
import { JobConfig } from '@/types/api';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [config, setConfig] = useState<JobConfig>({
    mode: '2d',
    dpi: 300,
    floor_height_m: 3.0,
    slab_thickness_m: 0.2,
    include_ceiling: false,
    output_format: 'dxf',
    segmenter: 'classic',
  });
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    toast.success(`Selected: ${selectedFile.name}`);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select a PDF file first');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadFile(file, config);
      toast.success('Job created! Redirecting...');
      onNavigate(`/jobs/${response.job_id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-2xl mb-3 text-primary">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">AI File Converter</h1>
        <p className="mt-2 text-lg text-gray-600">
          Convert architecture PDFs to DWG/DXF CAD models & 3D floor plans
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/history')}
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          View conversion history →
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Upload PDF">
          <DropZone onFileSelect={handleFileSelect} disabled={uploading} />
          {file && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 border border-gray-200 p-3">
              <div className="flex items-center gap-2 truncate">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="truncate text-sm font-medium text-gray-800">{file.name}</span>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0 font-mono">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}
        </Card>

        <Card title="Conversion Options">
          <ConversionOptions config={config} onChange={setConfig} disabled={uploading} />
          <div className="mt-6">
            <Button
              onClick={handleSubmit}
              disabled={!file || uploading}
              className="w-full shadow-sm"
              size="lg"
            >
              {uploading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Uploading & Initializing…
                </span>
              ) : (
                'Convert to CAD / 3D'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
