export interface LeaveType {
  id: number;
  type: string;
  leave_allowed: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface PaginatedApiResponse {
  current_page: number;
  data: LeaveType[];
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