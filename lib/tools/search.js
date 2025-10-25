import { tool } from 'ai';
import { getSearchSchemaForModel } from '../schema/search.js';

/**
 * Creates a search tool with the appropriate schema for the given model.
 */
export function createSearchTool(fullModel) {
  return tool({
    description: 'Search the web for information',
    parameters: getSearchSchemaForModel(fullModel),
    execute: async ({
      query,
      max_results = 20,
      search_depth = 'basic',
      include_domains = [],
      exclude_domains = []
    }) => {
      try {
        console.log('Executing search for:', query);
        
        // Use Tavily API for search
        const apiKey = process.env.REACT_APP_TAVILY_API_KEY;
        
        if (!apiKey) {
          console.warn('TAVILY_API_KEY not found, returning mock results');
          return {
            results: [
              {
                title: 'Search functionality not configured',
                url: '#',
                content: 'Please configure REACT_APP_TAVILY_API_KEY to enable search functionality.'
              }
            ],
            query,
            images: [],
            number_of_results: 1
          };
        }

        // Tavily API requires a minimum of 5 characters in the query
        const filledQuery = query.length < 5 ? query + ' '.repeat(5 - query.length) : query;
        
        const response = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            api_key: apiKey,
            query: filledQuery,
            max_results: Math.max(max_results || 10, 5),
            search_depth: search_depth,
            include_images: true,
            include_image_descriptions: true,
            include_domains: include_domains.length > 0 ? include_domains : undefined,
            exclude_domains: exclude_domains.length > 0 ? exclude_domains : undefined
          })
        });

        if (!response.ok) {
          throw new Error(`Tavily API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        const searchResults = {
          results: data.results?.map(result => ({
            title: result.title || '',
            url: result.url || '',
            content: result.content || ''
          })) || [],
          query: data.query || query,
          images: data.images?.map(image => typeof image === 'string' ? image : image.url) || [],
          number_of_results: data.results?.length || 0
        };

        console.log('Search completed successfully');
        return searchResults;
        
      } catch (error) {
        console.error('Search error:', error);
        return {
          results: [
            {
              title: 'Search Error',
              url: '#',
              content: `Search failed: ${error.message}`
            }
          ],
          query,
          images: [],
          number_of_results: 0
        };
      }
    }
  });
}

// Default export for backward compatibility
export const searchTool = createSearchTool('openai:gpt-4o-mini');

export async function search(
  query,
  maxResults = 10,
  searchDepth = 'basic',
  includeDomains = [],
  excludeDomains = []
) {
  return searchTool.execute(
    {
      query,
      max_results: maxResults,
      search_depth: searchDepth,
      include_domains: includeDomains,
      exclude_domains: excludeDomains
    },
    {
      toolCallId: 'search',
      messages: []
    }
  );
}