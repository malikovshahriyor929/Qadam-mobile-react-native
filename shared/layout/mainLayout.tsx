import BottomNavigation from "@/components/navigationbar/BottomNavigation";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <Outlet />
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;
