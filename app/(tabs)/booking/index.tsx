// import { View, Text } from 'react-native'
// import React from 'react'

// const Booking = () => {
//   return (
//     <View>
//       <Text>Booking</Text>
//     </View>
//   )
// }

// export default Booking

// HomeScreen.tsx
import React, { useState, useCallback } from "react";
import { ScrollView, RefreshControl, Text, View } from "react-native";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Bu yerda API chaqirishing yoki ma'lumotlarni yangilashing mumkin
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      style={ { flex: 1, backgroundColor: "#f5f5f5" } }
      contentContainerStyle={ { padding: 20 } }
      refreshControl={
        <RefreshControl
          refreshing={ refreshing }
          onRefresh={ onRefresh }
          colors={ ["#2A2F35"] } // Android loader rangi
          tintColor="#2A2F35" // iOS loader rangi
          title="Yangilanmoqda..." // iOS loader ostidagi text
        />
      }
    >
      <View style={ { gap: 10 } }>
        <Text style={ { fontSize: 20, fontWeight: "bold" } }>
          Chrome Style Pull-to-Refresh
        </Text>

        { [...Array(20)].map((_, i) => (
          <View
            key={ i }
            style={ {
              backgroundColor: "white",
              padding: 15,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            } }
          >
            <Text>Item { i + 1 }</Text>
          </View>
        )) }
      </View>
    </ScrollView>
  );
}
