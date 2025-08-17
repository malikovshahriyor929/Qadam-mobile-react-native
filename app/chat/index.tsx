import { useEffect, useState } from "react";
import { ArrowLeft, Send, Loader } from "lucide-react-native";
import { io, type Socket } from "socket.io-client";
import { t } from "i18next";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import Chat from "@/components/chat";
import { shadowLg } from "@/utils/shadow";

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
  const [socket, setSocket] = useState<Socket>();
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState<string | null>();
  const [role, setRole] = useState<string | null>();
  const tokens = async () => {
    const access = await AsyncStorage.getItem("access_token");
    const role = await AsyncStorage.getItem("role");
    setRole(role)
    setToken(access)
  }
  useEffect(() => {
    tokens()
  }, []);

  useEffect(() => {
    const newSocket = io(`wss://backend.qadam.app/chat`, {
      auth: {
        token
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    const handleConnected = () => {
      setSocket(newSocket);
      setIsConnected(true);
    };
    const hadleMessages = (data: Message[]) => {
      setMessages(data);
      setLoading(false);
    };
    const hadleNewMessages = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };
    newSocket.on("connected", handleConnected);
    newSocket.on("messages", hadleMessages);
    newSocket.on("newMessage", hadleNewMessages);

    return () => {
      newSocket.off("connected", handleConnected);
      newSocket.off("messages", hadleMessages);
      newSocket.off("newMessage", hadleNewMessages);
      newSocket.disconnect();
    };
  }, [token]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      const messageObj = {
        content: newMessage,
      };
      socket.emit("sendMessage", messageObj);
      setNewMessage("");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.emit("getMessages");
      const hadleMessages = (data: Message[]) => {
        setMessages(data);
      };
      socket.on("messages", hadleMessages);
      return () => {
        socket.off("messages", hadleMessages);
      };
    }
  }, [socket, handleSendMessage]);
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return <Text>{ date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }</Text>
  };
  const [keyboardOffset, setKeyboardOffset] = useState(20);
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardOffset(10)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardOffset(40)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
  return (
    <KeyboardAvoidingView
      style={ { flex: 1 } }
      behavior={ Platform.OS === "ios" ? "padding" : "padding" }
      keyboardVerticalOffset={ keyboardOffset }
    >
      <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
        <View style={ { flex: 1, backgroundColor: "white" } }>
          <View style={ shadowLg } className="flex-row items-center justify-between p-2 py-4 bg-primary shadow rounded-b-lg ">
            <View className="flex-row items-center gap-3 ">
              <Pressable
                className="p-2 text-primary-foreground hover:bg-primary/80"
                onPress={ () => router.push("/(tabs)/profile") }
              >
                <ArrowLeft color={ "#D5FA48" } className="h-5 w-5" />
              </Pressable>
              <View className="bg-primary-foreground items-center justify-center rounded-full h-10 w-10 ring-2 ring-primary-foreground/20 ">
                <Text className="text-primary font-semibold">
                  AD
                </Text>
              </View>
              <View>
                <Text className="font-semibold text-primary-foreground">
                  Support Admin
                </Text>
              </View>
            </View>
          </View>
          {/* Welcome Message */ }
          { messages.length === 0 && !loading && (
            <View className="text-center py-8">
              <View className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <View className="h-12 w-12">
                  <Text className="bg-primary text-primary-foreground">
                    AD
                  </Text>
                </View>
              </View>
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                { t("support.welcome") }
              </Text>
              <Text className="text-gray-600 text-sm px-4">
                { t("support.description") }
              </Text>
            </View>
          ) }

          {/* Loading State */ }
          { loading && (
            <View className="flex justify-center items-center absolute left-0 top-0 mx-auto size-full  ">
              <View className="animate-spin ">
                <Loader className=" rounded-full h-8 w-8  border-primary" />
              </View>
            </View>
          ) }
          {/* Chat messages */ }
          <Chat messages={ messages } />

          {/* Input */ }
          <View style={ { flexDirection: "row", padding: 8, borderTopWidth: 1, borderColor: "#eee" } }
          className={`${keyboardOffset == 20 && "mb-10"}`}
          >
            <TextInput
              style={ {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#ddd",
                backgroundColor: "#f9f9f9",
              } }
              placeholder="Type a message..."
              value={ newMessage }
              onChangeText={ setNewMessage }
            />
            <Pressable onPress={ handleSendMessage } style={ { marginLeft: 8, backgroundColor: "#2A2F35", borderRadius: 8, padding: 10 } }>
              <Send color="#D5FA48" />
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

  // return (
  //   <KeyboardAvoidingView
  //     style={ { flex: 1 } }
  //     behavior={ Platform.OS === "ios" ? "padding" : "height" }
  //     keyboardVerticalOffset={ Platform.OS === "ios" ? 80 : 0 } // header balandligiga qarab sozlasa bo‘ladi
  //   >     <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
  //       <View className="flex-col h-screen relative   w-full z-[999]  bg-white ">
  //         <View style={ shadowLg } className="flex-row items-center justify-between p-2 py-4 bg-primary shadow rounded-b-lg ">
  //           <View className="flex-row items-center gap-3 ">
  //             <Pressable
  //               className="p-2 text-primary-foreground hover:bg-primary/80"
  //               onPress={ () => router.push("/(tabs)/profile") }
  //             >
  //               <ArrowLeft color={ "#D5FA48" } className="h-5 w-5" />
  //             </Pressable>

  //             {/* <Image src="/admin-avatar.png" className="object-cover" /> */ }
  //             <View className="bg-primary-foreground items-center justify-center rounded-full h-10 w-10 ring-2 ring-primary-foreground/20 ">
  //               <Text className="text-primary font-semibold">
  //                 AD
  //               </Text>
  //             </View>

  //             <View>
  //               <Text className="font-semibold text-primary-foreground">
  //                 Support Admin
  //               </Text>
  //             </View>
  //           </View>
  //         </View>

  //         {/* Messages */ }
  //         <View className="p-4 space-y-4">
  //           {/* Welcome Message */ }
  //           { messages.length === 0 && !loading && (
  //             <View className="text-center py-8">
  //               <View className="w-16 h-16 bg-primary/10 rounded-full flex-row items-center justify-center mx-auto mb-4">
  //                 <View className="h-12 w-12 bg-primary">
  //                   <Text className=" text-primary-foreground">
  //                     AD
  //                   </Text>
  //                 </View>
  //               </View>
  //               <Text className="text-lg font-semibold text-gray-900 mb-2">
  //                 { t("support.welcome") }
  //               </Text>
  //               <Text className="text-gray-600 text-sm px-4">
  //                 { t("support.description") }
  //               </Text>
  //             </View>
  //           ) }

  //           {/* Loading State */ }
  //           { loading && (
  //             <View className="flex-row justify-center items-center animate-spin absolute left-0 top-0 mx-auto size-full  ">
  //               <Loader className="animate-spin rounded-full h-8 w-8  border-primary" />
  //             </View>
  //           ) }
  //           <Chat messages={ messages } />
  //         </View>

  //         <View className="px-4 py-2.5  w-full left-0  bg-white border-t rounded-lg border-gray-200">
  //           <View className="flex-row items-end space-x-3">
  //             <View className="flex-1 relative">
  //               <TextInput
  //                 placeholder="Type your message..."
  //                 value={ newMessage }
  //                 onChangeText={ setNewMessage }
  //                 className="pr-12 py-3 rounded-lg  focus:border-primary focus:ring-primary focus-visible:ring-primary bg-gray-50 focus:bg-white transition-colors border-primary"
  //               // disabled={ !isConnected }
  //               />
  //             </View>

  //             <Pressable
  //               onPress={ handleSendMessage }
  //               disabled={ !newMessage.trim() || !isConnected }
  //               className="rounded-lg w-10 h-10 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
  //             >
  //               <Send className="h-5 w-5" />
  //             </Pressable>
  //           </View>
  //         </View>
  //       </View >
  //     </TouchableWithoutFeedback>
  //   </KeyboardAvoidingView>
  // );
}
