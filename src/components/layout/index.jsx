import React from "react";
import Header from "../header";
import Footer from "../footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <Header />
      <div className="main-content" 
      style={{ 
        padding: 20, 
        minHeight: "100vh" 
        }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
