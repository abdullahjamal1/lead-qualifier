import { useState } from 'react';
import { LeadFilters as FiltersType } from '@/types/lead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface LeadFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

export function LeadFilters({ filters, onFiltersChange }: LeadFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key: keyof FiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FiltersType = {
      sortBy: 'score',
      sortOrder: 'desc'
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Filters & Sorting</CardTitle>
          <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs">
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sort By</Label>
            <Select value={localFilters.sortBy} onValueChange={(value: any) => handleFilterChange('sortBy', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">BANT Score</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="timeline">Timeline</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sort Order</Label>
            <Select value={localFilters.sortOrder} onValueChange={(value: any) => handleFilterChange('sortOrder', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">High to Low</SelectItem>
                <SelectItem value="asc">Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {localFilters.minScore !== undefined && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Minimum Score: {localFilters.minScore}
            </Label>
            <Slider
              value={[localFilters.minScore]}
              onValueChange={([value]) => handleFilterChange('minScore', value)}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
        )}
        
        {localFilters.minBudget !== undefined && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Minimum Budget: ${localFilters.minBudget.toLocaleString()}
            </Label>
            <Slider
              value={[localFilters.minBudget]}
              onValueChange={([value]) => handleFilterChange('minBudget', value)}
              max={200000}
              min={0}
              step={5000}
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}