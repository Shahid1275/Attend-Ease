// app/devices/[id]/page.tsx
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
import { getDevice } from "../../utils/api";
import { Device } from "../../types/devices";

const DeviceDetailsPage = () => {
  const { id } = useParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token && !hasRedirected) {
          setHasRedirected(true);
          router.push("/login");
          return;
        }

        const response = await getDevice(Number(id), token);
        // Extract the first device from the data array
        const deviceData = response.data?.[0];
        
        if (!deviceData || !deviceData.device_id) {
          throw new Error("Device data is incomplete");
        }

        setDevice(deviceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [id, router, hasRedirected]);

  if (loading) {
    return (
      <Layout>
        <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Layout>
    );
  }

  if (!device) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h6">Device not found</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ mb: 3 }}
          >
            Back
          </Button>

          <Typography variant="h4" component="h1" gutterBottom>
            Device Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>ID:</strong> {device.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Device ID:</strong> {device.device_id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>MAC Address:</strong> {device.MAC || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Location:</strong> {device.location?.title || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Token:</strong> {device.token}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Layout>
  );
};

export default DeviceDetailsPage;