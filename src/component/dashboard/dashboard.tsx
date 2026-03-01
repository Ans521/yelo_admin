import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Store, FolderTree } from "lucide-react";
import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/sidebar";
import { api } from "../../api";

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [counts, setCounts] = useState<{ businesses: number; users: number; categories: number }>({
    businesses: 0,
    users: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data } = await api.get("/get-counts");
        const res = data?.data ?? data;
        setCounts({
          businesses: res?.businesses ?? 0,
          users: res?.users ?? 0,
          categories: res?.categories ?? 0,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  if (location.pathname !== "/") return null;

  const cards = [
    { title: "Users", count: counts.users, icon: <Users size={28} color="#3B82F6" />, link: "/" },
    { title: "Businesses", count: counts.businesses, icon: <Store size={28} color="#3B82F6" />, link: "/all-businesses" },
    { title: "Categories", count: counts.categories, icon: <FolderTree size={28} color="#3B82F6" />, link: "/category" },
  ];

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="w-full min-h-screen overflow-y-auto bg-[#F0F2FD] p-4">
          <div className="text-2xl px-2 py-4 font-bold">DashBoard</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-20 mt-1">
            {loading ? (
              <div className="col-span-full text-center py-8 text-gray-500">Loading counts...</div>
            ) : (
              cards.map((card: any, idx) => (
                <Link
                  to={card?.link}
                  key={idx}
                  className="flex flex-col justify-center items-center text-center bg-white rounded-2xl p-8 shadow-md transition-all duration-300 hover:translate-y-[-10px] cursor-pointer mb-4"
                >
                  <div className="mb-0.5">{card.icon}</div>
                  <div className="text-lg font-semibold text-[#3B82F6] mb-2">{card.title}</div>
                  <div className="text-2xl font-bold">{card.count}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
