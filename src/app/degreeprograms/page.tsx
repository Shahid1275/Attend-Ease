// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { fetchData, deleteDegreeProgram } from "../utils/api";
// import Layout from "../components/Layout";
// import Link from "next/link";
// import {
//   Container,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   CircularProgress,
//   Alert,
//   Paper,
//   Box,
//   Stack,
//   Tooltip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Fade,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { blue, green, red } from "@mui/material/colors";
// import { TransitionProps } from "@mui/material/transitions";
// import React from "react";
// import { getDegreeProgram, PaginatedDegreeProgramResponse } from "../utils/api";
// import { DegreeProgram } from "../types/degreeProgram";

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & { children: React.ReactElement<any, any> },
//   ref: React.Ref<unknown>
// ) {
//   return <Fade ref={ref} {...props} timeout={500} />;
// });

// const DegreeProgramsPage = () => {
//   const [degreePrograms, setDegreePrograms] = useState<DegreeProgram[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [deleteError, setDeleteError] = useState<string | null>(null);
//   const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchDegreePrograms = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           router.push("/login");
//           return;
//         }

//         const response = await fetchData<PaginatedDegreeProgramResponse>("/degreeprograms", {
//           headers: {
//             Accept: "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if ("data" in response && Array.isArray(response.data)) {
//           setDegreePrograms(response.data);
//         } else {
//           throw new Error("Invalid response format from API");
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDegreePrograms();
//   }, [router]);

//   const handleView = (id: number) => {
//     router.push(`/degreeprograms/${id}`);
//   };

//   const handleEdit = (id: number) => {
//     router.push(`/degreeprograms/${id}/edit`);
//   };

//   const handleDelete = async (id: number) => {
//     if (confirm(`Are you sure you want to delete degree program with ID ${id}?`)) {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           router.push("/login");
//           return;
//         }

//         await deleteDegreeProgram(id, token);
//         setDegreePrograms(degreePrograms.filter((program) => program.id !== id));
//       } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
//         if (
//           errorMessage.toLowerCase().includes("student") ||
//           errorMessage.toLowerCase().includes("associated") ||
//           errorMessage.toLowerCase().includes("there are some")
//         ) {
//           setDeleteError(errorMessage);
//           setOpenDeleteModal(true);
//         } else {
//           setError(`Failed to delete degree program: ${errorMessage}`);
//         }
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setOpenDeleteModal(false);
//     setDeleteError(null);
//   };

//   return (
//     <Layout>
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         {/* Header Section */}
//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//           sx={{ mb: 4 }}
//         >
//           <Typography
//             variant="h4"
//             component="h1"
//             sx={{ fontWeight: "bold", color: "text.primary" }}
//           >
//             Degree Programs
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddIcon />}
//             component={Link}
//             href="/degreeprograms/create"
//             sx={{
//               borderRadius: 2,
//               textTransform: "none",
//               px: 3,
//               py: 1,
//               boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//               "&:hover": { boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)" },
//             }}
//           >
//             Create New Degree Program
//           </Button>
//         </Stack>

//         {/* Loading State */}
//         {loading && (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               minHeight: "200px",
//             }}
//           >
//             <CircularProgress size={48} color="primary" />
//           </Box>
//         )}

//         {/* General Error State */}
//         {error && (
//           <Alert
//             severity="error"
//             sx={{
//               mb: 3,
//               borderRadius: 2,
//               boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             {error}
//           </Alert>
//         )}

