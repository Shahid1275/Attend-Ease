// // 'use client';
// // import { useEffect, useState } from "react";
// // import { useParams, useRouter } from "next/navigation";
// // import { getLeaveType, updateLeaveType } from "../../../utils/api";
// // import Layout from "../../../components/Layout";
// // import {
// //   Typography,
// //   Alert,
// //   Paper,
// //   Button,
// //   TextField,
// //   CircularProgress,
// //   Stack,
// //   Snackbar,
// // } from "@mui/material";
// // import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// // import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// // const EditLeaveTypePage = () => {
// //   const { id } = useParams();
// //   const router = useRouter();
// //   const leaveTypeId = id ? Number(id) : NaN; // Convert id to number safely

// //   const [type, setType] = useState<string>("");
// //   const [leaveAllowed, setLeaveAllowed] = useState<string>("");
// //   const [leaveTypeName, setLeaveTypeName] = useState<string>("");
// //   const [error, setError] = useState<string | null>(null);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [success, setSuccess] = useState<boolean>(false);

// //   useEffect(() => {
// //     const fetchLeaveType = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         if (!token) {
// //           router.push("/login");
// //           return;
// //         }
// //         if (isNaN(leaveTypeId)) {
// //           throw new Error("Invalid leave type ID");
// //         }

// //         const response = await getLeaveType(leaveTypeId, token);
// //         if (response?.data) {
// //           const leaveTypeData = response.data;
// //           setType(leaveTypeData.type || "");
// //           setLeaveAllowed(leaveTypeData.leave_allowed?.toString() || "");
// //           setLeaveTypeName(leaveTypeData.type || "");
// //         } else {
// //           throw new Error("Leave type not found");
// //         }
// //       } catch (err) {
// //         setError(err instanceof Error ? err.message : "An error occurred");
// //         setLeaveTypeName("Not Found");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchLeaveType();
// //   }, [leaveTypeId, router]);

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError(null);

// //     // Basic validation
// //     if (!type.trim()) {
// //       setError("Leave type is required");
// //       setLoading(false);
// //       return;
// //     }
// //     const leaveAllowedNum = Number(leaveAllowed);
// //     if (isNaN(leaveAllowedNum) || leaveAllowedNum < 1) {
// //       setError("Leaves Allowed must be a valid number greater than 0");
// //       setLoading(false);
// //       return;
// //     }
// //     if (leaveAllowedNum > 100) {
// //       setError("Leaves Allowed must not exceed 100");
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         router.push("/login");
// //         return;
// //       }

// //       await updateLeaveType(leaveTypeId, { type, leave_allowed: leaveAllowedNum }, token);
// //       setSuccess(true);
// //       setTimeout(() => router.push("/leavetypes"), 1000);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : "An error occurred");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Layout>
// //       <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4, borderRadius: 2, boxShadow: 3 }}>
// //         <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 2 }}>
// //           Back
// //         </Button>
// //         <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
// //           Edit Leave Type{" "}
// //           <span style={{ color: "#1976d2" }}>
// //             {loading ? <CircularProgress size={20} /> : leaveTypeName}
// //           </span>
// //         </Typography>
// //         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
// //         {loading ? (
// //           <CircularProgress />
// //         ) : (
// //           <form onSubmit={handleSubmit}>
// //             {/* Leave Type Input */}
// //             <TextField
// //               fullWidth
// //               label="Leave Type"
// //               value={type}
// //               onChange={(e) => setType(e.target.value)}
// //               margin="normal"
// //               required
// //               sx={{ mb: 2 }}
// //               helperText="e.g., casual, medical, annual"
// //             />

// //             {/* Leave Allowed Input */}
// //             <TextField
// //               fullWidth
// //               label="Leaves Allowed"
// //               type="number"
// //               value={leaveAllowed}
// //               onChange={(e) => setLeaveAllowed(e.target.value)}
// //               margin="normal"
// //               required
// //               sx={{ mb: 2 }}
// //               inputProps={{ min: 1, max: 100 }}
// //               helperText="Must be between 1 and 100"
// //             />

