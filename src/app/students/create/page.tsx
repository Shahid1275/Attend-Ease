"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormHelperText,
} from "@mui/material";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createStudent } from "@/app/utils/api";

const CreateStudentPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    user_name: "",
    email: "",
    contact_no: "",
    location_id: "",
    ICE_email: "",
    ICE_contact: "",
    ICE_relation: "",
    current_address: "",
    degree_program_id: "",
    joining_date: "",
    batch_id: "",
    student_status_id: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState<boolean>(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.user_name.trim()) newErrors.user_name = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.contact_no.trim()) newErrors.contact_no = "Contact number is required";
    if (!formData.location_id) newErrors.location_id = "Location is required";
    if (!formData.ICE_email.trim()) newErrors.ICE_email = "Emergency email is required";
    if (!formData.ICE_contact.trim()) newErrors.ICE_contact = "Emergency contact is required";
    if (!formData.ICE_relation.trim()) newErrors.ICE_relation = "Emergency relation is required";
    if (!formData.current_address.trim()) newErrors.current_address = "Address is required";
    if (!formData.degree_program_id) newErrors.degree_program_id = "Degree program is required";
    if (!formData.joining_date) newErrors.joining_date = "Joining date is required";
    if (!formData.batch_id) newErrors.batch_id = "Batch is required";
    if (!formData.student_status_id) newErrors.student_status_id = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setOpenErrorSnackbar(true);
        setLoading(false);
        return;
      }

      await createStudent(formData, token);
      setOpenSuccessSnackbar(true);
      setTimeout(() => router.push("/students"), 1000);
    } catch (err) {
      console.error("Error creating student:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setOpenErrorSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false);
    setError(null);
  };

  const handleCloseSuccessSnackbar = () => {
    setOpenSuccessSnackbar(false);
  };

  return (
    <Layout>
      <Paper sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Student
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                error={!!errors.user_name}
                helperText={errors.user_name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contact_no"
                value={formData.contact_no}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                error={!!errors.contact_no}
                helperText={errors.contact_no}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Emergency Contact Email"
                name="ICE_email"
                type="email"
                value={formData.ICE_email}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                error={!!errors.ICE_email}
                helperText={errors.ICE_email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Emergency Contact Number"
                name="ICE_contact"
                value={formData.ICE_contact}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                error={!!errors.ICE_contact}
                helperText={errors.ICE_contact}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Emergency Contact Relation"
                name="ICE_relation"
                value={formData.ICE_relation}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                error={!!errors.ICE_relation}
                helperText={errors.ICE_relation}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Address"
                name="current_address"
                value={formData.current_address}
                onChange={handleChange}
                margin="normal"
                required
                multiline
                rows={3}
                disabled={loading}
                error={!!errors.current_address}
                helperText={errors.current_address}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal" error={!!errors.location_id}>
                <InputLabel>Location</InputLabel>
                <Select
                  name="location_id"
                  value={formData.location_id}
                  onChange={(e) =>
                    setFormData({ ...formData, location_id: e.target.value as string })
                  }
                  label="Location"
                  required
                  disabled={loading}
                >
                  <MenuItem value="1">LRO-Office Lahore</MenuItem>
                  <MenuItem value="2">LRO-Office Karachi</MenuItem>
                </Select>
                {errors.location_id && (
                  <FormHelperText>{errors.location_id}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal" error={!!errors.degree_program_id}>
                <InputLabel>Degree Program</InputLabel>
                <Select
                  name="degree_program_id"
                  value={formData.degree_program_id}
                  onChange={(e) =>
                    setFormData({ ...formData, degree_program_id: e.target.value as string })
                  }
                  label="Degree Program"
                  required
                  disabled={loading}
                >
                  <MenuItem value="1">Bachelor of Science in Computer Science</MenuItem>
                  <MenuItem value="2">Bachelor of Science in Information Technology</MenuItem>
                </Select>
                {errors.degree_program_id && (
                  <FormHelperText>{errors.degree_program_id}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal" error={!!errors.batch_id}>
                <InputLabel>Batch</InputLabel>
                <Select
                  name="batch_id"
                  value={formData.batch_id}
                  onChange={(e) =>
                    setFormData({ ...formData, batch_id: e.target.value as string })
                  }
                  label="Batch"
                  required
                  disabled={loading}
                >
                  <MenuItem value="1">Batch 1</MenuItem>
                  <MenuItem value="2">Batch 2</MenuItem>
                </Select>
                {errors.batch_id && <FormHelperText>{errors.batch_id}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Joining Date"
                name="joining_date"
                type="date"
                value={formData.joining_date}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                error={!!errors.joining_date}
                helperText={errors.joining_date}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={!!errors.student_status_id}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="student_status_id"
                  value={formData.student_status_id}
                  onChange={(e) =>
                    setFormData({ ...formData, student_status_id: e.target.value as string })
                  }
                  label="Status"
                  required
                  disabled={loading}
                >
                  <MenuItem value="1">Active</MenuItem>
                  <MenuItem value="2">Inactive</MenuItem>
                  <MenuItem value="3">Pending</MenuItem>
                </Select>
                {errors.student_status_id && (
                  <FormHelperText>{errors.student_status_id}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Student"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push("/students")}
              disabled={loading}
            >
              Cancel
            </Button>
          </Stack>
        </form>
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
          {error}
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
          Student created successfully!
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default CreateStudentPage;