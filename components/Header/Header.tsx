import React from "react";
import { Search, Bell, UserCircle } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex-1" />
      
      {/* Centered Search */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-200"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Global Actions & User Profile */}
      <div className="flex-1 flex items-center justify-end space-x-4">
        <button className="text-gray-400 hover:text-gray-500 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
          <UserCircle className="h-8 w-8 text-gray-400" />
          <span className="text-sm font-medium hidden md:block">Admin User</span>
        </button>
      </div>
    </header>
  );
};
