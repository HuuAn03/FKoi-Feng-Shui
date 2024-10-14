import React from "react";
import "./index.css";

function AuthenTemplate({ children }) {
  return (
    <div className="authen-template">
      <div className="authen-templat__form">{children}</div>
    </div>
  );
}

export default AuthenTemplate;
