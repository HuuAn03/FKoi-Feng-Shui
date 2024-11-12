import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import "./productDetail.scss";


function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [suggestedProducts, setSuggestedProducts] = useState([]);


  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await api.get(`/ads/id/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };


    const fetchSuggestedProducts = async () => {
      try {
        const response = await api.get("/ads/random");
        const filteredProducts = response.data.filter((item) => item.adId !== parseInt(id));
        setSuggestedProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching suggested products:", error);
      }
    };


    fetchProductDetail();
    fetchSuggestedProducts();
  }, [id]);


  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleBackClick = () => {
    navigate("/product");
  };


  if (!product) return <p>Loading...</p>;


  return (
    <div className="product-detail">


      <div className="product-content">
        <div className="product-images">
          <div className="main-image">
            <img src={product.imageUrl} alt={product.productName} />
          </div>
        </div>


        <div className="product-info">
          <h1>{product.productName}</h1>
          <h2>{product.price.toLocaleString()} VND</h2>
          <p>{product.description}</p>


          <div className="quantity-selector">
            <label>Quantity:</label>
            <button onClick={() => handleQuantityChange(-1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange(1)}>+</button>
          </div>


          <h3>TOTAL: {(product.price * quantity).toLocaleString()} VND</h3>
          <button className="buy-button">BUY NOW</button>
        </div>
      </div>


      {/* Product Benefit Section */}
      <div className="product-benefits">
        <ul>
          <li><span>1</span> Personalized feng shui consultation tailored to your BaZi (Four Pillars of Destiny).</li>
          <li><span>2</span> Design created in accordance with premium feng shui standards.</li>
          <li><span>3</span> Natural stone products certified by the LIULAB Gemological Center.</li>
          <li><span>4</span> Includes a 12-month energy cleansing and product maintenance warranty.</li>
          <li><span>5</span> Free shipping on all orders.</li>
          <li><span>6</span> Gold-plated finishing for enhanced elegance and durability.</li>
          <li><span>7</span> Gold products tested via spectroscopic analysis to ensure superior quality.</li>
          <li><span>8</span> Expert and dedicated feng shui guidance for a harmonious lifestyle.</li>
        </ul>
      </div>


      {/* Suggested Products Section */}
      <div className="suggested-products">
        <h2>SUGGESTED PRODUCTS</h2>
        <div className="suggested-products-list">
          {suggestedProducts.map((suggestedProduct) => (
            <div key={suggestedProduct.adId} className="suggested-product-card" onClick={() => navigate(`/product/${suggestedProduct.adId}`)}>
              <img src={suggestedProduct.imageUrl} alt={suggestedProduct.productName} />
              <h3>{suggestedProduct.productName}</h3>
              <p>{suggestedProduct.price.toLocaleString()} VND</p>
              <div className="product-details-hover">
                <h3>{suggestedProduct.productName}</h3>
                <p>{suggestedProduct.price.toLocaleString()} VND</p>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Back Button */}
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Product
      </button>


      {/* Scroll to Top Button */}
      <button className="scroll-to-top" onClick={scrollToTop}>↑</button>
    </div>
  );
}
export default ProductDetailPage;



