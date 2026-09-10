import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import OverviewPage from './pages/OverviewPage';
import MapPage from './pages/MapPage';
import ComparePage from './pages/ComparePage';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/map" element={<Navigate to="/" replace />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/compare" element={<ComparePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
