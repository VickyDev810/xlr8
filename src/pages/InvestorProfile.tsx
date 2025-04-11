import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { investorApi } from '../api/supabaseApi';
import { Investor } from '../lib/supabase';
import { FiExternalLink, FiDollarSign, FiPieChart, FiBarChart2 } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

// Mock data for investor's portfolio by industry
const mockPortfolioByIndustry = [
  { name: 'AI & ML', value: 35, color: '#6366f1' },
  { name: 'Fintech', value: 25, color: '#f97316' },
  { name: 'SaaS', value: 20, color: '#f43f5e' },
  { name: 'Healthtech', value: 10, color: '#14b8a6' },
  { name: 'Other', value: 10, color: '#8b5cf6' },
];

// Mock data for investments by stage
const mockInvestmentsByStage = [
  { name: 'Seed', value: 45 },
  { name: 'Series A', value: 30 },
  { name: 'Series B', value: 15 },
  { name: 'Later', value: 10 },
];

// Mock investment data
const mockInvestments = [
  { 
    id: 1, 
    startup: 'TechFlow AI', 
    industry: 'AI & ML', 
    roundType: 'Series A', 
    amount: 12000000, 
    date: '2023-09-15', 
    logo: '' 
  },
  { 
    id: 2, 
    startup: 'FinanceHub', 
    industry: 'Fintech', 
    roundType: 'Series B', 
    amount: 28000000, 
    date: '2023-07-22', 
    logo: '' 
  },
  { 
    id: 3, 
    startup: 'HealthTrack', 
    industry: 'Healthtech', 
    roundType: 'Seed', 
    amount: 3500000, 
    date: '2023-10-05', 
    logo: '' 
  },
  { 
    id: 4, 
    startup: 'CloudSecure', 
    industry: 'SaaS', 
    roundType: 'Series A', 
    amount: 15000000, 
    date: '2023-08-10', 
    logo: '' 
  },
  { 
    id: 5, 
    startup: 'DataViz', 
    industry: 'AI & ML', 
    roundType: 'Seed', 
    amount: 4200000, 
    date: '2023-11-18', 
    logo: '' 
  },
];

const InvestorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchInvestorData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch investor details
        const investorData = await investorApi.getById(parseInt(id));
        if (!investorData) {
          setError('Investor not found');
          return;
        }
        
        setInvestor(investorData);
      } catch (error) {
        console.error('Error fetching investor data:', error);
        setError('Failed to load investor data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvestorData();
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

  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error || !investor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {error || 'Investor not found'}
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the investor you're looking for.
        </p>
        <Link to="/investors" className="btn-primary">
          Back to Investors
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      {/* Investor header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{investor.name}</h1>
            
            <div className="flex items-center text-gray-600 mb-4">
              <FiDollarSign className="mr-1" />
              <span className="text-lg font-medium">{formatCurrency(investor.total_investments)} total invested</span>
            </div>
            
            <p className="text-gray-700 mb-4">{investor.profile}</p>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Notable Investments</h3>
              <div className="flex flex-wrap gap-2">
                {investor.notable_investments && investor.notable_investments.map((investment, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm"
                  >
                    {investment}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 md:ml-6 md:border-l md:border-gray-200 md:pl-6 md:w-1/3">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Contact</h3>
              <a
                href="#"
                className="flex items-center text-primary hover:text-indigo-700 transition-colors mb-2"
              >
                <span className="mr-1">Website</span>
                <FiExternalLink size={14} />
              </a>
              <a
                href={`mailto:contact@${investor.name.toLowerCase().replace(/\s+/g, '')}.com`}
                className="text-primary hover:text-indigo-700 transition-colors"
              >
                contact@{investor.name.toLowerCase().replace(/\s+/g, '')}.com
              </a>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Investment Focus</h3>
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-primary mr-2"></span>
                  <span className="text-sm text-gray-700">Early Stage</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-secondary mr-2"></span>
                  <span className="text-sm text-gray-700">Technology</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm text-gray-700">North America / Europe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Portfolio Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Industry Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiPieChart className="text-primary mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Portfolio by Industry</h2>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockPortfolioByIndustry}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockPortfolioByIndustry.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Stage Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiBarChart2 className="text-primary mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Investments by Stage</h2>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockInvestmentsByStage}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Investments */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <h2 className="text-xl font-semibold text-gray-800 p-6 pb-0">Recent Investments</h2>
        
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Startup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Round
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockInvestments.map((investment) => (
                <tr key={investment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/startup/${investment.id}`} className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                        {investment.logo ? (
                          <div 
                            dangerouslySetInnerHTML={{ __html: investment.logo }} 
                            className="text-gray-700"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary bg-opacity-10 text-primary font-bold text-xl">
                            {investment.startup.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
                          {investment.startup}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-gray-600">
                      {investment.industry}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-primary bg-opacity-10 text-primary rounded-full">
                      {investment.roundType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(investment.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {formatDate(investment.date)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Investment Strategy */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Investment Strategy</h2>
        
        <div className="prose prose-sm text-gray-700 max-w-none">
          <p>
            {investor.name} focuses on identifying and backing transformative technology companies with strong founding teams and significant market potential. The firm typically invests in early to mid-stage companies with proven traction and clear paths to scalability.
          </p>
          
          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Key Investment Criteria</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Strong founding team with domain expertise</li>
            <li>Innovative technology with defensible IP</li>
            <li>Large addressable market (TAM $1B+)</li>
            <li>Clear path to profitability</li>
            <li>Scalable business model</li>
          </ul>
          
          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Value-Add Services</h3>
          <p>
            Beyond capital, {investor.name} provides portfolio companies with strategic guidance, operational support, and access to an extensive network of industry partners and potential customers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestorProfile; 