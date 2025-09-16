import { Lead } from '@/types/lead';

export async function parseLeadsFromCSV(): Promise<Lead[]> {
  try {
    const response = await fetch('/data/sales_leads_extended_data.csv');
    const csvText = await response.text();
    
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    const leads: Lead[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      
      if (values.length >= 9) {
        const lead: Lead = {
          leadId: parseInt(values[0]),
          budget: parseInt(values[1]),
          designation: values[2],
          personName: values[3],
          numberOfPeopleToHire: parseInt(values[4]),
          revenue: parseInt(values[5]),
          companyName: values[6].replace(/"/g, ''), // Remove quotes
          companyImageUrl: values[7],
          timeline: parseInt(values[8])
        };
        
        leads.push(lead);
      }
    }
    
    return leads;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
}