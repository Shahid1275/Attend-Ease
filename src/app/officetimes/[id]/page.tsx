"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOfficeTime } from "../../utils/api";
import Layout from "../../components/Layout";
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Alert,
  Chip,
  Grid,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { OfficeTime } from "../../types/officeTime";

const OfficeTimeDetailPage = () => {
  const { id } = useParams();
  const [officeTime, setOfficeTime] = useState<OfficeTime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchOfficeTime = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await getOfficeTime(Number(id), token);

        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          setOfficeTime(response.data[0]);
        } else {
          setOfficeTime(response.data || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOfficeTime();
  }, [id, router]);

  const formatDayName = (day: string | undefined | null): string => {
    if (!day || typeof day !== "string") return "N/A";
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const formatTime = (time: string | null): string => {
    if (!time) return "N/A";
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = () => {
    router.push(`/officetimes/${id}/edit`);
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Header with Back Button */}
          <Box display="flex" alignItems="center" mb={4}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/officetimes")}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4">Office Time Details</Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : officeTime ? (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>ID:</strong> {officeTime.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Day:</strong> {formatDayName(officeTime.day)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <strong>Status:</strong>
                    <Chip
                      label={officeTime.is_working_day ? "Working Day" : "Off Day"}
                      color={officeTime.is_working_day ? "success" : "error"}
                      size="small"
                    />
                  </Box>
                </Grid>
                {officeTime.is_working_day ? (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Start Time:</strong> {formatTime(officeTime.start_time)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>End Time:</strong> {formatTime(officeTime.end_time)}
                      </Typography>
                    </Grid>
                  </>
                ) : null}
              </Grid>
            </>
          ) : (
            <Alert severity="warning">No office time data available for ID: {id}</Alert>
          )}
        </Paper>
      </Container>
    </Layout>
  );
};

export default OfficeTimeDetailPage;