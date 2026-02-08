import React, { useState } from "react";
import Sidebar from "./layouts/Sidebar";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const App: React.FC<LayoutProps> = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen min-w-screen">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed}`}>
        <div className="min-h-screen ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
