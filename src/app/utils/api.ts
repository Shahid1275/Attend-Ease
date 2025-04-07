
import { API_BASE_URL } from "../constants/apiEndpoints";
import { City } from "../types/city";
import { OfficeTime } from "../types/officeTime";
// utils/api.ts
export const fetchData = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Resource not found");
    }
    const errorData = await response.json();
    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`);
  }

  return response.json();
};
// Fetch data utility function
// export const fetchData = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
//   const url = `${API_BASE_URL}${endpoint}`;
//   const response = await fetch(url, options);

//   if (!response.ok) {
//     const errorData = await response.json();
//     console.error("API Error Details:", {
//       status: response.status,
//       statusText: response.statusText,
//       url: response.url,
//       errorData,
//     });
//     throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`);
//   }

//   return response.json();
// };
// Create a new province
export const createProvince = async (data: { name: string }, token: string) => {
  return fetchData<{ message: string }>("/provinces/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// Update a province
export const updateProvince = async (id: number, data: { name: string }, token: string) => {
  return fetchData<{ message: string }>(`/provinces/${id}/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// Delete a province
export const deleteProvince = async (id: number, token: string) => {
  const response = await fetch(`/api/provinces/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete province");
  }
};
// Get province details
export const getProvince = async (id: number, token: string) => {
  return fetchData<{
      data: any; id: number; name: string 
}>(`/provinces/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get province cities
export const getProvinceCities = async (id: number, token: string) => {
  return fetchData<{ id: number; name: string; cities: any[] }>(`/province/cities/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getProvinces = async (token: string) => {
  const response = await fetch("/api/provinces", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch provinces");
  }

  return await response.json();
};


// Utility function for fetching data
// export const fetchData = async <T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> => {
//   const url = `${API_BASE_URL}${endpoint}`;
  
//   try {
//     const response = await fetch(url, options);

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("API Error Details:", {
//         status: response.status,
//         statusText: response.statusText,
//         url: response.url,
//         errorData,
//       });
//       throw new Error(
//         `HTTP error! Status: ${response.status}, Message: ${
//           errorData.message || "Unknown error"
//         }`
//       );
//     }

//     return response.json();
//   } catch (error) {
//     console.error("Fetch error:", error);
//     throw new Error("Failed to fetch data");
//   }
// };
// Fetch holidays
export const getHolidays = async (token: string) => {
  return fetchData<{ holidays: { id: number; name: string; date: string }[] }>(
    `/holidays`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => response.holidays);
};

// Create a new city
export const createCity = async (data: { name: string, province_id: number }, token: string) => {
  return fetchData<{ message: string }>("/api/cities/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};
export const getCities = async (token: string) => {
  return fetchData<Response>("cities", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};


// Update a city
export const updateCity = async (id: number, data: { name: string; province_id: number }, token: string) => {
  const response = await fetch(`${API_BASE_URL}/cities/${id}/edit`, { // <-- Removed "/edit"
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update city: ${errorData.message || response.statusText}`);
  }

  return await response.json();
};


// Delete a city
export const deleteCity = async (id: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete city");
  }
};

// Get city details
// utils/api.ts
export const getCity = async (id: number, token: string) => {
  return fetchData<City>(`/cities/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Get city locations
export const getCityLocations = async (id: number, token: string) => {
  return fetchData<{ id: number; name: string; locations: any[] }>(`/api/cities/locations/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get city by name
export const getCityByName = async (name: string, token: string) => {
  return fetchData<{ id: number; name: string; province_id: number }>(`/api/cities/name/${name}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get cities by province
export const getCitiesByProvince = async (provinceId: number, token: string) => {
  return fetchData<{ id: number; name: string; province_id: number }[]>(`/api/cities/province/${provinceId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fetch all batches
export const getBatches = async (token: string) => {
  return fetchData<{
    current_page: number;
    data: {
      id: number;
      title: string;
      session: string;
      leaves_allowed: number;
      working_days: number;
    }[];
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
  }>("/batches", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Create a new batch
export const createBatch = async (
  data: { title: string; session: string; leaves_allowed: number; working_days: number },
  token: string
) => {
  return fetchData<{ message: string }>("/batches/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// Update a batch
// api.ts
export const updateBatch = async (
  id: number,
  batchData: {
    title: string;
    session: string;
    leaves_allowed: number;
    start_date: string;
    end_date: string | null; // Allow null to match your EditBatchPage logic
  },
  token: string
) => {
  // Use the full external Laravel API URL
  const apiUrl = `http://192.168.50.218/laravel-project/attendance-system/public/api/batches/${id}/edit`;

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchData),
    });

    if (!response.ok) {
      const text = await response.text(); // Get raw response text first
      let errorMessage = `Failed to update batch: ${response.status} ${response.statusText}`;

      // Handle specific HTTP status codes
      switch (response.status) {
        case 400:
          errorMessage = "Invalid data provided";
          break;
        case 404:
          errorMessage = "Batch not found";
          break;
        case 401:
          errorMessage = "Unauthorized - Invalid or expired token";
          break;
        case 500:
          errorMessage = "Server error - Please try again later";
          break;
        default:
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            console.error("Non-JSON response from server:", text); // Log HTML for debugging
            errorMessage += ` - Unexpected server response`;
          }
      }

      throw new Error(errorMessage);
    }

    return response.json(); // Successful response should return JSON like { "data": { ... } }
  } catch (err) {
    throw err instanceof Error ? err : new Error("An unexpected error occurred during batch update");
  }
};
// Delete a batch
export const deleteBatch = async (id: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/batches/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete batch");
  }
};

// Get batch details
export const getBatch = async (id: number, token: string) => {
  return fetchData<{
    data: any;
    id: number;
    title: string;
    session: string;
    leaves_allowed: number;
    working_days: number;
  }>(`/batches/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get batch leaves
export const getBatchLeaves = async (id: number, token: string) => {
  return fetchData<{
    id: number;
    title: string;
    session: string;
    leaves_allowed: number;
    working_days: number;
    leaves: any[]; // Adjust the type based on your API response
  }>(`/batches/${id}/leaves`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update batch leave quota
export const updateBatchLeaveQuota = async (
  id: number,
  data: { leaves_allowed: number },
  token: string
) => {
  return fetchData<{ message: string }>(`/batches/${id}/leaves`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// Get batch by name
export const getBatchByName = async (name: string, token: string) => {
  return fetchData<{
    id: number;
    title: string;
    session: string;
    leaves_allowed: number;
    working_days: number;
  }>(`/batches/name/${name}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Office Times API functions
export const getOfficeTimes = async (token: string) => {
  return fetchData<PaginatedOfficeTimes>("/officetimes", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createOfficeTime = async (
  data: {
    day: string;
    is_working_day: number;
    start_time: string | null;
    end_time: string | null;
  },
  token: string
) => {
  return fetchData<{
      error: boolean;
      error: string; message: string 
}>("/officetimes/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// In your api.ts or similar file
export const updateOfficeTime = async (
  id: number,
  data: OfficeTimeData,
  token: string
) => {
  const response = await fetch(`/api/officetimes/${id}`, {
    method: "PUT", // Using POST if PUT isn't allowed
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  // ... rest of the function
};
export const deleteOfficeTime = async (id: number, token: string) => {
  return fetchData<{ message: string }>(`/officetimes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOfficeTime = async (id: number, token: string) => {
  return fetchData<{ data: OfficeTime }>(`/officetimes/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};