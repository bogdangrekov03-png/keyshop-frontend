import { useState } from "react";
import axios from "axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/admin";
    } catch (err) {
      setError(err.response?.data?.message || "Помилка входу");
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-card">
        <h1>KEY-SHOP ADMIN</h1>
        <input
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="error">{error}</div>}
        <button onClick={login}>Увійти</button>
      </div>
    </div>
  );
}
