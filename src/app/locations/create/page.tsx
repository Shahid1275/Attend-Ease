"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Snackbar,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Switch,
  FormControlLabel,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createLocation } from "../../utils/api";
import { API_BASE_URL } from "../../constants/apiEndpoints";

interface City {
  id: number;
  name: string;
}

const CreateLocationPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    city_id: "",
    title: "",
    address: "",
    contact_no: "",
    is_active: true,
  });
  const [errors, setErrors] = useState({
    city_id: "",
    title: "",
    address: "",
    contact_no: "",
  });
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCities, setFetchingCities] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch cities for dropdown
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/cities`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }

        const data = await response.json();
        setCities(data.data);
      } catch (error) {
        setApiError(error instanceof Error ? error.message : "Failed to fetch cities");
        setOpenSnackbar(true);
      } finally {
        setFetchingCities(false);
      }
    };

    fetchCities();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      is_active: e.target.checked,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      city_id: "",
      title: "",
      address: "",
      contact_no: "",
    };

    if (!formData.city_id) {
      newErrors.city_id = "City is required";
      isValid = false;
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (formData.title.length > 255) {
      newErrors.title = "Title must be less than 255 characters";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    if (!formData.contact_no.trim()) {
      newErrors.contact_no = "Contact number is required";
      isValid = false;
    } else if (!/^[0-9+\- ]+$/.test(formData.contact_no)) {
      newErrors.contact_no = "Invalid contact number format";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }
    

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const locationData = {
        city_id: Number(formData.city_id),
        title: formData.title.trim(),
        address: formData.address.trim(),
        contact_no: formData.contact_no.trim(),
        is_active: formData.is_active ? 1 : 0,
      };

      await createLocation(locationData, token);
      
      setSuccess(true);
      setOpenSnackbar(true);
      setTimeout(() => router.push("/locations"), 1500);
    } catch (error) {
      let errorMessage = "Failed to create location";
      if (error instanceof Error) {
        try {
          // Try to parse the error message as JSON
          const errorData = JSON.parse(error.message);
          if (errorData.errors) {
            // Handle API validation errors
            const apiErrors = errorData.errors;
            setErrors({
              city_id: apiErrors.city_id ? apiErrors.city_id[0] : "",
              title: apiErrors.title ? apiErrors.title[0] : "",
              address: apiErrors.address ? apiErrors.address[0] : "",
              contact_no: apiErrors.contact_no ? apiErrors.contact_no[0] : "",
            });
            errorMessage = "Please fix the form errors";
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If not JSON, use the raw error message
          errorMessage = error.message;
        }
      }
      setApiError(errorMessage);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    if (success) {
      setSuccess(false);
    } else {
      setApiError(null);
    }
  };

  return (
    <Layout>
      <Paper
        sx={{
          p: 4,
          maxWidth: 800,
          mx: "auto",
          mt: 4,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          Create New Location
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* City Selection */}
            <FormControl fullWidth error={!!errors.city_id}>
              <InputLabel id="city-label">City</InputLabel>
              <Select
                labelId="city-label"
                id="city_id"
                name="city_id"
                value={formData.city_id}
                label="City"
                onChange={(e) =>
                  setFormData({ ...formData, city_id: e.target.value as string })
                }
                disabled={fetchingCities}
              >
                {fetchingCities ? (
                  <MenuItem disabled>Loading cities...</MenuItem>
                ) : (
                  cities.map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.city_id && <FormHelperText>{errors.city_id}</FormHelperText>}
            </FormControl>

            {/* Title Field */}
            <TextField
              fullWidth
              label="Location Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title || "e.g., Main Office, Warehouse"}
              disabled={loading}
            />

            {/* Address Field */}
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              multiline
              rows={3}
              disabled={loading}
            />

            {/* Contact Number Field */}
            <TextField
              fullWidth
              label="Contact Number"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              error={!!errors.contact_no}
              helperText={errors.contact_no || "e.g., +92 300 1234567"}
              disabled={loading}
            />

            {/* Status Switch */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={handleSwitchChange}
                  name="is_active"
                  color="primary"
                />
              }
              label={formData.is_active ? "Active" : "Inactive"}
              sx={{ alignSelf: "flex-start" }}
            />

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || fetchingCities}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Creating..." : "Create Location"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => router.push("/locations")}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? "success" : "error"}
          sx={{ width: "100%", borderRadius: 2 }}
          icon={success ? <CheckCircleIcon fontSize="inherit" /> : undefined}
        >
          {success ? "Location created successfully!" : apiError}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default CreateLocationPage;