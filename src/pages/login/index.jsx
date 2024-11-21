import React, { useState } from "react";
import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input, Modal } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlide";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin URL hiện tại
  const dispatch = useDispatch();
  const [isForgotModalVisible, setIsForgotModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutDuration, setLockoutDuration] = useState(0);
  const [captchaToken, setCaptchaToken] = useState(null);

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleLogin = async (values) => {
    if (isLocked) {
      toast.error("You are temporarily locked out. Please wait.");
      return;
    }

    if (!captchaToken) {
      toast.error("Please complete reCAPTCHA");
      return;
    }

    try {
      const response = await api.post("auth/login", { ...values, captchaToken });

      if (response.data.status === "INACTIVE") {
        toast.error("Your account is INACTIVE. Please contact support.");
        return;
      }

      toast.success("Login successful!");
      dispatch(login(response.data));

      const { role, token, accountId } = response.data;
      localStorage.setItem("accountId", accountId);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";
      navigate(redirectPath);
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

      const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";
      navigate(redirectPath);
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

          <Form.Item>
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
              marginBottom: "20px",
              transform: "scale(0.8)", // Thu nhỏ reCAPTCHA xuống 80%
              transformOrigin: "center", // Căn giữa khi thu nhỏ
              maxWidth: "100%"
            }}>
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={onCaptchaChange}
              />
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