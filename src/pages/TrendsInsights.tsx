import { useState, useEffect } from 'react';
import { trendApi, advancedQueries } from '../api/supabaseApi';
import { FiDownload, FiCalendar } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

// Mock data for charts (in real app, this would come from the backend)
const mockIndustryFunding = [
  { name: 'AI & ML', value: 1820, color: '#6366f1' },
  { name: 'Fintech', value: 1650, color: '#f97316' },
  { name: 'Healthtech', value: 1450, color: '#14b8a6' },
  { name: 'SaaS', value: 1200, color: '#f43f5e' },
  { name: 'EdTech', value: 850, color: '#8b5cf6' },
  { name: 'CleanTech', value: 680, color: '#22c55e' },
  { name: 'Consumer', value: 520, color: '#eab308' },
];

const mockMonthlyFunding = [
  { month: 'Jan', amount: 580 },
  { month: 'Feb', amount: 420 },
  { month: 'Mar', amount: 780 },
  { month: 'Apr', amount: 890 },
  { month: 'May', amount: 1100 },
  { month: 'Jun', amount: 1400 },
  { month: 'Jul', amount: 960 },
  { month: 'Aug', amount: 1700 },
  { month: 'Sep', amount: 1100 },
  { month: 'Oct', amount: 1300 },
  { month: 'Nov', amount: 1200 },
  { month: 'Dec', amount: 800 },
];

const mockRoundTypeFunding = [
  { type: 'Seed', count: 320, amount: 450 },
  { type: 'Series A', count: 160, amount: 1200 },
  { type: 'Series B', count: 80, amount: 2100 },
  { type: 'Series C', count: 40, amount: 3400 },
  { type: 'Series D+', count: 10, amount: 4800 },
  { type: 'Growth', count: 15, amount: 2600 },
  { type: 'IPO', count: 5, amount: 5200 },
];

const mockRegionalFunding = [
  { name: 'North America', value: 42 },
  { name: 'Europe', value: 28 },
  { name: 'Asia', value: 18 },
  { name: 'South America', value: 5 },
  { name: 'Africa', value: 4 },
  { name: 'Australia', value: 3 },
];

const COLORS = ['#6366f1', '#f97316', '#14b8a6', '#f43f5e', '#8b5cf6', '#22c55e'];

const TrendsInsights = () => {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('yearly');
  const [predictiveInsights, setPredictiveInsights] = useState(false);
  
  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      try {
        setLoading(true);
        // In a real app, we'd fetch data from the API
        // const trendsData = await trendApi.getAll();
        // const fundingByIndustry = await advancedQueries.getFundingByIndustry();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Failed to fetch trends data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [timeframe]);

  // Function to format currency values
  const formatCurrency = (value: number) => {
    return value >= 1000 ? `$${(value / 1000).toFixed(1)}B` : `$${value}M`;
  };
  
  // Toggle predictive insights
  const togglePredictiveInsights = () => {
    setPredictiveInsights(!predictiveInsights);
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Trends & Insights</h1>
          <p className="text-gray-600">Analyze funding patterns and market trends</p>
        </div>
        
        <div className="flex mt-4 md:mt-0 space-x-3">
          {/* Timeframe selector */}
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="monthly">Last 30 Days</option>
              <option value="quarterly">Last Quarter</option>
              <option value="yearly">Last Year</option>
              <option value="5year">Last 5 Years</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FiCalendar />
            </div>
          </div>
          
          <button 
            onClick={togglePredictiveInsights}
            className={`${
              predictiveInsights ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-300'
            } px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors`}
          >
            AI Predictions
          </button>
          
          <button 
            onClick={() => alert('Export functionality would be implemented here')}
            className="btn-primary flex items-center"
          >
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-8">
          {/* Industry Funding Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Funding by Industry</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockIndustryFunding}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip 
                    formatter={(value) => [`${formatCurrency(value as number)}`, 'Funding']}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Total Funding" radius={[4, 4, 0, 0]}>
                    {mockIndustryFunding.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Monthly Funding Trends */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Funding Trends</h2>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={mockMonthlyFunding}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value}M`} />
                    <Tooltip formatter={(value) => [`$${value}M`, 'Funding']} />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      name="Total Funding" 
                      stroke="#6366f1" 
                      fillOpacity={1} 
                      fill="url(#colorAmount)" 
                    />
                    {predictiveInsights && (
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        name="Predicted Trend" 
                        stroke="#f97316" 
                        strokeDasharray="5 5"
                        dot={false} 
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Regional Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Regional Distribution</h2>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockRegionalFunding}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockRegionalFunding.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Round Type Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Funding by Round Type</h2>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockRoundTypeFunding}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `$${value}M`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}`} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="amount" name="Average Amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="count" name="Number of Deals" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* AI Insights */}
            {predictiveInsights && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Predictions</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-primary bg-opacity-5 rounded-md border border-primary border-opacity-20">
                    <h3 className="font-medium text-primary">Expected Industry Growth</h3>
                    <p className="text-gray-700 mt-2">AI/ML and CleanTech sectors are projected to see 32% funding growth in the next quarter based on current trends.</p>
                  </div>
                  
                  <div className="p-4 bg-primary bg-opacity-5 rounded-md border border-primary border-opacity-20">
                    <h3 className="font-medium text-primary">Potential IPO Candidates</h3>
                    <p className="text-gray-700 mt-2">5 late-stage startups in the SaaS sector show strong indicators of preparing for public offerings within 6-12 months.</p>
                  </div>
                  
                  <div className="p-4 bg-primary bg-opacity-5 rounded-md border border-primary border-opacity-20">
                    <h3 className="font-medium text-primary">Investment Pattern Shift</h3>
                    <p className="text-gray-700 mt-2">Analysis suggests early-stage investment may increase by 18% as VCs adjust strategies toward emerging technologies.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Key Insights Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-2xl font-bold text-primary">$8.2B</div>
                <div className="text-sm text-gray-600">Total Funding This Quarter</div>
                <div className="text-xs text-green-600 mt-1">↑ 12% from previous</div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-2xl font-bold text-primary">427</div>
                <div className="text-sm text-gray-600">Number of Deals</div>
                <div className="text-xs text-red-600 mt-1">↓ 3% from previous</div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-2xl font-bold text-primary">$19.2M</div>
                <div className="text-sm text-gray-600">Average Deal Size</div>
                <div className="text-xs text-green-600 mt-1">↑ 15% from previous</div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-2xl font-bold text-primary">AI/ML</div>
                <div className="text-sm text-gray-600">Hottest Sector</div>
                <div className="text-xs text-green-600 mt-1">↑ 32% funding growth</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendsInsights; 