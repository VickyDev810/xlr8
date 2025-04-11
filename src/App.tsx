import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';

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

// AppContent component to use the theme context
const AppContent = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen ${
      isDarkMode 
        ? 'bg-dark-bg text-dark-text' 
        : 'bg-gradient-to-r from-violet-50 via-orange-50 to-transparent'
    }`}>
      <Navbar />
      
      <main className="flex-grow container-custom py-8">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        }>
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
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}

export default App;
