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
import { getLeaveCategory } from "../../utils/api"; // Import the correct function

// Interface for the LeaveCategory object
interface LeaveCategory {
  id: number;
  category: string;
}

const LeaveCategoryDetailsPage = () => {
  const { id } = useParams();
  const [leaveCategory, setLeaveCategory] = useState<LeaveCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false); // Add a flag to prevent redirect loops

  // Fetch leave category details on component mount
  useEffect(() => {
    const fetchLeaveCategory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token && !hasRedirected) {
          setHasRedirected(true); // Set the flag to prevent further redirects
          router.push("/login");
          return;
        }

        // Use the correct API function instead of recursively calling fetchLeaveCategory
        const leaveCategoryData = await getLeaveCategory(Number(id), token);
        setLeaveCategory(leaveCategoryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveCategory();
  }, [id, router, hasRedirected]);

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

  // No leave category found
  if (!leaveCategory) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h6">Leave category not found</Typography>
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

          {/* Leave Category Details Heading */}
          <Typography variant="h4" component="h1" gutterBottom>
            Leave Category Details
          </Typography>

          {/* Leave Category Details */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>ID:</strong> {leaveCategory.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Category:</strong> {leaveCategory.category}
              </Typography>
            </Grid>
          </Grid>

          {/* Buttons for editing or going back to list */}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6}>
              {/* Optional: Add an Edit button if needed */}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Layout>
  );
};

export default LeaveCategoryDetailsPage;