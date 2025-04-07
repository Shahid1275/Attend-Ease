// // "use client";
// import Sidebar from "./Sidebar";
// import { Box, useTheme } from "@mui/material";

// export default function Layout({ children }: { children: React.ReactNode }) {
//   const theme = useTheme();

//   return (
//     <Box sx={{ display: "flex", height: "100vh", backgroundColor: theme.palette.background.default }}>
//       {/* Sidebar */}
//       <Sidebar />
//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           overflowY: "auto",
//           overflowX: "hidden", // Prevent horizontal scrolling
//           marginLeft: { xs: 0, sm: 8 }, // Adjust margin for responsive behavior
//           transition: theme.transitions.create("margin", {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//           }),
//         }}
//       >
//         {children}
//       </Box>
//     </Box>
//   );
// }
"use client"; // Mark this as a client component
import Sidebar from "./Sidebar";
import { Box, useTheme } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Sidebar */}
      <Sidebar children={undefined} />
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: "auto",
          overflowX: "hidden", // Prevent horizontal scrolling
          marginLeft: { xs: 0, sm: 8 }, // Adjust margin for responsive behavior
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}