import { streamText } from 'ai';
import { createSearchTool } from '../tools/search.js';
import { getModel } from '../utils/registry.js';

const SYSTEM_PROMPT = `
Instructions:

You are a helpful AI assistant with access to real-time web search capabilities.

When asked a question, you should:
1. Determine if you need current information to properly answer the user's query
2. If you need current information, search for relevant information using the search tool
3. Analyze all search results to provide accurate, up-to-date information
4. Always cite sources using the [number](url) format, matching the order of search results
5. If multiple sources are relevant, include all of them, and comma separate them
6. Only use information that has a URL available for citation
7. If results are not relevant or helpful, rely on your general knowledge
8. Provide comprehensive and detailed responses based on search results, ensuring thorough coverage of the user's question
9. Use markdown to structure your responses. Use headings to break up the content into sections.

Citation Format:
[number](url)
`;

export function researcher({
  messages,
  model,
  searchMode
}) {
  try {
    const currentDate = new Date().toLocaleString();

    // Create model-specific tools
    const searchTool = createSearchTool(model);

    return {
      model: getModel(model),
      system: `${SYSTEM_PROMPT}\nCurrent date and time: ${currentDate}`,
      messages,
      tools: searchMode ? {
        search: searchTool
      } : {},
      maxSteps: searchMode ? 5 : 1,
    };
  } catch (error) {
    console.error('Error in researcher:', error);
    throw error;
  }
}