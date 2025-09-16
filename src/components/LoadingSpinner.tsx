import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ message = 'Loading more leads...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-3">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-linkedin`} />
          <span className="text-muted-foreground">{message}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface EndOfListProps {
  totalCount: number;
  displayedCount: number;
}

export function EndOfList({ totalCount, displayedCount }: EndOfListProps) {
  return (
    <Card className="w-full">
      <CardContent className="text-center py-8">
        <div className="text-muted-foreground">
          <div className="text-sm">
            Showing all {displayedCount} of {totalCount} leads
          </div>
          <div className="text-xs mt-1">
            You've reached the end of the list
          </div>
        </div>
      </CardContent>
    </Card>
  );
}