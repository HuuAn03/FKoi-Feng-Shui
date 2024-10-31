import React from "react";

import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./index.css"; 

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/login"); // Redirect to login page
  };
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
          <li><Link to="/product">Product</Link></li>
          <li><Link to="/user">User</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
       
      </nav>
      <div className="login-cart">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        ) : (
          <Link to="/login" className="login-button">
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}
export default Header;
