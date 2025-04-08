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
} from "@mui/material";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface LeaveType {
  id: number;
  type: string;
  leave_allowed: number;
}

const CreateLeaveTypePage = () => {
  const [type, setType] = useState<string>("");
  const [typeError, setTypeError] = useState<string>("");
  const [leaveAllowed, setLeaveAllowed] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState<boolean>(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState<boolean>(false); // Added for success
  const [loading, setLoading] = useState<boolean>(false);
  const [existingTypes, setExistingTypes] = useState<string[]>([]);
  const router = useRouter();

  // Fetch existing leave types to check for duplicate types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://192.168.50.218/laravel-project/attendance-system/public/api/leavetypes", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch leave types");
        const data = await response.json();
        const types = data.data.map((leaveType: LeaveType) => leaveType.type);
        setExistingTypes(types);
      } catch (err) {
        console.error("Error fetching leave types:", err);
      }
    };

    fetchLeaveTypes();
  }, []);

  // Real-time validation for type
  const handleTypeChange = (value: string) => {
    setType(value);
    if (!value.trim()) {
      setTypeError("Leave type is required");
    } else if (existingTypes.includes(value)) {
      setTypeError("This leave type already exists");
    } else if (value.length > 50) {
      setTypeError("Leave type must not exceed 50 characters");
    } else {
      setTypeError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side validation
    if (!type.trim()) {
      setTypeError("Leave type is required");
      setLoading(false);
      return;
    }
    const leaveAllowedNum = Number(leaveAllowed);
    if (isNaN(leaveAllowedNum) || leaveAllowedNum < 0) {
      setError("Leaves Allowed must be a valid non-negative number");
      setOpenErrorSnackbar(true);
      setLoading(false);
      return;
    }
    if (leaveAllowedNum > 100) {
      setError("Leaves Allowed must not exceed 100");
      setOpenErrorSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setOpenErrorSnackbar(true);
        setLoading(false);
        return;
      }

      const leaveTypeData = {
        type: type.trim(),
        leave_allowed: leaveAllowedNum,
      };

      const response = await fetch("http://192.168.50.218/laravel-project/attendance-system/public/api/leavetypes/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaveTypeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || `HTTP error! Status: ${response.status}`);
        setOpenErrorSnackbar(true);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Leave type created:", data);
      setOpenSuccessSnackbar(true); // Show success Snackbar
      setTimeout(() => router.push("/leavetypes"), 1000); // Redirect after 1 second
    } catch (err) {
      console.error("Error creating leave type:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setOpenErrorSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false);
    setError(null);
  };

  const handleCloseSuccessSnackbar = () => {
    setOpenSuccessSnackbar(false);
  };

  return (
    <Layout>
      <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Leave Type
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Leave Type"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            error={!!typeError}
            helperText={typeError || "e.g., casual, medical, annual"}
          />
          <TextField
            fullWidth
            label="Leaves Allowed"
            type="number"
            value={leaveAllowed}
            onChange={(e) => setLeaveAllowed(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            inputProps={{ min: 0, max: 100 }}
            helperText="Must be between 0 and 100"
          />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !!typeError}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push("/leavetypes")}
              disabled={loading}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Error Snackbar */}
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseErrorSnackbar}
          severity="error"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccessSnackbar}
          severity="success"
          icon={<CheckCircleIcon fontSize="inherit" />}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          Leave type created successfully!
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default CreateLeaveTypePage;