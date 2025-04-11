import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { investorApi } from '../api/supabaseApi';
import { Investor } from '../lib/supabase';
import { FiSearch, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const InvestorProfiles = () => {
  const [loading, setLoading] = useState(true);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Investor>('total_investments');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

  // Filter and sort investors
  const filteredAndSortedInvestors = [...investors]
    .filter(investor => 
      investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (investor.profile && investor.profile.toLowerCase().includes(searchTerm.toLowerCase()))
    )
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Investor Profiles</h1>
          <p className="text-gray-600 dark:text-gray-400">Explore investment firms and their portfolios</p>
        </div>
        
        {/* Search */}
        <div className="mt-4 md:mt-0 w-full md:w-64">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Search investors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedInvestors.length > 0 ? (
            filteredAndSortedInvestors.map((investor) => (
              <Link
                key={investor.id}
                to={`/investor/${investor.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-primary transition-colors">
                    {investor.name}
                  </h3>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Total Investments</span>
                      <p className="text-lg font-medium text-gray-800">
                        {formatCurrency(investor.total_investments)}
                      </p>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {investor.notable_investments?.length || 0} Notable Investments
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {investor.profile || 'No profile information available.'}
                    </p>
                  </div>
                  
                  {investor.notable_investments && investor.notable_investments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">NOTABLE INVESTMENTS</h4>
                      <div className="flex flex-wrap gap-1">
                        {investor.notable_investments.slice(0, 3).map((investment, idx) => (
                          <span key={idx} className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full">
                            {investment}
                          </span>
                        ))}
                        {investor.notable_investments.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
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
            <div className="col-span-3 py-10 text-center text-gray-500">
              No investors found matching your search criteria.
            </div>
          )}
        </div>
      )}
      
      {/* Sorting controls */}
      {!loading && filteredAndSortedInvestors.length > 0 && (
        <div className="mt-6 flex justify-end">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            
            <button
              onClick={() => handleSort('name')}
              className={`text-sm flex items-center space-x-1 ${
                sortField === 'name' ? 'text-primary font-medium' : 'text-gray-600'
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
                sortField === 'total_investments' ? 'text-primary font-medium' : 'text-gray-600'
              }`}
            >
              <span>Total Investment</span>
              {sortField === 'total_investments' && (
                sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorProfiles; 