import { useState } from 'react';
import ImageModal from './ImageModal';
import { getPageImageUrl } from '@/lib/api';

interface PageViewerProps {
  jobId: string;
  pageCount: number;
}

export default function PageViewer({ jobId, pageCount }: PageViewerProps) {
  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  if (pageCount === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Blueprint Page Preview</h3>
        <span className="text-xs text-gray-500">{pageCount} {pageCount === 1 ? 'Sheet' : 'Sheets'} Rendered</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-3 pt-1">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => setSelectedPage(pageNum)}
            className="group flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 transition-all hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary text-left bg-white"
            aria-label={`View page ${pageNum}`}
          >
            <div className="relative h-44 w-32 bg-gray-900 overflow-hidden">
              <img
                src={getPageImageUrl(jobId, pageNum)}
                alt={`Page ${pageNum}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-800 text-[11px] font-semibold px-2 py-0.5 rounded shadow transition-opacity">
                  Enlarge
                </span>
              </div>
            </div>
            <div className="border-t border-gray-100 bg-gray-50 px-2.5 py-1.5 text-center text-xs font-medium text-gray-600 group-hover:text-primary">
              Sheet A-{100 + pageNum}
            </div>
          </button>
        ))}
      </div>

      {selectedPage !== null && (
        <ImageModal
          src={getPageImageUrl(jobId, selectedPage)}
          alt={`Page ${selectedPage}`}
          onClose={() => setSelectedPage(null)}
        />
      )}
    </div>
  );
}
