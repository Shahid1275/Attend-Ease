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
import { getDegreeProgram } from "../../utils/api";
import { DegreeProgram } from "@/app/types/degreeProgram";

const DegreeProgramDetailsPage = () => {
  const { id } = useParams();
  const [degreeProgram, setDegreeProgram] = useState<DegreeProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDegreeProgram = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const program = await getDegreeProgram(Number(id), token);
        setDegreeProgram(program);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDegreeProgram();
  }, [id]);

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

  if (!degreeProgram) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h6">Degree program not found</Typography>
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
            Degree Program Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>ID:</strong> {degreeProgram.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Program Name:</strong> {degreeProgram.program_name}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Layout>
  );
};

export default DegreeProgramDetailsPage;