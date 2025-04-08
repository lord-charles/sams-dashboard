import axios from 'axios';
import { base_url } from '@/app/utils/baseUrl';
import type { ApiResponse } from '../types/dashboard';

const currentYear = new Date().getFullYear();

export const apiEndpoints = {
  states: `${base_url}data-set/get/2023_data/state`,
  home: {
    schoolStats: `${base_url}school-data/school-types-by-state`,
    enrollmentData: `${base_url}school-data/enrollment/completed`
  },
  learners: {
    total: `${base_url}data-set/getLearnerCountByLocation`,
    promoted: `${base_url}data-set/getPromotedLearnersCountByLocation`,
    disabled: `${base_url}data-set/getDisabledLearnersCountByLocation`,
    genderStats: `${base_url}data-set/overallMaleFemaleStat`,
    todaysEnrollment: `${base_url}data-set/fetchSchoolsEnrollmentToday`,
    enrollmentSummary: `${base_url}data-set/fetchState10EnrollmentSummary`
  },
  teachers: {
    total: `${base_url}user/getTeacherCountByLocation`,
    active: `${base_url}user/getTeacherCountByLocation`,
    inactive: `${base_url}user/getTeacherCountByLocation`,
    genderStats: `${base_url}user/overallMaleFemaleStat`
  }
};

export async function fetchApi<T>(
  url: string, 
  method: 'GET' | 'POST' = 'GET',
  params: Record<string, any> = {}
): Promise<ApiResponse<T>> {
  try {
    const response = method === 'POST' 
      ? await axios.post(url, { ...params, enrollmentYear: currentYear })
      : await axios.get(url);

    return {
      data: response.data,
      success: true
    };
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    return {
      data: {} as T,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
