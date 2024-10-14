import React from "react";
import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      values.role = "CUSTOMER";
      const response = await api.post("auth/register", values);

      toast.success("Successfully registered a new account!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data || "Registration failed.");
    }
  };

  return (
    <AuthenTemplate>
      <h2>Register</h2>
      <Form
        className="auth-form"
        labelCol={{ span: 24 }}
        onFinish={handleRegister}
      >
        <Form.Item

          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <div className="form-group">
            <span className="input-icon">
              <i className="uil uil-user"></i>
            </span>
            <Input placeholder="Username" className="form-style" />
          </div>
        </Form.Item>

        <Form.Item

          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            {
              type: "email",
              message: "Please enter a valid email!",
            },
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
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters long!" },
          ]}
          hasFeedback
        >
          <div className="form-group">
            <span className="input-icon">
              <i className="uil uil-lock"></i>
            </span>
            <Input.Password placeholder="Password" className="form-style" />
          </div>
        </Form.Item>

        <Form.Item

          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <div className="form-group">
            <span className="input-icon">
              <i className="uil uil-lock"></i>
            </span>
            <Input.Password placeholder="Confirm Password" className="form-style" />
          </div>
        </Form.Item>

        <Button type="primary" htmlType="submit" className="btn">
          Register
        </Button>

        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <Link to="/login" className="link">
            Already have an account? Go to login page
          </Link>
        </div>
      </Form>
    </AuthenTemplate>
  );
}

export default RegisterPage;