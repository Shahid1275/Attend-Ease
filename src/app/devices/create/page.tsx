// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { createDevice } from "../../utils/api";
// import Layout from "../../components/Layout";
// import {
//   Container,
//   Typography,
//   Button,
//   TextField,
//   Paper,
//   Box,
//   Stack,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   MenuItem,
// } from "@mui/material";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { Device } from "../../types/devices";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// interface CreateDeviceForm {
//   device_id: string;
//   MAC: string;
//   location_id: number;
//   token: string;
// }

// const CreateDevicePage = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});
//   const [openErrorSnackbar, setOpenErrorSnackbar] = useState<boolean>(false);
//   const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState<boolean>(false);

//   // Initialize the form with default values
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError,
//   } = useForm<CreateDeviceForm>({
//     defaultValues: {
//       device_id: "", // Optional field, can be empty
//       MAC: "", // Required field, initialize as empty string
//       location_id: "", // Required field, initialize as undefined for select
//       token: "", // Optional field, can be empty
//     },
//   });

//   // Mock locations - you should fetch these from your API
//   const [locations] = useState([
//     { id: 1, title: "LRO-Office Lahore" },
//     { id: 2, title: "Main Campus" },
//     { id: 3, title: "North Campus" },
//   ]);

//   const onSubmit: SubmitHandler<CreateDeviceForm> = async (data) => {
//     try {
//       setLoading(true);
//       setApiErrors({});
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       await createDevice(data, token);
//       setOpenSuccessSnackbar(true);
//       setTimeout(() => router.push("/devices"), 1000);
//     } catch (err: any) {
//       if (err.message && typeof err.message === "string") {
//         try {
//           const errorData = JSON.parse(err.message);
//           if (errorData.errors) {
//             setApiErrors(errorData.errors);
//             Object.entries(errorData.errors).forEach(([field, messages]) => {
//               setError(field as keyof CreateDeviceForm, {
//                 type: "manual",
//                 message: (messages as string[]).join(" "),
//               });
//             });
//           } else {
//             setApiErrors({ general: [errorData.message || "An error occurred"] });
//             setOpenErrorSnackbar(true);
//           }
//         } catch (e) {
//           setApiErrors({ general: [err.message] });
//           setOpenErrorSnackbar(true);
//         }
//       } else {
//         setApiErrors({ general: ["An unknown error occurred"] });
//         setOpenErrorSnackbar(true);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseErrorSnackbar = () => {
//     setOpenErrorSnackbar(false);
//     setApiErrors({});
//   };

//   const handleCloseSuccessSnackbar = () => {
//     setOpenSuccessSnackbar(false);
//   };

//   return (
//     <Layout>
//       <Container maxWidth="sm" sx={{ py: 4 }}>
//         <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
//           <Button
//             startIcon={<ArrowBackIcon />}
//             onClick={() => router.push("/devices")}
//             sx={{ mb: 2 }}
//           >
//             Back to Devices
//           </Button>

//           <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
//             Add New Device
//           </Typography>

//           <Box component="form" onSubmit={handleSubmit(onSubmit)}>
//             <Stack spacing={3}>
//               <TextField
//                 label="MAC Address"
//                 variant="outlined"
//                 fullWidth
//                 error={!!errors.MAC || !!apiErrors.mac}
//                 helperText={
//                   errors.MAC?.message ||
//                   (apiErrors.mac && apiErrors.mac.join(" "))
//                 }
//                 {...register("MAC", {
//                   required: "MAC address is required",
//                   pattern: {
//                     value: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
//                     message: "Enter a valid MAC address (e.g., 00:1A:2B:3C:4D:5E)",
//                   },
//                 })}
//               />

//               <TextField
//                 select
//                 label="Location"
//                 variant="outlined"
//                 fullWidth
//                 error={!!errors.location_id || !!apiErrors.location_id}
//                 helperText={
//                   errors.location_id?.message ||
//                   (apiErrors.location_id && apiErrors.location_id.join(" "))
//                 }
//                 {...register("location_id", {
//                   required: "Location is required",
//                   valueAsNumber: true,
//                 })}
//               >
//                 {locations.map((location) => (
//                   <MenuItem key={location.id} value={location.id}>
//                     {location.title}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               <Stack direction="row" spacing={2} justifyContent="flex-end">
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   onClick={() => router.push("/devices")}
//                   disabled={loading}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   disabled={loading}
//                   startIcon={loading ? <CircularProgress size={20} /> : null}
//                 >
//                   {loading ? "Adding..." : "Add Device"}
//                 </Button>
//               </Stack>
//             </Stack>
//           </Box>
//         </Paper>

