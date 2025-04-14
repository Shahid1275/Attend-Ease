export interface Student {
  id: number;
  name: string;
  email: string;
  contact_no: string;
  program_name: string;
  title: string;
  status: string;
  user_name?: string;
  ICE_contact?: string;
  ICE_email?: string;
  ICE_relation?: string;
  current_address?: string;
  medical_leaves?: number | null;
  casual_leaves?: number | null;
  joining_date?: string;
  releave_date?: string | null;
  user_id?: number;
}

export interface PaginatedStudentResponse {
  current_page: number;
  data: Student[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface StudentResponse {
  data: {
    student: Student[];
    location: string;
  };
}