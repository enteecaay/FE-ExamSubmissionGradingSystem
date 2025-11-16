import { courseClient } from './client';

// Types for course management (will be extended with generated types)
export interface Semester {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Subject {
  id: number;
  code: string;
  name: string;
}

export interface Exam {
  id: number;
  subjectId: number;
  semesterId: number;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
}

export interface CreateExamPayload {
  subjectId: number;
  semesterId: number;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
}

export const courseService = {
  // Semester operations
  async getSemesters(): Promise<Semester[]> {
    try {
      const response = await courseClient.getClient().get<Semester[]>('/api/semesters');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch semesters:', error);
      throw error;
    }
  },

  async getSemesterById(id: number): Promise<Semester> {
    try {
      const response = await courseClient.getClient().get<Semester>(`/api/semesters/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch semester ${id}:`, error);
      throw error;
    }
  },

  async createSemester(payload: Omit<Semester, 'id'>): Promise<Semester> {
    try {
      const response = await courseClient.getClient().post<Semester>('/api/semesters', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to create semester:', error);
      throw error;
    }
  },

  // Subject operations
  async getSubjects(): Promise<Subject[]> {
    try {
      const response = await courseClient.getClient().get<Subject[]>('/api/subjects');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      throw error;
    }
  },

  async getSubjectById(id: number): Promise<Subject> {
    try {
      const response = await courseClient.getClient().get<Subject>(`/api/subjects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch subject ${id}:`, error);
      throw error;
    }
  },

  async createSubject(payload: Omit<Subject, 'id'>): Promise<Subject> {
    try {
      const response = await courseClient.getClient().post<Subject>('/api/subjects', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to create subject:', error);
      throw error;
    }
  },

  // Exam operations
  async getExams(semesterId?: number, subjectId?: number): Promise<Exam[]> {
    try {
      const params = new URLSearchParams();
      if (semesterId) params.append('semesterId', semesterId.toString());
      if (subjectId) params.append('subjectId', subjectId.toString());

      const url = `/api/exams${params.toString() ? '?' + params.toString() : ''}`;
      const response = await courseClient.getClient().get<Exam[]>(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      throw error;
    }
  },

  async getExamById(id: number): Promise<Exam> {
    try {
      const response = await courseClient.getClient().get<Exam>(`/api/exams/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch exam ${id}:`, error);
      throw error;
    }
  },

  async createExam(payload: CreateExamPayload): Promise<Exam> {
    try {
      const response = await courseClient.getClient().post<Exam>('/api/exams', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to create exam:', error);
      throw error;
    }
  },
};

export default courseService;