//         <Snackbar
//           open={openErrorSnackbar}
//           autoHideDuration={6000}
//           onClose={handleCloseErrorSnackbar}
//           anchorOrigin={{ vertical: "top", horizontal: "center" }}
//         >
//           <Alert
//             onClose={handleCloseErrorSnackbar}
//             severity="error"
//             sx={{ width: "100%", borderRadius: 2 }}
//           >
//             {apiErrors.general?.join(" ")}
//           </Alert>
//         </Snackbar>

//         <Snackbar
//           open={openSuccessSnackbar}
//           autoHideDuration={3000}
//           onClose={handleCloseSuccessSnackbar}
//           anchorOrigin={{ vertical: "top", horizontal: "center" }}
//         >
//           <Alert
//             onClose={handleCloseSuccessSnackbar}
//             severity="success"
//             icon={<CheckCircleIcon fontSize="inherit" />}
//             sx={{ width: "100%", borderRadius: 2 }}
//           >
//             Device added successfully!
//           </Alert>
//         </Snackbar>
//       </Container>
//     </Layout>
//   );
// };

// export default CreateDevicePage;
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDevice } from "../../utils/api";
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
  MenuItem,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { Device } from "../../types/devices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface CreateDeviceForm {
  device_id: string;
  MAC: string;
  location_id: number | string; // Can be number or empty string
  token: string;
}

interface Location {
  id: number;
  title: string;
}

const CreateDevicePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState<boolean>(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState<boolean>(false);

  // Mock locations - in a real app, you would fetch these from your API
  const [locations] = useState<Location[]>([
    { id: 1, title: "LRO-Office Lahore" },
    { id: 2, title: "Main Campus" },
    { id: 3, title: "North Campus" },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<CreateDeviceForm>({
    defaultValues: {
      device_id: "",
      MAC: "",
      location_id: "", // Initialize as empty string for select
      token: "",
    },
  });

  const onSubmit: SubmitHandler<CreateDeviceForm> = async (data) => {
    try {
      setLoading(true);
      setApiErrors({});
      
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Convert location_id to number if it's a string
      const payload = {
        ...data,
        location_id: Number(data.location_id),
      };

      await createDevice(payload, token);
      setOpenSuccessSnackbar(true);
      reset(); // Reset form after successful submission
      setTimeout(() => router.push("/devices"), 1000);
    } catch (err: any) {
      if (err.message && typeof err.message === "string") {
        try {
          const errorData = JSON.parse(err.message);
          if (errorData.errors) {
            setApiErrors(errorData.errors);
            Object.entries(errorData.errors).forEach(([field, messages]) => {
              setError(field as keyof CreateDeviceForm, {
                type: "manual",
                message: (messages as string[]).join(" "),
              });
            });
          } else {
            setApiErrors({ general: [errorData.message || "An error occurred"] });
            setOpenErrorSnackbar(true);
          }
        } catch (e) {
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
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/devices")}
            sx={{ mb: 2 }}
          >
            Back to Devices
          </Button>

          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
            Add New Device
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>

              <TextField
                label="MAC Address"
                variant="outlined"
                fullWidth
                required
                error={!!errors.MAC || !!apiErrors.mac}
                helperText={
                  errors.MAC?.message ||
                  (apiErrors.mac && apiErrors.mac.join(" "))
                }
                {...register("MAC", {
                  required: "MAC address is required",
                  pattern: {
                    value: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
                    message: "Enter a valid MAC address (e.g., 00:1A:2B:3C:4D:5E)",
                  },
                })}
              />

              <TextField
                select
                label="Location"
                variant="outlined"
                fullWidth
                required
                error={!!errors.location_id || !!apiErrors.location_id}
                helperText={
                  errors.location_id?.message ||
                  (apiErrors.location_id && apiErrors.location_id.join(" "))
                }
                {...register("location_id", {
                  required: "Location is required",
                  validate: (value) => 
                    value !== "" || "Please select a location",
                })}
              >
                <MenuItem value="" disabled>
                  Select a location
                </MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.title}
                  </MenuItem>
                ))}
              </TextField>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => router.push("/devices")}
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
                  {loading ? "Adding..." : "Add Device"}
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
            {apiErrors.general?.join(" ") || "An error occurred"}
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
            Device added successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default CreateDevicePage;