import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { startupApi, fundingRoundApi } from '../api/supabaseApi';
import { Startup, FundingRound } from '../lib/supabase';
import { FiExternalLink, FiMapPin, FiTag, FiCalendar, FiDollarSign, FiUsers } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const StartupProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [startup, setStartup] = useState<Startup | null>(null);
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStartupData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch startup details
        const startupData = await startupApi.getById(parseInt(id));
        if (!startupData) {
          setError('Startup not found');
          return;
        }
        
        setStartup(startupData);
        
        // Fetch funding rounds for this startup
        const roundsData = await fundingRoundApi.getByStartupId(parseInt(id));
        
        // Sort funding rounds by date (newest first)
        const sortedRounds = [...roundsData].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setFundingRounds(sortedRounds);
      } catch (error) {
        console.error('Error fetching startup data:', error);
        setError('Failed to load startup data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStartupData();
  }, [id]);
  
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
  
  // Calculate total funding amount
  const totalFunding = fundingRounds.reduce((sum, round) => sum + round.amount, 0);
  
  // Prepare data for funding chart
  const chartData = [...fundingRounds]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((round) => ({
      date: formatDate(round.date),
      amount: round.amount / 1000000, // Convert to millions for easier display
      roundType: round.round_type
    }));

  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error || !startup) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {error || 'Startup not found'}
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the startup you're looking for.
        </p>
        <Link to="/" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      {/* Startup header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="flex-shrink-0 h-20 w-20 bg-gray-200 rounded-lg overflow-hidden mr-6 mb-4 md:mb-0">
            {startup.logo ? (
              <img 
                src={startup.logo} 
                alt={`${startup.name} logo`} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary bg-opacity-10 text-primary font-bold text-xl">
                {startup.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{startup.name}</h1>
            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-3">
              <div className="flex items-center mr-4">
                <FiMapPin className="mr-1" />
                <span>{startup.location}</span>
              </div>
              <div className="flex items-center">
                <FiTag className="mr-1" />
                <span>{startup.industry}</span>
              </div>
            </div>
            
            <p className="text-gray-700">{startup.description}</p>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
            <div className="text-right mb-3">
              <div className="text-sm text-gray-600">Total Funding</div>
              <div className="text-xl font-bold text-primary">{formatCurrency(totalFunding)}</div>
            </div>
            
            <a
              href={`https://${startup.name.toLowerCase().replace(/\s+/g, '')}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:text-indigo-700 transition-colors"
            >
              <span className="mr-1">Visit Website</span>
              <FiExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Funding chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Funding History</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${value}M`} />
                <Tooltip 
                  formatter={(value, name) => [`$${value}M`, 'Funding Amount']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  name="Funding Amount" 
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#colorFunding)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {/* Funding rounds */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-800 p-6 pb-0">Funding Rounds</h2>
        
        {fundingRounds.length > 0 ? (
          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Round
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead Investors
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fundingRounds.map((round) => (
                    <tr key={round.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiCalendar className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{formatDate(round.date)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-primary bg-opacity-10 text-primary rounded-full">
                          {round.round_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiDollarSign className="text-gray-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(round.amount)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <FiUsers className="text-gray-400 mr-2 mt-1" />
                          <div>
                            {round.lead_investors && round.lead_investors.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {round.lead_investors.map((investor, idx) => (
                                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {investor}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">Not disclosed</span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No funding rounds available for this startup.
          </div>
        )}
      </div>
      
      {/* News and updates - in a real app, this would fetch from an API */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest News & Updates</h2>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-800">{startup.name} Expands to European Market</h3>
              <span className="text-xs text-gray-500">2 weeks ago</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              The company announced its expansion plans into three major European markets, starting with Germany.
            </p>
          </div>
          
          <div className="p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-800">New Partnership Announced</h3>
              <span className="text-xs text-gray-500">1 month ago</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Strategic partnership with industry leader to accelerate growth and market adoption.
            </p>
          </div>
          
          <div className="p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-800">Product Launch</h3>
              <span className="text-xs text-gray-500">2 months ago</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Successfully launched new flagship product with enhanced features and capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupProfile; 