import { courseClient } from './client';

export interface Violation {
  id: number;
  submissionId: number;
  type: string;
  description?: string;
  verified: boolean;
  createdAt: string;
}

export interface CreateViolationPayload {
  submissionId: number;
  type: string;
  description?: string;
}

export interface VerifyViolationPayload {
  verified: boolean;
}

export const violationService = {
  async getViolations(status?: boolean): Promise<Violation[]> {
    try {
      const params = new URLSearchParams();
      if (status !== undefined) params.append('status', status.toString());

      const url = `/api/violations${params.toString() ? '?' + params.toString() : ''}`;
      const response = await courseClient.getClient().get<Violation[]>(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch violations:', error);
      throw error;
    }
  },

  async createViolation(payload: CreateViolationPayload): Promise<Violation> {
    try {
      const response = await courseClient.getClient().post<Violation>('/api/violations', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to create violation:', error);
      throw error;
    }
  },

  async verifyViolation(violationId: number, payload: VerifyViolationPayload): Promise<Violation> {
    try {
      const response = await courseClient.getClient().patch<Violation>(
        `/api/violations/${violationId}/verify`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to verify violation ${violationId}:`, error);
      throw error;
    }
  },
};

export default violationService;
