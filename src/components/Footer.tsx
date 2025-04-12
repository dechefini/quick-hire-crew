
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg mb-2">QuickHireCrew</h3>
            <p className="text-gray-600 text-sm">
              Connecting construction professionals with opportunities since 2024.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg mb-2">navigation.quickLinks</h3>
            <Link to="/about" className="text-gray-600 text-sm hover:text-primary">
              About
            </Link>
            <Link to="/privacy" className="text-gray-600 text-sm hover:text-primary">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-600 text-sm hover:text-primary">
              Terms
            </Link>
          </div>
          
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg mb-2">Contact</h3>
            <p className="text-gray-600 text-sm">Email: support@quickhirecrew.com</p>
            <p className="text-gray-600 text-sm">Phone: (555) 123-4567</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg mb-2">Follow Us</h3>
            <div className="flex gap-4">
              <Facebook className="text-gray-600 hover:text-primary cursor-pointer" size={20} />
              <Twitter className="text-gray-600 hover:text-primary cursor-pointer" size={20} />
              <Linkedin className="text-gray-600 hover:text-primary cursor-pointer" size={20} />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <p className="text-gray-600 text-sm text-center">
            © 2024 QuickHireCrew. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
