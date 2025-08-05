// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
// } from "@/components/ui/drawer";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import React, { useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Loader2 } from "lucide-react";
// import toast from "react-hot-toast";
// import Cookies from "js-cookie";
// import { Myasxios } from "@/shared/generics";
// import { useQuery } from "@tanstack/react-query";
// import heic2any from "heic2any";
// import loadImage from "blueimp-load-image";
// import { Sheet } from "tamagui";
// import { Text, View } from "react-native";

// interface Props {
//   open: boolean;
//   setFaceOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const FaceDrawer: React.FC<Props> = ({ open, setFaceOpen }) => {
//   const { t } = useTranslation();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [loading, setLoading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState<string>("");
//   const { data, refetch } = useQuery({
//     queryKey: ["face"],
//     queryFn: async () => {
//       const response = await Myasxios.get("/face", {
//         headers: {
//           Authorization: `Bearer ${Cookies.get("access_token")}`,
//         },
//       });
//       if (response.data) {
//         setPreviewUrl(
//           `${import.meta.env.VITE_BASE_URL}/files/${
//             response?.data?.file?.filename
//           }`
//         );
//       }
//       return response.data;
//     },
//   });
//   // if (open) {
//   //   refetch();
//   // }

//   // const handleFileChange = async (event) => {
//   //   const file = event.target.files[0];
//   //   if (file && file.type === "image/heic") {
//   //     try {
//   //       const convertedBlob = await heic2any({
//   //         blob: file,
//   //         toType: "image/jpeg",
//   //         quality: 0.8, // Adjust quality as needed
//   //       });
//   //       // Now you have a JPEG Blob, you can use it (e.g., create a URL for display)
//   //       const imageUrl = URL.createObjectURL(convertedBlob);
//   //       // Set state to display the image or send it to a server
//   //     } catch (error) {
//   //       console.error("Error converting HEIC:", error);
//   //     }
//   //   }
//   // };
//   const userAgent = navigator.userAgent || navigator.vendor || window.opener;

//   // if (/android/i.test(userAgent)) {
//   //   alert("Android qurilma");
//   // } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
//   //   alert("iOS (iPhone/iPad/iPod)");
//   // } else {
//   //   alert("Boshqa qurilma yoki desktop");
//   // }

//   const handleUpload = async (file: File) => {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await Myasxios.post("/files/face", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${Cookies.get("access_token")}`,
//         },
//       });
//       if (response.data.file.id) {
//         try {
//           await Myasxios.post("/face", {
//             fileId: response.data.file.id,
//           });
//           toast.success(t("faceId.success"));
//           refetch();
//         } catch (error) {
//           toast.error(t("faceId.error"), error);
//         }
//       }
//       setPreviewUrl(
//         `${import.meta.env.VITE_BASE_URL}/files/${
//           response?.data?.file?.filename
//         }`
//       );
//       setFaceOpen(false);
//     } catch (error) {
//       if (error.status == 406) {
//         toast.error(t("face406"));
//       } else {
//         toast.error(t("faceId.error"));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   function isAndroid() {
//     return /Android/i.test(navigator.userAgent);
//   }
//   // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const file = e.target.files?.[0];
//   //   if (file) {
//   //     handleUpload(file);
//   //   }
//   // };
  
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const isHeic = file.name.toLowerCase().endsWith(".heic");

//     try {
//       let inputBlob: Blob;
//       if (isHeic) {
//         const convertedBlob = await heic2any({
//           blob: file,
//           toType: "image/jpeg",
//           quality: 0.8,
//         });

//         if (!(convertedBlob instanceof Blob)) {
//           throw new Error("Konvertatsiya natijasi Blob emas");
//         }

//         inputBlob = convertedBlob;
//       } else {
//         inputBlob = file;
//       }
//       loadImage(
//         inputBlob,
//         async (canvas: HTMLCanvasElement | Event) => {
//           if (!(canvas instanceof HTMLCanvasElement)) {
//             toast.error("Rasmni o‘qishda xatolik yuz berdi");
//             return;
//           }

//           canvas.toBlob(async (blob) => {
//             if (!blob) {
//               toast.error("Blob yaratishda xatolik");
//               return;
//             }

//             const fixedFile = new File([blob], file.name, {
//               type: file.type || "image/jpeg",
//               lastModified: Date.now(),
//             });
//             await handleUpload(fixedFile);
//           }, "image/jpeg");
//         },
//         {
//           orientation: true,
//           canvas: true,
//         }
//       );
//     } catch (error) {
//       console.error("Rasmni qayta ishlashda xatolik:", error);
//       toast.error("Rasmni yuklashda xatolik yuz berdi");
//     }
//   };

//   return (
//     <Sheet open={open} onOpenChange={setFaceOpen}>
//       <View className="p-4 pb-6 min-h-[400px] z-[9999] max-w-[500px] mx-auto">
//         <View>
//           <Text>{t("faceId.title")}</Text>
//         </View>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           accept="image/*"
//           capture="environment"
//           // capture="user"
//           className="hidden"
//         />
//         <input
//           type="file"
//           accept="image/*"
//           capture="user"
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           id="cameraInput"
//           className="hidden"
//         />
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           id="galleryInput"
//           className="hidden"
//         />
//         <div className="flex flex-col items-center gap-4 mt-6">
//           <div
//             onClick={() => fileInputRef.current?.click()}
//             className="relative cursor-pointer"
//           >
//             <Avatar className="size-32 border-2  static z-[50]  border-gym-400">
//               {previewUrl && (
//                 <AvatarImage
//                   src={previewUrl}
//                   alt="Face ID Preview"
//                   className="object-cover"
//                 />
//               )}
//               <AvatarFallback>
//                 {/* {data?.user?.firstName[0] + data?.user?.lastName[0]} */}
//                 {t("faceId.label")}
//               </AvatarFallback>
//             </Avatar>
//             <div className="absolute animate-ping size-40 -top-4 right-0 bottom-0 -left-4 bg-primary/20 flex items-center justify-center rounded-full z-[10]" />
//             {loading && (
//               <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
//                 <Loader2 className="animate-spin text-gym-500 size-6" />
//               </div>
//             )}
//           </div>
//           <p className="text-muted-foreground text-center">
//             {t("faceId.description")}
//           </p>
//           <div className="flex w-full flex-col gap-3">
//             <Button
//               onClick={() => document.getElementById("cameraInput")?.click()}
//               className={`w-full ${isAndroid() && "hidden"}`}
//             >
//               {t("takePhoto")}
//             </Button>
//             <Button
//               onClick={() => document.getElementById("galleryInput")?.click()}
//               className="w-full"
//             >
//               {t("Choose from Gallery")}
//             </Button>
//           </div>
//         </div>
//       </DrawerContent>
//     </She>
//   );
// };

// export default FaceDrawer;
