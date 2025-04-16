
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-newswire-lightGray mt-12 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold font-display mb-4">NEWSWIRE</h3>
            <p className="text-sm text-newswire-mediumGray">Breaking news and analysis at the speed of business.</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-3 text-sm">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-newswire-mediumGray hover:text-newswire-black">Help Center</Link></li>
              <li><Link to="/contact" className="text-newswire-mediumGray hover:text-newswire-black">Contact Us</Link></li>
              <li><Link to="/faq" className="text-newswire-mediumGray hover:text-newswire-black">FAQs</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-3 text-sm">Tools & Features</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/email" className="text-newswire-mediumGray hover:text-newswire-black">Email Newsletters</Link></li>
              <li><Link to="/alerts" className="text-newswire-mediumGray hover:text-newswire-black">News Alerts</Link></li>
              <li><Link to="/podcast" className="text-newswire-mediumGray hover:text-newswire-black">Podcasts</Link></li>
              <li><Link to="/video" className="text-newswire-mediumGray hover:text-newswire-black">Video Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-3 text-sm">Ads</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/advertising" className="text-newswire-mediumGray hover:text-newswire-black">Advertising</Link></li>
              <li><Link to="/commercial" className="text-newswire-mediumGray hover:text-newswire-black">Commercial Opportunities</Link></li>
              <li><Link to="/partnerships" className="text-newswire-mediumGray hover:text-newswire-black">Partnership Inquiries</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-newswire-mediumGray">
              © {new Date().getFullYear()} Newswire. All Rights Reserved.
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
