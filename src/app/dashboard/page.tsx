"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Layout from "../components/Layout";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); // Redirect to login if not authenticated
    } else if (searchParams.get("welcome") === "true") {
      const username = localStorage.getItem("username") || "User";
      window.history.replaceState({}, document.title, "/home");
    }
  }, [searchParams, router]);

  // Animation variants for Framer Motion
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Typography
              variant={isMobile ? "h3" : "h2"}
              component="h1"
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Welcome to Our Attendance Management System
            </Typography>
            <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 4 }}>
              Streamline attendance tracking with our powerful and intuitive system.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ borderRadius: 2, px: 5, py: 1.5 }}
              onClick={() => router.push("/attendances")}
            >
              Get Started
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 6 }}
        >
          Key Features
        </Typography>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {/* Feature 1 */}
            <Grid item xs={12} md={4}>
              <motion.div variants={fadeInUp}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: "bold", mb: 2 }}
                    >
                      Real-Time Tracking
                    </Typography>
                    <Typography variant="body1">
                      Monitor attendance in real-time with live updates and notifications.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Feature 2 */}
            <Grid item xs={12} md={4}>
              <motion.div variants={fadeInUp}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: "bold", mb: 2 }}
                    >
                      Easy Reporting
                    </Typography>
                    <Typography variant="body1">
                      Generate detailed reports with just a few clicks.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Feature 3 */}
            <Grid item xs={12} md={4}> <motion.div variants={fadeInUp}> <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 3, transition: "transform 0.3s ease-in-out", "&:hover": { transform: "scale(1.05)" }, }} > <CardContent> <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", mb: 2 }} > Fingerprint Authentication </Typography> <Typography variant="body1"> Securely access the system using fingerprint recognition. </Typography> </CardContent> </Card> </motion.div> </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Layout>
  );
}