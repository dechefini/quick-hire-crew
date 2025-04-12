
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full border-b py-4 relative">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/9db3df61-b721-4237-87f3-d7f98f913285.png" 
            alt="Quick Hire Crew Logo" 
            className="h-12 w-auto" 
          />
          {!isMobile && <span className="text-xl font-bold">Quick Hire Crew</span>}
        </Link>
        
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
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
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          className="md:hidden p-1" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white z-50 shadow-lg">
          <div className="flex flex-col p-4 gap-4">
            <Link 
              to="/about" 
              className="text-base hover:text-primary py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/features" 
              className="text-base hover:text-primary py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/contact" 
              className="text-base hover:text-primary py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex items-center gap-1 py-2 border-b">
              <Globe size={18} />
              <span>EN</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link 
                to="/register" 
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" className="rounded-md w-full">
                  Register
                </Button>
              </Link>
              <Link 
                to="/login" 
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="rounded-md bg-primary text-white w-full">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
