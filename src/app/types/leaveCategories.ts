// types/leaveCategories.ts
export interface LeaveCategory {
    duration: any;
    id: number;
    category: string;
  }
  
  export interface PaginatedLeaveCategoriesResponse {
    current_page: number;
    data: LeaveCategory[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  }