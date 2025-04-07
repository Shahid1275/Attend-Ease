// import { Province } from "../types/province";

// export const API_BASE_URL = "http://192.168.50.218/laravel-project/attendance-system/public";

// export const API_ENDPOINTS = {
//   PROVINCES: `${API_BASE_URL}/provinces`,
//   PROVINCE_CITIES: (id: number) => `${API_BASE_URL}/province/cities/${id}`,
// };
// export const getProvince = async (id: number, token: string): Promise<Province> => {
//     const response = await fetch(
//       `${API_BASE_URL}/provinces/${id}`,
//       {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
  
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
  
//     const data = await response.json();
//     return data.data[0]; // Return the first province object from the array
//   };
import { Province } from "../types/province";

export const API_BASE_URL = "http://192.168.50.218/laravel-project/attendance-system/public/api";
//export const API_BASE_URL = "http://192.168.50.218/laravel-project/attendance-system/public/api";

export const API_ENDPOINTS = {
  PROVINCES: `${API_BASE_URL}/provinces`,
  PROVINCE_CITIES: (id: number) => `${API_BASE_URL}/province/cities/${id}`,
  CITIES: `${API_BASE_URL}/cities`,
  CITY: (id: number) => `${API_BASE_URL}/cities/${id}`,
  CITY_LOCATIONS: (id: number) => `${API_BASE_URL}/cities/locations/${id}`,
  CITY_BY_NAME: (name: string) => `${API_BASE_URL}/cities/name/${name}`,
  CITIES_BY_PROVINCE: (provinceId: number) => `${API_BASE_URL}/cities/province/${provinceId}`,
  HOLIDAYS: `${API_BASE_URL}/holidays`,
};

export const getProvince = async (id: number, token: string): Promise<Province> => {
  const response = await fetch(`${API_BASE_URL}/provinces/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data.data[0]; // Return the first province object from the array
};