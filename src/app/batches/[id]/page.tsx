"use client"; // Add this directive at the top

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Use Next.js's useParams and useRouter
import { getBatch } from "../../utils/api"; // Import the API function for fetching a batch
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

interface Batch {
  id: number;
  title: string;
  session: string;
  leaves_allowed: number;
  working_days: number | null; // Allow working_days to be null
}

const BatchDetailsPage = () => {
  const { id } = useParams(); // Correctly use useParams from next/navigation
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch batch details on component mount
  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await getBatch(Number(id), token);

        if (!response || !response.data) {
          throw new Error("Invalid response from API");
        }

        // Extract the correct data structure
        const data = response.data;

        const transformedData: Batch = {
          id: data.id,
          title: data.title,
          session: data.session,
          leaves_allowed: data.leaves_allowed,
          working_days: data.working_days ?? null, // Set to null if working_days is missing
        };

        setBatch(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
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

  // No batch found
  if (!batch) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h6">Batch not found</Typography>
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

          {/* Batch Details Heading */}
          <Typography variant="h4" component="h1" gutterBottom>
            Batch Details
          </Typography>

          {/* Batch Details */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>ID:</strong> {batch.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Title:</strong> {batch.title}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Session:</strong> {batch.session}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Leaves Allowed:</strong> {batch.leaves_allowed}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Working Days:</strong> {batch.working_days ?? "N/A"} {/* Display "N/A" if working_days is null or undefined */}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Layout>
  );
};

export default BatchDetailsPage;