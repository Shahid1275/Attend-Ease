// // app/locations/[id]/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Layout from "../../../components/Layout";
// import {
//   Typography,
//   Alert,
//   Paper,
//   Button,
//   CircularProgress,
//   Grid,
//   Container,
//   Chip,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { getLocation } from "../../../utils/locationApi";

// const LocationDetailsPage = () => {
//   const { id } = useParams();
//   const [location, setLocation] = useState<Location | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           throw new Error("No token found. Please log in.");
//         }

//         const locationId = Number(id);
//         if (isNaN(locationId)) {
//           throw new Error("Invalid location ID");
//         }

//         const locationData = await getLocation(locationId, token);
//         setLocation(locationData);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLocation();
//   }, [id]);

//   if (loading) {
//     return (
//       <Layout>
//         <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//           <CircularProgress />
//         </Container>
//       </Layout>
//     );
//   }

//   if (error) {
//     return (
//       <Layout>
//         <Container sx={{ mt: 4 }}>
//           <Alert severity="error">{error}</Alert>
//         </Container>
//       </Layout>
//     );
//   }

//   if (!location) {
//     return (
//       <Layout>
//         <Container sx={{ mt: 4 }}>
//           <Typography variant="h6">Location not found</Typography>
//         </Container>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
//         <Paper elevation={3} sx={{ p: 4 }}>
//           {/* Back Button */}
//           <Button
//             startIcon={<ArrowBackIcon />}
//             onClick={() => router.back()}
//             sx={{ mb: 3 }}
//           >
//             Back
//           </Button>

//           {/* Location Details Heading */}
//           <Typography variant="h4" component="h1" gutterBottom>
//             Location Details
//           </Typography>

//           {/* Location Details */}
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="body1" gutterBottom>
//                 <strong>ID:</strong> {location.id}
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="body1" gutterBottom>
//                 <strong>Title:</strong> {location.title}
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="body1" gutterBottom>
//                 <strong>City:</strong> {location.cities?.name}
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="body1" gutterBottom>
//                 <strong>Status:</strong>{" "}
//                 <Chip
//                   label={location.is_active ? "Active" : "Inactive"}
//                   color={location.is_active ? "success" : "error"}
//                   size="small"
//                 />
//               </Typography>
//             </Grid>
//             <Grid item xs={12}>
//               <Typography variant="body1" gutterBottom>
//                 <strong>Address:</strong> {location.address}
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="body1" gutterBottom>
//                 <strong>Contact No:</strong> {location.contact_no}
//               </Typography>
//             </Grid>
//           </Grid>
//         </Paper>
//       </Container>
//     </Layout>
//   );
// };

// export default LocationDetailsPage;
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
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import CityIcon from "@mui/icons-material/LocationCity";

interface Location {
  id: number;
  city_id: number;
  title: string;
  address: string;
  contact_no: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  cities: {
    id: number;
    name: string;
  };
}

const LocationDetailsPage = () => {
  const { id } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          `http://192.168.50.218/laravel-project/attendance-system/public/api/locations/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch location");
        }

        const result = await response.json();
        setLocation(result.data[0]); // Access first item in data array
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id, router]);

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

  if (!location) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h6">Location not found</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {/* Header with back button */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/locations")}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Back to Locations
            </Button>
          </Stack>

          {/* Main title with status chip */}
          <Stack direction="row" alignItems="center" spacing={2} mb={4}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
              {location.title}
            </Typography>
            <Chip
              label={location.is_active ? "Active" : "Inactive"}
              color={location.is_active ? "success" : "error"}
              size="medium"
            />
          </Stack>

          {/* Location details grid */}
          <Grid container spacing={3}>
            {/* Basic Info Column */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                  Location Information
                </Typography>

                <Stack spacing={2}>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Location ID
                    </Typography>
                    <Typography variant="body1">{location.id}</Typography>
                  </div>

                  <Divider />

                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      City
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <CityIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                      {location.cities.name}
                    </Typography>
                  </div>

                  <Divider />

                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Contact Number
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                      {location.contact_no}
                    </Typography>
                  </div>
                </Stack>
              </Paper>
            </Grid>

            {/* Address Column */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Address Details
                </Typography>
                <Typography variant="body1" paragraph>
                  {location.address}
                </Typography>
              </Paper>
            </Grid>

            {/* Timestamps */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography variant="body2">
                      {new Date(location.created_at).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body2">
                      {new Date(location.updated_at).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Layout>
  );
};

export default LocationDetailsPage;