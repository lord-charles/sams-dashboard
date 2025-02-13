import * as z from "zod";

export const learnerFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  grade: z.string().min(1, "Grade is required"),
  country: z.string().min(1, "Country is required"),
  phoneNumber: z.string().optional(),
  maleAdult: z.string().min(1, "Male adult count is required"),
  femaleAdult: z.string().min(1, "Female adult count is required"),
  maleBelow18: z.string().min(1, "Male below 18 count is required"),
  femaleBelow18: z.string().min(1, "Female below 18 count is required"),
  maleWithDisability: z.string().min(1, "Male with disability count is required"),
  femaleWithDisability: z.string().min(1, "Female with disability count is required"),
  eieStatus: z.string().min(1, "EiE status is required"),
  moreInformation: z.string().optional(),
  selectedStatus: z.string().optional(),
  difficultySeeing: z.number().min(1).max(4),
  difficultyHearing: z.number().min(1).max(4),
  difficultyTalking: z.number().min(1).max(4),
  difficultySelfCare: z.number().min(1).max(4),
  difficultyWalking: z.number().min(1).max(4),
  difficultyRecalling: z.number().min(1).max(4),
});
