import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Membership2Type } from "@/@types";
import MembershipName from "@/pages/membership/language";
import { t } from "i18next";
import React from "react";

export interface Tariff {
  avatar: string;
  name_eng: string;
  name_ru: string;
  name_uz: string;
  price: string;
  sessionLimit: number;
  userCount: number;
}

interface User {
  id: number;
  firstName: string;
  phoneNumber: string;
}

interface TariffInfoProps {
  startDate: string;
  endDate: string;
  usedSessions: number;
  tariff?: Partial<Tariff>;
  users: User[];
}

export function TariffDrawer({
  data,
  isOpenSelectedTarif,
  setIsOpenSelectedTarif,
}: {
  data: Partial<Membership2Type>;
  isOpenSelectedTarif: boolean;
  setIsOpenSelectedTarif: React.Dispatch<boolean>;
}) {
  return (
    <Drawer open={isOpenSelectedTarif} onOpenChange={setIsOpenSelectedTarif}>
      <DrawerContent className="max-w-md mx-auto p-4 z-[999] pt-2 pb-5">
        <div className="space-y-4 pt-4 ">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-medium text-gray-600">
                {t("tariff.sessionLimit")}
              </p>
              <p className="text-gray-900">
                {data?.usedSessions}/{data?.tariff?.sessionLimit}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="font-medium text-gray-600">
                {t("tariff.totalUsers")}
              </p>
              <p className="text-gray-900">{data?.tariff?.userCount}</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">
              {t("tariff.invitedFriends")}
            </h3>
            {data?.users?.length > 0 ? (
              <ul className="space-y-2">
                {data?.users?.map((user) => (
                  <li
                    key={user.id}
                    className="bg-gray-50 rounded-md flex items-center gap-3 border p-3"
                  >
                    {user.avatar ? (
                      <img
                        loading="lazy"
                        width={48}
                        height={48}
                        src={import.meta.env.VITE_BASE_URL + user.avatar}
                        className="size-12 rounded-[6px] object-cover "
                        alt={user.firstName}
                      />
                    ) : (
                      <div className="size-12 rounded-[6px] flex items-center justify-center border-primary border  ">
                        <p> {user.firstName[0]}</p>
                      </div>
                    )}
                    <div className=" ">
                      <p className="font-medium">{user.firstName}</p>
                      <p className="text-sm text-gray-600">
                        {user.phoneNumber}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Do‘stlar qo‘shilmagan.</p>
            )}
          </div>
        </div>

        <DrawerClose className="mt-6">
          <Button className="w-full">{t("common.close")}</Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}
