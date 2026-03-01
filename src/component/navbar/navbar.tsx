import React from 'react';
import { PiDiamondsFourFill } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineDarkMode } from "react-icons/md";
const Navbar: React.FC = () => {
  const DiamondIcon = PiDiamondsFourFill as unknown as React.FC<{ size?: number; className?: string }>;
  const UserIcon = FaUserCircle as unknown as React.FC<{ size?: number; className?: string }>;
  const DarkModeIcon = MdOutlineDarkMode as unknown as React.FC<{ size?: number; className?: string }>;

  return (
    <div className="flex w-full mt-3 justify-between gap-4 p-4">
          <div className="flex-1 ml-4 cursor-pointer">
            <DiamondIcon size={26} className="text-[#6362E7]"/>
          </div>
          <div className="flex gap-5 cursor-pointer mr-4">
            <UserIcon size={26}/>
            <DarkModeIcon size={26}/>
          </div>
      </div>
  );
};

export default Navbar;
