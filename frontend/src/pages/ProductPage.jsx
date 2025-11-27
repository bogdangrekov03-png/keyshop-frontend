import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const load = async () => {
    const res = await axios.get(`/api/products/${id}`);
    setProduct(res.data);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!product) return <div className="container">Завантаження...</div>;

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <div className="logo">
            KEY<span>SHOP</span>
          </div>
        </div>
      </header>

      <div className="container product-page">
        <div className="product-media">
          {product.image && <img src={product.image} alt={product.name} />}
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="brand">{product.brand} • {product.category}</p>
          <p className="price big">{product.price} ₴</p>
          {product.description && (
            <p className="desc">{product.description}</p>
          )}
          <button className="btn-primary">Додати в кошик (демо)</button>
        </div>
      </div>
    </div>
  );
}
