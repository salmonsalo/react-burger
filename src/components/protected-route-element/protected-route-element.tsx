import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth-provider/auth-provider";

const ProtectedRouteElement = ({
  restrictMode = false,
  redirectPath = "/profile",
  restrictedPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
}) => {
  const { isAuthenticated, visitedForgotPassword } = useAuth();
  const location = useLocation();
  
  if (!restrictMode) {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} />;
    }

    return <Outlet />;
  } else {
    if (isAuthenticated && restrictedPaths.includes(location.pathname)) {
      return <Navigate to={redirectPath} />;
    }

    if (location.pathname === "/reset-password" && !visitedForgotPassword) {
      return <Navigate to="/forgot-password" />;
    }

    return <Outlet />;
  }
};


export default ProtectedRouteElement;
