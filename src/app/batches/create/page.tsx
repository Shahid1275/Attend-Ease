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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

interface Batch {
  id: number;
  title: string;
  session: string;
  leaves_allowed: number;
  start_date: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} timeout={500} />;
});

const CreateBatchPage = () => {
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [session, setSession] = useState<string>("");
  const [sessionError, setSessionError] = useState<string>("");
  const [leavesAllowed, setLeavesAllowed] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [existingTitles, setExistingTitles] = useState<string[]>([]);
  const router = useRouter();

  // Get the current date in YYYY-MM-DD format for the min attribute
  const currentDate = new Date().toISOString().split("T")[0];

  // Fetch existing batches to check for duplicate titles
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("/api/batches", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch batches");
        const data = await response.json();
        const titles = data.data.map((batch: Batch) => batch.title);
        setExistingTitles(titles);
      } catch (err) {
        console.error("Error fetching batches:", err);
      }
    };

    fetchBatches();
  }, []);

  // Real-time validation for title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    const titleRegex = /^batch-\d*$/;
    if (!titleRegex.test(value) && value !== "") {
      setTitleError("Must be in the format 'batch-14'");
    } else if (existingTitles.includes(value)) {
      setTitleError("This batch title already exists");
    } else {
      setTitleError("");
    }
  };

  // Real-time validation for session
  const handleSessionChange = (value: string) => {
    setSession(value);
    const sessionRegex = /^[a-zA-Z]*\d{0,4}\s*-\s*[a-zA-Z]*\d{0,4}$/;
    if (!sessionRegex.test(value) && value !== "") {
      setSessionError("Must be in the format 'fall2022 - spring2023'");
    } else {
      setSessionError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side validation
    if (!title.trim()) {
      setTitleError("Batch title is required");
      setLoading(false);
      return;
    }
    if (!session.trim()) {
      setSessionError("Session is required");
      setLoading(false);
      return;
    }
    const leavesAllowedNum = Number(leavesAllowed);
    if (isNaN(leavesAllowedNum) || leavesAllowedNum < 0) {
      setError("Leaves Allowed must be a valid non-negative number");
      setOpenErrorModal(true);
      setLoading(false);
      return;
    }
    if (leavesAllowedNum > 100) {
      setError("Leaves Allowed must not exceed 100");
      setOpenErrorModal(true);
      setLoading(false);
      return;
    }
    if (!startDate) {
      setError("Start Date is required");
      setOpenErrorModal(true);
      setLoading(false);
      return;
    }
    const parsedStartDate = new Date(startDate);
    if (isNaN(parsedStartDate.getTime())) {
      setError("Start Date must be a valid date");
      setOpenErrorModal(true);
      setLoading(false);
      return;
    }
    const currentDateObj = new Date();
    currentDateObj.setHours(0, 0, 0, 0);
    parsedStartDate.setHours(0, 0, 0, 0);
    if (parsedStartDate < currentDateObj) {
      setError("Start Date cannot be earlier than the current date");
      setOpenErrorModal(true);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setOpenErrorModal(true);
        setLoading(false);
        return;
      }

      const batchData = {
        title,
        session,
        leaves_allowed: leavesAllowedNum,
        start_date: startDate,
      };

      const response = await fetch("/api/batches/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || `HTTP error! Status: ${response.status}`);
        setOpenErrorModal(true);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Batch created:", data);
      router.push("/batches");
    } catch (err) {
      console.error("Error creating batch:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setOpenErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenErrorModal(false);
    setError(null);
  };

  return (
    <Layout>
      <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Batch
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Batch Title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            error={!!titleError}
            helperText={titleError || "Format: batch-14"}
          />
          <TextField
            fullWidth
            label="Session"
            value={session}
            onChange={(e) => handleSessionChange(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            error={!!sessionError}
            helperText={sessionError || "Format: fall2022 - spring2023"}
          />
          <TextField
            fullWidth
            label="Leaves Allowed"
            type="number"
            value={leavesAllowed}
            onChange={(e) => setLeavesAllowed(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            inputProps={{ min: 0, max: 100 }}
            helperText="Must be between 0 and 100"
          />
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: currentDate }}
            helperText={`Must be on or after ${currentDate}`}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !!titleError || !!sessionError}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push("/batches")}
              disabled={loading}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Error Modal */}
      <Dialog
        open={openErrorModal}
        onClose={handleCloseModal}
        TransitionComponent={Transition}
        aria-labelledby="error-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            minWidth: "400px",
          },
        }}
      >
        <DialogTitle id="error-dialog-title" sx={{ bgcolor: red[50], color: red[800] }}>
          Error
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1">{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="primary"
            sx={{ m: 2, borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default CreateBatchPage;