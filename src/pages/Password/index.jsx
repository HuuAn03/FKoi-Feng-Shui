import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";
import "./PasswordPage.css";


function PasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  // Lấy token từ URL
  const token = searchParams.get("token");
  const handlePasswordReset = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      // Gửi token và mật khẩu mới tới API
      await api.post(`/password/reset?token=${token}`, {
        newPassword: values.newPassword,
      });
      toast.success("Password reset successfully!");
      navigate("/login"); // Điều hướng về trang đăng nhập sau khi thành công
    } catch (err) {
      toast.error(err.response?.data || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <Form onFinish={handlePasswordReset} className="reset-password-form">
        <Form.Item
          name="newPassword"
          
        >
          <Input.Password placeholder="New Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          
        >
          <Input.Password placeholder="Confirm New Password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} className="reset-password-button">
          Reset Password
        </Button>
      </Form>
    </div>
  );
}


export default PasswordPage;