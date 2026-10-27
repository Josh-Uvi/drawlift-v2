import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import HomePage from '@/pages/HomePage';
import JobDetailPage from '@/pages/JobDetailPage';
import HistoryPage from '@/pages/HistoryPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || window.location.pathname || '/';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine current route
  let pageContent = <HomePage onNavigate={navigate} />;

  if (currentPath === '/history') {
    pageContent = <HistoryPage onNavigate={navigate} />;
  } else if (currentPath.startsWith('/jobs/')) {
    const jobId = currentPath.replace('/jobs/', '');
    pageContent = <JobDetailPage jobId={jobId} onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-transform group-hover:scale-105">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect width="18" height="18" x="3" y="3" rx="2" strokeWidth="2" />
                <path strokeWidth="2" d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-1.5">
                DrawLift
                <span className="rounded bg-blue-100 text-blue-700 px-1.5 py-0.2 text-[10px] font-semibold uppercase tracking-wider">
                  v2.0
                </span>
              </span>
              <p className="text-xs text-gray-500 hidden sm:block">AI Architecture CAD & 3D Floor Plan Converter</p>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                currentPath === '/' || currentPath.startsWith('/jobs/')
                  ? 'text-primary bg-blue-50 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              + Convert PDF
            </button>
            <button
              type="button"
              onClick={() => navigate('/history')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                currentPath === '/history'
                  ? 'text-primary bg-blue-50 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              History
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {pageContent}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DrawLift · Autonomous Architecture Vectorization & 3D BIM Synthesis</span>
          <span>Exports standard AutoCAD DXF, DWG-compatible geometry, and glTF/GLB 3D models</span>
        </div>
      </footer>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}
