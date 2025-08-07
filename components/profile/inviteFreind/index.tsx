import React, { useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Myasxios } from "@/shared/generics";
import toast from "react-hot-toast";
import { t } from "i18next";
import MembershipName from "@/pages/membership/language";
import { Crown, Star } from "lucide-react";
import { Membership2Type } from "@/@types";

interface User {
  id: number;
  firstName: string;
  phoneNumber: string;
}

interface TariffData {
  id: number;
  startDate: string;
  endDate: string;
  usedSessions: number;
  tariff: {
    id: number;
    name_uz: string;
    name_ru: string;
    name_eng: string;
    price: string;
    userCount: number;
  };
  users: User[];
}

const InviteDrawer = ({
  data,
  phoneDrawerOpen,
  setPhoneDrawerOpen,
  selectedUser,
  refetchMemberShip,
}: {
  data: Partial<Membership2Type[]>;
  phoneDrawerOpen: boolean;
  selectedUser: number;
  setPhoneDrawerOpen: React.Dispatch<boolean>;
  refetchMemberShip: () => void;
}) => {
  // const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [phone, setPhone] = useState("+998");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await Myasxios.post(`/tariffs/invite`, {
        phone,
        userTariffId: selectedUser,
      });
      toast.success(t("inviteSuccess"));
      setPhoneDrawerOpen(false);
    } catch (err) {
      if (err.status == 400) {
        toast.error(t("alreadyInvited"));
      } else {
        toast.error(t("inviteError"));
      }
    } finally {
      setLoading(false);
      setPhone("+998");
      refetchMemberShip();
    }
  };
  return (
    <>
      <Drawer open={phoneDrawerOpen} onOpenChange={setPhoneDrawerOpen}>
        <DrawerContent className="z-[999] max-w-[500px] mx-auto mb-5">
          <div className="p-4 space-y-4">
            <h2 className="text-base font-medium">{t("enterPhone")}</h2>
            <Input
              value={phone}
              onChange={(e) => {
                let val = e.target.value;
                if (!val.startsWith("+998")) {
                  val = "+998" + val.replace(/\D/g, "").replace(/^998/, "");
                }
                const numbersOnly = val.replace(/\D/g, "").slice(0, 12); // cheklash
                setPhone("+998" + numbersOnly.replace(/^998/, "").slice(0, 9));
              }}
              onKeyDown={(e) => {
                if (
                  (e.key === "Backspace" || e.key === "Delete") &&
                  phone.length <= 4
                ) {
                  e.preventDefault();
                }
              }}
              className="outline-none "
              placeholder="+998"
            />
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={loading || !phone.startsWith("+998")}
            >
              {loading ? t("sending") : t("send")}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default InviteDrawer;
