import { create } from 'zustand';

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

export interface Submission {
  id: number;
  examId: number;
  studentId: string;
  submittedAt: string;
  assignedExaminerId?: number;
  totalScore?: number;
  status: string;
}

interface CourseState {
  semesters: Semester[];
  subjects: Subject[];
  exams: Exam[];
  submissions: Submission[];
  selectedSemesterId: number | null;
  selectedExamId: number | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSemesters: (semesters: Semester[]) => void;
  setSubjects: (subjects: Subject[]) => void;
  setExams: (exams: Exam[]) => void;
  setSubmissions: (submissions: Submission[]) => void;
  setSelectedSemesterId: (id: number | null) => void;
  setSelectedExamId: (id: number | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCourseData: () => void;
}

const useCourseStore = create<CourseState>((set) => ({
  semesters: [],
  subjects: [],
  exams: [],
  submissions: [],
  selectedSemesterId: null,
  selectedExamId: null,
  isLoading: false,
  error: null,

  setSemesters: (semesters) => set({ semesters }),
  setSubjects: (subjects) => set({ subjects }),
  setExams: (exams) => set({ exams }),
  setSubmissions: (submissions) => set({ submissions }),
  setSelectedSemesterId: (selectedSemesterId) => set({ selectedSemesterId }),
  setSelectedExamId: (selectedExamId) => set({ selectedExamId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  clearCourseData: () => set({
    semesters: [],
    subjects: [],
    exams: [],
    submissions: [],
    selectedSemesterId: null,
    selectedExamId: null,
    error: null,
  }),
}));

export default useCourseStore;
