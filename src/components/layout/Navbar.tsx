import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiSun, FiMoon, FiSearch } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { investorApi, startupApi } from '../../api/supabaseApi';
import { Investor } from '../../lib/supabase';
import { Startup } from '../../lib/supabase';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{investors: Investor[], startups: Startup[]}>({
    investors: [],
    startups: []
  });
  const [showResults, setShowResults] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  useEffect(() => {
    // Handle clicks outside of search results
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const searchData = async () => {
      if (searchQuery.length < 2) {
        setSearchResults({ investors: [], startups: [] });
        setShowResults(false);
        return;
      }

      try {
        // Fetch investors and startups
        const investorsResponse = await investorApi.getAll();
        const startupsResponse = await startupApi.getAll();

        // Filter based on search query
        const filteredInvestors = investorsResponse.data.filter((investor: Investor) => 
          investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (investor.profile && investor.profile.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        const filteredStartups = startupsResponse.data.filter((startup: Startup) => 
          startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (startup.description && startup.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        setSearchResults({
          investors: filteredInvestors.slice(0, 5), // Limit results to 5
          startups: filteredStartups.slice(0, 5)
        });
        
        setShowResults(true);
      } catch (error) {
        console.error('Error searching data:', error);
      }
    };

    const debounce = setTimeout(() => {
      searchData();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearchItemClick = (type: 'investor' | 'startup', id: number) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(type === 'investor' ? `/investor/${id}` : `/startup/${id}`);
  };

  // Desktop menu links
  const NavLink = ({ to, onClick, children }: { to: string; onClick?: () => void; children: React.ReactNode }) => {
    const { isDarkMode } = useTheme();
    
    return (
      <Link 
        to={to} 
        onClick={onClick}
        className={`hover:text-primary transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : ''}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className={`${isDarkMode ? 'bg-dark-bg text-dark-text' : 'bg-white text-gray-700'} shadow-md py-4 transition-colors duration-200`}>
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-primary'}`}>StartupRadar</span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative" ref={searchRef}>
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

          {/* Search Results Dropdown */}
          {showResults && (searchResults.investors.length > 0 || searchResults.startups.length > 0) && (
            <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden z-50 ${
              isDarkMode ? 'bg-dark-secondary border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              {searchResults.investors.length > 0 && (
                <div>
                  <div className={`px-4 py-2 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Investors
                  </div>
                  {searchResults.investors.map(investor => (
                    <div 
                      key={`investor-${investor.id}`}
                      className={`px-4 py-2 cursor-pointer ${
                        isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-200' 
                          : 'hover:bg-gray-100 text-gray-800'
                      }`}
                      onClick={() => handleSearchItemClick('investor', investor.id)}
                    >
                      <div className="font-medium">{investor.name}</div>
                      <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {investor.profile?.substring(0, 60)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.startups.length > 0 && (
                <div>
                  <div className={`px-4 py-2 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Companies
                  </div>
                  {searchResults.startups.map(startup => (
                    <div 
                      key={`startup-${startup.id}`}
                      className={`px-4 py-2 cursor-pointer ${
                        isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-200' 
                          : 'hover:bg-gray-100 text-gray-800'
                      }`}
                      onClick={() => handleSearchItemClick('startup', startup.id)}
                    >
                      <div className="font-medium">{startup.name}</div>
                      <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {startup.description?.substring(0, 60)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" onClick={toggleMenu}>
            Dashboard
          </NavLink>
          <NavLink to="/investors" onClick={toggleMenu}>
            Investors
          </NavLink>
          <NavLink to="/startups" onClick={toggleMenu}>
            Companies
          </NavLink>
          <NavLink to="/trends" onClick={toggleMenu}>
            Trends
          </NavLink>
          
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
          <div className="pb-2 relative" ref={searchRef}>
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

            {/* Mobile Search Results */}
            {showResults && (searchResults.investors.length > 0 || searchResults.startups.length > 0) && (
              <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden z-50 ${
                isDarkMode ? 'bg-dark-secondary border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                {searchResults.investors.length > 0 && (
                  <div>
                    <div className={`px-4 py-2 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Investors
                    </div>
                    {searchResults.investors.map(investor => (
                      <div 
                        key={`mobile-investor-${investor.id}`}
                        className={`px-4 py-2 cursor-pointer ${
                          isDarkMode 
                            ? 'hover:bg-gray-700 text-gray-200' 
                            : 'hover:bg-gray-100 text-gray-800'
                        }`}
                        onClick={() => {
                          handleSearchItemClick('investor', investor.id);
                          toggleMenu();
                        }}
                      >
                        <div className="font-medium">{investor.name}</div>
                        <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {investor.profile?.substring(0, 60)}...
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.startups.length > 0 && (
                  <div>
                    <div className={`px-4 py-2 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Companies
                    </div>
                    {searchResults.startups.map(startup => (
                      <div 
                        key={`mobile-startup-${startup.id}`}
                        className={`px-4 py-2 cursor-pointer ${
                          isDarkMode 
                            ? 'hover:bg-gray-700 text-gray-200' 
                            : 'hover:bg-gray-100 text-gray-800'
                        }`}
                        onClick={() => {
                          handleSearchItemClick('startup', startup.id);
                          toggleMenu();
                        }}
                      >
                        <div className="font-medium">{startup.name}</div>
                        <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {startup.description?.substring(0, 60)}...
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <NavLink to="/" onClick={toggleMenu}>
            Dashboard
          </NavLink>
          <NavLink to="/investors" onClick={toggleMenu}>
            Investors
          </NavLink>
          <NavLink to="/startups" onClick={toggleMenu}>
            Companies
          </NavLink>
          <NavLink to="/trends" onClick={toggleMenu}>
            Trends
          </NavLink>
          
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