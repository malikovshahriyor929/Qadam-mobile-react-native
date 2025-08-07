
// // import React, { useRef, useState } from "react";
// // import { useTranslation } from "react-i18next";
// // import { Loader2 } from "lucide-react-native";
// // import { Myasxios } from "@/shared/generics";
// // import { useQuery } from "@tanstack/react-query";
// // // import heic2any from "heic2any";
// // // import loadImage from "blueimp-load-image";
// // import { Avatar, AvatarFallback, AvatarImage, Button, Sheet } from "tamagui";
// // import { Pressable, Text, View } from "react-native";
// // import { isAxiosError } from "axios";
// // import Toast from "react-native-toast-message";

// // interface Props {
// //   open: boolean;
// //   setFaceOpen: React.Dispatch<React.SetStateAction<boolean>>;
// // }

// // const FaceDrawer: React.FC<Props> = ({ open, setFaceOpen }) => {
// //   const { t } = useTranslation();
// //   const fileInputRef = useRef<HTMLInputElement>(null);
// //   const [loading, setLoading] = useState(false);
// //   const [previewUrl, setPreviewUrl] = useState<string>("");
// //   const { refetch } = useQuery({
// //     queryKey: ["face"],
// //     queryFn: async () => {
// //       const response = await Myasxios.get("/face");
// //       if (response.data) {
// //         setPreviewUrl(
// //           `${process.env.EXPO_PUBLIC_BASE_URL}/files/${response?.data?.file?.filename
// //           }`
// //         );
// //       }
// //       return response.data;
// //     },
// //   });
// //   // if (open) {
// //   //   refetch();
// //   // }

// //   // const handleFileChange = async (event) => {
// //   //   const file = event.target.files[0];
// //   //   if (file && file.type === "image/heic") {
// //   //     try {
// //   //       const convertedBlob = await heic2any({
// //   //         blob: file,
// //   //         toType: "image/jpeg",
// //   //         quality: 0.8, // Adjust quality as needed
// //   //       });
// //   //       // Now you have a JPEG Blob, you can use it (e.g., create a URL for display)
// //   //       const imageUrl = URL.createObjectURL(convertedBlob);
// //   //       // Set state to display the image or send it to a server
// //   //     } catch (error) {
// //   //       console.error("Error converting HEIC:", error);
// //   //     }
// //   //   }
// //   // };
// //   const userAgent = navigator.userAgent || navigator.vendor || window.opener;

// //   // if (/android/i.test(userAgent)) {
// //   //   alert("Android qurilma");
// //   // } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
// //   //   alert("iOS (iPhone/iPad/iPod)");
// //   // } else {
// //   //   alert("Boshqa qurilma yoki desktop");
// //   // }

// //   const handleUpload = async (file: File) => {
// //     setLoading(true);
// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       const response = await Myasxios.post("/files/face", formData, {
// //         headers: {
// //           "Content-Type": "multipart/form-data",
// //         },
// //       });
// //       if (response.data.file.id) {
// //         try {
// //           await Myasxios.post("/face", {
// //             fileId: response.data.file.id,
// //           });
// //           Toast.show({
// //             type: "success",
// //             text1: t("faceId.success")
// //           });
// //           refetch();
// //         } catch (error) {
// //           Toast.show({
// //             type: "error",
// //             text1: t("faceId.error") + " " + error
// //           });
// //         }
// //       }
// //       setPreviewUrl(
// //         `${process.env.EXPO_PUBLIC_BASE_URL}/files/${response?.data?.file?.filename
// //         }`
// //       );
// //       setFaceOpen(false);
// //     } catch (error) {
// //       if (isAxiosError(error) && error.status == 406) {
// //         Toast.show({
// //           type: "error",
// //           text1: t("face406")
// //         });
// //       } else {
// //         Toast.show({
// //           type: "error",
// //           text1: t("faceId.error")
// //         });
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   // function isAndroid() {
// //   //   return /Android/i.test(navigator.userAgent);
// //   // }
// //   // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //   //   const file = e.target.files?.[0];
// //   //   if (file) {
// //   //     handleUpload(file);
// //   //   }
// //   // };

// //   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;

// //     const isHeic = file.name.toLowerCase().endsWith(".heic");

// //     try {
// //       let inputBlob: Blob;
// //       if (isHeic) {
// //         const convertedBlob = await heic2any({
// //           blob: file,
// //           toType: "image/jpeg",
// //           quality: 0.8,
// //         });

