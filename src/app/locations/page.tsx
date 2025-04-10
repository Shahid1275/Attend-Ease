// app/locations/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocations, deleteLocation } from "../utils/api"
import Layout from "../components/Layout";
import Link from "next/link";
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
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Pagination,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { blue, green, red } from "@mui/material/colors";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { Location, PaginatedApiResponse } from "../types/locationTypes";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} timeout={500} />;
});

const LocationsPage = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 15,
    last_page: 1,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await getLocations(token, pagination.current_page);

        if ("data" in response) {
          setLocations(response.data);
          setPagination({
            current_page: response.current_page,
            total: response.total,
            per_page: response.per_page,
            last_page: response.last_page,
          });
        } else {
          throw new Error("Invalid response format from API");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [router, pagination.current_page]);

  const handleView = (id: number) => {
    router.push(`/locations/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/locations/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (confirm(`Are you sure you want to delete location with ID ${id}?`)) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        await deleteLocation(id, token);
        setLocations(locations.filter((location) => location.id !== id));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        if (
          errorMessage.toLowerCase().includes("student") ||
          errorMessage.toLowerCase().includes("associated") ||
          errorMessage.toLowerCase().includes("there are some")
        ) {
          setDeleteError(errorMessage);
          setOpenDeleteModal(true);
        } else {
          setError(`Failed to delete location: ${errorMessage}`);
        }
      }
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
    setDeleteError(null);
  };

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
            Locations
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            href="/locations/create"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              py: 1,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              "&:hover": { boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)" },
            }}
          >
            Create New Location
          </Button>
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

        {/* General Error State */}
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

        {/* Locations Table */}
        {!loading && !error && (
          <>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                overflowX: "auto",
                mb: 3,
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "primary.main",
                      "& th": { fontWeight: "bold", color: "common.white", py: 2 },
                    }}
                  >
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                          No locations found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    locations.map((location) => (
                      <TableRow
                        key={location.id}
                        sx={{
                          "&:hover": {
                            backgroundColor: "grey.50",
                            transition: "background-color 0.2s ease-in-out",
                          },
                        }}
                      >
                        <TableCell>{location.id}</TableCell>
                        <TableCell>{location.title}</TableCell>
                        <TableCell>{location.cities?.name}</TableCell>
                        <TableCell>{location.address}</TableCell>
                        <TableCell>{location.contact_no}</TableCell>
                        <TableCell>
                          <Chip
                            label={location.is_active ? "Active" : "Inactive"}
                            color={location.is_active ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="View">
                              <IconButton
                                onClick={() => handleView(location.id)}
                                sx={{ color: blue[600], "&:hover": { backgroundColor: blue[50] } }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={() => handleEdit(location.id)}
                                sx={{ color: green[600], "&:hover": { backgroundColor: green[50] } }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() => handleDelete(location.id)}
                                sx={{ color: red[600], "&:hover": { backgroundColor: red[50] } }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {pagination.total > pagination.per_page && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={pagination.last_page}
                  page={pagination.current_page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}

        {/* Delete Error Modal */}
        <Dialog
          open={openDeleteModal}
          onClose={handleCloseModal}
          TransitionComponent={Transition}
          aria-labelledby="delete-error-dialog-title"
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              minWidth: "400px",
            },
          }}
        >
          <DialogTitle id="delete-error-dialog-title" sx={{ bgcolor: red[50], color: red[800] }}>
            Delete Error
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography variant="body1">
              {deleteError || "This location cannot be deleted because it has associated records."}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="primary"
              sx={{ m: 2, borderRadius: 2 }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default LocationsPage;