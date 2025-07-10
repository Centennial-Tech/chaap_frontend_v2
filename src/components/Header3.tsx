import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { Z_INDEX } from "../constants/zIndex";
import { Button } from "./ui/Button";

export default function Header3() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 fixed top-0 left-0 right-0" style={{ zIndex: Z_INDEX.HEADER }}>
      <div className="w-full">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="w-[200px] flex pl-2">
            <img 
              src={logo} 
              alt="CHAAP Logo" 
              className="h-20 w-auto ml-4 object-contain"
            />
          </Link>
          <div className="hidden md:block pr-2">
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => scrollToSection('features')}
                variant="default"
              >
                Features
              </Button>
              <Button 
                onClick={() => scrollToSection('ai-agents')}
                variant="default"
              >
                AI Agents
              </Button>
              <Button 
                onClick={() => scrollToSection('contact')}
                variant="default"
              >
                Contact Us
              </Button>
              <Link to="/login">
                <Button variant="default">
                  Login
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:hidden pr-2">
            <Button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="icon"
              className="text-purple-500 hover:text-purple-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-4 pb-6 bg-gradient-to-br from-white to-slate-50 border-t border-slate-200 flex flex-col space-y-2">
              <Button 
                onClick={() => scrollToSection('features')}
                variant="default"
                className="w-full justify-start"
              >
                Features
              </Button>
              <Button 
                onClick={() => scrollToSection('ai-agents')}
                variant="default"
                className="w-full justify-start"
              >
                AI Agents
              </Button>
              <Button 
                onClick={() => scrollToSection('contact')}
                variant="default"
                className="w-full justify-start"
              >
                Demo
              </Button>
              <Link to="/login" className="w-full">
                <Button
                  variant="default"
                  className="w-full justify-start"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
