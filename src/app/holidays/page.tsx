"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Paper,
  Box,
  Stack,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const HolidaysPage = () => {
  const [holidays, setHolidays] = useState<any[]>([]); // ✅ Ensure it's always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          setError("Unauthorized: No token found");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://192.168.50.218/laravel-project/attendance-system/public/api/holidays",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch holidays: ${response.status}`);
        }
           const data = await response.json();
           console.log("API Response:", data); // ✅ Check API response in console
         

        if (!data.data || !Array.isArray(data.data)) {
          throw new Error("Invalid API response format");
        }

        setHolidays(data.data); // ✅ Use `data.data` to get the holidays array
      } catch (error: any) {
        console.error("Error fetching holidays:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            Holidays
          </Typography>
        </Stack>

        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <CircularProgress size={48} color="primary" />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {error}
          </Alert>
        )}

        {/* No Holidays Found */}
        {!loading && !error && holidays.length === 0 && (
          <Alert
            severity="info"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            No holidays found.
          </Alert>
        )}

        {/* Holidays Table */}
        {!loading && !error && holidays.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "primary.main",
                    "& th": {
                      fontWeight: "bold",
                      color: "common.white",
                      py: 2,
                    },
                  }}
                >
                  <TableCell>ID</TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {holidays.map((holiday) => (
                  <TableRow
                    key={holiday.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "grey.50",
                        transition: "background-color 0.2s ease-in-out",
                      },
                    }}
                  >
                    <TableCell>{holiday.id}</TableCell>
                    <TableCell>{holiday.event}</TableCell>
                    <TableCell>{holiday.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Layout>
  );
};

export default HolidaysPage;