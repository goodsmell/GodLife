import { Outlet } from "react-router-dom";
import SideMenu from "../components/menu/SideMenu";
export default function HomeLayout() {
  return (
    <div>
      <SideMenu />
      <Outlet />
    </div>
  );
}
