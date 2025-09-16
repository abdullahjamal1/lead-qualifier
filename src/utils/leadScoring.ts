import { Lead } from '@/types/lead';

// Authority levels based on job titles
const authorityLevels: Record<string, number> = {
  'ceo': 100, 'chief executive': 100, 'founder': 100, 'president': 100,
  'cto': 95, 'chief technology': 95, 'chief technical': 95,
  'cfo': 95, 'chief financial': 95,
  'coo': 95, 'chief operating': 95,
  'vp': 90, 'vice president': 90,
  'director': 80, 'head of': 75, 'manager': 65,
  'senior': 55, 'lead': 50, 'principal': 60,
  'analyst': 30, 'associate': 25, 'assistant': 20,
  'coordinator': 15, 'specialist': 35, 'officer': 40
};

function getAuthorityScore(designation: string): number {
  const title = designation.toLowerCase();
  
  for (const [keyword, score] of Object.entries(authorityLevels)) {
    if (title.includes(keyword)) {
      return score;
    }
  }
  
  // Default score for unknown titles
  return 30;
}

function getBudgetScore(budget: number): number {
  // Normalize budget score (assuming max reasonable budget is 500k)
  const maxBudget = 500000;
  return Math.min((budget / maxBudget) * 100, 100);
}

function getNeedScore(numberOfPeople: number, revenue: number): number {
  // Combine hiring need and company size (revenue) indicators
  const peopleScore = Math.min((numberOfPeople / 50) * 50, 50); // Max 50 people = 50 points
  const revenueScore = Math.min((revenue / 50000000) * 50, 50); // Max 50M revenue = 50 points
  return peopleScore + revenueScore;
}

function getTimelineScore(weeks: number): number {
  // Shorter timeline = higher urgency = higher score
  if (weeks <= 2) return 100;
  if (weeks <= 4) return 90;
  if (weeks <= 8) return 75;
  if (weeks <= 12) return 60;
  if (weeks <= 16) return 40;
  return 20;
}

export function calculateBANTScore(lead: Lead): Lead {
  const budgetScore = getBudgetScore(lead.budget);
  const authorityScore = getAuthorityScore(lead.designation);
  const needScore = getNeedScore(lead.numberOfPeopleToHire, lead.revenue);
  const timelineScore = getTimelineScore(lead.timeline);
  
  // Weighted average: Budget(25%), Authority(30%), Need(25%), Timeline(20%)
  const bantScore = Math.round(
    (budgetScore * 0.25) + 
    (authorityScore * 0.30) + 
    (needScore * 0.25) + 
    (timelineScore * 0.20)
  );
  
  return {
    ...lead,
    bantScore,
    budgetScore: Math.round(budgetScore),
    authorityScore: Math.round(authorityScore),
    needScore: Math.round(needScore),
    timelineScore: Math.round(timelineScore)
  };
}

export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Hot Lead', color: 'text-success' };
  if (score >= 65) return { label: 'Warm Lead', color: 'text-warning' };
  if (score >= 45) return { label: 'Cold Lead', color: 'text-muted-foreground' };
  return { label: 'Low Priority', color: 'text-muted-foreground' };
}