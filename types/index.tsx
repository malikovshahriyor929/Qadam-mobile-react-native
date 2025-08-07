import { ImageSourcePropType } from "react-native";

export type LanguageOption = {
  id: number;
  title: string;
  shortTitle: string;
  code: string;
  img: ImageSourcePropType;
};

export interface userType {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatarUrl?: string;
  role?: "user" | "admin" | "superAdmin";
  balance?: {
    id: number;
    amount: string;
  };
  transactions?: [
    {
      id: number;
      amount: string;
      type: TransactionType;
      description: string;
      createdAt: string;
    }
  ];
  transactionsPagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  SUBSCRIPTION = "subscription",
}

export interface MembershipType {
  active: boolean;
  avatar: {
    createdAt: string;
    createdById: boolean;
    filename: string;
    id: string;
    mimetype: string;
    originalname: string;
    path: string;
    size: number;
    updatedAt: string;
  };
  avatarId: string;
  createdAt: string;
  durationInDays: number;
  id: number;
  price: string;
  sessionDurationInMinutes: number;
  sessionLimit: number;
  updatedAt: string;
  name_eng: string;
  name_uz: string;
  name_ru: string;
  description_eng: string;
  description_ru: string;
  description_uz: string;
}

interface Tariff {
  id: number;
  active: boolean;
  name_eng: string;
  name_ru: string;
  name_uz: string;
  price: string;
  sessionLimit: number;
  createdAt: string;
  updatedAt: string;
  avatar: Avatar;
  userCount: number;
  sessionDurationInHours: number;
}

interface Avatar {
  id: string;
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
}
interface User {
  id: number;
  firstName: string;
  phoneNumber: string;
  avatar: string;
}

export interface Membership2Type {
  id: number;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  durationInDays: number;
  sessionLimit: number;
  usedSessions: number;
  tariff: Tariff;
  avatar?: string; // Optional if it might not always exist
  avatarId?: string; // Optional if it might not always exist
  users: User[];
}

export type HallType = {
  connected?: boolean;
  id: number;
  name_eng: string;
  name_ru: string;
  name_uz: string;
  address_eng: string;
  address_ru: string;
  address_uz: string;
  capacity: number;
  bookedSessions: [
    {
      endTime: string;
      startTime: string;
    }
  ]; // or specify the type if you know the shape of booked sessions
  latitude: string;
  longitude: string;
  created_at: string;
  distance: string;
  averageRate: number;
  images: HallImgaeType[];
  availability: {
    isAvailableNow: boolean;
  };
};
export type HallImgaeType = {
  createdAt: string;
  createdById: null | number | string;
  filename: string;
  id: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
  updatedAt: string;
};

// post
type FileInfo = {
  createdAt: string;
  createdById: string | null;
  filename: string;
  id: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
  updatedAt: string;
};

export type PostDataType = {
  createdAt: string;
  updatedAt: string;
  description: string;
  miniDescription: string;
  name: string;
  description_en: string;
  description_ru: string;
  description_uz: string;
  id: string;
  fileId: string;
  file: FileInfo;
  miniDescription_en: string;
  miniDescription_ru: string;
  miniDescription_uz: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
};

type Image = {
  createdAt: string;
  createdById: string | null;
  filename: string;
  id: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
  updatedAt: string;
};

export type UserTariff = {
  id: number;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  durationInDays: number;
  sessionLimit: number;
  usedSessions: number;
  tariff: Tariff;
  avatar?: Image; // Optional if it might not always exist
  avatarId?: string; // Optional if it might not always exist
};

type Location = {
  address_eng: string;
  address_ru: string;
  address_uz: string;
  capacity: number;
  created_at: string;
  id: number;
  images: HallImgaeType[];
  latitude: string;
  longitude: string;
  name_eng: string;
  name_ru: string;
  name_uz: string;
  rate: number | null;
  updatedAt: string;
};

export type BookingType = {
  rate: {
    amount: string;
    comment: string;
    createdAt: string;
    id: number;
    updatedAt: string;
  };
  createdAt: string;
  endTime: string;
  id: number;
  location: Location;
  startTime: string;
  updatedAt: string;
  userTariff: UserTariff;
  status: "pending" | "using" | "expired" | "used" | "cancelled";
  isYour: boolean;
};
