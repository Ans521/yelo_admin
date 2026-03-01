import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  List,
  Users,
  LogOut,
  Store,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-[22%] bg-white text-black shadow-lg flex flex-col h-screen">
      
      <div className="px-5 mt-5 text-2xl font-semibold">Yelo_Admin</div>
      
      <div className="overflow-y-auto flex-1 mt-4">
        <nav className="p-4 flex flex-col space-y-4">
          {[
            { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
            { name: "Banner", path: "/banner", icon: <Image size={20} /> },
            { name: "General Notification", path: "/general-notify", icon: <List size={20} /> },
            { name: "Category", path: "/category", icon: <List size={20} /> },
            { name: "All Businesses", path: "/all-businesses", icon: <Store size={20} /> },
            // Removed All Providers - no longer needed
            { name: "Logout", path: "/", icon: <LogOut size={20} /> },
          ].map((item, index) => (
            <div key={index}>
              <Link
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? "bg-[#e3e9fe] font-medium text-[#6362E7]"
                    : "text-black hover:bg-[#dde2f6] font-medium"
                }`}
                onClick={() => {
                  if (item.name === "Logout") {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                  }
                }}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
