import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider.tsx";
import { useSubmission } from "../provider/submissionProvider";
import SelectSubmission from "../pages/SelectSubmission";

export const ProtectedRoute = () => {
  const { user } = useAuth();

  // Check if the user is authenticated
  if (!user) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export const SubmissionProtectedRoute = () => {
  const { user } = useAuth();
  const { activeSubmission } = useSubmission();

  // First check authentication
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Show submission selector if no active submission
  if (!activeSubmission) {
    return <SelectSubmission />;
  }

  // If both checks pass, render the child routes
  return <Outlet />;
};
