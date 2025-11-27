import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    description: "",
    image: null
  });

  const token = localStorage.getItem("token");

  const api = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  const loadProducts = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data);
  };

  const submitProduct = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null) fd.append(k, v);
    });

    await api.post("/api/products", fd);
    setForm({
      name: "",
      brand: "",
      category: "",
      price: "",
      description: "",
      image: null
    });
    loadProducts();
  };

  const removeProduct = async (id) => {
    await api.delete("/api/products/" + id);
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="logo">
          KEY<span>SHOP</span>
        </div>
        <p>Адмін панель</p>
      </div>
      <div className="admin-main">
        <h1>Товари</h1>

        <div className="admin-form">
          <input
            placeholder="Назва"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Бренд"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
          <input
            placeholder="Категорія"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            placeholder="Ціна"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <textarea
            placeholder="Опис"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="file"
            onChange={(e) =>
              setForm({ ...form, image: e.target.files[0] || null })
            }
          />
          <button onClick={submitProduct}>Додати товар</button>
        </div>

        <div className="admin-list">
          {products.map((p) => (
            <div key={p._id} className="admin-item">
              {p.image && <img src={p.image} alt={p.name} />}
              <div className="info">
                <h3>{p.name}</h3>
                <p>{p.brand} • {p.category}</p>
                <p>{p.price} ₴</p>
              </div>
              <button onClick={() => removeProduct(p._id)}>X</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
