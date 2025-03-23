import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from './components/molecules/LoadingScreen/LoadingScreen';
import ToastProvider from './components/molecules/Toast/ToastProvider';
import ConfirmationProvider from './components/molecules/ConfirmationDialog/ConfirmationProvider';
import ErrorBoundary from './components/molecules/ErrorBoundary';
// Import GardenProvider directly - make sure the path is correct
import { GardenProvider } from './contexts/GardenContext';

// Lazy-loaded page components
const HomePage = lazy(() => import('./components/pages/Home'));
const PlantBrowserPage = lazy(() => import('./components/pages/PlantBrowser'));
const GardenUploadPage = lazy(() => import('./components/pages/GardenUpload'));
const GardenEditorPage = lazy(() => import('./components/pages/GardenEditor'));
const GardenScalingPage = lazy(() => import('./components/pages/GardenScaling'));

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <ConfirmationProvider>
          <GardenProvider>
            <Router>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/plants" element={<PlantBrowserPage />} />
                  <Route path="/garden/new" element={<GardenUploadPage />} />
                  <Route path="/garden/:gardenId" element={<GardenEditorPage />} />
                  <Route path="/garden/:gardenId/scale" element={<GardenScalingPage />} />
                  <Route path="/garden" element={<Navigate replace to="/garden/new" />} />
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </Suspense>
            </Router>
          </GardenProvider>
        </ConfirmationProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

// Simple error page for 404 and other routing errors
const ErrorPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
    <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <button 
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
        onClick={() => window.location.href = '/'}
      >
        Return Home
      </button>
    </div>
  </div>
);

export default App;