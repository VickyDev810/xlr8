import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { startupApi } from '../api/supabaseApi';
import { Startup } from '../lib/supabase';
import { FiArrowUp, FiArrowDown, FiChevronLeft, FiChevronRight, FiMapPin, FiTag } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useTheme } from '../context/ThemeContext';

const Startups = () => {
  const [loading, setLoading] = useState(true);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [totalStartups, setTotalStartups] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Startup>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const { isDarkMode } = useTheme();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true);
        
        // If industry filter is applied, use the filtered API
        if (selectedIndustry) {
          const response = await startupApi.getByIndustry(selectedIndustry, currentPage, itemsPerPage);
          setStartups(response.data);
          setTotalStartups(response.total);
        } else {
          const response = await startupApi.getAll(currentPage, itemsPerPage);
          setStartups(response.data);
          setTotalStartups(response.total);
        }
      } catch (error) {
        console.error('Failed to fetch startups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [currentPage, selectedIndustry]);

  // Handle sort toggling
  const handleSort = (field: keyof Startup) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle industry filter
  const handleIndustryFilter = (industry: string | null) => {
    setSelectedIndustry(industry);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalStartups / itemsPerPage);

  // Get unique industries from startups
  const industries = [...new Set(startups.map(startup => startup.industry))];

  // Sort startups
  const sortedStartups = [...startups]
    .sort((a, b) => {
      if (sortField === 'name' || sortField === 'industry' || sortField === 'location') {
        const aValue = String(a[sortField]).toLowerCase();
        const bValue = String(b[sortField]).toLowerCase();
        
        if (sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
      
      return 0;
    });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Companies</h1>
          <p className="text-gray-600 dark:text-gray-400">Explore startups across industries</p>
        </div>
        
        {/* Sorting controls */}
        <div className="mt-4 md:mt-0">
          <div className={`flex items-center space-x-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="text-sm">Sort by:</span>
            
            <button
              onClick={() => handleSort('name')}
              className={`text-sm flex items-center space-x-1 ${
                sortField === 'name' 
                  ? 'text-primary font-medium' 
                  : isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <span>Name</span>
              {sortField === 'name' && (
                sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />
              )}
            </button>
            
            <button
              onClick={() => handleSort('industry')}
              className={`text-sm flex items-center space-x-1 ${
                sortField === 'industry' 
                  ? 'text-primary font-medium' 
                  : isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <span>Industry</span>
              {sortField === 'industry' && (
                sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Industry Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleIndustryFilter(null)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              selectedIndustry === null
                ? 'bg-primary text-white'
                : isDarkMode ? 'bg-dark-secondary text-gray-300' : 'bg-gray-100 text-gray-800'
            }`}
          >
            All Industries
          </button>
          
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => handleIndustryFilter(industry)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                selectedIndustry === industry
                  ? 'bg-primary text-white'
                  : isDarkMode ? 'bg-dark-secondary text-gray-300' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedStartups.length > 0 ? (
              sortedStartups.map((startup) => (
                <Link
                  key={startup.id}
                  to={`/startup/${startup.id}`}
                  className={`${isDarkMode ? 'bg-dark-secondary hover:bg-dark-secondary/80' : 'bg-white hover:shadow-lg'} rounded-lg shadow-md overflow-hidden transition-shadow`}
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md overflow-hidden mr-4 flex items-center justify-center">
                        {startup.logo ? (
                          <div 
                            dangerouslySetInnerHTML={{ __html: startup.logo }} 
                            className="text-gray-700 dark:text-gray-300"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary bg-opacity-10 text-primary font-bold text-xl">
                            {startup.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white hover:text-primary' : 'text-gray-800 hover:text-primary'} transition-colors`}>
                          {startup.name}
                        </h3>
                        
                        <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 space-x-2 mt-1">
                          <div className="flex items-center">
                            <FiTag size={12} className="mr-1" />
                            <span>{startup.industry}</span>
                          </div>
                          {startup.location && (
                            <div className="flex items-center">
                              <FiMapPin size={12} className="mr-1" />
                              <span>{startup.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-3`}>
                        {startup.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 py-10 text-center text-gray-500 dark:text-gray-400">
                No startups found.
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : isDarkMode ? 'text-white hover:text-primary' : 'text-gray-700 hover:text-primary'
                  } p-2 rounded-md focus:outline-none`}
                >
                  <FiChevronLeft size={18} />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Calculate page numbers to show (current page in the middle when possible)
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-md focus:outline-none ${
                        pageNum === currentPage
                          ? 'bg-primary text-white'
                          : isDarkMode 
                            ? 'text-gray-300 hover:bg-dark-secondary' 
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : isDarkMode ? 'text-white hover:text-primary' : 'text-gray-700 hover:text-primary'
                  } p-2 rounded-md focus:outline-none`}
                >
                  <FiChevronRight size={18} />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Startups; 