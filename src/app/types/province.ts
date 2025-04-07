export interface Province {
  // updated_at: string | number | Date;
  // created_at: string | number | Date;
  id: number;
  name: string;
}

export interface ProvinceWithCities {
  id: number;
  name: string;
  cities: any[]; // Replace `any` with a proper type for cities if available
}