"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProvince } from "../../utils/api";
import { Province } from "../../types/province";
import Link from "next/link";
import Layout from "../../components/Layout";
import {
  Typography,
  Alert,
  Paper,
  Button,
  CircularProgress,
  Stack,
  Grid,
  Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ProvinceDetailsPage = () => {
  const { id } = useParams();
  const [province, setProvince] = useState<Province | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch province details on component mount
  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        // const data = await getProvince(Number(id), token);
        // setProvince(data);
        const data = await getProvince(Number(id), token);
if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
  setProvince(data.data[0]); // Extract the first province from the array
} else {
  setProvince(null); // Handle empty or invalid data
}
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProvince();
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

  // No province found
  if (!province) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h6">Province not found</Typography>
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

          {/* Province Name */}
          <Typography variant="h4" component="h1" gutterBottom>
            Province Details
          </Typography>

          {/* Province Details */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>ID:</strong> {province.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Name:</strong> {province.name}
              </Typography>
            </Grid>
          </Grid>

        </Paper>
      </Container>
    </Layout>
  );
};

export default ProvinceDetailsPage;

