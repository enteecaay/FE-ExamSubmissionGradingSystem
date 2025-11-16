import { courseClient } from './client';

export interface Examiner {
  id: number;
  fullName: string;
  email: string;
}

export interface CreateExaminerPayload {
  fullName: string;
  email: string;
}

export interface Submission {
  id: number;
  examId: number;
  studentId: string;
  submittedAt: string;
  assignedExaminerId?: number;
  totalScore?: number;
  status: string;
}

export interface GradeSubmissionPayload {
  totalScore: number;
}

export const submissionService = {
  // Examiner operations
  async getExaminers(): Promise<Examiner[]> {
    try {
      const response = await courseClient.getClient().get<Examiner[]>('/api/examiners');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch examiners:', error);
      throw error;
    }
  },

  async createExaminer(payload: CreateExaminerPayload): Promise<Examiner> {
    try {
      const response = await courseClient.getClient().post<Examiner>('/api/examiners', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to create examiner:', error);
      throw error;
    }
  },

  // Submission operations
  async getSubmissions(examId?: number): Promise<Submission[]> {
    try {
      const params = new URLSearchParams();
      if (examId) params.append('examId', examId.toString());

      const url = `/api/submissions${params.toString() ? '?' + params.toString() : ''}`;
      const response = await courseClient.getClient().get<Submission[]>(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      throw error;
    }
  },

  async assignSubmission(submissionId: number, examinerId: number): Promise<Submission> {
    try {
      const response = await courseClient.getClient().patch<Submission>(
        `/api/submissions/${submissionId}/assign/${examinerId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to assign submission ${submissionId}:`, error);
      throw error;
    }
  },

  async gradeSubmission(submissionId: number, payload: GradeSubmissionPayload): Promise<Submission> {
    try {
      const response = await courseClient.getClient().patch<Submission>(
        `/api/submissions/${submissionId}/grade`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to grade submission ${submissionId}:`, error);
      throw error;
    }
  },
};

export default submissionService;
