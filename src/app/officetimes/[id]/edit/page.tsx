"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOfficeTime, updateOfficeTime } from "../../../utils/api";
import Layout from "../../../components/Layout";
import {
  Typography,
  Alert,
  Paper,
  Button,
  CircularProgress,
  Stack,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Chip,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { OfficeTime } from "../../../types/officeTime";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const EditOfficeTimePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const officeTimeId = id ? Number(id) : NaN;

  const [officeTime, setOfficeTime] = useState<OfficeTime | null>(null);
  const [day, setDay] = useState<string>("");
  const [isWorkingDay, setIsWorkingDay] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchOfficeTime = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        if (isNaN(officeTimeId)) {
          throw new Error("Invalid office time ID");
        }

        const response = await getOfficeTime(officeTimeId, token);
        if (response?.data && response.data.length > 0) {
          const data = response.data[0];
          setOfficeTime(data);
          setDay(data.day || "");
          setIsWorkingDay(data.is_working_day);
          // Initialize times only if it's a working day
          if (data.is_working_day) {
            setStartTime(data.start_time || "");
            setEndTime(data.end_time || "");
          } else {
            setStartTime("");
            setEndTime("");
          }
        } else {
          throw new Error("Office time not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOfficeTime();
  }, [officeTimeId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await updateOfficeTime(officeTimeId, {
        day,
        is_working_day: isWorkingDay,
        start_time: isWorkingDay ? startTime : null,
        end_time: isWorkingDay ? endTime : null,
      }, token);

      setSuccess(true);
      setTimeout(() => router.push("/officetimes"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <Layout>
      <Paper sx={{ 
        p: 4, 
        maxWidth: 600, 
        mx: "auto", 
        mt: 4, 
        borderRadius: 2, 
        boxShadow: 3 
      }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.back()} 
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1.5
          }}
        >
          Edit Office Time:{" "}
          <span style={{ color: "#1976d2" }}>
            {loading ? (
              <CircularProgress size={20} />
            ) : officeTime ? (
              formatDayName(officeTime.day)
            ) : (
              "Not Found"
            )}
          </span>
          {!loading && officeTime && (
            <Chip
              label={isWorkingDay ? "Working Day" : "Off Day"}
              color={isWorkingDay ? "success" : "default"}
              size="small"
            />
          )}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Day</InputLabel>
              <Select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                label="Day"
                required
                disabled={loading}
              >
                {daysOfWeek.map((d) => (
                  <MenuItem key={d} value={d}>
                    {formatDayName(d)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={isWorkingDay ? "working" : "off"}
                onChange={(e) => {
                  const newIsWorking = e.target.value === "working";
                  setIsWorkingDay(newIsWorking);
                  // Clear times when switching to off day
                  if (!newIsWorking) {
                    setStartTime("");
                    setEndTime("");
                  }
                }}
                label="Status"
                disabled={loading}
              >
                <MenuItem value="working">Working Day</MenuItem>
                <MenuItem value="off">Off Day</MenuItem>
              </Select>
            </FormControl>

            {isWorkingDay ? (
              <>
                <TextField
                  label="Start Time"
                  type="time"
                  fullWidth
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                  inputProps={{
                    step: 300 // 5 min intervals
                  }}
                />
                <TextField
                  label="End Time"
                  type="time"
                  fullWidth
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                  inputProps={{
                    step: 300 // 5 min intervals
                  }}
                />
              </>
            ) : (
              <Box sx={{ mb: 2, color: 'text.secondary' }}>
                Time fields are not required for off days
              </Box>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !day}
                sx={{ minWidth: 100 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update"
                )}
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                disabled={loading}
              >
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
            sx={{ width: '100%' }}
          >
            Office time updated successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Layout>
  );
};

export default EditOfficeTimePage;
