import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Edit, 
  FolderOpen, 
  TrendingUp, 
  FileText, 
  Shield, 
  Activity,
  Lock
} from "lucide-react";

const mainNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/form-builder", label: "Form Builder", icon: Edit },
  { path: "/documents", label: "Document Manager", icon: FolderOpen },
  { path: "/tracking", label: "Submission Tracking", icon: TrendingUp },
  { path: "/pdf-generator", label: "PDF Generator", icon: FileText },
];

// const sectionItems = [
//   "Device Description",
//   "Predicate Device", 
//   "Substantial Equivalence",
//   "Performance Testing",
//   "Labeling",
//   "Risk Analysis",
// ];

const securityItems = [
  { label: "Access Control", icon: Shield },
  { label: "Audit Logs", icon: Activity },
  { label: "Data Encryption", icon: Lock },
];

export default function Sidebar() {
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const shouldShowFull = !isMinimized || isHovered;

  // Adjust main content margin instead of body margin
  useEffect(() => {
    const mainContent = document.querySelector('[data-main-content]') || document.querySelector('main');
    if (mainContent) {
      const marginLeft = shouldShowFull ? '16rem' : '4rem';
      (mainContent as HTMLElement).style.marginLeft = marginLeft;
      (mainContent as HTMLElement).style.transition = 'margin-left 410ms ease-in-out';
    }
    
    // Cleanup function
    return () => {
      const mainContent = document.querySelector('[data-main-content]') || document.querySelector('main');
      if (mainContent) {
        (mainContent as HTMLElement).style.marginLeft = '';
        (mainContent as HTMLElement).style.transition = '';
      }
    };
  }, [shouldShowFull]);

  return (
    <aside 
      className={`${shouldShowFull ? 'w-64' : 'w-16'} bg-white border-r border-gray-300 flex-shrink-0 transition-all duration-500 ease-in-out fixed overflow-hidden h-screen left-0 top-0 z-40`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className={`absolute top-[88px] right-2 p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all duration-300 ease-in-out z-10 ${
          shouldShowFull ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {isMinimized ? (
          // Open dot
          <div className="w-4 h-4 rounded-full border-2 border-current transition-all duration-200 ease-in-out"></div>
        ) : (
          // Closed dot
          <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center transition-all duration-200 ease-in-out">
            <div className="w-2 h-2 rounded-full bg-current"></div>
          </div>
        )}
      </button>

      <div className="p-3 pt-32 min-w-64 transition-all duration-500 ease-in-out h-full overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={
              location.pathname === item.path && !shouldShowFull
              ? "flex items-center px-1 py-2 rounded-md transition-all duration-300 ease-in-out text-blue-600"
              : location.pathname === item.path
              ? "flex items-center px-1 py-2 rounded-md transition-all duration-300 ease-in-out bg-blue-50 text-blue-600"
              : "flex items-center px-1 py-2 rounded-md transition-all duration-300 ease-in-out text-gray-700 hover:bg-gray-100"
              }
              title={!shouldShowFull ? item.label : undefined}
            >
              <span
              className={
                location.pathname === item.path && !shouldShowFull
                ? "bg-blue-50 rounded-md p-1.5 transition-all duration-300 ease-in-out"
                : "p-1.5"
              }
              >
              <item.icon className="w-5 h-5 flex-shrink-0 transition-all duration-200 ease-in-out" />
              </span>
              <span className={`font-medium ml-3 transition-all duration-500 ease-in-out whitespace-nowrap ${
              shouldShowFull 
                ? 'opacity-100 translate-x-0 max-w-xs' 
                : 'opacity-0 -translate-x-4 max-w-0 overflow-hidden'
              }`}>
              {item.label}
              </span>
            </Link>
          ))}
        </div>
        
        {/* {shouldShowFull && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              510(k) Sections
            </h3>
            <div className="space-y-1 text-sm">
              {sectionItems.map((section) => (
                <Link 
                  key={section} 
                  to={`/form-builder?section=${section.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  {section}
                </Link>
              ))}
            </div>
          </div>
        )} */}
        
        <div className="mt-8 transition-all duration-300 ease-in-out">
          <h3 className={`text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 transition-all duration-500 ease-in-out whitespace-nowrap ${
            shouldShowFull 
              ? 'opacity-100 translate-x-0 max-w-xs' 
              : 'opacity-0 -translate-x-4 max-w-0 overflow-hidden'
          }`}>
            Security & Compliance
          </h3>
          <div className="space-y-1 text-sm">
            {securityItems.map((item) => (
              <a 
                key={item.label}
                href="#" 
                className="flex items-center px-2.5 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out"
                title={!shouldShowFull ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0 transition-all duration-200 ease-in-out" />
                <span className={`ml-3 transition-all duration-500 ease-in-out whitespace-nowrap ${
                  shouldShowFull 
                    ? 'opacity-100 translate-x-0 max-w-xs' 
                    : 'opacity-0 -translate-x-4 max-w-0 overflow-hidden'
                }`}>
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