// //         if (!(convertedBlob instanceof Blob)) {
// //           throw new Error("Konvertatsiya natijasi Blob emas");
// //         }

// //         inputBlob = convertedBlob;
// //       } else {
// //         inputBlob = file;
// //       }
// //       loadImage(
// //         inputBlob,
// //         async (canvas: HTMLCanvasElement | Event) => {
// //           if (!(canvas instanceof HTMLCanvasElement)) {
// //             toast.error("Rasmni o‘qishda xatolik yuz berdi");
// //             return;
// //           }

// //           canvas.toBlob(async (blob) => {
// //             if (!blob) {
// //               toast.error("Blob yaratishda xatolik");
// //               return;
// //             }

// //             const fixedFile = new File([blob], file.name, {
// //               type: file.type || "image/jpeg",
// //               lastModified: Date.now(),
// //             });
// //             await handleUpload(fixedFile);
// //           }, "image/jpeg");
// //         },
// //         {
// //           orientation: true,
// //           canvas: true,
// //         }
// //       );
// //     } catch (error) {
// //       console.error("Rasmni qayta ishlashda xatolik:", error);
// //       toast.error("Rasmni yuklashda xatolik yuz berdi");
// //     }
// //   };

// //   return (
// //     <Sheet
// //       open={ open }
// //       onOpenChange={ setFaceOpen }
// //       snapPoints={ [55] }
// //       dismissOnSnapToBottom
// //       modal
// //     >
// //       <Sheet.Overlay />
// //       <Sheet.Handle />
// //       <Sheet.Frame className="p-4 bg-white rounded-t-2xl">
// //         <View className="p-4 pb-6 min-h-[400px] z-[9999] max-w-[500px] mx-auto">
// //           <View>
// //             <Text>{ t("faceId.title") }</Text>
// //           </View>
// //           <input
// //             type="file"
// //             ref={ fileInputRef }
// //             onChange={ handleFileChange }
// //             accept="image/*"
// //             capture="environment"
// //             // capture="user"
// //             className="hidden"
// //           />
// //           <input
// //             type="file"
// //             accept="image/*"
// //             capture="user"
// //             onChange={ handleFileChange }
// //             ref={ fileInputRef }
// //             id="cameraInput"
// //             className="hidden"
// //           />
// //           <input
// //             type="file"
// //             accept="image/*"
// //             onChange={ handleFileChange }
// //             ref={ fileInputRef }
// //             id="galleryInput"
// //             className="hidden"
// //           />
// //           <View className="flex flex-col items-center gap-4 mt-6">
// //             <Pressable
// //               onPress={ () => fileInputRef.current?.click() }
// //               className="relative cursor-pointer"
// //             >
// //               <Avatar className="size-32 border-2  static z-[50]  border-gym-400">
// //                 { previewUrl && (
// //                   <AvatarImage
// //                     src={ previewUrl }
// //                     alt="Face ID Preview"
// //                     className="object-cover"
// //                   />
// //                 ) }
// //                 <AvatarFallback>
// //                   {/* {data?.user?.firstName[0] + data?.user?.lastName[0]} */ }
// //                   { t("faceId.label") }
// //                 </AvatarFallback>
// //               </Avatar>
// //               <View className="absolute animate-ping size-40 -top-4 right-0 bottom-0 -left-4 bg-primary/20 flex items-center justify-center rounded-full z-[10]" />
// //               { loading && (
// //                 <View className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
// //                   <Loader2 className="animate-spin text-gym-500 size-6" />
// //                 </View>
// //               ) }
// //             </Pressable>
// //             <p className="text-muted-foreground text-center">
// //               { t("faceId.description") }
// //             </p>
// //             <View className="flex w-full flex-col gap-3">
// //               <Button
// //                 onPress={ () => document.getElementById("cameraInput")?.click() }
// //                 className={ `w-full ${isAndroid() && "hidden"}` }
// //               >
// //                 { t("takePhoto") }
// //               </Button>
// //               <Button
// //                 onPress={ () => document.getElementById("galleryInput")?.click() }
// //                 className="w-full"
// //               >
// //                 { t("Choose from Gallery") }
// //               </Button>
// //             </View>
// //           </View>
// //         </View>
// //       </Sheet.Frame>
// //     </Sheet>
// //   );
// // };

// // export default FaceDrawer;


