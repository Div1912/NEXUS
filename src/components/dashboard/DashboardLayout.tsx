import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import TopBar from './TopBar';
import { useNexus } from '@/contexts/NexusContext';

const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { presentationMode } = useNexus();

  return (
    <div className="min-h-screen bg-background flex">
      {!presentationMode && (
        <DashboardSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />
      )}
      <div className={`flex-1 flex flex-col transition-all duration-200 ${
        presentationMode ? 'ml-0' : sidebarCollapsed ? 'ml-14' : 'ml-56'
      }`}>
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
