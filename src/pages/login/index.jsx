import React, { useState } from "react";
import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlide";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";


function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isForgotModalVisible, setIsForgotModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  // Handle login form submission
  const handleLogin = async (values) => {
    try {
      const response = await api.post("auth/login", values);
      toast.success("Login successful!");
      dispatch(login(response.data));
      const { role, token ,accountId} = response.data;
      localStorage.setItem("accountId",accountId);
      localStorage.setItem("token", token);
      if (role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data || "Login failed.");
    }
  };


  // Handle forgot password modal submission
  const handleForgotPassword = async (values) => {
    setLoading(true);
    try {
      await api.post("/password/forgot", values);
      toast.success("Password reset email sent!");
      setIsForgotModalVisible(false);
    } catch (err) {
      toast.error(err.response?.data || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = async (response) => {
    try {
      const { data } = await api.post("/auth/login/google", { token: response.credential });
      toast.success("Login successful!");
      dispatch(login(data));
      localStorage.setItem("token", data.token);
      navigate(data.role === "ADMIN" ? "/dashboard" : "/");
    } catch (error) {
      toast.error(error.response?.data || "Google login failed.");
    }
  };


  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthenTemplate>
        <h2>Login</h2>
        <Form className="auth-form" labelCol={{ span: 24 }} onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <div className="form-group">
              <span className="input-icon">
                <i className="uil uil-envelope"></i>
              </span>
              <Input placeholder="Email" className="form-style" />
            </div>
          </Form.Item>


          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <div className="form-group">
              <span className="input-icon">
                <i className="uil uil-lock"></i>
              </span>
              <Input.Password placeholder="Password" className="form-style" />
            </div>
          </Form.Item>


          <Button type="primary" htmlType="submit" className="btn">
            Login
          </Button>


          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <Link to="/register" className="link">
              Don't have an account? Register new account
            </Link>
          </div>


          {/* Forgot Password Link */}
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <Button type="link" onClick={() => setIsForgotModalVisible(true)}>
              Forgot Password?
            </Button>
          </div>


          {/* Forgot Password Modal */}
          <Modal
            title="Forgot Password"
            visible={isForgotModalVisible}
            onCancel={() => setIsForgotModalVisible(false)}
            footer={null}
          >
            <Form onFinish={handleForgotPassword}>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form>
          </Modal>


          {/* Google Login Button */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error("Google login failed.")} />
          </div>
        </Form>
      </AuthenTemplate>
    </GoogleOAuthProvider>
  );
}


export default LoginPage;


