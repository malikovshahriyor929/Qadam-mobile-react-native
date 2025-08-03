import React, { useEffect, useState } from "react";

// Define PermissionState type for TypeScript
type PermissionState = "granted" | "denied" | "prompt";

interface props {
  setLocation: React.Dispatch<
    React.SetStateAction<{ latitude: number; longitude: number } | null>
  >;
}

const LocationTracker = ({ setLocation }: props) => {
  const [, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState>("prompt");

  // Check permission on mount
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const checkPermission = async () => {
      try {
        const status = await navigator.permissions?.query({
          name: "geolocation",
        } as PermissionDescriptor & { name: "geolocation" });
        if (status) {
          setPermissionStatus(status.state as PermissionState);
          status.onchange = () => {
            setPermissionStatus(status.state as PermissionState);
          };
        } else {
          setPermissionStatus("prompt");
        }
      } catch {
        setPermissionStatus("prompt");
      }
    };

    checkPermission();
  }, []);

  // Request location when permissionStatus changes
  useEffect(() => {
    if (permissionStatus === "granted" || permissionStatus === "prompt") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError(
                "Location access was denied. Please enable it in your browser settings."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setError("Location request timed out.");
              break;
            default:
              setError("An unknown error occurred.");
          }
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, [permissionStatus, setLocation]);

  return <></>;
};

export default LocationTracker;
