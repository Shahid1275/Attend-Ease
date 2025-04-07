"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProvince, updateProvince } from "../../../utils/api";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const EditProvincePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const provinceId = id ? Number(id) : NaN; // Convert id to number safely
  
  const [name, setName] = useState<string>("");
  const [provinceName, setProvinceName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        if (isNaN(provinceId)) {
          throw new Error("Invalid province ID");
        }
        const response = await getProvince(provinceId, token);
        console.log("Fetched Province:", response);

        if (response.data && response.data.length > 0) {
          const provinceData = response.data[0];
          if (provinceData.name) {
            setName(provinceData.name);
            setProvinceName(provinceData.name);
          } else {
            throw new Error("Province name is missing in API response.");
          }
        } else {
          throw new Error("Province not found.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProvince();
  }, [provinceId, router]);

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
      await updateProvince(provinceId, { name }, token);
      setSuccess(true);
      setTimeout(() => router.push(`/provinces`), 1000);
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
          Edit Province:{" "}
          <span style={{ color: "#1976d2" }}>
            {loading ? <CircularProgress size={20} /> : provinceName || "Not Found"}
          </span>
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Province Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" disabled={!name.trim()}>
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
          <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />}>Province updated successfully!</Alert>
        </Snackbar>
      </Paper>
    </Layout>
  );
};

export default EditProvincePage;
