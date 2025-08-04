// import React, { useEffect, useState } from "react";
// import * as Location from "expo-location";
// import { Alert } from "react-native";

// interface Props {
//   setLocation: React.Dispatch<
//     React.SetStateAction<{ latitude: number; longitude: number } | null>
//   >;
// }

// const LocationTracker = ({ setLocation }: Props) => {
//   const [, setError] = useState<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//           setError("Permission to access location was denied");
//           Alert.alert("Location Permission", "Access denied.");
//           return;
//         }

//         const location = await Location.getCurrentPositionAsync({
//           accuracy: Location.Accuracy.High,
//         });

//         setLocation({
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//         });
//       } catch (error) {
//         setError("Failed to get location");
//       }
//     })();
//   }, [setLocation]);

//   return null;
// };

// export default LocationTracker;


import React, { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";
import { Alert, AppState, AppStateStatus } from "react-native";

interface Props {
  setLocation: React.Dispatch<
    React.SetStateAction<{ latitude: number; longitude: number } | null>
  >;
}

const LocationTracker = ({ setLocation }: Props) => {
  const [, setError] = useState<string | null>(null);

  const getLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        Alert.alert("Location Permission", "Access denied.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setError(null);
    } catch {
      setError("Failed to get location");
    }
  }, [setLocation]);

  useEffect(() => {
    getLocation()
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          getLocation()
        }
      }
    );

    return () => subscription.remove();
  }, [getLocation]);

  return null;
};

export default LocationTracker;
