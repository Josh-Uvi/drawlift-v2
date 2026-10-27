import { useCallback, useEffect, useState } from 'react';
import Card from '@/components/shared/Card';
import ProgressTracker from '@/components/job/ProgressTracker';
import PageViewer from '@/components/job/PageViewer';
import Model3DPreview from '@/components/job/Model3DPreview';
import DownloadButton from '@/components/job/DownloadButton';
import RetryButton from '@/components/job/RetryButton';
import { getJob } from '@/lib/api';
import type { Job } from '@/types/api';

interface JobDetailPageProps {
  jobId: string;
  onNavigate: (path: string) => void;
}

export default function JobDetailPage({ jobId, onNavigate }: JobDetailPageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshJob = useCallback(() => {
    getJob(jobId)
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch job:', err);
        setLoading(false);
      });
  }, [jobId]);

  useEffect(() => {
    refreshJob();
  }, [refreshJob]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            ← Back to upload
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => onNavigate('/history')}
            className="text-sm font-medium text-primary hover:underline"
          >
            View history
          </button>
        </div>
        {job && (
          <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
            {job.input_file}
          </span>
        )}
      </div>

      <Card
        title={`Job: ${jobId}`}
        action={
          job?.status === 'completed' ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              ● Ready for Download
            </span>
          ) : undefined
        }
      >
        {loading && !job ? (
          <div className="py-12 text-center text-sm text-gray-600">
            <svg className="animate-spin mx-auto h-8 w-8 text-primary mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Loading job status…
          </div>
        ) : job ? (
          <div className="space-y-6">
            <ProgressTracker
              jobId={jobId}
              initialProgress={job.progress}
              initialStatus={job.status}
              initialStep={job.step}
              onComplete={refreshJob}
            />

            {/* Conversion Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs">
              <div>
                <span className="text-gray-500 block">Conversion Mode:</span>
                <span className="font-semibold uppercase text-gray-800">{job.config.mode}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Target Output:</span>
                <span className="font-semibold uppercase text-gray-800">{job.config.output_format}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Raster DPI:</span>
                <span className="font-semibold text-gray-800">{job.config.dpi} DPI</span>
              </div>
              <div>
                <span className="text-gray-500 block">AI Segmenter:</span>
                <span className="font-semibold text-gray-800 uppercase">{job.config.segmenter}</span>
              </div>
            </div>

            {/* Page Previews */}
            {job.page_count && job.page_count > 0 && (
              <div className="border-t border-gray-100 pt-6">
                <PageViewer jobId={jobId} pageCount={job.page_count} />
              </div>
            )}

            {/* 3D Model Preview */}
            {job.status === 'completed' && job.config?.mode === '3d' && (
              <div className="border-t border-gray-100 pt-6">
                <Model3DPreview jobId={jobId} />
              </div>
            )}

            {/* Failed State */}
            {job.status === 'failed' && (
              <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <div>
                  <h2 className="text-sm font-semibold text-red-900">Conversion failed</h2>
                  <p className="mt-1 text-sm text-red-700">
                    {job.error_msg || 'The worker could not complete this conversion.'}
                  </p>
                </div>
                <RetryButton jobId={jobId} onRetried={refreshJob} />
              </div>
            )}

            {/* Downloads */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Exported CAD & BIM Files</h3>
              <DownloadButton
                jobId={jobId}
                isReady={job.status === 'completed'}
                is3D={job.config?.mode === '3d'}
                outputFormat={job.config?.output_format}
              />
              {job.status !== 'completed' && (
                <p className="text-xs text-gray-500 text-center mt-2 italic">
                  Downloads will activate as soon as the pipeline finishes.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-red-600">
            Job not found.
          </div>
        )}
      </Card>
    </div>
  );
}
