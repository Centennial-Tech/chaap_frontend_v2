import { useEffect } from "react";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import NoAccess from "../pages/NoAccess";
import Home from "../pages/Home";
import Footer from "../components/Footer";
import Contact from "../pages/Contact";
import Presubmission from "../pages/agents/Presubmission";
import Header2 from "../components/Header2";
import ScrollToHash from "../components/ScrollToHash";
import Login from "../pages/Login";
import KnowledgeAgent from "../components/KnowledgeAgent";
import Logout from "../pages/Logout";
import Dashboard from "../pages/Dashboard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/ui/SideNav";
import { useLocation, useNavigate } from "react-router-dom";

const LayoutWithHeader = () => {
  // const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const user = {
    something: "dummy", // Replace with actual user data from context or state
  }

  useEffect(() => {
    if (user && location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return (
    <div className={`flex flex-col min-h-screen ${user ? "bg-[#f4f5f6]" : ""}`}>
      <ScrollToHash />
      <div className="relative z-50">{!user ? <Header2 /> : <Navbar />}</div>
      <main className="flex-grow flex">
        {user ? <Sidebar /> : ""}
        <div className="flex-grow mt-[60px] p-4 md:p-6 lg:p-8">
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
              path: "/dashboard",
              element: <Dashboard />,
            },

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
            // {
            //   path: "/dashboard",
            //   element: <Dashboard />,
            // },
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
