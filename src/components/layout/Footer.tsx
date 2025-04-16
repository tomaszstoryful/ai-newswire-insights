
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-newswire-lightGray mt-12 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold font-display mb-4">NEWSWIRE</h3>
            <p className="text-sm text-newswire-mediumGray">Video Licensing Platform for Global Media</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-3 text-sm">Licensing Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/licensing/process" className="text-newswire-mediumGray hover:text-newswire-black">Licensing Process</Link></li>
              <li><Link to="/licensing/pricing" className="text-newswire-mediumGray hover:text-newswire-black">Pricing</Link></li>
              <li><Link to="/licensing/terms" className="text-newswire-mediumGray hover:text-newswire-black">License Terms</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-3 text-sm">Video Library</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/categories" className="text-newswire-mediumGray hover:text-newswire-black">Video Categories</Link></li>
              <li><Link to="/trending" className="text-newswire-mediumGray hover:text-newswire-black">Trending Videos</Link></li>
              <li><Link to="/regions" className="text-newswire-mediumGray hover:text-newswire-black">Regional Content</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-newswire-mediumGray hover:text-newswire-black">Help Center</Link></li>
              <li><Link to="/contact" className="text-newswire-mediumGray hover:text-newswire-black">Contact Sales</Link></li>
              <li><Link to="/faq" className="text-newswire-mediumGray hover:text-newswire-black">FAQs</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-newswire-mediumGray">
              © {new Date().getFullYear()} Newswire Video Licensing. All Rights Reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-xs text-newswire-mediumGray hover:text-newswire-black">Privacy Policy</Link>
              <Link to="/terms" className="text-xs text-newswire-mediumGray hover:text-newswire-black">Terms of Service</Link>
              <Link to="/cookies" className="text-xs text-newswire-mediumGray hover:text-newswire-black">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
