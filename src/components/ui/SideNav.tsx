import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Edit,
  FolderOpen,
  TrendingUp,
  FileText,
  Shield,
  Activity,
  Lock,
} from "lucide-react";

const mainNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/contact", label: "Form Builder", icon: Edit },
  { path: "/documents", label: "Document Manager", icon: FolderOpen },
  { path: "/tracking", label: "Submission Tracking", icon: TrendingUp },
  { path: "/pdf-generator", label: "PDF Generator", icon: FileText },
];

const sectionItems = [
  "Device Description",
  "Predicate Device",
  "Substantial Equivalence",
  "Performance Testing",
  "Labeling",
  "Risk Analysis",
];

const securityItems = [
  { label: "Access Control", icon: Shield },
  { label: "Audit Logs", icon: Activity },
  { label: "Data Encryption", icon: Lock },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed md:relative left-0 top-[75px] h-screen w-64 min-w-[16rem] max-w-[16rem] bg-white border-r border-gray-200 flex-shrink-0 z-30">
      <div className="p-6 h-full flex flex-col">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path
                  ? "flex items-center space-x-3 px-3 py-2 rounded-md bg-blue-100 text-blue-700 font-semibold shadow-sm"
                  : "flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* 510(k) Sections */}
        <div className="mt-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            510(k) Sections
          </h3>
          <div className="space-y-1 text-sm">
            {sectionItems.map((section) => (
              <Link
                key={section}
                to={`/form-builder?section=${section
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                {section}
              </Link>
            ))}
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="mt-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Security & Compliance
          </h3>
          <div className="space-y-1 text-sm">
            {securityItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
