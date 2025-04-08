"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import {
  Typography,
  Alert,
  Paper,
  Button,
  CircularProgress,
  Grid,
  Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Interface for the LeaveType object
interface LeaveType {
  id: number;
  type: string;
  leave_allowed: number;
}

const LeaveTypeDetailsPage = () => {
  const { id } = useParams();
  const [leaveType, setLeaveType] = useState<LeaveType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch leave type details on component mount
  useEffect(() => {
    const fetchLeaveType = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await fetch(`/api/leavetypes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch leave type");
        }

        const result = await response.json();

        // Assuming 'data' is an array, take the first item
        const leaveTypeData = result.data[0]; // Access the first item in the data array
        setLeaveType(leaveTypeData); // Now setting leaveType properly
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveType();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <Layout>
        <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Layout>
    );
  }

  // No leave type found
  if (!leaveType) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h6">Leave type not found</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ mb: 3 }}
          >
            Back
          </Button>

          {/* Leave Type Details Heading */}
          <Typography variant="h4" component="h1" gutterBottom>
            Leave Type Details
          </Typography>

          {/* Leave Type Details */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>ID:</strong> {leaveType.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Type:</strong> {leaveType.type}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Leave Allowed (days):</strong> {leaveType.leave_allowed}
              </Typography>
            </Grid>
          </Grid>

          {/* Buttons for editing or going back to list */}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6}>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Layout>
  );
};

export default LeaveTypeDetailsPage;
