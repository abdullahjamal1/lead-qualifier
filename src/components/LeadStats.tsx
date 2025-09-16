import { Lead } from '@/types/lead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

interface LeadStatsProps {
  leads: Lead[];
}

export function LeadStats({ leads }: LeadStatsProps) {
  const totalLeads = leads.length;
  const hotLeads = leads.filter(lead => lead.bantScore! >= 80).length;
  const warmLeads = leads.filter(lead => lead.bantScore! >= 65 && lead.bantScore! < 80).length;
  const averageScore = leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + (lead.bantScore || 0), 0) / leads.length) : 0;
  const totalBudget = leads.reduce((sum, lead) => sum + lead.budget, 0);
  
  // Fix NaN issue for average timeline
  const validTimelines = leads.filter(lead => !isNaN(lead.timeline) && lead.timeline > 0);
  const averageTimeline = validTimelines.length > 0 
    ? Math.round(validTimelines.reduce((sum, lead) => sum + lead.timeline, 0) / validTimelines.length) 
    : 0;

  const stats = [
    {
      title: 'Total Leads',
      value: totalLeads.toString(),
      icon: Users,
      color: 'text-linkedin'
    },
    {
      title: 'Hot Leads',
      value: hotLeads.toString(),
      icon: TrendingUp,
      color: 'text-success'
    },
    {
      title: 'Warm Leads',
      value: warmLeads.toString(),
      icon: TrendingUp,
      color: 'text-warning'
    },
    {
      title: 'Avg Score',
      value: averageScore.toString(),
      icon: TrendingUp,
      color: 'text-foreground'
    },
    {
      title: 'Total Budget',
      value: `$${(totalBudget / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'text-success'
    },
    {
      title: 'Avg Timeline',
      value: `${averageTimeline}w`,
      icon: Clock,
      color: 'text-muted-foreground'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <div>
                <div className="text-xs text-muted-foreground">{stat.title}</div>
                <div className="text-lg font-bold text-foreground">{stat.value}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}