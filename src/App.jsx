import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import AuthGuard from "./auth/AuthGuard";
import AppContent from "./AppContent";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <AuthGuard>
              <AppContent />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
