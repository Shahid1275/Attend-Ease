"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLeaveCategory } from "../../utils/api";
import Layout from "../../components/Layout";
import {
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Box,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { LeaveCategory } from "../../types/leaveCategories";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface CreateLeaveCategoryForm {
  category: string;
  duration: string;
}

const CreateLeaveCategoryPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState<boolean>(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateLeaveCategoryForm>();

  const onSubmit: SubmitHandler<CreateLeaveCategoryForm> = async (data) => {
    try {
      setLoading(true);
      setApiErrors({});
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await createLeaveCategory(data, token);
      setOpenSuccessSnackbar(true);
      setTimeout(() => router.push("/leavecategories"), 1000);
    } catch (err: any) {
      if (err.message && typeof err.message === "string") {
        try {
          // Try to parse the error message as JSON
          const errorData = JSON.parse(err.message);
          if (errorData.errors) {
            setApiErrors(errorData.errors);
            // Set errors for react-hook-form
            Object.entries(errorData.errors).forEach(([field, messages]) => {
              setError(field as keyof CreateLeaveCategoryForm, {
                type: "manual",
                message: (messages as string[]).join(" "),
              });
            });
          } else {
            setApiErrors({ general: [errorData.message || "An error occurred"] });
            setOpenErrorSnackbar(true);
          }
        } catch (e) {
          // If parsing fails, treat it as a general error
          setApiErrors({ general: [err.message] });
          setOpenErrorSnackbar(true);
        }
      } else {
        setApiErrors({ general: ["An unknown error occurred"] });
        setOpenErrorSnackbar(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false);
    setApiErrors({});
  };

  const handleCloseSuccessSnackbar = () => {
    setOpenSuccessSnackbar(false);
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
            Create New Leave Category
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                label="Category Name"
                variant="outlined"
                fullWidth
                error={!!errors.category || !!apiErrors.category}
                helperText={
                  errors.category?.message ||
                  (apiErrors.category && apiErrors.category.join(" "))
                }
                {...register("category", {
                  required: "Category name is required",
                  minLength: {
                    value: 2,
                    message: "Category name must be at least 2 characters",
                  },
                })}
              />

              <TextField
                label="Duration (days)"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{ min: 1 }}
                error={!!errors.duration || !!apiErrors.duration}
                helperText={
                  errors.duration?.message ||
                  (apiErrors.duration && apiErrors.duration.join(" "))
                }
                {...register("duration", {
                  required: "Duration is required",
                  min: {
                    value: 1,
                    message: "Duration must be at least 1 day",
                  },
                  valueAsNumber: true,
                })}
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => router.push("/leavecategories")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? "Creating..." : "Create Category"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>

        {/* Error Snackbar */}
        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseErrorSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseErrorSnackbar}
            severity="error"
            sx={{ width: "100%", borderRadius: 2 }}
          >
            {apiErrors.general?.join(" ")}
          </Alert>
        </Snackbar>

        {/* Success Snackbar */}
        <Snackbar
          open={openSuccessSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSuccessSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSuccessSnackbar}
            severity="success"
            icon={<CheckCircleIcon fontSize="inherit" />}
            sx={{ width: "100%", borderRadius: 2 }}
          >
            Leave category created successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default CreateLeaveCategoryPage;