// import React, { useState } from "react";
// import { View, Text, ActivityIndicator, Image } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import Toast from "react-native-toast-message";
// import { useTranslation } from "react-i18next";
// import { useQuery } from "@tanstack/react-query";
// import { Myasxios } from "@/shared/generics";
// import { Button, Sheet, Avatar, AvatarFallback, AvatarImage } from "tamagui";
// import { isAxiosError } from "axios";

// interface Props {
//   open: boolean;
//   setFaceOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const FaceDrawer: React.FC<Props> = ({ open, setFaceOpen }) => {
//   const { t } = useTranslation();
//   const [loading, setLoading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState<string>("");

//   const { refetch } = useQuery({
//     queryKey: ["face"],
//     queryFn: async () => {
//       const response = await Myasxios.get("/face");
//       if (response.data?.file?.filename) {
//         setPreviewUrl(`${process.env.EXPO_PUBLIC_BASE_URL}/files/${response.data.file.filename}`);
//       }
//       return response.data;
//     },
//   });
//   const getPermissions = async () => {
//     const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
//     const mediaPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!cameraPerm.granted || !mediaPerm.granted) {
//       Toast.show({ type: "error", text1: t("Permission denied") });
//       return false;
//     }
//     return true;
//   };
//   const pickImage = async (fromCamera = false) => {
//     const permissionGranted = await getPermissions();
//     if (!permissionGranted) return;


//     const result = await (fromCamera
//       ? ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 })
//       : ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 })
//     );

//     if (!result.canceled && result.assets.length > 0) {
//       const asset = result.assets[0];
//       const localUri = asset.uri;
//       const fileName = localUri.split("/").pop() || "face.jpg";
//       const fileType = asset.type || "image/jpeg";

//       const formData = new FormData();
//       formData.append("file", {
//         uri: localUri,
//         name: fileName,
//         type: fileType,
//       } as any);
//       console.log(formData);

//       uploadFile(formData);
//     }
//   };

//   const uploadFile = async (formData: FormData) => {
//     // try {
//     //   setLoading(true);
//     //   const response = await Myasxios.post("/files/face", formData, {
//     //     headers: { "Content-Type": "multipart/form-data" },
//     //   });

//     //   if (response.data?.file?.id) {
//     //     await Myasxios.post("/face", {
//     //       fileId: response.data.file.id,
//     //     });
//     //     console.log(response);

//     //     Toast.show({ type: "success", text1: t("faceId.success") });
//     //     refetch();
//     //     setFaceOpen(false);
//     //   }
//     // } catch (error) {
//     //     console.log(error);
//     //   Toast.show({ type: "error", text1: t("faceId.error") });
//     // } finally {
//     //   setLoading(false);
//     // }
//     try {
//       const response = await Myasxios.post("/files/face", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           // Authorization: `Bearer ${Cookies.get("access_token")}`,
//         },
//       });
//       if (response.data.file.id) {
//         try {
//           await Myasxios.post("/face", {
//             fileId: response.data.file.id,
//           }).then(res => console.log(res.data)
//           ).catch(err => console.log(err)
//           )
//           Toast.show({ type: "success", text1: t("faceId.success") });
//         } catch (error) {
//           console.log(error);

//           Toast.show({ type: "error", text1: t("faceId.error") + error });
//         }
//       }
//       refetch();
//       setPreviewUrl(
//         `${process.env.EXPO_PUBLIC_BASE_URL}/files/${response?.data?.file?.filename
//         }`
//       )
//     } catch (error) {
//       if (isAxiosError(error) && error.status == 406) {
//         Toast.show({ type: "error", text1: t("face406") });

//       } else {
//         Toast.show({ type: "error", text1: t("faceId.error") });
//       }
//       console.log(error);
//     } finally {
//       setFaceOpen(false);
//       setLoading(false);
//     }
//   };

//   return (
//     <Sheet open={ open } onOpenChange={ setFaceOpen } snapPoints={ [55] } dismissOnSnapToBottom modal>
//       <Sheet.Overlay />
//       <Sheet.Handle />
//       <Sheet.Frame className="p-4 bg-white rounded-t-2xl">
//         <View className="p-4 pb-6 min-h-[400px] max-w-[500px] mx-auto">
//           <Text className="text-lg font-bold text-center mb-4">{ t("faceId.title") }</Text>

