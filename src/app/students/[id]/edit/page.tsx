"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";
import {
  Typography,
  Alert,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getStudent, updateStudent } from "@/app/utils/api";
import { Student } from "@/app/types/student";

const EditStudentPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const studentId = id ? Number(id) : NaN;

  const [formData, setFormData] = useState<{
    name: string;
    user_name: string;
    email: string;
    ICE_email: string;
    student_status_id: number;
    contact_no: string;
    location_id: number;
    ICE_contact: string;
    ICE_relation: string;
    current_address: string;
    degree_program_id: number;
    joining_date: string;
    batch_id: number;
    releave_date: string;
    user_id: number | string;
  }>({
    name: "",
    user_name: "",
    email: "",
    ICE_email: "",
    student_status_id: 0,
    contact_no: "",
    location_id: 0,
    ICE_contact: "",
    ICE_relation: "",
    current_address: "",
    degree_program_id: 0,
    joining_date: "",
    batch_id: 0,
    releave_date: "",
    user_id: "",
  });
  const [studentName, setStudentName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        if (isNaN(studentId)) {
          throw new Error("Invalid student ID");
        }
        const response = await getStudent(studentId, token);
        console.log("Fetched Student:", response);

        const { student } = response;
        setFormData({
          name: student.name || "",
          user_name: student.user_name || "",
          email: student.email || "",
          ICE_email: student.ICE_email || "",
          student_status_id: student.status === "active" ? 1 : student.status === "inactive" ? 2 : 0,
          contact_no: student.contact_no || "",
          location_id: 1, // Placeholder; replace with actual ID
          ICE_contact: student.ICE_contact || "",
          ICE_relation: student.ICE_relation || "",
          current_address: student.current_address || "",
          degree_program_id: 1, // Placeholder
          joining_date: student.joining_date || "",
          batch_id: 1, // Placeholder
          releave_date: student.releave_date || "",
          user_id: student.user_id ?? "",
        });
        setStudentName(student.name || "Unknown");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Convert user_id to number or null for API
      const payload = {
        ...formData,
        user_id: formData.user_id ? Number(formData.user_id) : null,
      };

      await updateStudent(studentId, payload, token);
      setSuccess(true);
      setTimeout(() => router.push(`/students`), 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value : value === null || value === undefined ? "" : String(value),
    }));
  };

  const isFormValid = () =>
    (formData.name || "").trim() &&
    (formData.user_name || "").trim() &&
    (formData.email || "").trim() &&
    (formData.ICE_email || "").trim() &&
    formData.student_status_id > 0 &&
    (formData.contact_no || "").trim() &&
    formData.location_id > 0 &&
    (formData.ICE_contact || "").trim() &&
    (formData.ICE_relation || "").trim() &&
    (formData.current_address || "").trim() &&
    formData.degree_program_id > 0 &&
    (formData.joining_date || "").trim() &&
    formData.batch_id > 0;

  return (
    <Layout>
      <Paper sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4, borderRadius: 2, boxShadow: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Edit Student:{" "}
          <span style={{ color: "#1976d2" }}>
            {loading ? <CircularProgress size={20} /> : studentName || "Not Found"}
          </span>
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Username"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Emergency Email"
                name="ICE_email"
                type="email"
                value={formData.ICE_email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="student_status_id"
                  value={formData.student_status_id}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value={0} disabled>
                    Select Status
                  </MenuItem>
                  <MenuItem value={1}>Active</MenuItem>
                  <MenuItem value={2}>Inactive</MenuItem>
                  <MenuItem value={3}>Pending</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Contact Number"
                name="contact_no"
                value={formData.contact_no}
                onChange={handleChange}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Location</InputLabel>
                <Select
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleChange}
                  label="Location"
                >
                  <MenuItem value={0} disabled>
                    Select Location
                  </MenuItem>
                  <MenuItem value={1}>LRO-Office Lahore</MenuItem>
                  {/* Add more locations via API */}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Emergency Contact"
                name="ICE_contact"
                value={formData.ICE_contact}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Emergency Relation"
                name="ICE_relation"
                value={formData.ICE_relation}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Current Address"
                name="current_address"
                value={formData.current_address}
                onChange={handleChange}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Degree Program</InputLabel>
                <Select
                  name="degree_program_id"
                  value={formData.degree_program_id}
                  onChange={handleChange}
                  label="Degree Program"
                >
                  <MenuItem value={0} disabled>
                    Select Program
                  </MenuItem>
                  <MenuItem value={1}>Bachelor of Science in Computer Science</MenuItem>
                  {/* Add more programs via API */}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Joining Date"
                name="joining_date"
                type="date"
                value={formData.joining_date}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Batch</InputLabel>
                <Select
                  name="batch_id"
                  value={formData.batch_id}
                  onChange={handleChange}
                  label="Batch"
                >
                  <MenuItem value={0} disabled>
                    Select Batch
                  </MenuItem>
                  <MenuItem value={1}>Batch-14</MenuItem>
                  {/* Add more batches via API */}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Release Date"
                name="releave_date"
                type="date"
                value={formData.releave_date}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="User ID"
                name="user_id"
                type="number"
                value={formData.user_id}
                onChange={handleChange}
                margin="normal"
              />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" disabled={!isFormValid()}>
                Update
              </Button>
              <Button variant="outlined" onClick={() => router.back()}>
                Cancel
              </Button>
            </Stack>
          </form>
        )}
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />}>
            Student updated successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Layout>
  );
};

export default EditStudentPage;