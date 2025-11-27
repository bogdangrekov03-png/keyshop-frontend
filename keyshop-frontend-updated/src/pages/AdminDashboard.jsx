import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/home.css";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    description: "",
    chip: "",
    buttons: "",
    inStock: true,
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get("/api/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити список товарів");
    } finally {
      setLoadingList(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      brand: "",
      category: "",
      price: "",
      description: "",
      chip: "",
      buttons: "",
      inStock: true,
      image: null
    });
    setPreview(null);
  };

  const submitProduct = async () => {
    setError("");
    if (!form.name || !form.brand || !form.category || !form.price) {
      setError("Заповніть мінімум: Назва, Бренд, Категорія, Ціна");
      return;
    }
    if (!token) {
      setError("Немає токена. Увійдіть заново.");
      window.location.href = "/admin/login";
      return;
    }

    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("brand", form.brand);
      fd.append("category", form.category);
      fd.append("price", Number(form.price));
      if (form.description) fd.append("description", form.description);
      if (form.chip) fd.append("chip", form.chip);
      if (form.buttons) fd.append("buttons", Number(form.buttons));
      fd.append("inStock", form.inStock ? "true" : "false");
      if (form.image) fd.append("image", form.image);

      const res = await axios.post("/api/products", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setProducts((prev) => [res.data, ...prev]);
      resetForm();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Помилка збереження товару");
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (id) => {
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    if (!window.confirm("Видалити цей товар?")) return;

    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Не вдалося видалити товар");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  const renderImage = (p) => {
    if (!p.image) return null;
    const src = p.image.startsWith("http") ? p.image : `/${p.image}`;
    return <img src={src} alt={p.name} />;
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2 style={{ marginTop: 0 }}>KEYSHOP ADMIN</h2>
        <p style={{ fontSize: 12, color: "#a0a3b5" }}>
          Мобільна панель керування товарами
        </p>

        <div style={{ marginTop: 16, fontSize: 13 }}>
          <div style={{ opacity: 0.8, marginBottom: 4 }}>Категорія</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["keys", "cases", "smart", "chips", "remotes"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleChange("category", cat)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  border:
                    form.category === cat
                      ? "1px solid var(--accent-soft)"
                      : "1px solid rgba(255,255,255,0.18)",
                  background:
                    form.category === cat
                      ? "rgba(46,125,255,0.18)"
                      : "transparent",
                  color: "#fff",
                  fontSize: 12,
                  cursor: "pointer"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          style={{
            marginTop: 24,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.26)",
            background: "transparent",
            color: "#fff",
            padding: "6px 10px",
            fontSize: 12,
            cursor: "pointer"
          }}
        >
          Вийти
        </button>
      </aside>

      <main className="admin-main">
        <h1 style={{ marginTop: 0, marginBottom: 10 }}>Товари</h1>

        <div className="admin-form">
          <input
            placeholder="Назва"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <input
            placeholder="Бренд"
            value={form.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
          />
          <input
            placeholder="Ціна, грн"
            type="number"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
          <input
            placeholder="К-сть кнопок (опц.)"
            type="number"
            value={form.buttons}
            onChange={(e) => handleChange("buttons", e.target.value)}
          />
          <input
            placeholder="Чіп (опц. напр. ID46)"
            value={form.chip}
            onChange={(e) => handleChange("chip", e.target.value)}
          />

          <textarea
            placeholder="Короткий опис (опціонально)"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <label
            style={{
              gridColumn: "1 / -1",
              fontSize: 12,
              opacity: 0.8,
              display: "flex",
              flexDirection: "column",
              gap: 4
            }}
          >
            Фото товару
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>

          {preview && (
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                gap: 10,
                alignItems: "center"
              }}
            >
              <img
                src={preview}
                alt="preview"
                style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover" }}
              />
              <span style={{ fontSize: 12, color: "#a0a3b5" }}>
                Попередній перегляд фото
              </span>
            </div>
          )}

          <button type="button" onClick={submitProduct} disabled={saving}>
            {saving ? "Зберігаю..." : "Додати товар"}
          </button>
        </div>

        {error && (
          <div className="error" style={{ marginBottom: 10 }}>
            {error}
          </div>
        )}

        <div className="admin-list">
          {loadingList && <div style={{ fontSize: 13 }}>Завантаження...</div>}
          {!loadingList && products.length === 0 && (
            <div style={{ fontSize: 13, color: "#a0a3b5" }}>
              Поки немає жодного товару. Додайте перший вище.
            </div>
          )}

          {products.map((p) => (
            <div key={p._id} className="admin-item">
              {renderImage(p)}
              <div className="info">
                <h3>{p.name}</h3>
                <p>
                  {p.brand} • {p.category} • {p.price} ₴
                </p>
              </div>
              <button type="button" onClick={() => removeProduct(p._id)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
