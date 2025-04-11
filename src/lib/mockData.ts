import { Startup, FundingRound, Investor } from './supabase';

// Mock startups
export const mockStartups: Startup[] = [
  {
    id: 1,
    name: 'TechFlow AI',
    description: 'Enterprise AI solutions for workflow automation and optimization.',
    industry: 'AI & ML',
    location: 'San Francisco, CA',
    logo: 'https://via.placeholder.com/150?text=TF',
  },
  {
    id: 2,
    name: 'FinEdge',
    description: 'Next-generation payment infrastructure for global businesses.',
    industry: 'Fintech',
    location: 'New York, NY',
    logo: 'https://via.placeholder.com/150?text=FE',
  },
  {
    id: 3,
    name: 'MediSync',
    description: 'AI-powered healthcare coordination platform for hospitals and clinics.',
    industry: 'Healthtech',
    location: 'Boston, MA',
    logo: 'https://via.placeholder.com/150?text=MS',
  },
  {
    id: 4,
    name: 'CloudScale',
    description: 'Serverless computing platform for enterprise applications.',
    industry: 'SaaS',
    location: 'Seattle, WA',
    logo: 'https://via.placeholder.com/150?text=CS',
  },
  {
    id: 5,
    name: 'EcoSmart',
    description: 'IoT solutions for energy efficiency and sustainable building management.',
    industry: 'CleanTech',
    location: 'Austin, TX',
    logo: 'https://via.placeholder.com/150?text=ES',
  }
];

// Mock funding rounds
export const mockFundingRounds: FundingRound[] = [
  {
    id: 1,
    startup_id: 1,
    round_type: 'Series A',
    amount: 5000000,
    date: '2023-10-15',
    lead_investors: ['Accel', 'Sequoia Capital'],
  },
  {
    id: 2,
    startup_id: 1,
    round_type: 'Seed',
    amount: 750000,
    date: '2022-05-20',
    lead_investors: ['Y Combinator', 'Kleiner Perkins'],
  },
  {
    id: 3,
    startup_id: 2,
    round_type: 'Series B',
    amount: 12000000,
    date: '2023-09-10',
    lead_investors: ['Andreessen Horowitz', 'Founders Fund'],
  },
  {
    id: 4,
    startup_id: 3,
    round_type: 'Series A',
    amount: 7500000,
    date: '2023-11-05',
    lead_investors: ['Khosla Ventures', 'NEA'],
  },
  {
    id: 5,
    startup_id: 4,
    round_type: 'Seed',
    amount: 1200000,
    date: '2023-08-18',
    lead_investors: ['First Round Capital', 'Greylock'],
  },
  {
    id: 6,
    startup_id: 5,
    round_type: 'Series A',
    amount: 6500000,
    date: '2023-10-25',
    lead_investors: ['Breakthrough Energy Ventures', 'Obvious Ventures'],
  }
];

// Mock investors
export const mockInvestors: Investor[] = [
  {
    id: 1,
    name: 'Sequoia Capital',
    profile: 'One of the oldest and largest venture capital firms, focusing on technology, healthcare, and energy.',
    total_investments: 300000000,
    notable_investments: ['TechFlow AI', 'CloudScale', 'FinEdge'],
  },
  {
    id: 2,
    name: 'Andreessen Horowitz',
    profile: 'Silicon Valley venture capital firm backing bold entrepreneurs building the future through technology.',
    total_investments: 250000000,
    notable_investments: ['FinEdge', 'MediSync'],
  },
  {
    id: 3,
    name: 'Y Combinator',
    profile: 'Seed accelerator focused on early-stage startups, providing funding and mentorship.',
    total_investments: 120000000,
    notable_investments: ['TechFlow AI', 'CloudScale'],
  },
  {
    id: 4,
    name: 'Accel',
    profile: 'Global venture capital firm investing in early-stage and growth-stage companies.',
    total_investments: 180000000,
    notable_investments: ['TechFlow AI', 'EcoSmart'],
  },
  {
    id: 5,
    name: 'Khosla Ventures',
    profile: 'Venture capital firm focused on technology, sustainability, and social impact.',
    total_investments: 200000000,
    notable_investments: ['MediSync', 'EcoSmart'],
  }
];

// Helper function to get startup by ID
export const getStartupById = (id: number): Startup | undefined => {
  return mockStartups.find(startup => startup.id === id);
};

// Helper function to get funding rounds by startup ID
export const getFundingRoundsByStartupId = (startupId: number): FundingRound[] => {
  return mockFundingRounds.filter(round => round.startup_id === startupId);
};

// Helper function to get investor by ID
export const getInvestorById = (id: number): Investor | undefined => {
  return mockInvestors.find(investor => investor.id === id);
};

// Helper function to get the latest funding rounds
export const getLatestFundingRounds = (limit: number = 10): FundingRound[] => {
  return [...mockFundingRounds]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}; 