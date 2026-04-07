import api from './api';

export interface ComplianceRequirement {
  id: string;
  label: string;
  description: string;
  status: 'done' | 'pending' | 'blocked' | 'review';
  requiresUpload?: boolean;
  uploadedFile?: string | null;
}

export const complianceService = {
  getGhanaCompliance: async (hsCode: string): Promise<ComplianceRequirement[]> => {
    const response = await api.get(`/compliance/ghana/${hsCode}`);
    return response.data;
  },
  getProductCompliance: async (productId: number): Promise<ComplianceRequirement[]> => {
    const response = await api.get(`/products/${productId}/compliance`);
    return response.data;
  },
};
