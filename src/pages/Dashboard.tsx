import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fundingRoundApi, startupApi } from '../api/supabaseApi';
import { FundingRound, Startup } from '../lib/supabase';
import { FiFilter, FiDownload, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { exportToPDF } from '../utils/pdfExport';
import { useTheme } from '../context/ThemeContext';

// Filter options
const industries = ['Fintech', 'Healthtech', 'AI', 'SaaS', 'Consumer', 'EdTech', 'CleanTech'];
const roundTypes = ['Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Growth', 'IPO'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [fundingRounds, setFundingRounds] = useState<(FundingRound & { startup?: Startup })[]>([]);
  const [startups, setStartups] = useState<Record<number, Startup>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRounds, setTotalRounds] = useState(0);
  const itemsPerPage = 10;
  const { isDarkMode } = useTheme();
  
  // Filter states
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedRoundTypes, setSelectedRoundTypes] = useState<string[]>([]);
  const [minAmount, setMinAmount] = useState<number | null>(null);
  const [maxAmount, setMaxAmount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch latest funding rounds
        const roundsResponse = await fundingRoundApi.getAll(currentPage, itemsPerPage);
        const rounds = roundsResponse.data;
        setTotalRounds(roundsResponse.total);
        
        // Get unique startup IDs from funding rounds
        const startupIds = [...new Set(rounds.map(round => round.startup_id))];
        
        // Fetch startups by IDs
        const startupsPromises = startupIds.map(id => startupApi.getById(id));
        const startupsData = await Promise.all(startupsPromises);
        
        // Create a lookup map for startups
        const startupMap: Record<number, Startup> = {};
        startupsData.forEach(startup => {
          if (startup) {
            startupMap[startup.id] = startup;
          }
        });
        
        // Combine funding rounds with startup data
        const combinedData = rounds.map(round => ({
          ...round,
          startup: startupMap[round.startup_id]
        }));
        
        setFundingRounds(combinedData);
        setStartups(startupMap);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // In a real app, show error message to user
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentPage]);
  
  // Calculate total pages
  const totalPages = Math.ceil(totalRounds / itemsPerPage);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Filter the funding rounds based on selected filters
  const filteredRounds = fundingRounds.filter(round => {
    const industry = round.startup?.industry;
    const roundType = round.round_type;
    const amount = round.amount;
    
    // Filter by industry if any are selected
    if (selectedIndustries.length > 0 && industry && !selectedIndustries.includes(industry)) {
      return false;
    }
    
    // Filter by round type if any are selected
    if (selectedRoundTypes.length > 0 && !selectedRoundTypes.includes(roundType)) {
      return false;
    }
    
    // Filter by min amount if set
    if (minAmount !== null && amount < minAmount) {
      return false;
    }
    
    // Filter by max amount if set
    if (maxAmount !== null && amount > maxAmount) {
      return false;
    }
    
    return true;
  });
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    } else {
      return `$${amount}`;
    }
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  // Toggle industry selection
  const toggleIndustry = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
    } else {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
  };
  
  // Toggle round type selection
  const toggleRoundType = (roundType: string) => {
    if (selectedRoundTypes.includes(roundType)) {
      setSelectedRoundTypes(selectedRoundTypes.filter(r => r !== roundType));
    } else {
      setSelectedRoundTypes([...selectedRoundTypes, roundType]);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedIndustries([]);
    setSelectedRoundTypes([]);
    setMinAmount(null);
    setMaxAmount(null);
  };
  
  // Export data to PDF
  const exportData = () => {
    exportToPDF(filteredRounds, {
      title: 'Funding Rounds Report',
      subtitle: 'Latest startup funding activity',
      filters: {
        industries: selectedIndustries,
        roundTypes: selectedRoundTypes,
        minAmount,
        maxAmount,
      },
    });
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Funding Rounds</h1>
          <p className="text-gray-600 dark:text-gray-400">Latest startup funding activity</p>
        </div>
        
        <div className="flex mt-4 md:mt-0 space-x-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
          
          <button 
            onClick={exportData}
            className="btn-primary flex items-center"
          >
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white dark:bg-dark-secondary p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-white">Filter Options</h3>
            <button 
              onClick={resetFilters}
              className="text-primary hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm flex items-center"
            >
              <FiRefreshCw className="mr-1" /> Reset
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Industry filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Industry
              </label>
              <div className="flex flex-wrap gap-2">
                {industries.map(industry => (
                  <button
                    key={industry}
                    onClick={() => toggleIndustry(industry)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      selectedIndustries.includes(industry)
                        ? 'bg-primary text-black ring-2 ring-primary ring-opacity-50'
                        : 'bg-gray-100 dark:bg-dark-bg text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Round type filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Round Type
              </label>
              <div className="flex flex-wrap gap-2">
                {roundTypes.map(roundType => (
                  <button
                    key={roundType}
                    onClick={() => toggleRoundType(roundType)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      selectedRoundTypes.includes(roundType)
                        ? 'bg-primary text-black ring-2 ring-primary ring-opacity-50'
                        : 'bg-gray-100 dark:bg-dark-bg text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {roundType}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Amount range filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Amount Range
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min ($)"
                  value={minAmount || ''}
                  onChange={e => setMinAmount(e.target.value ? Number(e.target.value) : null)}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-dark-bg dark:text-white"
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="number"
                  placeholder="Max ($)"
                  value={maxAmount || ''}
                  onChange={e => setMaxAmount(e.target.value ? Number(e.target.value) : null)}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-dark-bg dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="bg-white dark:bg-dark-secondary shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Startup
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Round
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Industry
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Investors
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-secondary divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRounds.length > 0 ? (
                    filteredRounds.map((round) => (
                      <tr key={round.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {round.startup ? (
                            <Link to={`/startup/${round.startup_id}`} className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                                {round.startup.logo ? (
                                  <div 
                                    dangerouslySetInnerHTML={{ __html: round.startup.logo }} 
                                    className="text-gray-700 dark:text-gray-300"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-primary bg-opacity-10 text-primary font-bold text-xl">
                                    {round.startup.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors">
                                  {round.startup.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {round.startup.location}
                                </div>
                              </div>
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">Unknown Startup</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-primary bg-opacity-10 text-primary rounded-full">
                            {round.round_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(round.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(round.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            {round.startup?.industry || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {round.lead_investors && round.lead_investors.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {round.lead_investors.map((investor, idx) => (
                                <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                  {investor}
                                </span>
                              ))}
                            </div>
                          ) : (
                            'Not disclosed'
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                        No funding rounds match your current filters.
                        {selectedIndustries.length > 0 || selectedRoundTypes.length > 0 || minAmount || maxAmount ? (
                          <button 
                            onClick={resetFilters}
                            className="text-primary hover:text-indigo-700 ml-2"
                          >
                            Reset filters
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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

export default Dashboard; 