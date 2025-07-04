
import React from 'react';
import { Home, DollarSign, CheckSquare, Calendar, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  view: string;
  onNavigate: (view: string) => void;
}

export function AppSidebar({ view, onNavigate }: AppSidebarProps) {
  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "finances", label: "Finances", icon: DollarSign },
    { id: "todo", label: "To-Do", icon: CheckSquare },
    { id: "planning", label: "Planning", icon: Calendar },
    { id: "documents", label: "Documents", icon: FileText }
  ];

  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#F6C103] to-[#E5AD03] bg-clip-text text-transparent">
            SKOOLIFE
          </h1>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onNavigate(item.id)}
                      isActive={view === item.id}
                      className={`w-full justify-start ${
                        view === item.id 
                          ? "bg-gradient-to-r from-[#F6C103] to-[#E5AD03] text-gray-900" 
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-[#FEF7D6] dark:hover:bg-gray-700"
                      }`}
                    >
                      <IconComponent className="h-5 w-5 mr-3" />
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
