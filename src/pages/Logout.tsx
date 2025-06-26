import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  useEffect(() => {
    const logoutHandler = async () => {
      try {
        await logout();
        navigate("/", { replace: true });
      } catch (error) {
        // Optionally handle error
      }
    };
    logoutHandler();
  }, [navigate]);

  return null;
};

export default Logout;
