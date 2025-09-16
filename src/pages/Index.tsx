import { useState, useEffect, useMemo } from 'react';
import { Lead, LeadFilters } from '@/types/lead';
import { parseLeadsFromCSV } from '@/utils/csvParser';
import { calculateBANTScore } from '@/utils/leadScoring';
import { LeadSearchService } from '@/services/LeadSearchService';
import { LeadCard } from '@/components/LeadCard';
import { LeadFilters as LeadFiltersComponent } from '@/components/LeadFilters';
import { LeadStats } from '@/components/LeadStats';
import { SearchInput } from '@/components/SearchInput';
import { LoadingSpinner, EndOfList } from '@/components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInfiniteScroll, useIntersectionObserver } from '@/hooks/useInfiniteScroll';

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<LeadFilters>({
    sortBy: 'score',
    sortOrder: 'desc'
  });
  const { toast } = useToast();

  // Create search service instance
  const searchService = useMemo(() => {
    if (leads.length > 0) {
      return new LeadSearchService(leads);
    }
    return null;
  }, [leads]);

  // Infinite scroll for leads
  const {
    displayedItems: displayedLeads,
    loading: loadingMore,
    hasMore,
    loadMore,
    totalItems,
    displayedCount
  } = useInfiniteScroll(filteredLeads, 20);

  // Intersection observer for infinite scroll
  const loadMoreRef = useIntersectionObserver(loadMore);

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [leads, filters, searchTerm, searchResults]);

  // Handle search with Fuse.js
  useEffect(() => {
    if (!searchService) return;

    if (searchTerm.trim()) {
      const results = searchService.search(searchTerm);
      const suggestions = searchService.getSuggestions(searchTerm, 5);
      setSearchResults(results);
      setSearchSuggestions(suggestions);
    } else {
      setSearchResults([]);
      setSearchSuggestions([]);
    }
  }, [searchTerm, searchService]);

  const loadLeads = async () => {
    try {
      const rawLeads = await parseLeadsFromCSV();
      const scoredLeads = rawLeads.map(calculateBANTScore);
      setLeads(scoredLeads);
      toast({
        title: "Leads loaded successfully",
        description: `Processed ${scoredLeads.length} leads with BANT scoring.`,
      });
    } catch (error) {
      toast({
        title: "Error loading leads",
        description: "Failed to load and process lead data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    // Start with search results if there's a search term, otherwise use all leads
    let filtered = searchTerm.trim() ? searchResults : [...leads];

    // Apply score filters
    if (filters.minScore !== undefined) {
      filtered = filtered.filter(lead => (lead.bantScore || 0) >= filters.minScore!);
    }
    if (filters.maxScore !== undefined) {
      filtered = filtered.filter(lead => (lead.bantScore || 0) <= filters.maxScore!);
    }

    // Apply budget filters
    if (filters.minBudget !== undefined) {
      filtered = filtered.filter(lead => lead.budget >= filters.minBudget!);
    }
    if (filters.maxBudget !== undefined) {
      filtered = filtered.filter(lead => lead.budget <= filters.maxBudget!);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (filters.sortBy) {
        case 'score':
          aValue = a.bantScore || 0;
          bValue = b.bantScore || 0;
          break;
        case 'budget':
          aValue = a.budget;
          bValue = b.budget;
          break;
        case 'timeline':
          aValue = a.timeline;
          bValue = b.timeline;
          break;
        case 'revenue':
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        default:
          return 0;
      }

      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredLeads(filtered);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-linkedin border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold text-foreground">Loading Lead Scoring System</h1>
          <p className="text-muted-foreground">Processing leads with BANT methodology...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-linkedin text-white shadow-elevated">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Lead Scoring System</h1>
              <p className="text-white/90">BANT methodology for sales prioritization</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Stats Overview */}
        <LeadStats leads={filteredLeads} />

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Search Leads</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  suggestions={searchSuggestions}
                  placeholder="Search by name, company, or designation..."
                />
              </CardContent>
            </Card>
          </div>
          
          <LeadFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Results Summary */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Showing {displayedCount} of {filteredLeads.length} leads
                {leads.length !== filteredLeads.length && ` (${leads.length} total)`}
              </span>
              <span className="text-sm font-medium text-linkedin">
                Sorted by {filters.sortBy} ({filters.sortOrder === 'desc' ? 'High to Low' : 'Low to High'})
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedLeads.map((lead) => (
            <LeadCard key={lead.leadId} lead={lead} />
          ))}
        </div>

        {/* Loading More Indicator */}
        {loadingMore && (
          <LoadingSpinner message="Loading more leads..." />
        )}

        {/* Load More Trigger (Invisible) */}
        {hasMore && !loadingMore && (
          <div ref={loadMoreRef} className="h-4" />
        )}

        {/* End of List */}
        {!hasMore && displayedLeads.length > 0 && (
          <EndOfList totalCount={filteredLeads.length} displayedCount={displayedCount} />
        )}

        {filteredLeads.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No leads found</h3>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
