import { supabase, Startup, FundingRound, Investor, Trend } from '../lib/supabase';
import { 
  mockStartups, 
  mockFundingRounds, 
  mockInvestors, 
  getStartupById, 
  getFundingRoundsByStartupId, 
  getInvestorById,
  getLatestFundingRounds
} from '../lib/mockData';

// Startups API
export const startupApi = {
  getAll: async (): Promise<Startup[]> => {
    // Using mock data
    return Promise.resolve(mockStartups);
  },
  
  getById: async (id: number): Promise<Startup | null> => {
    // Using mock data
    const startup = getStartupById(id);
    return Promise.resolve(startup || null);
  },
  
  getByIndustry: async (industry: string): Promise<Startup[]> => {
    // Using mock data
    const startups = mockStartups.filter(s => s.industry === industry);
    return Promise.resolve(startups);
  }
};

// Funding Rounds API
export const fundingRoundApi = {
  getAll: async (): Promise<FundingRound[]> => {
    // Using mock data
    return Promise.resolve(mockFundingRounds);
  },
  
  getByStartupId: async (startupId: number): Promise<FundingRound[]> => {
    // Using mock data
    return Promise.resolve(getFundingRoundsByStartupId(startupId));
  },
  
  getLatest: async (limit: number = 10): Promise<FundingRound[]> => {
    // Using mock data
    return Promise.resolve(getLatestFundingRounds(limit));
  },
  
  getByRoundType: async (roundType: string): Promise<FundingRound[]> => {
    // Using mock data
    const rounds = mockFundingRounds.filter(r => r.round_type === roundType);
    return Promise.resolve(rounds);
  }
};

// Investors API
export const investorApi = {
  getAll: async (): Promise<Investor[]> => {
    // Using mock data
    return Promise.resolve(mockInvestors);
  },
  
  getById: async (id: number): Promise<Investor | null> => {
    // Using mock data
    const investor = getInvestorById(id);
    return Promise.resolve(investor || null);
  },
  
  getByTotalInvestments: async (minAmount: number): Promise<Investor[]> => {
    // Using mock data
    const investors = mockInvestors.filter(i => i.total_investments >= minAmount);
    return Promise.resolve(investors);
  }
};

// Trends API
export const trendApi = {
  getAll: async (): Promise<Trend[]> => {
    // Using mock data
    return Promise.resolve([]);
  },
  
  getByCategory: async (category: string): Promise<Trend[]> => {
    // Using mock data
    return Promise.resolve([]);
  }
};

// Advanced combined queries
export const advancedQueries = {
  // Get startups with their latest funding round
  getStartupsWithFunding: async (): Promise<any[]> => {
    // Using mock data - combine startups with their funding rounds
    const startupsWithFunding = mockStartups.map(startup => {
      const funding = getFundingRoundsByStartupId(startup.id);
      return {
        ...startup,
        funding_rounds: funding
      };
    });
    return Promise.resolve(startupsWithFunding);
  },
  
  // Get investors with their investments
  getInvestorPortfolios: async (): Promise<any[]> => {
    // Using mock data
    return Promise.resolve(mockInvestors);
  },
  
  // Get funding statistics by industry
  getFundingByIndustry: async (): Promise<any[]> => {
    // Using mock data - calculate funding by industry
    const industries = [...new Set(mockStartups.map(s => s.industry))];
    const fundingByIndustry = industries.map(industry => {
      const startupIds = mockStartups
        .filter(s => s.industry === industry)
        .map(s => s.id);
      
      const totalFunding = mockFundingRounds
        .filter(r => startupIds.includes(r.startup_id))
        .reduce((sum, round) => sum + round.amount, 0);
      
      return {
        industry,
        totalFunding,
        dealCount: mockFundingRounds.filter(r => startupIds.includes(r.startup_id)).length
      };
    });
    
    return Promise.resolve(fundingByIndustry);
  }
}; 