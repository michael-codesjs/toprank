import axios from 'axios';

const SERPER_API_KEY = process.env.SERPER_API_KEY;

export const serperClient = axios.create({
  baseURL: 'https://google.serper.dev',
  headers: {
    'X-API-KEY': SERPER_API_KEY,
    'Content-Type': 'application/json',
  },
});

export const searchAmazon = async (brandName: string) => {
  const response = await serperClient.post('/search', {
    q: `site:amazon.com "${brandName}"`,
  });
  return response.data.organic || [];
};
