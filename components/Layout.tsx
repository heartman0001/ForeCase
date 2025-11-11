import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar ด้านซ้าย */}
      <Sidebar />

      {/* พื้นที่เนื้อหา */}
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}

