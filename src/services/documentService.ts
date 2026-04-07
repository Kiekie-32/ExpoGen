import api from './api';

export interface DocumentGenerationData {
  product_id: number;
  consignee_name: string;
  consignee_address: string;
  exporter_name?: string;
  exporter_address?: string;
  product_details: {
    quantity: number;
    unit_price: number;
    net_weight: number;
    gross_weight: number;
  };
  currency: string;
  incoterms: string;
}

export interface ContractGenerationData {
  product_id: number;
  consignee_name: string;
  consignee_address: string;
  quantity: string;
  quantity_value: number;
  price_per_unit: number;
  total_price: number;
  incoterms: string;
  port_name: string;
  payment_terms: string;
  governing_law: string;
  dispute_resolution: string;
}

export const documentService = {
  generateOperationalDocs: async (data: DocumentGenerationData) => {
    const response = await api.post(`/products/${data.product_id}/documents/generate`, data);
    return response.data;
  },
  
  generateContract: async (data: ContractGenerationData) => {
    const response = await api.post(`/products/${data.product_id}/contracts/generate`, data);
    return response.data;
  },
  
  reviewContract: async (contractText: string) => {
    const response = await api.post('/contracts/review', { contract_text: contractText });
    return response.data;
  },
};
