"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCity, updateCity, getProvinces } from "../../../utils/api";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const EditCityPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const cityId = id ? Number(id) : NaN; // Convert id safely

  const [name, setName] = useState<string>("");
  const [provinceId, setProvinceId] = useState<number | "">("");
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        if (isNaN(cityId)) {
          throw new Error("Invalid city ID");
        }

        // Fetch city details
        const cityResponse = await getCity(cityId, token);
        console.log("City Response:", cityResponse); // Debugging

        if (cityResponse.data) {
          setName(cityResponse.data.name || "");
          setProvinceId(cityResponse.data.province_id || "");
        } else {
          throw new Error("City not found.");
        }

        // Fetch provinces for dropdown
        const provincesResponse = await getProvinces(token);
        console.log("Provinces Response:", provincesResponse); // Debugging

        if (provincesResponse.data) {
          setProvinces(provincesResponse.data);
        } else {
          throw new Error("Failed to load provinces.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();
  }, [cityId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      await updateCity(cityId, { name, province_id: Number(provinceId) }, token);

      setSuccess(true);
      setTimeout(() => router.push(`/cities`), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
          Edit City:{" "}
          <span style={{ color: "#1976d2" }}>
            {loading ? <CircularProgress size={20} /> : name || "Not Found"}
          </span>
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleSubmit}>
            {/* City Name Input */}
            <TextField
              fullWidth
              label="City Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />

            {/* Province Dropdown */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Province</InputLabel>
              <Select
                value={provinceId}
                onChange={(e) => setProvinceId(Number(e.target.value))}
                required
              >
                {provinces.map((province) => (
                  <MenuItem key={province.id} value={province.id}>
                    {province.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" disabled={!name.trim() || !provinceId}>
                Update
              </Button>
              <Button variant="outlined" onClick={() => router.back()}>
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
          <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />}>
            City updated successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Layout>
  );
};

export default EditCityPage;