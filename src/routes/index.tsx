import {
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
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

const Routes = () => {
  const { user } = useAuth();

  // Public routes accessible to all
  const routesForPublic: RouteObject[] = [
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
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
          element: <Layout />,
          children: [
            { path: "logout", element: <Logout /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "profile", element: <UserProfile /> },
            { path: "document-manager", element: <DocumentManager /> },
            { path: "form-editor", element: <FormEditor /> },
            {
              path: "agents",
              children: [
                {
                  path: "presubmission-strategy",
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
                  path: "fda-meeting-prep",
                  element: <FdaMeetingPrepAgent />,
                },
                {
                  path: "post-market-surveillance",
                  element: <PostMarketSurveillanceAgent />,
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
    { path: "login", element: <Login /> },
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
