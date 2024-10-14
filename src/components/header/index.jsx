import React from "react";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./index.css"; 

function Header() {
  const cart = useSelector((store) => store.cart);

  return (
    <header className="fengshui-header">
      <div className="logo">
        <img src="https://img.freepik.com/premium-vector/vector-illustration-koi-fish-with-beautiful-colors-minimalist-flat-style_1287411-59.jpg" alt="Logo" className="logo-image" />
        <span className="logo-text">FKoi FengShui</span>
      </div>
      <nav className="navigation">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/adv">Advertisement</Link></li>
          <li><Link to="/destiny">Destiny</Link></li>
          <li><Link to="/productPage">Product</Link></li>
          <li><Link to="/userPage">User</Link></li>
        </ul>
       
      </nav>
      <div className="login-cart">
          <Link to="/login" className="login-button">Log in</Link>
          
        </div>
    </header>
  );
}
export default Header;
