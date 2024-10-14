import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import "./index.scss";


function ProductPage() {
  const [products, setProducts] = useState([]);
  const fetchProduct = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (e) {
      console.log("Error fetch product: ", e);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);
  return (
    <div>
      {/* từ danh sách sp, biến mỗi product thành <Product /> */}
      <div className="product-list">
        {products.map((product) => (
          <Product product={product} />
        ))}
      </div>
    </div>
  );
}

const Product = ({ product }) => {

  return (
    <div className="product">
      <img src={product.image} alt="" />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span>{product.price}</span>
      
    </div>
  );
};

export default ProductPage;
