import { useState } from "react";
import axios from "axios";
import "../styles/home.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError("");
    if (!email || !password) {
      setError("Введіть логін і пароль");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/admin";
    } catch (err) {
      setError(err.response?.data?.message || "Помилка входу");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div className="admin-login">
      <div className="admin-card">
        <h1>KEYSHOP • ADMIN</h1>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>
          Вхід до панелі керування товарами
        </p>

        <input
          placeholder="E-mail адміністратора"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <input
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={onKeyDown}
        />

        {error && <div className="error" style={{ fontSize: 12 }}>{error}</div>}

        <button onClick={login} disabled={loading}>
          {loading ? "Вхід..." : "Увійти"}
        </button>

        <span style={{ fontSize: 11, color: "#a0a3b5", marginTop: 4 }}>
          Оптимізовано під мобільний вигляд
        </span>
      </div>
    </div>
  );
}
