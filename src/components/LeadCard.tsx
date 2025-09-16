import { Lead } from '@/types/lead';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building2, Calendar, DollarSign, Users, User } from 'lucide-react';
import { getScoreLabel } from '@/utils/leadScoring';

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const scoreData = getScoreLabel(lead.bantScore || 0);
  
  return (
    <Card className="w-full hover:shadow-elevated transition-all duration-300 border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-linkedin-light rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-linkedin" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{lead.personName}</h3>
              <p className="text-sm text-muted-foreground">{lead.designation}</p>
              <p className="text-sm font-medium text-linkedin">{lead.companyName}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{lead.bantScore}</div>
            <Badge variant={lead.bantScore! >= 65 ? "default" : "secondary"} className={scoreData.color}>
              {scoreData.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-success" />
            <div>
              <div className="text-sm text-muted-foreground">Budget</div>
              <div className="font-semibold">${lead.budget.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-warning" />
            <div>
              <div className="text-sm text-muted-foreground">Timeline</div>
              <div className="font-semibold">{lead.timeline} weeks</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-linkedin" />
            <div>
              <div className="text-sm text-muted-foreground">Hiring Need</div>
              <div className="font-semibold">{lead.numberOfPeopleToHire} people</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Revenue</div>
              <div className="font-semibold">${(lead.revenue / 1000000).toFixed(1)}M</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground">BANT Breakdown</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Budget</span>
              <span className="text-xs font-medium">{lead.budgetScore}%</span>
            </div>
            <Progress value={lead.budgetScore} className="h-1" />
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Authority</span>
              <span className="text-xs font-medium">{lead.authorityScore}%</span>
            </div>
            <Progress value={lead.authorityScore} className="h-1" />
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Need</span>
              <span className="text-xs font-medium">{lead.needScore}%</span>
            </div>
            <Progress value={lead.needScore} className="h-1" />
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Timeline</span>
              <span className="text-xs font-medium">{lead.timelineScore}%</span>
            </div>
            <Progress value={lead.timelineScore} className="h-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}