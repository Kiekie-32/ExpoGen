import api from './api';

export interface HSSuggestion {
  code?: string;
  hs_code?: string;
  description: string;
  relevance?: number;
}

export const hsCodeService = {
  search: async (query: string, sector?: string, limit = 10): Promise<HSSuggestion[]> => {
    const response = await api.get('/hs-codes/search', {
      params: { q: query, sector, limit },
    });
    return response.data;
  },
  
  getDetails: async (hsCode: string) => {
    const response = await api.get(`/hs-codes/${hsCode}`);
    return response.data;
  },
};
