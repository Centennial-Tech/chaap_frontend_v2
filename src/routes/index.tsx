import { useEffect } from "react";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from "react-router-dom";
import { Z_INDEX } from "../constants/zIndex";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import NoAccess from "../pages/NoAccess";
import Home from "../pages/Home2";
import Footer from "../components/Footer";
import Contact from "../pages/Contact";
import Presubmission from "../pages/agents/Presubmission";
import Header2 from "../components/Header2";
import ScrollToHash from "../components/ScrollToHash";
import Login from "../pages/Login";
import KnowledgeAgent from "../components/KnowledgeAgent";
import Logout from "../pages/Logout";
import Dashboard from "../pages/Dashboard";
import DocPrepAgent from "../pages/DocPrepAgent";
import Navbar from "../components/Navbar";
import Sidebar from "../components/ui/SideNav";
import UserProfile from "../pages/UserProfile";

import { useLocation, useNavigate } from "react-router-dom";

const LayoutWithHeader = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  // Only add padding/margin if not on the home page
  const isHome = location.pathname === "/";

  return (
    <div className={`flex flex-col min-h-screen ${user ? 'bg-gradient-to-br from-gradient-purple via-gradient-green via-gradient-red to-gradient-blue bg-[length:400%_400%] animate-gradient-shift' : ''}`}>
      <ScrollToHash />
      <div className="relative" style={{ zIndex: Z_INDEX.HEADER }}>{!user ? <Header2 /> : <Navbar />}</div>
      <main className="flex-grow flex">
        {user ? <Sidebar /> : ""}
        <div className={`flex-grow ${!isHome ? "mt-[60px] p-4 md:p-6 lg:p-8" : ""}`}>
          <Outlet />
        </div>
      </main>
      {user ? "" : <Footer />}
    </div>
  );
};

const Routes = () => {
  const { user } = useAuth();

  // Public routes accessible to all
  const routesForPublic: RouteObject[] = [
    {
      element: <LayoutWithHeader />,
      children: [
        // Example:
        { path: "/", element: <Home /> },
        { path: "/contact", element: <Contact /> },
        {
          path: "/agents/",
          children: [
            {
              path: "presubmission",
              element: <Presubmission />,
            },
          ],
        },
        {
          path: "/agents/",
          children: [
            {
              path: "regulatory",
              element: <KnowledgeAgent />,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NoAccess />,
    },
  ];

  // Routes for logged-in users
  const routesForAuthenticatedOnly: RouteObject[] = [
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <LayoutWithHeader />,
          children: [
            { path: "/logout", element: <Logout /> },
            {
              path: "/dashboard",
              element: <Dashboard />,
            },
            {
              path: "/profile",
              element: <UserProfile />,
            },
            {
              path: "/agents/",
              children: [
                {
                  path: "document-preparation",
                  element: <DocPrepAgent />,
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  // Routes for not-logged-in users
  const routesForNotAuthenticatedOnly: RouteObject[] = [
    { path: "/login", element: <Login /> },
    // { path: "/signup", element: <SignUp /> },
  ];

  // Merge routes based on auth status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!user ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
