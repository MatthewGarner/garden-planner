import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '../../atoms';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <span className="text-primary font-display font-bold text-xl">Garden Planner</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`font-medium transition-colors ${
              isActive('/') && !isActive('/garden') && !isActive('/plants') 
                ? 'text-primary' 
                : 'text-gray-700 hover:text-primary'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/garden" 
            className={`font-medium transition-colors ${
              isActive('/garden') ? 'text-primary' : 'text-gray-700 hover:text-primary'
            }`}
          >
            My Garden
          </Link>
          <Link 
            to="/plants" 
            className={`font-medium transition-colors ${
              isActive('/plants') ? 'text-primary' : 'text-gray-700 hover:text-primary'
            }`}
          >
            Plants
          </Link>
        </nav>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            Help
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => navigate('/garden/new')}
          >
            New Garden
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;