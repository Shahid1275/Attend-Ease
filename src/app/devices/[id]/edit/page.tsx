
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
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getDevice, updateDevice } from "../../../utils/api";
import { Device } from "../../../types/devices";

const EditDevicePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const deviceId = id ? Number(id) : NaN;

  const [deviceData, setDeviceData] = useState({
    device_id: "",
    MAC: "",
    location_id: "",
    token: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [deviceNotFound, setDeviceNotFound] = useState<boolean>(false);
  const [locations, setLocations] = useState<{id: number, title: string}[]>([]);

  // Format MAC address as user types
  const formatMAC = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^0-9a-fA-F]/g, '');
    
    // Format as XX:XX:XX:XX:XX:XX
    const parts = [];
    for (let i = 0; i < cleaned.length && i < 12; i += 2) {
      parts.push(cleaned.substr(i, 2));
    }
    
    return parts.join(':').toUpperCase();
  };

  const handleMACChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatMAC(e.target.value);
    setDeviceData({...deviceData, MAC: formattedValue});
  };

  useEffect(() => {
    const fetchDeviceAndLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        if (isNaN(deviceId)) {
          throw new Error("Invalid device ID");
        }

        // Fetch device data
        const deviceResponse = await getDevice(deviceId, token);
        const device = deviceResponse.data?.[0]; // Extract first device from array

        if (!device || !device.device_id) {
          setDeviceNotFound(true);
          throw new Error("Device data is incomplete or not found");
        }

        // Fetch locations (replace with your actual API call)
        // const locationsResponse = await fetchLocations(token);
        // setLocations(locationsResponse.data);
        
        // For now using mock locations
        const mockLocations = [
          { id: 1, title: "LRO-Office Lahore" },
          { id: 2, title: "Main Campus" },
          { id: 3, title: "North Campus" },
        ];
        setLocations(mockLocations);

        // Format the MAC address if it exists
        const formattedMAC = device.MAC ? formatMAC(device.MAC) : "";

        setDeviceData({
          device_id: device.device_id || device.device_id, // Handle potential typo in API response
          MAC: formattedMAC,
          location_id: device.location_id?.toString() || "",
          token: device.token || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching device:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceAndLocations();
  }, [deviceId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!deviceData.device_id.trim()) {
      setError("Device ID is required");
      setLoading(false);
      return;
    }
    if (!deviceData.MAC.trim()) {
      setError("MAC address is required");
      setLoading(false);
      return;
    }
    if (!/^([0-9A-F]{2}:){5}([0-9A-F]{2})$/.test(deviceData.MAC)) {
      setError("Please enter a valid MAC address (format: XX:XX:XX:XX:XX:XX)");
      setLoading(false);
      return;
    }
    if (!deviceData.location_id) {
      setError("Location is required");
      setLoading(false);
      return;
    }
    if (!deviceData.token.trim()) {
      setError("Token is required");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await updateDevice(
        deviceId,
        {
          device_id: deviceData.device_id,
          MAC: deviceData.MAC, // Ensure this matches your API expectation (lowercase)
          location_id: Number(deviceData.location_id),
          token: deviceData.token,
        },
        token
      );
      setSuccess(true);
      setTimeout(() => router.push("/devices"), 1000);
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
          Edit Device
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
          <CircularProgress />
        ) : deviceNotFound ? (
          <Typography color="error" sx={{ mt: 2 }}>
            Device not found.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="MAC Address (XX:XX:XX:XX:XX:XX)"
              value={deviceData.MAC}
              onChange={handleMACChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: 17, // 6 groups of 2 chars + 5 colons
                pattern: "^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$"
              }}
              placeholder="00:1A:2B:3C:4D:5E"
            />

            <TextField
              select
              fullWidth
              label="Location"
              value={deviceData.location_id}
              onChange={(e) => setDeviceData({...deviceData, location_id: e.target.value})}
              margin="normal"
              required
              sx={{ mb: 2 }}
            >
              {locations.map((location) => (
                <MenuItem 
                  key={location.id} 
                  value={location.id}
                  selected={location.id.toString() === deviceData.location_id}
                >
                  {location.title}
                </MenuItem>
              ))}
            </TextField>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || 
                  !deviceData.device_id.trim() || 
                  !deviceData.MAC.trim() || 
                  !deviceData.location_id || 
                  !deviceData.token.trim()}
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
            Device updated successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Layout>
  );
};

export default EditDevicePage;