import { supabase, Startup, FundingRound, Investor, Trend } from '../lib/supabase';
import { 
  loadDataFromCSV, 
  getStartupById, 
  getFundingRoundsByStartupId, 
  getInvestorById,
  getLatestFundingRounds
} from '../utils/csvParser';

// Path to the CSV file
const CSV_PATH = '/Clean Startup Data.csv';

// Store loaded data
let startups: Startup[] = [];
let fundingRounds: FundingRound[] = [];
let investors: Investor[] = [];
let csvData: any[] = [];
let isDataLoaded = false;

// Load data function
const loadData = async () => {
  if (isDataLoaded) return;
  
  try {
    const data = await loadDataFromCSV(CSV_PATH);
    startups = data.startups;
    fundingRounds = data.fundingRounds;
    investors = data.investors;
    csvData = data.rawData;
    isDataLoaded = true;
  } catch (error) {
    console.error('Failed to load CSV data:', error);
  }
};

// Pagination helper
const paginateData = <T>(data: T[], page: number = 1, limit: number = 10): T[] => {
  const startIndex = (page - 1) * limit;
  return data.slice(startIndex, startIndex + limit);
};

// Startups API
export const startupApi = {
  getAll: async (page: number = 1, limit: number = 10): Promise<{ data: Startup[], total: number }> => {
    await loadData();
    return {
      data: paginateData(startups, page, limit),
      total: startups.length
    };
  },
  
  getById: async (id: number): Promise<Startup | null> => {
    await loadData();
    const startup = getStartupById(startups, id);
    return Promise.resolve(startup || null);
  },
  
  getByIndustry: async (industry: string, page: number = 1, limit: number = 10): Promise<{ data: Startup[], total: number }> => {
    await loadData();
    const filteredStartups = startups.filter(s => s.industry === industry);
    return {
      data: paginateData(filteredStartups, page, limit),
      total: filteredStartups.length
    };
  }
};

// Funding Rounds API
export const fundingRoundApi = {
  getAll: async (page: number = 1, limit: number = 10): Promise<{ data: FundingRound[], total: number }> => {
    await loadData();
    return {
      data: paginateData(fundingRounds, page, limit),
      total: fundingRounds.length
    };
  },
  
  getByStartupId: async (startupId: number): Promise<FundingRound[]> => {
    await loadData();
    return Promise.resolve(getFundingRoundsByStartupId(fundingRounds, startupId));
  },
  
  getLatest: async (limit: number = 10): Promise<FundingRound[]> => {
    await loadData();
    return Promise.resolve(getLatestFundingRounds(fundingRounds, limit));
  },
  
  getByRoundType: async (roundType: string, page: number = 1, limit: number = 10): Promise<{ data: FundingRound[], total: number }> => {
    await loadData();
    const filteredRounds = fundingRounds.filter(r => r.round_type === roundType);
    return {
      data: paginateData(filteredRounds, page, limit),
      total: filteredRounds.length
    };
  }
};

// Investors API
export const investorApi = {
  getAll: async (page: number = 1, limit: number = 10): Promise<{ data: Investor[], total: number }> => {
    await loadData();
    return {
      data: paginateData(investors, page, limit),
      total: investors.length
    };
  },
  
  getById: async (id: number): Promise<Investor | null> => {
    await loadData();
    const investor = getInvestorById(investors, id);
    return Promise.resolve(investor || null);
  },
  
  getByTotalInvestments: async (minAmount: number, page: number = 1, limit: number = 10): Promise<{ data: Investor[], total: number }> => {
    await loadData();
    const filteredInvestors = investors.filter(i => i.total_investments >= minAmount);
    return {
      data: paginateData(filteredInvestors, page, limit),
      total: filteredInvestors.length
    };
  }
};

// Trends API
export const trendApi = {
  getAll: async (): Promise<Trend[]> => {
    // Calculate trends from CSV data
    await loadData();
    return Promise.resolve([]);
  },
  
  getByCategory: async (category: string): Promise<Trend[]> => {
    // Calculate trends from CSV data
    await loadData();
    return Promise.resolve([]);
  }
};

// Advanced combined queries
export const advancedQueries = {
  // Get startups with their latest funding round
  getStartupsWithFunding: async (page: number = 1, limit: number = 10): Promise<{ data: any[], total: number }> => {
    await loadData();
    const startupsWithFunding = startups.map(startup => {
      const funding = getFundingRoundsByStartupId(fundingRounds, startup.id);
      return {
        ...startup,
        funding_rounds: funding
      };
    });
    
    return {
      data: paginateData(startupsWithFunding, page, limit),
      total: startupsWithFunding.length
    };
  },
  
  // Get investors with their investments
  getInvestorPortfolios: async (page: number = 1, limit: number = 10): Promise<{ data: Investor[], total: number }> => {
    await loadData();
    return {
      data: paginateData(investors, page, limit),
      total: investors.length
    };
  },
  
  // Get funding statistics by industry
  getFundingByIndustry: async (): Promise<any[]> => {
    await loadData();
    
    // Calculate funding by industry from CSV data
    const industries = [...new Set(startups.map(s => s.industry))];
    const fundingByIndustry = industries.map(industry => {
      const startupIds = startups
        .filter(s => s.industry === industry)
        .map(s => s.id);
      
      const totalFunding = fundingRounds
        .filter(r => startupIds.includes(r.startup_id))
        .reduce((sum, round) => sum + round.amount, 0);
      
      return {
        industry,
        totalFunding,
        dealCount: fundingRounds.filter(r => startupIds.includes(r.startup_id)).length
      };
    });
    
    return Promise.resolve(fundingByIndustry);
  }
}; 