
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, User, Bell, Video, Filter, Headphones } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="border-b border-newswire-lightGray">
      <div className="container mx-auto px-4 md:px-6">
        {/* Top header with date and sections */}
        <div className="py-2 text-xs text-newswire-mediumGray flex justify-between items-center border-b border-newswire-lightGray">
          <div className="hidden md:flex gap-4">
            <span>Internal Platform</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex gap-4">
            <Link to="/dashboard" className="hover:text-newswire-black">Dashboard</Link>
            <Link to="/login" className="hover:text-newswire-black">Sign In</Link>
          </div>
        </div>
        
        {/* Main header with logo and search */}
        <div className="py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu size={24} />
            </Button>
            <Link to="/" className="text-4xl font-display font-bold tracking-tight flex items-center">
              <Video className="mr-2" size={28} />
              NEWSWIRE
              <span className="text-xs ml-2 text-newswire-mediumGray">by storyful</span>
            </Link>
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
            <Button variant="outline" className="hidden md:inline-flex">
              134 / 100 <Video className="ml-2" size={16} />
            </Button>
            <Button className="hidden md:inline-flex bg-orange-500 hover:bg-orange-600">
              <Headphones className="mr-2" size={16} />
              Talk to a Licensing Expert
            </Button>
          </div>
        </div>
        
        {/* Navigation menu */}
        <nav className="py-2 border-t border-newswire-lightGray hidden md:block">
          <ul className="flex gap-6 text-sm font-medium overflow-x-auto">
            <li><Link to="/" className="hover:text-newswire-accent whitespace-nowrap">Home</Link></li>
            <li><Link to="/top-stories" className="hover:text-newswire-accent whitespace-nowrap">Top Videos</Link></li>
            <li><Link to="/trending" className="hover:text-newswire-accent whitespace-nowrap">Trending</Link></li>
            <li><Link to="/categories" className="hover:text-newswire-accent whitespace-nowrap">Categories</Link></li>
            <li><Link to="/regions" className="hover:text-newswire-accent whitespace-nowrap">Regions</Link></li>
            <li><Link to="/licensed" className="hover:text-newswire-accent whitespace-nowrap">Licensed</Link></li>
            <li><Link to="/restricted" className="hover:text-newswire-accent whitespace-nowrap">Restricted</Link></li>
            <li><Link to="/cleared" className="hover:text-newswire-accent whitespace-nowrap">Cleared</Link></li>
            <li><Link to="/licenses" className="hover:text-newswire-accent whitespace-nowrap">My Licenses</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
