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