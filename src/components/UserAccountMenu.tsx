
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LogOut, User, Settings, Bell, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserAccountMenu = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const userDisplayData = {
    name: user.user_metadata?.first_name && user.user_metadata?.last_name 
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
      : user.email?.split('@')[0] || "Utilisateur",
    email: user.email || "",
    avatar: "",
    initials: user.user_metadata?.first_name && user.user_metadata?.last_name
      ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`
      : user.email?.[0]?.toUpperCase() || "U"
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleSwitchAccounts = () => {
    console.log("Switch accounts clicked");
    // Add switch accounts logic here
  };

  const handleAccountSettings = () => {
    console.log("Account settings clicked");
    // Add account settings logic here
  };

  const handleNotificationToggle = () => {
    console.log("Notification toggle clicked");
    // Add notification toggle logic here
  };

  const getPlanDisplay = () => {
    if (!profile) return "Free";
    switch (profile.plan) {
      case 'monthly':
        return "SKOOLIFE+ Mensuel";
      case 'yearly':
        return "SKOOLIFE+ Annuel";
      default:
        return "Free";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-yellow-200 hover:border-yellow-300 transition-colors">
            <AvatarImage src={userDisplayData.avatar} alt={userDisplayData.name} />
            <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 font-semibold">
              {userDisplayData.initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-72 p-4 bg-white dark:bg-gray-800 border border-yellow-200 dark:border-gray-700 shadow-xl rounded-lg"
        align="end"
        sideOffset={8}
      >
        {/* User Profile Section */}
        <div className="flex items-center space-x-3 pb-4">
          <Avatar className="h-12 w-12 border-2 border-yellow-200">
            <AvatarImage src={userDisplayData.avatar} alt={userDisplayData.name} />
            <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 font-semibold text-lg">
              {userDisplayData.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {userDisplayData.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {userDisplayData.email}
            </p>
            {profile && profile.plan !== 'free' && (
              <div className="flex items-center gap-1 mt-1">
                <Crown className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  {getPlanDisplay()}
                </span>
              </div>
            )}
          </div>
        </div>

        <DropdownMenuSeparator className="bg-yellow-100 dark:bg-gray-700" />

        {/* Account Section */}
        <div className="py-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 pb-2">
            Account
          </p>
          <DropdownMenuItem 
            className="flex items-center space-x-3 py-2 px-2 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={handleSwitchAccounts}
          >
            <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm">Switch accounts</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center space-x-3 py-2 px-2 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={handleAccountSettings}
          >
            <Settings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm">Account settings</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-yellow-100 dark:bg-gray-700" />

        {/* Notifications Section */}
        <div className="py-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 pb-2">
            Notifications
          </p>
          <div className="flex items-center justify-between py-2 px-2 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-md">
            <div className="flex items-center space-x-3">
              <Bell className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              <span className="text-sm">Email notifications</span>
            </div>
            <Switch 
              className="data-[state=checked]:bg-yellow-500"
              onCheckedChange={handleNotificationToggle}
            />
          </div>
        </div>

        <DropdownMenuSeparator className="bg-yellow-100 dark:bg-gray-700" />

        {/* Quick Actions */}
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
