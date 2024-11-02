import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import "./index.scss";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (pageNumber) => {
    try {
      const response = await api.get(`/ads/active?page=${pageNumber}&size=8`);
      if (Array.isArray(response.data.ads)) {
        setProducts(response.data.ads);
        setTotalPages(response.data.totalPages);
      } else {
        setProducts([]);
      }
    } catch (e) {
      console.log("Error fetching products: ", e);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);


  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };


  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };


  return (
    <div className="product-page">
      <h1>Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.adId} product={product} />
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 0}>
          Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page === totalPages - 1}>
          Next
        </button>
      </div>
    </div>
  );
}

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/product/${product.adId}`);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <img src={product.imageUrl} alt={product.productName} className="product-image" />
      <div className="product-overlay">
        <h3>{product.productName}</h3>
        <p>{product.price.toLocaleString()} VND</p>
        <button>Mua ngay</button>
      </div>
      <div className="new-badge">NEW</div>
    </div>
  );
};

export default ProductPage;



