import React from 'react';

import { Button } from '../../atoms';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-primary font-display font-bold text-xl">Garden Planner</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
            Home
          </a>
          <a href="/garden" className="text-gray-700 hover:text-primary font-medium transition-colors">
            My Garden
          </a>
          <a href="/plants" className="text-gray-700 hover:text-primary font-medium transition-colors">
            Plants
          </a>
        </nav>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            Help
          </Button>
          <Button variant="primary" size="sm">
            New Garden
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;