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
import { createDegreeProgram } from "@/app/utils/api";

interface DegreeProgram {
  id: number;
  program_name: string;
}

const CreateDegreeProgramPage = () => {
  const [programName, setProgramName] = useState<string>("");
  const [programNameError, setProgramNameError] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState<boolean>(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [existingPrograms, setExistingPrograms] = useState<string[]>([]);
  const router = useRouter();

  // Fetch existing degree programs to check for duplicate names
  useEffect(() => {
    const fetchDegreePrograms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("/api/degreeprograms", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch degree programs");
        const data = await response.json();
        const programs = data.data.map((program: DegreeProgram) => program.program_name.toLowerCase());
        setExistingPrograms(programs);
      } catch (err) {
        console.error("Error fetching degree programs:", err);
      }
    };

    fetchDegreePrograms();
  }, []);

  // Real-time validation for program name
  const handleProgramNameChange = (value: string) => {
    setProgramName(value);
    if (!value.trim()) {
      setProgramNameError("Program name is required");
    } else if (existingPrograms.includes(value.toLowerCase())) {
      setProgramNameError("This program name already exists");
    } else if (value.length > 100) {
      setProgramNameError("Program name must not exceed 100 characters");
    } else {
      setProgramNameError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side validation
    if (!programName.trim()) {
      setProgramNameError("Program name is required");
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

      const programData = {
        program_name: programName.trim(),
      };

      await createDegreeProgram(programData, token);
      setOpenSuccessSnackbar(true);
      setTimeout(() => router.push("/degreeprograms"), 1000);
    } catch (err) {
      console.error("Error creating degree program:", err);
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
          Create Degree Program
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Program Name"
            value={programName}
            onChange={(e) => handleProgramNameChange(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            error={!!programNameError}
            helperText={programNameError || "e.g., Bachelor of Science in Computer Science"}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !!programNameError}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push("/degreeprograms")}
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
          Degree program created successfully!
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default CreateDegreeProgramPage;