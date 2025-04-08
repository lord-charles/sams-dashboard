export interface GenderStats {
  totalMale: number;
  totalFemale: number;
  totalMaleLwd: number;
  totalFemaleLwd: number;
  droppedOutMale?: number;
  droppedOutFemale?: number;
}

export interface LearnerStatistics {
  totalLearners: { total: number; current: number };
  promotedLearners: { total: number; current: number };
  disabledLearners: { total: number; current: number };
  newLearners: { total: number; current: number };
  droppedOutLearners: { total: number; current: number };
  averageAge: number;
  malePercentage: number;
  femalePercentage: number;
  genderStats: GenderStats;
  todaysEnrollment?: any[];
  enrollmentSummary?: any;
}

export interface TeacherStatistics {
  totalTeachers: { total: number; current: number };
  activeTeachers: { total: number; current: number };
  inactiveTeachers: { total: number; current: number };
  newTeachers: { total: number; current: number };
  droppedOutTeachers: number;
  averageAge: number;
  malePercentage: number;
  femalePercentage: number;
  genderStats: GenderStats;
}

export interface ApiResponse<T> {
  data: T;
  count?: number;
  success: boolean;
  error?: string;
}
