// types/locationTypes.ts
export interface City {
    id: number;
    name: string;
    province_id: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  }
  
  export interface Location {
    id: number;
    city_id: number;
    title: string;
    address: string;
    contact_no: string;
    is_active: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    cities: City;
  }
  
  export interface PaginatedApiResponse {
    current_page: number;
    data: Location[];
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