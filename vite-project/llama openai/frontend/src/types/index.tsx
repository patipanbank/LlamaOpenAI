export interface Subject {
  name: string;
  thresholds: {
    A: number;
    'B+': number;
    B: number;
    'C+': number;
    C: number;
    'D+': number;
    D: number;
    F: number;
  };
}

export interface GradeData {
  summary: string;
  data: Record<string, string | number>[];
}

export interface Grade {
  _id: string;
  subjects: Subject[];
  gradeData: GradeData;
  createdAt: Date;
} 