// //             {/* Buttons */}
// //             <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
// //               <Button
// //                 type="submit"
// //                 variant="contained"
// //                 disabled={loading || !type.trim() || !leaveAllowed}
// //               >
// //                 {loading ? <CircularProgress size={24} /> : "Update"}
// //               </Button>
// //               <Button variant="outlined" onClick={() => router.back()} disabled={loading}>
// //                 Cancel
// //               </Button>
// //             </Stack>
// //           </form>
// //         )}
// //         <Snackbar
// //           open={success}
// //           autoHideDuration={3000}
// //           onClose={() => setSuccess(false)}
// //           anchorOrigin={{ vertical: "top", horizontal: "center" }}
// //         >
// //           <Alert
// //             severity="success"
// //             icon={<CheckCircleIcon fontSize="inherit" />}
// //             sx={{ width: "100%" }}
// //           >
// //             Leave type updated successfully!
// //           </Alert>
// //         </Snackbar>
// //       </Paper>
// //     </Layout>
// //   );
// // };

// // export default EditLeaveTypePage;

// 'use client';
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { getLeaveType, updateLeaveType } from "../../../utils/api";
// import Layout from "../../../components/Layout";
// import {
//   Typography,
//   Alert,
//   Paper,
//   Button,
//   TextField,
//   CircularProgress,
//   Stack,
//   Snackbar,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// const EditLeaveTypePage = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const leaveTypeId = id ? Number(id) : NaN; // Convert id to number safely

//   const [type, setType] = useState<string>("");
//   const [leaveAllowed, setLeaveAllowed] = useState<string>("");
//   const [leaveTypeName, setLeaveTypeName] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [success, setSuccess] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchLeaveType = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           router.push("/login");
//           return;
//         }
//         if (isNaN(leaveTypeId)) {
//           throw new Error("Invalid leave type ID");
//         }

//         const response = await fetch(`/api/leavetypes/${leaveTypeId}/edit`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         const data = await response.json();

//         if (data?.data) {
//           const leaveTypeData = data.data;
//           setType(leaveTypeData.type || "");
//           setLeaveAllowed(leaveTypeData.leave_allowed?.toString() || "");
//           setLeaveTypeName(leaveTypeData.type || "");
//         } else {
//           throw new Error("Leave type not found");
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred");
//         setLeaveTypeName("Not Found");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLeaveType();
//   }, [leaveTypeId, router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     // Basic validation
//     if (!type.trim()) {
//       setError("Leave type is required");
//       setLoading(false);
//       return;
//     }
//     const leaveAllowedNum = Number(leaveAllowed);
//     if (isNaN(leaveAllowedNum) || leaveAllowedNum < 1) {
//       setError("Leaves Allowed must be a valid number greater than 0");
//       setLoading(false);
//       return;
//     }
//     if (leaveAllowedNum > 100) {
//       setError("Leaves Allowed must not exceed 100");
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       // Update leave type using PUT request
//       const response = await fetch(`/api/leavetypes/${leaveTypeId}/edit`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           type,
//           leave_allowed: leaveAllowedNum,
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setSuccess(true);
//         setTimeout(() => router.push("/leavetypes"), 1000);
//       } else {
//         throw new Error(result.message || "Failed to update leave type");
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4, borderRadius: 2, boxShadow: 3 }}>
//         <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 2 }}>
//           Back
//         </Button>
//         <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
//           Edit Leave Type{" "}
//           <span style={{ color: "#1976d2" }}>
//             {loading ? <CircularProgress size={20} /> : leaveTypeName}
//           </span>
//         </Typography>
//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//         {loading ? (
//           <CircularProgress />
//         ) : (
//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="Leave Type"
//               value={type}
//               onChange={(e) => setType(e.target.value)}
//               margin="normal"
//               required
//               sx={{ mb: 2 }}
//               helperText="e.g., casual, medical, annual"
//             />

