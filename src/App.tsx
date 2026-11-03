import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { FeedPage } from './pages/FeedPage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { TilePage } from './pages/TilePage';
import { useServices } from './hooks/useServices';

export default function App() {
  const { services, loading, error, refresh } = useServices();

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="/feed" element={<FeedPage services={services} loading={loading} error={error} onRetry={refresh} />} />
          <Route path="/tile" element={<TilePage services={services} loading={loading} error={error} />} />
          <Route path="/service/:id" element={<ServiceDetailsPage services={services} loading={loading} />} />
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
