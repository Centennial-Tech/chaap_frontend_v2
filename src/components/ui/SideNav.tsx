import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  BarChart3,
  FolderOpen,
  Bot,
  Cpu,
  Zap,
  Brain,
  Shield,
  SquarePen,
  AlertTriangle,
} from "lucide-react";

interface SidebarProps {
  onExpandChange?: (expanded: boolean) => void;
}

const mainNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/document-manager", label: "Document Manager", icon: FolderOpen },
  { path: "/form-editor", label: "Form Editor", icon: SquarePen},
];

const sectionItems = [
  {
    label: "Pre-Submission Strategy Agent",
    path: "/agents/pre-submission-strategy",
    icon: Bot,
  },
  {
    label: "Document Prep Agent",
    path: "/agents/document-preparation",
    icon: Cpu,
  },
  {
    label: "FDA Meeting Prep Agent",
    path: "/agents/FDA-Meeting-Prep",
    icon: Zap,
  },
  {
    label: "Regulatory Knowledge Agent",
    path: "/agents/regulatory-knowledge",
    icon: Brain,
  },
  {
    label: "Post Market Surveillance Agent",
    path: "/agents/post-market-surveillance",
    icon: Shield,
  },
];

export default function Sidebar({ onExpandChange }: SidebarProps) {
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const shouldShowFull = !isMinimized || isHovered;

  useEffect(() => {
    onExpandChange?.(shouldShowFull);
  }, [shouldShowFull, onExpandChange]);

  return (
    <aside
      className={`${
        shouldShowFull ? "w-72" : "w-16"
      } bg-white border-r border-gray-300 flex-shrink-0 transition-all duration-500 ease-in-out fixed overflow-hidden h-[calc(100vh-80px)] left-0 top-[80px] z-40`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className={`absolute top-[8px] right-2 p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all duration-300 ease-in-out z-10 ${
          shouldShowFull
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {isMinimized ? (
          <div className="w-4 h-4 rounded-full border-2 border-current transition-all duration-200 ease-in-out"></div>
        ) : (
          <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center transition-all duration-200 ease-in-out">
            <div className="w-2 h-2 rounded-full bg-current"></div>
          </div>
        )}
      </button>

      <div className="p-3 pt-16 min-w-64 transition-all duration-500 ease-in-out h-full overflow-y-auto scrollbar-hide flex flex-col" style={{paddingBottom: '60px'}}>
        <div className="flex-1">
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
                <span
                  className={`font-medium ml-3 transition-all duration-500 ease-in-out whitespace-nowrap ${
                    shouldShowFull
                      ? "opacity-100 translate-x-0 max-w-xs"
                      : "opacity-0 -translate-x-4 max-w-0 overflow-hidden"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Agent Hub Sections */}
          <div className="mt-8 transition-all duration-300 ease-in-out">
            <h3
              className={`text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 ml-2 transition-all duration-500 ease-in-out whitespace-nowrap ${
                shouldShowFull
                  ? "opacity-100 translate-x-0 max-w-xs"
                  : "opacity-0 -translate-x-4 max-w-0 overflow-hidden"
              }`}
            >
              Agent Hub
            </h3>
            <div className="space-y-1 text-sm">
              {sectionItems.map((section) => {
                const isActive = location.pathname === section.path; // Updated active check

                return (
                  <Link
                    key={section.label}
                    to={section.path} // Direct path instead of query parameter
                    className={
                      isActive && !shouldShowFull
                        ? "flex items-center px-1 py-2 rounded-md transition-all duration-300 ease-in-out text-blue-600"
                        : isActive
                        ? "flex items-center px-1 py-2 rounded-md transition-all duration-300 ease-in-out bg-blue-50 text-blue-600"
                        : "flex items-center px-1 py-2 rounded-md transition-all duration-300 ease-in-out text-gray-700 hover:bg-gray-100"
                    }
                    title={!shouldShowFull ? section.label : undefined}
                  >
                    <span
                      className={
                        isActive && !shouldShowFull
                          ? "bg-blue-50 rounded-md p-1.5 transition-all duration-300 ease-in-out"
                          : "p-1.5"
                      }
                    >
                      <section.icon className="w-5 h-5 flex-shrink-0 transition-all duration-200 ease-in-out" />
                    </span>
                    <span
                      className={`font-medium ml-3 transition-all duration-500 ease-in-out whitespace-nowrap ${
                        shouldShowFull
                          ? "opacity-100 translate-x-0 max-w-xs"
                          : "opacity-0 -translate-x-4 max-w-0 overflow-hidden"
                      }`}
                    >
                      {section.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI Caution Notice*/}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3">
        <div
          className={`flex items-center ml-1 py-2 rounded-md transition-all duration-200 ease-in-out text-amber-600 hover:bg-gray-100 ${
            shouldShowFull ? "opacity-100" : "opacity-100"
          }`}
          title="AI-generated content"
        >
          <span className="p-1.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 transition-all duration-200 ease-in-out" />
          </span>
          <span
            className={`text-sm text-slate-700 transition-all duration-500 ease-in-out whitespace-nowrap ${
              shouldShowFull
                ? "opacity-100 translate-x-0 max-w-xs"
                : "opacity-0 -translate-x-4 max-w-0 overflow-hidden"
            }`}
          >
            Contains AI-generated content.
          </span>
        </div>
      </div>
    </aside>
  );
}
