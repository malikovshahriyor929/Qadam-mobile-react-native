import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import axios from "axios";
import { t } from "i18next";
import { Myasxios } from "@/shared/generics";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
interface props {
  setOpenForAdminReq: React.Dispatch<React.SetStateAction<boolean>>;
  openForAdminReq: boolean;
}
const InputDrawerForAdmin = ({
  openForAdminReq,
  setOpenForAdminReq,
}: props) => {
  // const [Value, setValue] = useState("");
  const [Value2, setValue2] = useState("");
  const submit = () => {
    Myasxios.post(
      `${import.meta.env.VITE_BASE_URL}/requests`,
      { description: Value2 },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      }
    )
      .then((res) => {
        toast.success(t("sent_to_admin"));
      })
      .finally(() => {
        setOpenForAdminReq(false);
      });
  };
  return (
    <>
      <Drawer open={openForAdminReq} onOpenChange={setOpenForAdminReq}>
        <DrawerContent className="max-w-md mx-auto z-[9999]">
          <DrawerHeader>
            <DrawerTitle>{t("contact_admin")}</DrawerTitle>
            <DrawerDescription>{t("describe_issue")}</DrawerDescription>
          </DrawerHeader>

          <div className="p-4">
            <Textarea
              value={Value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder={t("describe_issue")}
              className="mb-4 min-h-[120px] max-h-[300px]"
            />
          </div>

          <DrawerFooter>
            <Button
              onClick={() => {
                submit();
              }}
              className="w-full"
            >
              {t("common.submit")}
            </Button>
            <Button variant="outline" onClick={() => setOpenForAdminReq(false)}>
              {t("common.cancel")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default InputDrawerForAdmin;
