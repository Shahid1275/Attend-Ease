"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import {
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";

interface Province {
  id: number;
  name: string;
}

interface ApiResponse {
  current_page: number;
  data: Province[];
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

const CreateCityPage = () => {
  const [name, setName] = useState<string>("");
  const [provinceId, setProvinceId] = useState<number | "">(""); // Allow empty string as initial value
  const [provinces, setProvinces] = useState<Province[]>([]); // Properly typed as Province[]
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [provincesLoading, setProvincesLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await fetch(
          "http://192.168.50.218/laravel-project/attendance-system/public/api/provinces",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setProvinces(data.data); // Set only the data array
      } catch (err) {
        console.error("Error fetching provinces:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setProvincesLoading(false);
      }
    };

    fetchProvinces();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      if (!name.trim()) {
        throw new Error("City name is required.");
      }

      if (!provinceId) {
        throw new Error("Please select a province.");
      }

      const response = await fetch(
        "http://192.168.50.218/laravel-project/attendance-system/public/api/cities/create",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, province_id: Number(provinceId) }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("City created:", data);

      router.push("/cities");
    } catch (err) {
      console.error("Error creating city:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create City
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {provincesLoading ? (
          <Stack alignItems="center" sx={{ my: 2 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="City Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="province-label">Province</InputLabel>
              <Select
                labelId="province-label"
                value={provinceId}
                label="Province"
                onChange={(e) => setProvinceId(Number(e.target.value))}
                disabled={loading}
              >
                {provinces.map((province) => (
                  <MenuItem key={province.id} value={province.id}>
                    {province.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || provincesLoading}
              >
                {loading ? "Creating..." : "Create"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => router.push("/cities")}
                disabled={loading}
              >
                Cancel
              </Button>
            </Stack>
          </form>
        )}
      </Paper>
    </Layout>
  );
};

export default CreateCityPage;