import {
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import NoAccess from "../pages/NoAccess";
import Home from "../pages/Home2";
import PreSubmissionAgent from "../pages/agents/Pre-SubmissionAgent";
import Login from "../pages/Login";
import KnowledgeAgent from "../pages/agents/KnowledgeAgent";
import Logout from "../pages/Logout";
import Dashboard from "../pages/Dashboard";
import DocPrepAgent from "../pages/agents/DocPrepAgent";
import UserProfile from "../pages/UserProfile";
import Layout from "../pages/Layout";
import DocumentManager from "../pages/DocumentManager";
import FormEditor from "../pages/FormEditor";
import FdaMeetingPrepAgent from "../pages/agents/FdaMeetingPrepAgent";
import PostMarketSurveillanceAgent from "../pages/agents/PostMarketSurveillanceAgent";
import Signup from "../pages/Signup";

// Wrapper for routes that should redirect to dashboard if user is logged in
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return null; // or a loading spinner
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const Routes = () => {
  // Public routes accessible to all
  const routesForPublic: RouteObject[] = [];

  // Routes for logged-in users
  const routesForAuthenticatedOnly: RouteObject[] = [
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <Layout />,
          children: [
            { path: "logout", element: <Logout /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "profile", element: <UserProfile /> },
            { path: "document-manager", element: <DocumentManager /> },
            { path: "form-editor", element: <FormEditor /> },
            // AI Agent routes
            { 
              path: "agents",
              children: [
                {
                  path: "pre-submission-strategy",
                  element: <PreSubmissionAgent />,
                },
                {
                  path: "regulatory-knowledge",
                  element: <KnowledgeAgent />,
                },
                {
                  path: "document-preparation",
                  element: <DocPrepAgent />,
                },
                {
                  path: "meeting-prep",
                  element: <FdaMeetingPrepAgent />,
                },
                {
                  path: "post-market-surveillance",
                  element: <PostMarketSurveillanceAgent />,
                },
              ]
            }
          ],
        },
      ],
    },
  ];

  // Routes that should redirect to dashboard if user is logged in
  const publicOnlyRoutes: RouteObject[] = [
    {
      element: <Layout />,
      children: [
        { 
          path: "/", 
          element: <PublicOnlyRoute><Home /></PublicOnlyRoute>
        },
        { 
          path: "login", 
          element: <PublicOnlyRoute><Login /></PublicOnlyRoute>
        },
        { 
          path: "signup", 
          element: <PublicOnlyRoute><Signup /></PublicOnlyRoute>
        },
      ],
    },
  ];

  // Catch-all route for 404s
  const catchAllRoute: RouteObject = {
    path: "*",
    element: <NoAccess />,
  };

  // Merge routes
  const router = createBrowserRouter([
    ...routesForPublic,
    ...publicOnlyRoutes,
    ...routesForAuthenticatedOnly,
    catchAllRoute,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
