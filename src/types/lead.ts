export interface Lead {
  leadId: number;
  budget: number;
  designation: string;
  personName: string;
  numberOfPeopleToHire: number;
  revenue: number;
  companyName: string;
  companyImageUrl: string;
  timeline: number;
  bantScore?: number;
  budgetScore?: number;
  authorityScore?: number;
  needScore?: number;
  timelineScore?: number;
}

export interface LeadFilters {
  minScore?: number;
  maxScore?: number;
  minBudget?: number;
  maxBudget?: number;
  sortBy: 'score' | 'budget' | 'timeline' | 'revenue';
  sortOrder: 'asc' | 'desc';
}