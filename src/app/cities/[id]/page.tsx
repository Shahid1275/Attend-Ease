"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCity } from "../../utils/api";
import { City } from "../../types/city";
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

const CityDetailsPage = () => {
  const { id } = useParams();
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch city details on component mount
  useEffect(() => {
    const fetchCity = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await getCity(Number(id), token);

        if (!response || !response.data) {
          throw new Error("Invalid response from API");
        }

        // Extract the correct data structure
        const data = response.data;

        const transformedData: City = {
            id: data.id,
            name: data.name,
            province_id: data.province_id,
            provinces: {
                id: data.provinces?.id ?? null,
                name: data.provinces?.name ?? "Unknown",
            },
            data: undefined
        };

        setCity(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
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

  // No city found
  if (!city) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h6">City not found</Typography>
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

        {/* City Details Heading */}
<Typography variant="h4" component="h1" gutterBottom>
  City Details
</Typography>


          {/* City Details */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>ID:</strong> {city.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Name:</strong> {city.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Province:</strong> {city.provinces?.name || "Unknown"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Layout>
  );
};

export default CityDetailsPage;
