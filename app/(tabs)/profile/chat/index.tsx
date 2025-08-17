// import { View, Text } from 'react-native'
// import React from 'react'

// const Chat = () => {
//   return (
//     <View>
//       <Text>Chat</Text>
//     </View>
//   )
// }

// export default Chat

// app/(chat)/UserChat.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { io, type Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Send } from "lucide-react-native";

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  recipientId: number;
  senderRole: "user" | "admin";
  isRead: boolean;
}

export default function UserChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation<any>();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const initSocket = async () => {
      const token = await AsyncStorage.getItem("access_token"); // RN uchun

      const newSocket = io("wss://backend.qadam.app/chat", {
        auth: { token: `Bearer ${token}` },
        extraHeaders: { Authorization: `Bearer ${token}` },
      });

      newSocket.on("connected", () => {
        setSocket(newSocket);
        setIsConnected(true);
      });

      newSocket.on("messages", (data: Message[]) => {
        setMessages(data);
        setLoading(false);
      });

      newSocket.on("newMessage", (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        newSocket.disconnect();
      };
    };

    initSocket();
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      socket.emit("sendMessage", { content: newMessage });
      setNewMessage("");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.senderRole === "user";
    return (
      <View
        className={`flex my-1 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <View
          className={`max-w-[80%] p-3 rounded-2xl ${
            isUser
              ? "bg-blue-600 rounded-br-md"
              : "bg-gray-100 rounded-bl-md"
          }`}
        >
          <Text
            className={`text-sm ${
              isUser ? "text-white" : "text-gray-900"
            }`}
          >
            {item.content}
          </Text>
          <Text
            className={`text-xs mt-1 text-right ${
              isUser ? "text-white/70" : "text-gray-500"
            }`}
          >
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      {/* Header */}
      <View className="flex-row items-center p-3 bg-blue-600">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2"
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="ml-2 text-white font-semibold text-lg">
          Support Admin
        </Text>
      </View>

      {/* Messages */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 12 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      )}

      {/* Input */}
      <View className="flex-row items-center border-t mb-28 border-gray-200 p-2">
        <TextInput
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSendMessage}
          editable={isConnected}
          className="flex-1 bg-gray-100 rounded-lg px-3 py-2 mr-2"
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={!newMessage.trim() || !isConnected}
          className={`p-3 rounded-full ${
            newMessage.trim() && isConnected
              ? "bg-blue-600"
              : "bg-gray-400"
          }`}
        >
          <Send color="white" size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
