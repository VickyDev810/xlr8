import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would apply dark mode to the entire app
    // document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-primary">StartupRadar</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/investors" className="text-gray-700 hover:text-primary transition-colors">
            Investors
          </Link>
          <Link to="/trends" className="text-gray-700 hover:text-primary transition-colors">
            Trends
          </Link>
          
          {/* Dark mode toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-3 bg-white">
          <Link 
            to="/" 
            className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            onClick={toggleMenu}
          >
            Dashboard
          </Link>
          <Link 
            to="/investors" 
            className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            onClick={toggleMenu}
          >
            Investors
          </Link>
          <Link 
            to="/trends" 
            className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            onClick={toggleMenu}
          >
            Trends
          </Link>
          
          {/* Dark mode toggle in mobile menu */}
          <button 
            onClick={() => {
              toggleDarkMode();
              toggleMenu();
            }}
            className="flex w-full items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            {isDarkMode ? (
              <>
                <FiSun size={20} className="mr-2" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <FiMoon size={20} className="mr-2" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 