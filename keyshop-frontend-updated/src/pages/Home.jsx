import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <div className="logo">
            KEY<span>SHOP</span>
          </div>
          <nav className="nav">
            <a href="#" className="nav-link">Корпуси</a>
            <a href="#" className="nav-link">Смарт-ключі</a>
            <a href="#" className="nav-link">Чіпи</a>
            <a href="#" className="nav-link">Пульти</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-badge">Магазин автоключів</div>
            <h1>KEY-SHOP 2025</h1>
            <p>
              Корпуси, автоключі, смарт-ключі, чіпи, жала та пульти.
              Професійний підбір для авто, преміальний дизайн сайту.
            </p>
          </div>
          <div className="hero-side">
            <div className="hero-card">
              <p>Спеціальні ціни для СТО та майстрів</p>
              <span>Доступ до оптового кабінету за запитом</span>
            </div>
          </div>
        </div>
      </section>

      <section className="products">
        <div className="container">
          <h2>Товари</h2>
          <div className="grid">
            {products.map((p) => (
              <a key={p._id} href={`/product/${p._id}`} className="card">
                {p.image && <img src={p.image} alt={p.name} />}
                <h3>{p.name}</h3>
                <p className="brand">{p.brand} • {p.category}</p>
                <p className="price">{p.price} ₴</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
