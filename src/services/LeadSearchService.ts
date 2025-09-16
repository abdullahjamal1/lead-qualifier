import Fuse from 'fuse.js';
import { Lead } from '@/types/lead';

export class LeadSearchService {
  private fuse: Fuse<Lead>;

  constructor(leads: Lead[]) {
    const options = {
      // Include score and matches for highlighting
      includeScore: true,
      includeMatches: true,
      
      // Threshold for matching (0.0 = perfect match, 1.0 = match anything)
      threshold: 0.3,
      
      // Location where match is expected to be found
      location: 0,
      
      // Machine word location
      distance: 100,
      
      // At what point does the match algorithm give up
      maxPatternLength: 32,
      
      // Minimum number of characters that must be matched
      minMatchCharLength: 1,
      
      // Fields to search in with weights
      keys: [
        {
          name: 'personName',
          weight: 0.3
        },
        {
          name: 'companyName',
          weight: 0.3
        },
        {
          name: 'designation',
          weight: 0.2
        },
        {
          name: 'leadId',
          weight: 0.1
        },
        {
          name: 'bantScore',
          weight: 0.1
        }
      ]
    };

    this.fuse = new Fuse(leads, options);
  }

  search(query: string): Lead[] {
    if (!query.trim()) {
      return [];
    }

    const results = this.fuse.search(query);
    return results.map(result => result.item);
  }

  // Update the search index when leads change
  updateIndex(leads: Lead[]) {
    this.fuse.setCollection(leads);
  }

  // Get search suggestions based on partial input
  getSuggestions(query: string, limit: number = 5): string[] {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    const results = this.fuse.search(query);
    const suggestions = new Set<string>();

    results.slice(0, limit * 2).forEach(result => {
      const item = result.item;
      
      // Add company names
      if (item.companyName.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(item.companyName);
      }
      
      // Add person names
      if (item.personName.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(item.personName);
      }
      
      // Add designations
      if (item.designation.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(item.designation);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }
}