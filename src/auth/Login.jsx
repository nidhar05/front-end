import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setToken } from "./AuthUtils";
import "./Auth.css";

const API_BASE = "http://localhost:8080";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    setError("");

    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      setError("Invalid email or password");
      return;
    }

    const token = await res.text();
    setToken(token);
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>

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

        <button className="auth-button" onClick={login}>
          Login
        </button>

        <div className="auth-link">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
