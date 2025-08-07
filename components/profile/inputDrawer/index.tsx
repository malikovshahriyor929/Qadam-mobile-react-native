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
import { Navigate, useNavigate } from "react-router-dom";
import { t } from "i18next";
import { Loader, Loader2 } from "lucide-react";
interface props {
  amountForPayment: number | string;
  setAmountForPayment: React.Dispatch<React.SetStateAction<number | string>>;
  setOpenForPayment: React.Dispatch<React.SetStateAction<boolean>>;
  openForPayment: boolean;
}
const InputDrawer = ({
  amountForPayment,
  setAmountForPayment,
  openForPayment,
  setOpenForPayment,
}: props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [Value, setValue] = useState("");
  const submit = () => {
    setLoading(true);
    const sanitizedValue = Value.replace(/\s+/g, "");
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/click/create`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
        params: { amount: sanitizedValue },
      })
      .then((res) => {
        window.location.href = res.data.url;
        // <Navigate to={res.data.url} />;
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <Drawer open={openForPayment} onOpenChange={setOpenForPayment}>
        <DrawerContent className="max-w-md mx-auto z-[9999]">
          <DrawerHeader>
            <DrawerTitle>{t("payment.enterAmount")}</DrawerTitle>
            <DrawerDescription>
              {t("payment.enterAmountDescription")}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4">
            <Input
              value={Value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("currency")}
              className="mb-4"
              type="number"
            />
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                onClick={() => setValue("50000")}
                variant="outline"
              >
                50 000 {t("currency")}
              </Button>
              <Button
                size="sm"
                onClick={() => setValue("200000")}
                variant="outline"
              >
                200 000 {t("currency")}
              </Button>
              <Button
                size="sm"
                onClick={() => setValue("400000")}
                variant="outline"
              >
                400 000 {t("currency")}
              </Button>
            </div>
          </div>

          <DrawerFooter>
            <Button
              onClick={() => {
                setAmountForPayment(Value);
                submit();
              }}
              disabled={loading}
              className="w-full disabled:opacity-70"
            >
              {!loading ? t("common.submit") : t("common.submit") + "..."}
            </Button>
            <Button variant="outline" onClick={() => setOpenForPayment(false)}>
              {t("common.cancel")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default InputDrawer;
