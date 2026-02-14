import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { Navigation } from './components/UI/Navigation';
import { Dashboard } from './pages/Dashboard';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { EnergySourcesPage } from './pages/EnergySourcesPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AlertsPage } from './pages/AlertsPage';
import { SustainabilityPage } from './pages/SustainabilityPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-dark">
        <Navigation />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/energy" element={<EnergySourcesPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
