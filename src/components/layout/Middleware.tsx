import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/store";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export function Middleware() {
  // const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/login");
  //   }
  // }, [isAuthenticated, navigate]);

  // if (!isAuthenticated || !user) {
  //   return null;
  // }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div
        className={cn(
          "flex flex-col flex-1 overflow-hidden transition-all duration-300",
          // !sidebarOpen && "ml-[30px]"
        )}
      >
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default Middleware;
