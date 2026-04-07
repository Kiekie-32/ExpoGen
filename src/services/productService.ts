import api from './api';

export interface ProductData {
  user_id: number;
  product_name: string;
  description: string;
  selected_hs_code: string;
  destination_country: string;
}

export const productService = {
  create: async (data: ProductData) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  getById: async (productId: number) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },
  
  getReadiness: async (productId: number) => {
    const response = await api.get(`/products/${productId}/readiness`);
    return response.data;
  },
  
  uploadDocument: async (productId: number, docData: { document_type: string; file_url: string; verified: boolean }) => {
    const response = await api.post(`/products/${productId}/documents`, docData);
    return response.data;
  },
};
