import { useState } from "react";
import { useUser } from "../app/state/UserProvider.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, loading } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email);
      navigate("/");
    } catch {
      setError("Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 50, padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 8 }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: 10 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}