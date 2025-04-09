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
import { getDegreeProgram, updateDegreeProgram } from "../../../utils/api";
import { DegreeProgram } from "@/app/types/degreeProgram";

const EditDegreeProgramPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const programId = id ? Number(id) : NaN;

  const [programName, setProgramName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [programNotFound, setProgramNotFound] = useState<boolean>(false);
  const [existingPrograms, setExistingPrograms] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        if (isNaN(programId)) {
          throw new Error("Invalid degree program ID");
        }

        // Fetch current program data
        const programData = await getDegreeProgram(programId, token);
        setProgramName(programData.program_name);

        // Fetch all programs for duplicate check (assuming /api/degreeprograms returns { data: [...] })
        const response = await fetch("/api/degreeprograms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allPrograms = await response.json();
        const programNames = allPrograms.data
          .filter((p: DegreeProgram) => p.id !== programId)
          .map((p: DegreeProgram) => p.program_name.toLowerCase());
        setExistingPrograms(programNames);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setProgramNotFound(err.message.includes("not found"));
        console.error("Error fetching degree program:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [programId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!programName.trim()) {
      setError("Program name is required");
      setLoading(false);
      return;
    }
    if (existingPrograms.includes(programName.toLowerCase())) {
      setError("This program name already exists");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await updateDegreeProgram(programId, { program_name: programName }, token);
      setSuccess(true);
      setTimeout(() => router.push("/degreeprograms"), 1000);
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
          Edit Degree Program
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
          <CircularProgress />
        ) : programNotFound ? (
          <Typography color="error" sx={{ mt: 2 }}>
            Degree program not found.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Program Name"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
              helperText="e.g., Master of Science in Information Technology"
            />

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !programName.trim()}
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
            Degree program updated successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Layout>
  );
};

export default EditDegreeProgramPage;