//             <TextField
//               fullWidth
//               label="Leaves Allowed"
//               type="number"
//               value={leaveAllowed}
//               onChange={(e) => setLeaveAllowed(e.target.value)}
//               margin="normal"
//               required
//               sx={{ mb: 2 }}
//               inputProps={{ min: 1, max: 100 }}
//               helperText="Must be between 1 and 100"
//             />

//             <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 disabled={loading || !type.trim() || !leaveAllowed}
//               >
//                 {loading ? <CircularProgress size={24} /> : "Update"}
//               </Button>
//               <Button variant="outlined" onClick={() => router.back()} disabled={loading}>
//                 Cancel
//               </Button>
//             </Stack>
//           </form>
//         )}
//         <Snackbar
//           open={success}
//           autoHideDuration={3000}
//           onClose={() => setSuccess(false)}
//           anchorOrigin={{ vertical: "top", horizontal: "center" }}
//         >
//           <Alert
//             severity="success"
//             icon={<CheckCircleIcon fontSize="inherit" />}
//             sx={{ width: "100%" }}
//           >
//             Leave type updated successfully!
//           </Alert>
//         </Snackbar>
//       </Paper>
//     </Layout>
//   );
// };

// export default EditLeaveTypePage;
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "../../../components/Layout";
import {
  Typography,
  Alert,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getLeaveType, updateLeaveType } from "@/app/utils/api";

interface LeaveType {
  id?: number; // id might not be present in the response
  type: string;
  leave_allowed: number;
}

const EditLeaveTypePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const leaveTypeId = id ? Number(id) : NaN; // Convert id to number safely

  const [type, setType] = useState<string>("");
  const [leaveAllowed, setLeaveAllowed] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [leaveTypeNotFound, setLeaveTypeNotFound] = useState<boolean>(false);

  useEffect(() => {
    const fetchLeaveType = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        if (isNaN(leaveTypeId)) {
          throw new Error("Invalid leave type ID");
        }

        const leaveTypeData = await getLeaveType(leaveTypeId, token);
        console.log("Fetched Leave Type Data:", leaveTypeData); // Debug log

        if (!leaveTypeData || !leaveTypeData.type || leaveTypeData.leave_allowed === undefined) {
          setLeaveTypeNotFound(true);
          throw new Error("Leave type data is incomplete or not found");
        }

        setType(leaveTypeData.type);
        setLeaveAllowed(leaveTypeData.leave_allowed.toString());
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching leave type:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveType();
  }, [leaveTypeId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!type.trim()) {
      setError("Leave type is required");
      setLoading(false);
      return;
    }
    const leaveAllowedNum = Number(leaveAllowed);
    if (isNaN(leaveAllowedNum) || leaveAllowedNum < 1) {
      setError("Leaves Allowed must be a valid number greater than 0");
      setLoading(false);
      return;
    }
    if (leaveAllowedNum > 100) {
      setError("Leaves Allowed must not exceed 100");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await updateLeaveType(leaveTypeId, { type, leave_allowed: leaveAllowedNum }, token);
      setSuccess(true);
      setTimeout(() => router.push("/leavetypes"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4, borderRadius: 2, boxShadow: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Edit Leave Type
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
          <CircularProgress />
        ) : leaveTypeNotFound ? (
          <Typography color="error" sx={{ mt: 2 }}>
            Leave type not found.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Leave Type Input */}
            <TextField
              fullWidth
              label="Leave Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
              helperText="e.g., casual, medical, annual"
            />

            {/* Leave Allowed Input */}
            <TextField
              fullWidth
              label="Leaves Allowed"
              type="number"
              value={leaveAllowed}
              onChange={(e) => setLeaveAllowed(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
              inputProps={{ min: 1, max: 100 }}
              helperText="Must be between 1 and 100"
            />

            {/* Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !type.trim() || !leaveAllowed}
              >
                {loading ? <CircularProgress size={24} /> : "Update"}
              </Button>
              <Button variant="outlined" onClick={() => router.back()} disabled={loading}>
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
          <Alert
            severity="success"
            icon={<CheckCircleIcon fontSize="inherit" />}
            sx={{ width: "100%" }}
          >
            Leave type updated successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Layout>
  );
};

export default EditLeaveTypePage;