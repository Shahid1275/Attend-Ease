"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "../../../components/Layout";
import {
  Typography,
  Alert,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Snackbar,
  Switch,
  FormControlLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.50.218/laravel-project/attendance-system/public/api";

// Interface based on the API response
interface Location {
  id: number;
  city_id: number;
  title: string;
  address: string;
  contact_no: string;
  is_active: number; // API returns 1 or 0
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  cities: {
    id: number;
    name: string;
  };
}

interface ApiResponse {
  data: Location[]; // Array of locations, as per the API response
}

const EditLocationPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const locationId = id ? Number(id) : NaN;

  const [cityId, setCityId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [contactNo, setContactNo] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [locationNotFound, setLocationNotFound] = useState<boolean>(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) {
          console.log("No token found, redirecting to login");
          router.push("/login");
          return;
        }

        if (isNaN(locationId)) {
          console.log("Invalid location ID:", id);
          throw new Error("Invalid location ID");
        }
        console.log("Fetching location with ID:", locationId);

        const response = await getLocation(locationId, token);
        console.log("Raw API Response:", response);

        // Check if response has the expected structure
        if (!response || !response.data) {
          console.log("No 'data' field in response");
          setLocationNotFound(true);
          throw new Error("No location data received");
        }

        // Check if the data array is empty
        if (response.data.length === 0) {
          console.log("Data array is empty");
          setLocationNotFound(true);
          throw new Error("Location not found");
        }

        // Extract the first location from the data array
        const locationData: Location = response.data[0];
        console.log("Parsed Location Data:", locationData);

        // Verify the location has an ID
        if (!locationData.id) {
          console.log("Location data missing ID:", locationData);
          setLocationNotFound(true);
          throw new Error("Location not found or invalid data");
        }

        // Prefill form with available data
        setCityId(locationData.city_id?.toString() || "");
        setTitle(locationData.title || "");
        setAddress(locationData.address || "");
        setContactNo(locationData.contact_no || "");
        setIsActive(locationData.is_active === 1);

        // Warn about incomplete data
        if (!locationData.city_id || !locationData.title || !locationData.address || !locationData.contact_no) {
          setError("Some location data is missing. Please fill in all required fields.");
        }
      } catch (err) {
        console.error("Error in fetchLocation:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch location data");
        setLocationNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [locationId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!cityId.trim()) {
      setError("City ID is required");
      setLoading(false);
      return;
    }
    const cityIdNum = Number(cityId);
    if (isNaN(cityIdNum) || cityIdNum < 1) {
      setError("City ID must be a valid number greater than 0");
      setLoading(false);
      return;
    }
    if (!title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }
    if (!address.trim()) {
      setError("Address is required");
      setLoading(false);
      return;
    }
    if (!contactNo.trim()) {
      setError("Contact number is required");
      setLoading(false);
      return;
    }
    if (!/^\d{7,13}$/.test(contactNo)) {
      setError("Contact number must be between 7 and 15 digits");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await updateLocation(
        locationId,
        {
          city_id: cityIdNum,
          title,
          address,
          contact_no: contactNo,
          is_active: isActive,
        },
        token
      );
      setSuccess(true);
      setTimeout(() => router.push("/locations"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while updating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4, borderRadius: 2, boxShadow: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Edit Location
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
          <CircularProgress />
        ) : locationNotFound && !cityId && !title && !address && !contactNo ? (
          <Typography color="error" sx={{ mt: 2 }}>
            Location not found or no valid data available.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="City ID"
              type="number"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
              helperText="Enter the city ID (e.g., 1)"
              error={!cityId.trim()}
            />
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
              helperText="e.g., Main Office"
              error={!title.trim()}
            />
            <TextField
              fullWidth
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
              helperText="e.g., 123 Main St, Springfield"
              error={!address.trim()}
            />
            <TextField
              fullWidth
              label="Contact Number"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
              helperText="e.g., 1234567890"
              error={!contactNo.trim()}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="primary"
                />
              }
              label="Is Active"
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !cityId.trim() || !title.trim() || !address.trim() || !contactNo.trim()}
              >
                {loading ? <CircularProgress size={24} /> : "Update"}
              </Button>
              <Button variant="outlined" onClick={() => router.back()} disabled={loading}>
                Cancel
              </Button>
            </Stack>
          </form>
        )}
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            icon={<CheckCircleIcon fontSize="inherit" />}
            sx={{ width: "100%" }}
          >
            Location updated successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Layout>
  );
};

// API Functions
export const getLocation = async (id: number, token: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("API Error Response:", errorData);
      throw new Error(errorData.message || `Failed to fetch location (Status: ${response.status})`);
    }

    const data = await response.json();
    console.log("API Success Response:", data);
    return data;
  } catch (err) {
    console.error("Error in getLocation:", err);
    throw err;
  }
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
  const response = await fetch(`${API_BASE_URL}/locations/${id}/edit`, {
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
    console.log("Update API Error Response:", errorData);
    if (errorData.errors) {
      const errorMessages = Object.values(errorData.errors).flat().join(", ");
      throw new Error(errorMessages);
    }
    throw new Error(errorData.message || "Failed to update location");
  }

  return await response.json();
};

export default EditLocationPage;