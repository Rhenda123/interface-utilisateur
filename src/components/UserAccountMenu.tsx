
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const UserAccountMenu = () => {
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    avatar: "",
    initials: "AJ"
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // Add your logout logic here
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-yellow-200 hover:border-yellow-300 transition-colors">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 font-semibold">
              {user.initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 p-4 bg-white dark:bg-gray-800 border border-yellow-200 dark:border-gray-700 shadow-xl rounded-lg"
        align="end"
        sideOffset={8}
      >
        {/* User Profile Section */}
        <div className="flex items-center space-x-3 pb-4">
          <Avatar className="h-12 w-12 border-2 border-yellow-200">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 font-semibold text-lg">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-yellow-100 dark:bg-gray-700" />

        {/* Logout */}
        <div className="pt-2">
          <DropdownMenuItem 
            className="flex items-center space-x-3 py-3 px-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md cursor-pointer text-red-600 dark:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountMenu;
