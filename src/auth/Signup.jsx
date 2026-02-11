import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const API_BASE = "http://localhost:8080";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    setError("");

    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      setError("Account already exists");
      return;
    }

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>

        {error && <div className="auth-error">{error}</div>}

        <input
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="auth-button" onClick={signup}>
          Sign Up
        </button>

        <div className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
