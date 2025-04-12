
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full border-b py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/03f4db2e-708e-47b2-8d5c-94e41a1567c1.png" 
            alt="Quick Hire Crew Logo" 
            className="h-10 w-auto" 
          />
          <span className="text-xl font-bold">Quick Hire Crew</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-base hover:text-primary">
            About
          </Link>
          <Link to="/features" className="text-base hover:text-primary">
            Features
          </Link>
          <Link to="/contact" className="text-base hover:text-primary">
            Contact
          </Link>
          <div className="flex items-center gap-1">
            <Globe size={18} />
            <span>EN</span>
          </div>
          <Link to="/register">
            <Button variant="outline" className="rounded-md">
              Register
            </Button>
          </Link>
          <Link to="/login">
            <Button className="rounded-md bg-primary text-white">
              Login
            </Button>
          </Link>
        </div>
        
        {/* Mobile menu button for smaller screens */}
        <div className="md:hidden flex items-center">
          {/* Button for mobile menu - to be implemented */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
