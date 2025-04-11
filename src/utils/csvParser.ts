import { Startup, FundingRound, Investor } from '../lib/supabase';

interface CSVData {
  Date: string;
  Startup: string;
  'Industry Vertical': string;
  SubVertical: string;
  City: string;
  'Investors Name': string;
  InvestmentnType: string;
  CR: string;
  Year: string;
  Month: string;
}

// Function to read and parse the CSV file
export const parseCSV = async (filePath: string): Promise<CSVData[]> => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();
    
    // Parse CSV
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim() !== '').map(line => {
      const values = line.split(',');
      const entry: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        entry[header] = values[index] || '';
      });
      
      return entry as unknown as CSVData;
    });
  } catch (error) {
    console.error('Error parsing CSV file:', error);
    return [];
  }
};

// Convert CSV data to Startup objects
export const convertToStartups = (csvData: CSVData[]): Startup[] => {
  const uniqueStartups = new Map<string, Startup>();
  let id = 1;
  
  csvData.forEach(row => {
    if (!uniqueStartups.has(row.Startup) && row.Startup) {
      uniqueStartups.set(row.Startup, {
        id,
        name: row.Startup,
        description: `${row.Startup} is a company in the ${row['Industry Vertical']} industry.`,
        industry: row['Industry Vertical'] || 'Uncategorized',
        location: row.City || 'Unknown',
        logo: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot-icon lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
      });
      id++;
    }
  });
  
  return Array.from(uniqueStartups.values());
};

// Convert CSV data to FundingRound objects
export const convertToFundingRounds = (csvData: CSVData[], startups: Startup[]): FundingRound[] => {
  const rounds: FundingRound[] = [];
  let id = 1;
  
  csvData.forEach(row => {
    if (!row.Startup || !row.Date) return;
    
    const startup = startups.find(s => s.name === row.Startup);
    if (!startup) return;
    
    // Convert CR value (in Crores) to amount in USD (approximating 1 Crore = $120,000)
    const amountInCrores = parseFloat(row.CR) || 0;
    const amountInUSD = amountInCrores * 120000;
    
    rounds.push({
      id: id++,
      startup_id: startup.id,
      round_type: row.InvestmentnType || 'Unknown',
      amount: amountInUSD,
      date: row.Date,
      lead_investors: row['Investors Name'] ? [row['Investors Name']] : [],
    });
  });
  
  return rounds;
};

// Convert CSV data to Investor objects
export const convertToInvestors = (csvData: CSVData[], startups: Startup[]): Investor[] => {
  const investorsMap = new Map<string, Investor>();
  let id = 1;
  
  csvData.forEach(row => {
    if (!row['Investors Name'] || !row.Startup) return;
    
    const investorName = row['Investors Name'];
    
    if (!investorsMap.has(investorName)) {
      investorsMap.set(investorName, {
        id: id++,
        name: investorName,
        profile: `${investorName} is an investment firm focused on ${row['Industry Vertical']} industries.`,
        total_investments: 0,
        notable_investments: [],
      });
    }
    
    const investor = investorsMap.get(investorName)!;
    
    // Add to total investments (CR value converted to USD)
    const amountInCrores = parseFloat(row.CR) || 0;
    const amountInUSD = amountInCrores * 120000;
    investor.total_investments += amountInUSD;
    
    // Add to notable investments if not already included
    if (!investor.notable_investments.includes(row.Startup)) {
      investor.notable_investments.push(row.Startup);
    }
  });
  
  return Array.from(investorsMap.values());
};

// Helper function to load data from CSV
export const loadDataFromCSV = async (csvPath: string) => {
  const csvData = await parseCSV(csvPath);
  const startups = convertToStartups(csvData);
  const fundingRounds = convertToFundingRounds(csvData, startups);
  const investors = convertToInvestors(csvData, startups);
  
  return {
    startups,
    fundingRounds,
    investors,
    rawData: csvData
  };
};

// Helper functions (similar to those in the mock data file)
export const getStartupById = (startups: Startup[], id: number): Startup | undefined => {
  return startups.find(startup => startup.id === id);
};

export const getFundingRoundsByStartupId = (fundingRounds: FundingRound[], startupId: number): FundingRound[] => {
  return fundingRounds.filter(round => round.startup_id === startupId);
};

export const getInvestorById = (investors: Investor[], id: number): Investor | undefined => {
  return investors.find(investor => investor.id === id);
};

export const getLatestFundingRounds = (fundingRounds: FundingRound[], limit: number = 10): FundingRound[] => {
  return [...fundingRounds]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}; 