import 'dotenv/config';
import axios from 'axios';
// The env variable name is SERPER_API_KEY but contains a SerpApi key
const SERPAPI_KEY = process.env.SERPER_API_KEY;

if (!SERPAPI_KEY) {
  console.error('SERPAPI_KEY (via SERPER_API_KEY) is missing in process.env');
}

export const serpapiClient = axios.create({
  baseURL: 'https://serpapi.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchAmazon = async (brandName: string) => {
  try {
    const query = `site:amazon.com "${brandName}"`;
    console.log(`Searching SerpApi for: ${query}`);

    const response = await serpapiClient.get('/search', {
      params: {
        api_key: SERPAPI_KEY,
        engine: 'google',
        q: query,
        num: 10,
      },
    });

    // SerpApi returns 'organic_results'
    const results = response.data.organic_results || [];
    console.log(`SerpApi found ${results.length} results`);
    return results;
  } catch (error: any) {
    console.error('SerpApi Execution Failed:', error?.response?.data || error.message);
    throw error;
  }
};
