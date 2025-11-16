import { courseClient } from './client';

export interface Rubric {
  id: number;
  examId: number;
  name: string;
  criteria: Array<{
    id: number;
    criterionName: string;
    maxScore: number;
  }>;
}

export interface CreateRubricPayload {
  examId: number;
  name: string;
  rubricCriteria: Array<{
    criterionName: string;
    maxScore: number;
  }>;
}

export const rubricService = {
  async getRubricsByExamId(examId: number): Promise<Rubric[]> {
    try {
      const response = await courseClient.getClient().get<Rubric[]>(`/api/rubrics/${examId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch rubrics for exam ${examId}:`, error);
      throw error;
    }
  },

  async createRubric(payload: CreateRubricPayload): Promise<Rubric> {
    try {
      const response = await courseClient.getClient().post<Rubric>('/api/rubrics', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to create rubric:', error);
      throw error;
    }
  },
};

export default rubricService;
