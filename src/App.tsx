import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './App.css';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy-loaded page components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const InvestorProfiles = lazy(() => import('./pages/InvestorProfiles'));
const TrendsInsights = lazy(() => import('./pages/TrendsInsights'));
const StartupProfile = lazy(() => import('./pages/StartupProfile'));
const InvestorProfile = lazy(() => import('./pages/InvestorProfile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-violet-50 via-orange-50 to-transparent">
        <Navbar />
        
        <main className="flex-grow container-custom py-8">
          <Suspense fallback={<div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/investors" element={<InvestorProfiles />} />
              <Route path="/trends" element={<TrendsInsights />} />
              <Route path="/startup/:id" element={<StartupProfile />} />
              <Route path="/investor/:id" element={<InvestorProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
