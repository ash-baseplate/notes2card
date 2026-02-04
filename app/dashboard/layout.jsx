import React from 'react';
import DashboardHeader from './_components/DashboardHeader';

function DashboardLayout({ children }) {
  return (
    <div>
      <DashboardHeader />
      <div className="p-10">{children}</div>
    </div>
  );
}

export default DashboardLayout;
