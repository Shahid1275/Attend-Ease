export interface OfficeTime {
    length: number;
    id: number;
    day: string;
    is_working_day: number; // 1 for true, 0 for false
    start_time: string | null;
    end_time: string | null;
  }
  
  export interface PaginatedOfficeTimes {
    current_page: number;
    data: OfficeTime[];
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