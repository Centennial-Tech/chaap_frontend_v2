import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import NoAccess from "../pages/NoAccess";
import Home from "../pages/Home";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Contact from "../pages/Contact";
import Presubmission from "../pages/agents/Presubmission";
import Header2 from "../components/Header2";
import ScrollToHash from "../components/ScrollToHash";
import Login from "../pages/Login";

const LayoutWithHeader = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToHash />
      <div className="relative z-50">
        <Header2 />
      </div>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const Routes = () => {
  const { token } = useAuth();

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
        // {
        //   element: <LayoutWithHeader />,
        //   children: [
        //     { path: "/upload", element: <Upload /> },
        //   ],
        // },
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
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
