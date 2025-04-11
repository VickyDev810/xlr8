import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FundingRound, Startup } from '../lib/supabase';

interface ExportOptions {
  title: string;
  subtitle?: string;
  filters?: {
    industries?: string[];
    roundTypes?: string[];
    minAmount?: number | null;
    maxAmount?: number | null;
  };
}

export const exportToPDF = (
  data: (FundingRound & { startup?: Startup })[],
  options: ExportOptions
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title
  doc.setFontSize(20);
  doc.text(options.title, pageWidth / 2, 20, { align: 'center' });
  
  // Add subtitle if provided
  if (options.subtitle) {
    doc.setFontSize(12);
    doc.text(options.subtitle, pageWidth / 2, 30, { align: 'center' });
  }
  
  // Add filters if provided
  if (options.filters) {
    doc.setFontSize(10);
    let yPos = 40;
    
    if (options.filters.industries?.length) {
      doc.text(`Industries: ${options.filters.industries.join(', ')}`, 14, yPos);
      yPos += 6;
    }
    
    if (options.filters.roundTypes?.length) {
      doc.text(`Round Types: ${options.filters.roundTypes.join(', ')}`, 14, yPos);
      yPos += 6;
    }
    
    if (options.filters.minAmount || options.filters.maxAmount) {
      const amountRange = [];
      if (options.filters.minAmount) amountRange.push(`Min: $${formatAmount(options.filters.minAmount)}`);
      if (options.filters.maxAmount) amountRange.push(`Max: $${formatAmount(options.filters.maxAmount)}`);
      doc.text(`Amount Range: ${amountRange.join(' - ')}`, 14, yPos);
      yPos += 10;
    }
  }
  
  // Prepare table data
  const tableData = data.map(round => [
    round.startup?.name || 'Unknown',
    round.round_type,
    formatAmount(round.amount),
    formatDate(round.date),
    round.startup?.industry || 'Unknown',
    (round.lead_investors || []).join(', ') || 'Not disclosed'
  ]);
  
  // Add table
  autoTable(doc, {
    head: [['Startup', 'Round Type', 'Amount', 'Date', 'Industry', 'Lead Investors']],
    body: tableData,
    startY: options.filters ? 60 : 40,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [99, 102, 241], // Indigo-600
      textColor: 255,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 30 }, // Startup name
      1: { cellWidth: 20 }, // Round type
      2: { cellWidth: 25 }, // Amount
      3: { cellWidth: 25 }, // Date
      4: { cellWidth: 25 }, // Industry
      5: { cellWidth: 'auto' }, // Lead investors
    },
  });
  
  // Add footer with date
  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`${options.title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Helper function to format currency
const formatAmount = (amount: number): string => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  } else {
    return `${amount}`;
  }
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}; 