//           <View className="items-center justify-center">
//             <Avatar className="size-32 border-2 border-gym-400">
//               { previewUrl ? (
//                 <AvatarImage source={ { uri: previewUrl } } />
//               ) : (
//                 <AvatarFallback>{ t("faceId.label") }</AvatarFallback>
//               ) }
//               { loading && (
//                 <View className="absolute inset-0 items-center justify-center bg-white/70 rounded-full">
//                   <ActivityIndicator size="small" color="#555" />
//                 </View>
//               ) }
//             </Avatar>
//             <Text className="text-center text-gray-500 mt-4">{ t("faceId.description") }</Text>
//           </View>

//           <View className="mt-6 space-y-3">
//             <Button onPress={ () => pickImage(true) }>
//               <Text>
//                 { t("takePhoto") }
//               </Text>
//             </Button>
//             <Button onPress={ () => pickImage(false) }>
//               <Text>
//                 { t("Choose from Gallery") }
//               </Text>
//             </Button>
//           </View>
//         </View>
//       </Sheet.Frame>
//     </Sheet>
//   );
// };

// export default FaceDrawer;

import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Myasxios } from "@/shared/generics";
import { Button, Sheet, Avatar, AvatarFallback, AvatarImage } from "tamagui";
import { isAxiosError } from "axios";

interface Props {
  open: boolean;
  setFaceOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FaceDrawer: React.FC<Props> = ({ open, setFaceOpen }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { refetch } = useQuery({
    queryKey: ["face"],
    enabled: open,
    queryFn: async () => {
      const response = await Myasxios.get("/face");
      if (response.data?.file?.filename) {
        setPreviewUrl(
          `${process.env.EXPO_PUBLIC_BASE_URL}/files/${response.data.file.filename}`
        );
      }
      return response.data;
    },
  });

  useEffect(() => {
    if (open) refetch();
  }, [open]);

  const requestPermissions = async () => {
    const camera = await ImagePicker.requestCameraPermissionsAsync();
    const library = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!camera.granted || !library.granted) {
      Toast.show({ type: "error", text1: t('Permission denied') });
      return false;
    }
    return true;
  };

  const pickImage = async (camera: boolean) => {
    if (!(await requestPermissions())) return;
    const result = camera
      ? await ImagePicker.launchCameraAsync({ quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });

    if (!result.canceled && result.assets.length) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const name = uri.split('/').pop() || 'face.jpg';
      const type = asset.type || 'image/jpeg';

      const formData = new FormData();
      formData.append('file', { uri, name, type } as any);
      await upload(formData);
    }
  };

  const upload = async (formData: FormData) => {
    setLoading(true);
    try {
      const res = await Myasxios.post('/files/face', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileId = res.data?.file?.id;
      if (fileId) {
        await Myasxios.post('/face', { fileId });
        Toast.show({ type: 'success', text1: t('faceId.success') });
        refetch();
        setFaceOpen(false);
      }
      if (res.data?.file?.filename) {
        setPreviewUrl(
          `${process.env.EXPO_PUBLIC_BASE_URL}/files/${res.data.file.filename}`
        );
      }
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 406) {
        Toast.show({ type: 'error', text1: t('face406') });
      } else {
        Toast.show({ type: 'error', text1: t('faceId.error') });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={ open } onOpenChange={ setFaceOpen } snapPoints={ [55] } modal>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame padding={ 16 } backgroundColor="#fff" borderTopLeftRadius={ 16 } borderTopRightRadius={ 16 }>
        <View style={ styles.container }>
          <Text style={ styles.title }>{ t('faceId.title') }</Text>

          <Avatar size={ 80 } borderWidth={ 2 } borderColor="#ccc">
            { previewUrl ? (
              <AvatarImage source={ { uri: previewUrl } } />
            ) : (
              <AvatarFallback>
                <Text>{ t('faceId.label') }</Text>
              </AvatarFallback>
            ) }
            { loading && (
              <View style={ styles.loadingOverlay }>
                <ActivityIndicator size="small" />
              </View>
            ) }
          </Avatar>
          <Text style={ styles.description }>{ t('faceId.description') }</Text>

          <View style={ styles.buttonContainer }>
            <Button onPress={ () => pickImage(true) } marginBottom={ 8 }>
              <Text>{ t('takePhoto') }</Text>
            </Button>
            <Button onPress={ () => pickImage(false) }>
              <Text>{ t('Choose from Gallery') }</Text>
            </Button>
          </View>
        </View>
      </Sheet.Frame>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  container: { minHeight: 400, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  description: { textAlign: 'center', color: '#666', marginTop: 8 },
  buttonContainer: { width: '100%', marginTop: 24 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 40 },
});

export default FaceDrawer;
