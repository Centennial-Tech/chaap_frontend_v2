import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

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
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center h-20">
              <Link to="/" className="hover:opacity-80 transition-opacity flex items-center h-20">
                <img 
                  src={logo} 
                  alt="CHAAP Logo" 
                  className="h-16 w-auto"
                />
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2 bg-slate-50 p-1 rounded-xl">
              <button 
                onClick={() => scrollToSection('features')}
                className="relative text-slate-600 hover:text-blue-800 hover:bg-blue-100 transition-all duration-200 px-4 py-2 text-sm font-medium rounded-lg group"
              >
                <span className="relative z-10">Features</span>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-orange-100/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
              <button 
                onClick={() => scrollToSection('ai-agents')}
                className="relative text-slate-600 hover:text-blue-800 hover:bg-blue-100 transition-all duration-200 px-4 py-2 text-sm font-medium rounded-lg group"
              >
                <span className="relative z-10">AI Agents</span>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-orange-100/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
              <Link to="/login">
                <button
                  className="relative text-slate-600 hover:text-blue-800 hover:bg-blue-100 transition-all duration-200 px-4 py-2 text-sm font-medium rounded-lg group"
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-orange-100/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-blue-800 p-2 rounded-lg focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 bg-gradient-to-br from-white to-slate-50 border-t border-slate-200 flex flex-col space-y-2">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-slate-600 hover:text-blue-800 hover:bg-blue-100 block px-4 py-3 text-base font-medium w-full text-left rounded-lg transition-all duration-200"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('ai-agents')}
                className="text-slate-600 hover:text-blue-800 hover:bg-blue-100 block px-4 py-3 text-base font-medium w-full text-left rounded-lg transition-all duration-200"
              >
                AI Agents
              </button>
              <Link to="/login">
                <button
                  className="text-slate-600 hover:text-blue-800 hover:bg-blue-100 block px-4 py-3 text-base font-medium w-full text-left rounded-lg transition-all duration-200"
                >
                  Login
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
