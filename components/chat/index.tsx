import React, { useRef } from "react";
import { View, Text, FlatList } from "react-native";
export interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  recipientId: number;
  senderRole: "user" | "admin";
  isRead: boolean;
}
const renderMessage = ({ item }: { item: Message }) => {
  const isUser = item.senderRole === "user";
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  return (
    <View
      style={ {
        flexDirection: "row",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginVertical: 4,
      } }
    >
      <View
        style={ {
          maxWidth: "85%",
          padding: 12,
          borderRadius: 20,
          backgroundColor: isUser ? "#2A2F35" : "#ffffff",
          borderBottomRightRadius: isUser ? 4 : 20,
          borderBottomLeftRadius: isUser ? 20 : 4,
          borderWidth: isUser ? 0 : 1,
          borderColor: "#e5e7eb",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        } }
      >
        <Text style={ { fontSize: 14, color: isUser ? "#D5FA48" : "#2A2F35", lineHeight: 20 } }>
          { item.content }
        </Text>
        <View style={ { flexDirection: "row", justifyContent: "flex-end", marginTop: 4 } }>
          <Text style={ { fontSize: 10, color: isUser ? "#D5FA48" : "#6b7280" } }>
            { formatTime(item.createdAt) }
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function Chat({ messages }: { messages: Message[] }) {
  const flatListRef = useRef<FlatList>(null);
  return (
    <FlatList
      ref={ flatListRef }
      data={ messages }
      keyExtractor={ (item, i) => item.id.toString() + i }
      renderItem={ renderMessage }
      contentContainerStyle={ { padding: 12 } }
      onContentSizeChange={ () => flatListRef.current?.scrollToEnd({ animated: true }) }
    />
  );
}
