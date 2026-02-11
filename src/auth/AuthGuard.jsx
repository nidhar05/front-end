import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./AuthUtils";

export default function AuthGuard({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
