"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOfficeTime } from "../../utils/api";
import Layout from "../../components/Layout";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const CreateOfficeTimePage = () => {
  const [day, setDay] = useState("");
  const [isWorkingDay, setIsWorkingDay] = useState(true);
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(dayjs());
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(dayjs());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!day) {
      setError("Please select a day");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const officeTimeData = {
        day,
        is_working_day: isWorkingDay ? 1 : 0,
        start_time: isWorkingDay && startTime ? startTime.format("HH:mm:ss") : null,
        end_time: isWorkingDay && endTime ? endTime.format("HH:mm:ss") : null,
      };

      await createOfficeTime(officeTimeData, token);
      router.push("/officetimes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create office time");
    } finally {
      setLoading(false);
    }
  };

  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/officetimes")}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1">
              Create New Office Time
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Day</InputLabel>
              <Select
                value={day}
                label="Day"
                onChange={(e) => setDay(e.target.value)}
                required
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    {formatDayName(day)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Working Day</InputLabel>
              <Select
                value={isWorkingDay ? 1 : 0}
                label="Working Day"
                onChange={(e) => setIsWorkingDay(e.target.value === 1)}
              >
                <MenuItem value={1}>Yes</MenuItem>
                <MenuItem value={0}>No</MenuItem>
              </Select>
            </FormControl>

            {isWorkingDay && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <TimePicker
                    label="Start Time"
                    value={startTime}
                    onChange={(newValue) => setStartTime(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                  <TimePicker
                    label="End Time"
                    value={endTime}
                    onChange={(newValue) => setEndTime(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ px: 4 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default CreateOfficeTimePage;