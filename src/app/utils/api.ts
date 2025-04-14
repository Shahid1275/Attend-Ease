
import { API_BASE_URL } from "../constants/apiEndpoints";
import { City } from "../types/city";
import { PaginatedDegreeProgramResponse } from "../types/degreeProgram";
import { Device, PaginatedDevicesResponse } from "../types/devices";
import { LeaveCategory, PaginatedLeaveCategoriesResponse } from "../types/leaveCategories";
import { LeaveType, PaginatedApiResponse } from "../types/leaveTypes";
import { OfficeTime, PaginatedOfficeTimes } from "../types/officeTime";
import { Permission } from "../types/permissionTypes";
import { PaginatedStudentResponse, Student, StudentResponse } from "../types/student";
// utils/api.ts
// export const fetchData = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
//   const url = `${API_BASE_URL}${endpoint}`;
//   const response = await fetch(url, options);

//   if (!response.ok) {
//     if (response.status === 404) {
//       throw new Error("Resource not found");
//     }
//     const errorData = await response.json();
//     throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`);
//   }

//   return response.json();
// };

export const fetchData = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers, 
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;

        // Handle Laravel validation errors
        if (errorData.errors && typeof errorData.errors === "object") {
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
            .join("; ");
          errorMessage += ` (Validation errors: ${validationErrors})`;
        }
      } catch (e) {
        errorMessage += ` - Unable to parse error response`;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    // Debug: Log the raw response for troubleshooting
    console.log(`Raw API response for ${endpoint}:`, data);
    return data as T;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error instanceof Error ? error : new Error("Network request failed");
  }
};
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
      // error: boolean;
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
  data: OfficeTime,
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
export const getLeaveTypes = async (token: string) => {
  return fetchData<PaginatedApiResponse>("/leavetypes", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createLeaveType = async (
  data: { type: string; leave_allowed: number },
  token: string
) => {
  return fetchData<{ message: string }>("/leavetypes/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

// In your utils/api.ts
export const getLeaveType = async (id: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/leavetypes/${id}/edit`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch leave type");
  }

  const result = await response.json();
  if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
    throw new Error("Leave type data not found in response");
  }

  return result.data[0]; // Return the first item in the data array
};

export const updateLeaveType = async (
  id: number,
  data: { type: string; leave_allowed: number },
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/leavetypes/${id}/edit`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update leave type");
  }

  return response.json();
};
export const deleteLeaveType = async (id: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/leavetypes/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete leave type");
  }
};


// Leave Categories CRUD functions
export const getLeaveCategories = async (token: string): Promise<PaginatedLeaveCategoriesResponse> => {
  const response = await fetchData<PaginatedLeaveCategoriesResponse>('/leavecategories', {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};
export const getLeaveCategory = async (id: number, token: string): Promise<LeaveCategory> => {
  const response = await fetch(`${API_BASE_URL}/leavecategories/${id}/edit`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch leave category");
  }

  const result = await response.json();
  console.log("Raw API Response for getLeaveCategory:", result); // Debug log

  let leaveCategoryData;
  if (result.data) {
    if (Array.isArray(result.data)) {
      if (result.data.length === 0) {
        throw new Error("Leave category data is empty");
      }
      leaveCategoryData = result.data[0];
    } else {
      leaveCategoryData = result.data;
    }
  } else {
    throw new Error("Leave category data not found in response");
  }

  if (!leaveCategoryData || !leaveCategoryData.category) {
    throw new Error("Leave category data is incomplete");
  }

  return leaveCategoryData;
};

export const createLeaveCategory = async (category: Omit<LeaveCategory, 'id'>, token: string): Promise<LeaveCategory> => {
  const response = await fetchData<{ data: LeaveCategory }>('/leavecategories/create', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  });
  return response.data;
};

export const updateLeaveCategory = async (
  id: number,
  data: { category: string; duration: number },
  token: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/leavecategories/${id}/edit`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }
};

export const deleteLeaveCategory = async (id: number, token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/leavecategories/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete leave category');
  }
};


// export const fetchDevices = async (url: string, options: RequestInit = {}): Promise<PaginatedDevicesResponse> => {
//   const response = await fetch(url, options);
//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   return await response.json();
// };

// export const deleteDevice = async (id: number, token: string): Promise<void> => {
//   const response = await fetch(`/api/devices/${id}`, {
//     method: 'DELETE',
//     headers: {
//       'Accept': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     },
//   });
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'Failed to delete device');
//   }
// };


 
// utils/api.ts
export const getDevices = async (token: string): Promise<PaginatedDevicesResponse> => {
  const response = await fetchData<PaginatedDevicesResponse>('/devices', {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

export const getDevice = async (id: number, token: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

export const createDevice = async (device: Omit<Device, 'id'>, token: string): Promise<Device> => {
  const response = await fetchData<{ data: Device }>('/devices/create', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(device),
  });
  return response.data;
};

export const updateDevice = async (
  id: number,
  data: Partial<Device>,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/devices/${id}/edit`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }
};

export const deleteDevice = async (id: number, token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete device');
  }
};

export const getDegreePrograms = async (token: string) => {
  return fetchData<PaginatedDegreeProgramResponse>("/degreeprograms", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createDegreeProgram = async (
  data: { program_name: string },
  token: string
) => {
  return fetchData<{ message: string }>("/degreeprograms/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

export const getDegreeProgram = async (id: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/degreeprograms/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch degree program");
  }

  const result = await response.json();
  if (!result.data || typeof result.data !== "object" || !result.data.program_name) {
    throw new Error("Degree program data not found in response");
  }

  return result.data; // Return the data object directly
};
export const updateDegreeProgram = async (
  id: number,
  data: { program_name: string },
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/degreeprograms/${id}/edit`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update degree program");
  }

  return response.json();
};

export const deleteDegreeProgram = async (id: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/degreeprograms/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete degree program");
  }
};

export const getDegreeProgramByName = async (name: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/degreeprograms/name/${encodeURIComponent(name)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch degree program by name");
  }

  return response.json();
};

export type { PaginatedDegreeProgramResponse };
// src/utils/permissionApi.ts
export const fetchPermissions = async (token: string, page: number = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/permissions?page=${page}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch permissions');
    }

    const data = await response.json();
    
    // Ensure the response has the expected structure
    if (!data || !Array.isArray(data.data)) {
      throw new Error('Invalid permissions data format');
    }

    return data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

export const fetchRoles = async (token: string, page: number = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/roles?page=${page}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch roles');
    }

    const data = await response.json();
    
    // Ensure the response has the expected structure
    if (!data || !Array.isArray(data.data)) {
      throw new Error('Invalid roles data format');
    }

    return data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const getLocations = async (token: string, page = 1) => {
  return fetchData<PaginatedApiResponse>(`/locations?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getLocation = async (id: number, token: string): Promise<Location> => {
  const response = await fetch(`${API_BASE_URL}/locations/${id}/edit`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch location");
  }

  const result = await response.json();
  
  // Handle different response structures
  if (result.data) {
    if (Array.isArray(result.data) ){
      if (result.data.length === 0) {
        throw new Error("Location not found");
      }
      return result.data[0];
    }
    return result.data;
  }
  
  throw new Error("Invalid location data format");
};




export const updateLocation = async (
  id: number,
  data: {
    city_id: number;
    title: string;
    address: string;
    contact_no: string;
    is_active: boolean;
  },
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...data,
      is_active: data.is_active ? 1 : 0,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (errorData.errors) {
      const errorMessages = Object.values(errorData.errors).flat().join(", ");
      throw new Error(errorMessages);
    }
    throw new Error(errorData.message || "Failed to update location");
  }

  return await response.json();
};

export const createLocation = async (
  data: {
    city_id: number;
    title: string;
    address: string;
    contact_no: string;
    is_active: boolean;
  },
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/locations/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...data,
      is_active: data.is_active ? 1 : 0,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (errorData.errors) {
      const errorMessages = Object.values(errorData.errors).flat().join(", ");
      throw new Error(errorMessages);
    }
    throw new Error(errorData.message || "Failed to create location");
  }

  return await response.json();
};
export const deleteLocation = async (id: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete location");
  }

  return true;
};

export const getLocationByName = async (name: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/locations/name/${name}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch location by name");
  }

  return response.json();
};


export const getStudents = async (token: string): Promise<PaginatedStudentResponse> => {
  try {
    const response = await fetchData<PaginatedStudentResponse>("/students", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Debug: Log the raw response to inspect its structure
    console.log("Raw API response in getStudents:", response);

    // Case 1: Expected paginated response { current_page, data: [...], ... }
    if (response && typeof response === "object" && Array.isArray(response.data)) {
      return response as PaginatedStudentResponse;
    }

    // Case 2: Unexpected array response [{...}, {...}]
    if (Array.isArray(response)) {
      console.warn("Received array instead of paginated response, normalizing...");
      return {
        current_page: 1,
        data: response, // Use the array as the data field
        total: response.length,
        per_page: response.length,
        last_page: 1,
        first_page_url: "",
        last_page_url: "",
        next_page_url: null,
        prev_page_url: null,
        path: "",
        from: 1,
        to: response.length,
        links: [],
      };
    }

    // Case 3: Invalid response
    throw new Error(
      "Invalid response format: Expected a paginated response with a 'data' array or an array of students."
    );
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while fetching students."
    );
  }
};

export const createStudent = async (data: Omit<Student, "id">, token: string) => {
  return fetchData<{ message: string; student: Student }>("/students/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

export const getStudent = async (id: number, token: string): Promise<{ student: Student; location: string }> => {
  try {
    const response = await fetchData<StudentResponse>(`/students/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // Debug: Log the raw response
    console.log(`Raw API response for /students/${id}:`, response);

    // Validate response structure
    if (
      !response ||
      typeof response !== "object" ||
      !response.data ||
      typeof response.data !== "object" ||
      !Array.isArray(response.data.student) ||
      typeof response.data.location !== "string"
    ) {
      throw new Error("Invalid response format: Expected { data: { student: array, location: string } }");
    }

    // Check if the student array is empty
    if (response.data.student.length === 0) {
      throw new Error(`No student found for ID ${id}`);
    }

    // Return the first student and location
    return {
      student: response.data.student[0],
      location: response.data.location,
    };
  } catch (error) {
    console.error(`Failed to fetch student with ID ${id}:`, error);
    throw error instanceof Error ? error : new Error("Failed to fetch student details");
  }
};
export const updateStudent = async (
  id: number,
  data: Partial<Student> & {
    student_status_id: number;
    location_id: number;
    degree_program_id: number;
    batch_id: number;
  },
  token: string
): Promise<{ message: string; student: Student }> => {
  try {
    const response = await fetchData<{ message: string; student: Student }>(`/students/${id}/edit`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error(`Failed to update student with ID ${id}:`, error);
    throw error;
  }
};

export const deleteStudent = async (id: number, token: string) => {
  return fetchData<{ message: string }>(`/students/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};