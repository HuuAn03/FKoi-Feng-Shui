import React, { useState, useEffect } from "react";
import "./index.scss";
import Carousel from "../../components/carousel";
import api from "../../config/axios";

function HomePage() {
  const [selectedFate, setSelectedFate] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (selectedFate) {
      api.get(`/products/random`, { params: { fateType: selectedFate } })
        .then(response => setProducts(response.data))
        .catch(error => console.error("Error fetching products:", error));
    }
  }, [selectedFate]);

  const handleFateClick = (fateType) => {
    setSelectedFate(fateType);
  };

  return (
    <div className="homepage">
      <Carousel />
      <div className="fate-selection-display">
        <div className="fate-selection">
          {["METAL", "WOOD", "WATER", "FIRE", "EARTH"].map((fate) => (
            <button
              key={fate}
              onClick={() => handleFateClick(fate)}
              className={`fate-button ${selectedFate === fate ? "active" : ""}`}
            >
              {fate}
            </button>
          ))}
        </div>
        <div className="product-display">
          {products.map((product) => (
            <div key={product.productId} className="product-card">
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.price.toLocaleString()} VND</p>
                <p>{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <iframe
        src="/src/pages/home/circle/circle.html"
        style={{ width: '100%', height: '600px', border: 'none', marginTop: '2rem' }}
        title="Circle Page"
      />
    </div>
  );
}

export default HomePage;
