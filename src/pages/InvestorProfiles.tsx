import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { investorApi } from '../api/supabaseApi';
import { Investor } from '../lib/supabase';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useTheme } from '../context/ThemeContext';

const InvestorProfiles = () => {
  const [loading, setLoading] = useState(true);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [sortField, setSortField] = useState<keyof Investor>('total_investments');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        setLoading(true);
        const data = await investorApi.getAll();
        setInvestors(data);
      } catch (error) {
        console.error('Failed to fetch investors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  // Handle sort toggling
  const handleSort = (field: keyof Investor) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort investors
  const sortedInvestors = [...investors]
    .sort((a, b) => {
      if (sortField === 'total_investments') {
        return sortDirection === 'asc' 
          ? a.total_investments - b.total_investments
          : b.total_investments - a.total_investments;
      }
      
      // Sort by name as string
      const aValue = String(a[sortField]).toLowerCase();
      const bValue = String(b[sortField]).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
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

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Investor Profiles</h1>
          <p className="text-gray-600 dark:text-gray-400">Explore investment firms and their portfolios</p>
        </div>
        
        {/* Sorting controls moved to top */}
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
              onClick={() => handleSort('total_investments')}
              className={`text-sm flex items-center space-x-1 ${
                sortField === 'total_investments' 
                  ? 'text-primary font-medium' 
                  : isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <span>Total Investment</span>
              {sortField === 'total_investments' && (
                sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />
              )}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedInvestors.length > 0 ? (
            sortedInvestors.map((investor) => (
              <Link
                key={investor.id}
                to={`/investor/${investor.id}`}
                className={`${isDarkMode ? 'bg-dark-secondary hover:bg-dark-secondary/80' : 'bg-white hover:shadow-lg'} rounded-lg shadow-md overflow-hidden transition-shadow`}
              >
                <div className="p-6">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white hover:text-primary' : 'text-gray-800 hover:text-primary'} transition-colors`}>
                    {investor.name}
                  </h3>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Investments</span>
                      <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {formatCurrency(investor.total_investments)}
                      </p>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <span className={`text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded`}>
                        {investor.notable_investments?.length || 0} Notable Investments
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-3`}>
                      {investor.profile || 'No profile information available.'}
                    </p>
                  </div>
                  
                  {investor.notable_investments && investor.notable_investments.length > 0 && (
                    <div className="mt-4">
                      <h4 className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>NOTABLE INVESTMENTS</h4>
                      <div className="flex flex-wrap gap-1">
                        {investor.notable_investments.slice(0, 3).map((investment, idx) => (
                          <span key={idx} className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full">
                            {investment}
                          </span>
                        ))}
                        {investor.notable_investments.length > 3 && (
                          <span className={`text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded-full`}>
                            +{investor.notable_investments.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 py-10 text-center text-gray-500 dark:text-gray-400">
              No investors found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvestorProfiles; 