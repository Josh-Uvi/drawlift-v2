import { useState } from 'react';
import { toast } from 'sonner';
import Button from '@/components/shared/Button';
import { deleteJob } from '@/lib/api';
import type { Job } from '@/types/api';

interface JobTableProps {
  jobs: Job[];
  onDeleted: () => void;
  onOpenJob?: (id: string) => void;
}

export default function JobTable({ jobs, onDeleted, onOpenJob }: JobTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (job: Job) => {
    const confirmed = window.confirm(
      `Delete job ${job.id}? This removes the uploaded PDF and generated outputs.`
    );
    if (!confirmed) return;

    setDeletingId(job.id);
    try {
      await deleteJob(job.id);
      toast.success('Job deleted');
      onDeleted();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 text-center text-sm text-gray-500">
        <p className="font-medium text-gray-700">No conversion jobs found</p>
        <p className="mt-1">Upload a PDF blueprint to generate CAD and 3D floor plans.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">File / Job</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Mode</th>
            <th className="px-4 py-3">Format</th>
            <th className="px-4 py-3">Progress</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50/70 transition-colors">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900 truncate max-w-[200px]" title={job.input_file}>
                  {job.input_file}
                </div>
                <div className="text-xs text-gray-400 font-mono">{job.id}</div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600 text-xs">
                {new Date(job.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    job.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : job.status === 'processing'
                      ? 'bg-purple-100 text-purple-800'
                      : job.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {job.status}
                </span>
              </td>
              <td className="px-4 py-3 uppercase text-xs font-semibold text-gray-700">
                {job.config.mode}
              </td>
              <td className="px-4 py-3 uppercase text-xs font-semibold text-gray-700">
                {job.config.output_format}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 font-mono">{job.progress}%</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenJob ? onOpenJob(job.id) : (window.location.hash = `#/jobs/${job.id}`)}
                    className="font-medium text-primary hover:underline text-xs"
                  >
                    Open View
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(job)}
                    disabled={deletingId === job.id}
                    className="text-red-700 hover:bg-red-50 text-xs py-1 px-2 h-auto"
                  >
                    {deletingId === job.id ? 'Deleting…' : 'Delete'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
