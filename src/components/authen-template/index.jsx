import React from "react";
import "./index.css"; // Đảm bảo đường dẫn đúng

function AuthenTemplate({ children }) {
  return (
    <div className="authen-template">
      
      <div className="authen-template__form">{children}</div>
    </div>
  );
}

export default AuthenTemplate;
