import React, { useState, useEffect } from "react";
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


  // State for failed login attempts and lockout
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutDuration, setLockoutDuration] = useState(0);


  // Calculate lockout duration based on failed attempts
  useEffect(() => {
    if (failedAttempts === 3) setLockoutDuration(30); // 30 seconds after 3 failed attempts
  }, [failedAttempts]);


  useEffect(() => {
    if (lockoutDuration > 0) {
      setIsLocked(true);
      const timer = setTimeout(() => {
        setLockoutDuration((prev) => prev - 1);
      }, 1000);


      if (lockoutDuration === 1) {
        setIsLocked(false);
        setFailedAttempts(0);
      }


      return () => clearTimeout(timer);
    }
  }, [lockoutDuration]);

  const handleLogin = async (values) => {
    if (isLocked) return;


    try {
      const response = await api.post("auth/login", values);
      toast.success("Login successful!");
      dispatch(login(response.data));
      const { role, token, accountId } = response.data;
      localStorage.setItem("accountId", accountId);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (role === "ADMIN") {
        navigate("/dashboard/manage-users");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data || "Login failed.");
      setFailedAttempts((prev) => prev + 1);
    }
  };

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
        <Form
          className="auth-form"
          labelCol={{ span: 24 }}
          onFinish={handleLogin}
        >
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
              <Input placeholder="Email" className="form-style" disabled={isLocked} />
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
              <Input.Password placeholder="Password" className="form-style" disabled={isLocked} />
            </div>
          </Form.Item>


          <Button type="primary" htmlType="submit" className="btn" disabled={isLocked}>
            {isLocked ? `Please wait ${lockoutDuration}s` : "Login"}
          </Button>


          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <Link to="/register" className="link">
              Don't have an account? Register new account
            </Link>
          </div>


          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <Button type="link" onClick={() => setIsForgotModalVisible(true)}>
              Forgot Password?
            </Button>
          </div>


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


          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error("Google login failed.")} />
          </div>
        </Form>
      </AuthenTemplate>
    </GoogleOAuthProvider>
  );
}


export default LoginPage;





