import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '@/components/shared/Card';
import JobTable from '@/components/history/JobTable';
import { listJobs } from '@/lib/api';
import type { Job, JobStatus } from '@/types/api';

const STATUSES: Array<JobStatus | 'all'> = [
  'all',
  'pending',
  'queued',
  'processing',
  'completed',
  'failed',
  'archived',
];

interface HistoryPageProps {
  onNavigate: (path: string) => void;
}

export default function HistoryPage({ onNavigate }: HistoryPageProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<JobStatus | 'all'>('all');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedStatus = useMemo(() => (status === 'all' ? undefined : status), [status]);
  const sortedJobs = useMemo(
    () =>
      [...jobs].sort((a, b) => {
        const left = new Date(a.created_at).getTime();
        const right = new Date(b.created_at).getTime();
        return sortDirection === 'desc' ? right - left : left - right;
      }),
    [jobs, sortDirection]
  );

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listJobs(selectedStatus, 50, 0);
      setJobs(response.jobs);
      setTotal(response.total);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            ← Back to upload
          </button>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Conversion History</h1>
          <p className="mt-1 text-sm text-gray-600">
            Review, reopen, filter, and delete past jobs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            Status:
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as JobStatus | 'all')}
              className="ml-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            >
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value === 'all' ? 'All statuses' : value}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center">
            Sort:
            <select
              value={sortDirection}
              onChange={(event) => setSortDirection(event.target.value as 'desc' | 'asc')}
              className="ml-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </label>
        </div>
      </div>

      <Card title={`Jobs (${total})`}>
        {loading && (
          <div className="py-8 text-center text-sm text-gray-500">
            Loading conversion records…
          </div>
        )}
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {!loading && !error && (
          <JobTable
            jobs={sortedJobs}
            onDeleted={loadJobs}
            onOpenJob={(id) => onNavigate(`/jobs/${id}`)}
          />
        )}
      </Card>
    </div>
  );
}
