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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getLeaveCategory, updateLeaveCategory } from "../../../utils/api";

interface LeaveCategory {
  id?: number; // id might not be present in the response
  category: string;
  duration: number; // Add duration field
}

const EditLeaveCategoryPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const leaveCategoryId = id ? Number(id) : NaN; // Convert id to number safely

  const [category, setCategory] = useState<string>("");
  const [duration, setDuration] = useState<string>(""); // Add state for duration
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [leaveCategoryNotFound, setLeaveCategoryNotFound] = useState<boolean>(false);

  useEffect(() => {
    const fetchLeaveCategory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        if (isNaN(leaveCategoryId)) {
          throw new Error("Invalid leave category ID");
        }

        const leaveCategoryData = await getLeaveCategory(leaveCategoryId, token);
        console.log("Processed Leave Category Data:", leaveCategoryData); // Debug log

        if (!leaveCategoryData || !leaveCategoryData.category || leaveCategoryData.duration === undefined) {
          setLeaveCategoryNotFound(true);
          throw new Error("Leave category data is incomplete or not found");
        }

        setCategory(leaveCategoryData.category);
        setDuration(leaveCategoryData.duration.toString()); // Set duration as string for TextField
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching leave category:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveCategory();
  }, [leaveCategoryId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation for category
    if (!category.trim()) {
      setError("Category name is required");
      setLoading(false);
      return;
    }
    if (category.length < 2) {
      setError("Category name must be at least 2 characters");
      setLoading(false);
      return;
    }

    // Basic validation for duration
    const durationNum = Number(duration);
    if (isNaN(durationNum) || durationNum < 1) {
      setError("Duration must be a valid number greater than 0");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Include duration in the update payload
      await updateLeaveCategory(leaveCategoryId, { category, duration: durationNum }, token);
      setSuccess(true);
      setTimeout(() => router.push("/leavecategories"), 1000);
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
          Edit Leave Category
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
          <CircularProgress />
        ) : leaveCategoryNotFound ? (
          <Typography color="error" sx={{ mt: 2 }}>
            Leave category not found.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Category Input */}
            <TextField
              fullWidth
              label="Category Name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
              helperText="e.g., short, half, full"
            />

            {/* Duration Input */}
            <TextField
              fullWidth
              label="Duration (days)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
              inputProps={{ min: 1 }}
              helperText="Must be at least 1 day"
            />

            {/* Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !category.trim() || !duration}
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
            Leave category updated successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Layout>
  );
};

export default EditLeaveCategoryPage;