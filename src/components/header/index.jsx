import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./index.css"; 

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="fengshui-header">
      <div className="logo">
        <Link to="/">
          <img
            src="https://img.freepik.com/premium-vector/vector-illustration-koi-fish-with-beautiful-colors-minimalist-flat-style_1287411-59.jpg"
            alt="Logo"
            className="logo-image"
          />
          <span className="logo-text">FKoi FengShui</span>
        </Link>
      </div>
      <nav className="navigation">
        <ul>
          <li><Link to="/adv">Advertisement</Link></li>
          <li><Link to="/destiny">Consultation</Link></li>
          <li><Link to="/product">Product</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
      </nav>
      <div className="login-cart">
        {isLoggedIn ? (
          <>
            <Link to="/user" className="profile-button">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                alt="Profile Icon"
                className="profile-icon"
              />
              Profile
            </Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
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