//         {/* Degree Programs Table */}
//         {!loading && !error && (
//           <TableContainer
//             component={Paper}
//             sx={{
//               borderRadius: 2,
//               boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
//               overflowX: "auto",
//             }}
//           >
//             <Table sx={{ minWidth: 650 }}>
//               <TableHead>
//                 <TableRow
//                   sx={{
//                     backgroundColor: "primary.main",
//                     "& th": { fontWeight: "bold", color: "common.white", py: 2 },
//                   }}
//                 >
//                   <TableCell>ID</TableCell>
//                   <TableCell>Program Name</TableCell>
//                   <TableCell align="right">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {degreePrograms.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={3} align="center">
//                       <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
//                         No degree programs found.
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   degreePrograms.map((program) => (
//                     <TableRow
//                       key={program.id}
//                       sx={{
//                         "&:hover": {
//                           backgroundColor: "grey.50",
//                           transition: "background-color 0.2s ease-in-out",
//                         },
//                       }}
//                     >
//                       <TableCell>{program.id}</TableCell>
//                       <TableCell>{program.program_name}</TableCell>
//                       <TableCell align="right">
//                         <Stack direction="row" spacing={1} justifyContent="flex-end">
//                           <Tooltip title="View">
//                             <IconButton
//                               onClick={() => handleView(program.id)}
//                               sx={{ color: blue[600], "&:hover": { backgroundColor: blue[50] } }}
//                             >
//                               <VisibilityIcon />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Edit">
//                             <IconButton
//                               onClick={() => handleEdit(program.id)}
//                               sx={{ color: green[600], "&:hover": { backgroundColor: green[50] } }}
//                             >
//                               <EditIcon />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Delete">
//                             <IconButton
//                               onClick={() => handleDelete(program.id)}
//                               sx={{ color: red[600], "&:hover": { backgroundColor: red[50] } }}
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           </Tooltip>
//                         </Stack>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}

//         {/* Delete Error Modal */}
//         <Dialog
//           open={openDeleteModal}
//           onClose={handleCloseModal}
//           TransitionComponent={Transition}
//           aria-labelledby="delete-error-dialog-title"
//           sx={{
//             "& .MuiDialog-paper": {
//               borderRadius: 2,
//               boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//               minWidth: "400px",
//             },
//           }}
//         >
//           <DialogTitle id="delete-error-dialog-title" sx={{ bgcolor: red[50], color: red[800] }}>
//             Delete Error
//           </DialogTitle>
//           <DialogContent sx={{ mt: 2 }}>
//             <Typography variant="body1">
//               {deleteError || "This degree program cannot be deleted because it has associated records."}
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={handleCloseModal}
//               variant="contained"
//               color="primary"
//               sx={{ m: 2, borderRadius: 2 }}
//             >
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </Layout>
//   );
// };

// export default DegreeProgramsPage;
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchData, deleteDegreeProgram } from "../utils/api";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { blue, green, red } from "@mui/material/colors";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { PaginatedDegreeProgramResponse } from "../utils/api";
import { DegreeProgram } from "../types/degreeProgram";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} timeout={500} />;
});

const DegreeProgramsPage = () => {
  const [degreePrograms, setDegreePrograms] = useState<DegreeProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDegreePrograms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetchData<PaginatedDegreeProgramResponse>("/degreeprograms", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if ("data" in response && Array.isArray(response.data)) {
          setDegreePrograms(response.data);
        } else {
          throw new Error("Invalid response format from API");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDegreePrograms();
  }, [router]);

  const handleView = (id: number) => {
    router.push(`/degreeprograms/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/degreeprograms/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (confirm(`Are you sure you want to delete degree program with ID ${id}?`)) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        await deleteDegreeProgram(id, token);
        setDegreePrograms(degreePrograms.filter((program) => program.id !== id));
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
          setError(`Failed to delete degree program: ${errorMessage}`);
        }
      }
    }
  };

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
    setDeleteError(null);
  };

  return (
    <Layout>
      <Container sx={{ py: 2, px: 0, maxWidth: "none" }}>
        {/* Header Section */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            Degree Programs
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            href="/degreeprograms/create"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              py: 1,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              "&:hover": { boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)" },
            }}
          >
            Create New Degree Program
          </Button>
        </Stack>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <CircularProgress size={48} color="primary" />
          </Box>
        )}

        {/* General Error State */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {error}
          </Alert>
        )}

        {/* Degree Programs Table */}
        {!loading && !error && (
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
                    "& th": { fontWeight: "bold", color: "common.white", py: 1 },
                  }}
                >
                  <TableCell>ID</TableCell>
                  <TableCell>Program Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {degreePrograms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="body1" color="text.secondary" sx={{ py: 1 }}>
                        No degree programs found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  degreePrograms.map((program) => (
                    <TableRow
                      key={program.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "grey.50",
                          transition: "background-color 0.2s ease-in-out",
                        },
                      }}
                    >
                      <TableCell>{program.id}</TableCell>
                      <TableCell>{program.program_name}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View">
                            <IconButton
                              onClick={() => handleView(program.id)}
                              sx={{ color: blue[600], "&:hover": { backgroundColor: blue[50] } }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEdit(program.id)}
                              sx={{ color: green[600], "&:hover": { backgroundColor: green[50] } }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDelete(program.id)}
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
              {deleteError || "This degree program cannot be deleted because it has associated records."}
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

export default DegreeProgramsPage;