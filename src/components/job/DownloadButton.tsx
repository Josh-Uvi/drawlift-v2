import Button from '@/components/shared/Button';
import { getJobDownloadUrl } from '@/lib/api';

interface DownloadButtonProps {
  jobId: string;
  isReady: boolean;
  is3D?: boolean;
  outputFormat?: 'dxf' | 'dwg' | 'both';
}

export default function DownloadButton({
  jobId,
  isReady,
  is3D = false,
  outputFormat = 'dxf',
}: DownloadButtonProps) {
  if (!isReady) {
    return null;
  }

  return (
    <div className="space-y-2">
      {(outputFormat === 'dxf' || outputFormat === 'both') && (
        <a
          href={getJobDownloadUrl(jobId, 'dxf')}
          download={`drawlift_${jobId}.dxf`}
          className="block"
        >
          <Button variant="outline" className="w-full font-medium">
            <svg
              className="mr-2 h-4 w-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download AutoCAD Drawing (.DXF)
          </Button>
        </a>
      )}
      {(outputFormat === 'dwg' || outputFormat === 'both') && (
        <a
          href={getJobDownloadUrl(jobId, 'dwg')}
          download={`drawlift_${jobId}.dxf`}
          className="block"
        >
          <Button variant="outline" className="w-full font-medium">
            <svg
              className="mr-2 h-4 w-4 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download DWG Compatible CAD File
          </Button>
        </a>
      )}
      {is3D && (
        <a
          href={getJobDownloadUrl(jobId, 'glb')}
          download={`drawlift_${jobId}.glb`}
          className="block"
        >
          <Button variant="outline" className="w-full font-medium border-blue-300 text-blue-700 hover:bg-blue-50">
            <svg
              className="mr-2 h-4 w-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
              />
            </svg>
            Download 3D Extruded BIM Model (.GLB)
          </Button>
        </a>
      )}
    </div>
  );
}
