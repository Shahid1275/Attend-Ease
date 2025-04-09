// types/devices.ts
export interface Location {
  id: number;
  title: string;
}

export interface Device {
  id: number;
  device_id: string;
  MAC: string;  // Make optional if it's not always present
  location_id: number;
  token: string;
  location?: {
    id: number;
    title: string;
  };
}
export interface PaginatedDevicesResponse {
  current_page: number;
  data: Device[];
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