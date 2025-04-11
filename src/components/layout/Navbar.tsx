import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX, FiSun, FiMoon, FiSearch } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode, toggleDarkMode } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className={`${isDarkMode ? 'bg-dark-bg text-dark-text' : 'bg-white text-gray-700'} shadow-md py-4 transition-colors duration-200`}>
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-primary'}`}>StartupRadar</span>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search investors or companies..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-dark-secondary border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </form>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`hover:text-primary transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : ''}`}>
            Dashboard
          </Link>
          <Link to="/investors" className={`hover:text-primary transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : ''}`}>
            Investors
          </Link>
          <Link to="/trends" className={`hover:text-primary transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : ''}`}>
            Trends
          </Link>
          
          {/* Dark mode toggle */}
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-dark-secondary text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            } transition-colors`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu}
            className={`p-2 rounded-md hover:text-primary ${
              isDarkMode ? 'hover:bg-dark-secondary text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            } transition-colors`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={`md:hidden px-4 pt-2 pb-4 space-y-3 ${isDarkMode ? 'bg-dark-bg' : 'bg-white'}`}>
          {/* Search Bar - Mobile */}
          <form onSubmit={handleSearch} className="pb-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search investors or companies..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-dark-secondary border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </form>

          <Link 
            to="/" 
            className={`block py-2 px-4 ${
              isDarkMode ? 'text-gray-300 hover:bg-dark-secondary' : 'text-gray-700 hover:bg-gray-100'
            } rounded transition-colors`}
            onClick={toggleMenu}
          >
            Dashboard
          </Link>
          <Link 
            to="/investors" 
            className={`block py-2 px-4 ${
              isDarkMode ? 'text-gray-300 hover:bg-dark-secondary' : 'text-gray-700 hover:bg-gray-100'
            } rounded transition-colors`}
            onClick={toggleMenu}
          >
            Investors
          </Link>
          <Link 
            to="/trends" 
            className={`block py-2 px-4 ${
              isDarkMode ? 'text-gray-300 hover:bg-dark-secondary' : 'text-gray-700 hover:bg-gray-100'
            } rounded transition-colors`}
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
            className={`flex w-full items-center py-2 px-4 ${
              isDarkMode ? 'text-gray-300 hover:bg-dark-secondary' : 'text-gray-700 hover:bg-gray-100'
            } rounded transition-colors`}
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