
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomeFooter() {
  // Use useEffect for the footer if needed
  useEffect(() => {
    console.log('HomeFooter component mounted');
    return () => {
      console.log('HomeFooter component unmounting');
    };
  }, []);

  return (
    <footer className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-600 hover:text-blue-600">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link></li>
              <li><Link to="/security" className="text-gray-600 hover:text-blue-600">Security</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-blue-600">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/community" className="text-gray-600 hover:text-blue-600">Community</Link></li>
              <li><Link to="/help" className="text-gray-600 hover:text-blue-600">Help Center</Link></li>
              <li><Link to="/partners" className="text-gray-600 hover:text-blue-600">Partners</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-blue-600">Terms of Use</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Repair Auto Pilot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
