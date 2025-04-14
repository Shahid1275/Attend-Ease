
// "use client"; // Mark this as a client component
// import Sidebar from "./Sidebar";
// import { Box, useTheme } from "@mui/material";

// export default function Layout({ children }: { children: React.ReactNode }) {
//   const theme = useTheme();

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         height: "100vh",
//         backgroundColor: theme.palette.background.default,
//       }}
//     >
//       {/* Sidebar */}
//       <Sidebar children={undefined} />
//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           overflowY: "auto",
//           overflowX: "hidden", // Prevent horizontal scrolling
//           marginLeft: { xs: 0, sm: 1 }, // Adjust margin for responsive behavior
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
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Box, useTheme, IconButton, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Toggle sidebar drawer on mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sidebar width for desktop
  const drawerWidth = 240;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh", // Use minHeight for better compatibility
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Sidebar for Desktop */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth }, // Show sidebar on sm and up
          flexShrink: { sm: 0 }, // Prevent sidebar from shrinking
          display: { xs: "none", sm: "block" }, // Hide on mobile, show on sm+
        }}
      >
        <Sidebar children={undefined} />
      </Box>

      {/* Sidebar Drawer for Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" }, // Show drawer on mobile only
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Sidebar children={undefined} />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 }, // Smaller padding on mobile
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` }, // Adjust width
          overflowY: "auto",
          overflowX: "hidden",
          minHeight: "100vh", // Ensure main content fills height
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Mobile Menu Button */}
        <Box
          sx={{
            display: { xs: "flex", sm: "none" }, // Show only on mobile
            justifyContent: "flex-start",
            mb: 2,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        {children}
      </Box>
    </Box>
  );
}