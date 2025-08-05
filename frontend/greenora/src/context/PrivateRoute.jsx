import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();

  return auth.isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
