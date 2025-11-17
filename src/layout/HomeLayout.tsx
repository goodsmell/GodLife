// src/layout/HomeLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../components/menu/SideMenu";

export default function HomeLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SideMenu isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <main className="relative z-0 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
