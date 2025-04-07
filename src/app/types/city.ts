// src/types/city.ts
export interface City {
    data: any;
    id: number;
    name: string;
    province_id: number;
    provinces?: { // Make `provinces` optional
      id: number;
      name: string;
    };
  }