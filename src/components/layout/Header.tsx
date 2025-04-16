
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, User, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="border-b border-newswire-lightGray">
      <div className="container mx-auto px-4 md:px-6">
        {/* Top header with date and sections */}
        <div className="py-2 text-xs text-newswire-mediumGray flex justify-between items-center border-b border-newswire-lightGray">
          <div className="hidden md:flex gap-4">
            <span>U.S. Edition</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex gap-4">
            <Link to="/sections" className="hover:text-newswire-black">Sections</Link>
            <Link to="/login" className="hover:text-newswire-black">Sign In</Link>
          </div>
        </div>
        
        {/* Main header with logo and search */}
        <div className="py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu size={24} />
            </Button>
            <Link to="/" className="text-4xl font-display font-bold tracking-tight">NEWSWIRE</Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User size={20} />
            </Button>
            <Button variant="outline" className="hidden md:inline-flex">Subscribe</Button>
          </div>
        </div>
        
        {/* Navigation menu */}
        <nav className="py-2 border-t border-newswire-lightGray hidden md:block">
          <ul className="flex gap-6 text-sm font-medium overflow-x-auto">
            <li><Link to="/home" className="hover:text-newswire-accent whitespace-nowrap">Home</Link></li>
            <li><Link to="/world" className="hover:text-newswire-accent whitespace-nowrap">World</Link></li>
            <li><Link to="/business" className="hover:text-newswire-accent whitespace-nowrap">Business</Link></li>
            <li><Link to="/markets" className="hover:text-newswire-accent whitespace-nowrap">Markets</Link></li>
            <li><Link to="/politics" className="hover:text-newswire-accent whitespace-nowrap">Politics</Link></li>
            <li><Link to="/opinion" className="hover:text-newswire-accent whitespace-nowrap">Opinion</Link></li>
            <li><Link to="/tech" className="hover:text-newswire-accent whitespace-nowrap">Technology</Link></li>
            <li><Link to="/life" className="hover:text-newswire-accent whitespace-nowrap">Life & Arts</Link></li>
            <li><Link to="/real-estate" className="hover:text-newswire-accent whitespace-nowrap">Real Estate</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
