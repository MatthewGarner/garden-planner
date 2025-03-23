import React from 'react';

import { Header } from '../../organisms';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Garden Planner. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;