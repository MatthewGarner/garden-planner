import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '../../atoms';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when navigating
  const handleNavigate = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <span className="text-primary font-display font-bold text-xl">Garden Planner</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-gray-700" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
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

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
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

      {/* Mobile Menu (Slide Down) */}
      <div 
        className={`md:hidden bg-white overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-60 py-3 shadow-md' : 'max-h-0'
        }`}
      >
        <nav className="container mx-auto px-4 flex flex-col space-y-4">
          <Link 
            to="/" 
            className={`py-2 px-3 rounded-lg text-center text-lg ${
              isActive('/') && !isActive('/garden') && !isActive('/plants') 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-gray-700'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/garden" 
            className={`py-2 px-3 rounded-lg text-center text-lg ${
              isActive('/garden') 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-gray-700'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            My Garden
          </Link>
          <Link 
            to="/plants" 
            className={`py-2 px-3 rounded-lg text-center text-lg ${
              isActive('/plants') 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-gray-700'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Plants
          </Link>
          <div className="flex flex-col space-y-2 pt-2">
            <Button 
              variant="outline" 
              fullWidth
            >
              Help
            </Button>
            <Button 
              variant="primary" 
              fullWidth
              onClick={() => handleNavigate('/garden/new')}
            >
              New Garden
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;