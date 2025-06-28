
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  Activity, 
  CheckSquare, 
  Eye, 
  Palette, 
  Plus, 
  HelpCircle, 
  LogOut,
  Users
} from "lucide-react";

const UserAccountMenu = () => {
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    avatar: "",
    initials: "AJ"
  };

  const handleMenuAction = (action: string) => {
    console.log(`${action} clicked`);
    // Add your logic here for each menu action
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
        className="w-80 p-4 bg-white dark:bg-gray-800 border border-yellow-200 dark:border-gray-700 shadow-xl rounded-lg"
        align="end"
        sideOffset={8}
      >
        {/* User Profile Section */}
        <div className="flex items-center space-x-3 pb-4 border-b border-yellow-100 dark:border-gray-700">
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

        {/* Account Management */}
        <div className="py-2">
          <DropdownMenuLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-0">
            Account
          </DropdownMenuLabel>
          
          <DropdownMenuItem 
            className="flex items-center space-x-3 py-3 px-2 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={() => handleMenuAction("Switch accounts")}
          >
            <Users className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium">Switch accounts</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="flex items-center space-x-3 py-3 px-2 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={() => handleMenuAction("Account settings")}
          >
            <Settings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium">Account settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="flex items-center space-x-3 py-3 px-2 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={() => handleMenuAction("Activity history")}
          >
            <Activity className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium">Activity history</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-yellow-100 dark:bg-gray-700" />

        {/* Personal Features */}
        <div className="py-2">
          <DropdownMenuLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-0">
            Personal
          </DropdownMenuLabel>
          
          <DropdownMenuItem 
            className="flex items-center space-x-3 py-3 px-2 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={() => handleMenuAction("Assigned to me")}
          >
            <CheckSquare className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium">Assigned to me</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="flex items-center space-x-3 py-3 px-2 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={() => handleMenuAction("Profile visibility")}
          >
            <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium">Profile visibility</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-yellow-100 dark:bg-gray-700" />

        {/* App Settings */}
        <div className="py-2">
          <DropdownMenuLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-0">
            Settings
          </DropdownMenuLabel>
          
          <DropdownMenuItem 
            className="flex items-center space-x-3 py-3 px-2 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={() => handleMenuAction("App settings")}
          >
            <Palette className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium">Theme & notifications</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-yellow-100 dark:bg-gray-700" />

        {/* Quick Actions */}
        <div className="py-2">
          <DropdownMenuLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-0">
            Quick Actions
          </DropdownMenuLabel>
          
          <DropdownMenuItem 
            className="flex items-center space-x-3 py-3 px-2 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={() => handleMenuAction("Create workspace")}
          >
            <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium">Create a workspace</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="flex items-center space-x-3 py-3 px-2 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={() => handleMenuAction("Help & support")}
          >
            <HelpCircle className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium">Help & support</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-yellow-100 dark:bg-gray-700" />

        {/* Logout */}
        <div className="pt-2">
          <DropdownMenuItem 
            className="flex items-center space-x-3 py-3 px-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md cursor-pointer text-red-600 dark:text-red-400"
            onClick={() => handleMenuAction("Logout")}
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
