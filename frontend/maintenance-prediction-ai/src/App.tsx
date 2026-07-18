import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Prediction } from './pages/Prediction/Prediction';
import { History } from './pages/History/History';
import { Analytics } from './pages/Analytics/Analytics';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="predict" element={<Prediction />} />
          <Route path="history" element={<History />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}