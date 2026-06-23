"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumb = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((p) => p !== "");

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
      <Link href="/" className="hover:text-primary transition-colors flex items-center">
        <Home className="w-4 h-4" />
      </Link>
      
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const formattedPath = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900">{formattedPath}</span>
            ) : (
              <Link href={href} className="hover:text-primary transition-colors">
                {formattedPath}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
