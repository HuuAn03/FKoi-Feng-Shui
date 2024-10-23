import React, { useState } from "react";
import { Form, Button, DatePicker, Typography, Card, Spin } from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { motion } from "framer-motion"; // For animations
import "./Destiny.css"; // Import the CSS file

const { Title, Paragraph } = Typography;

const Destiny = () => {
  const [loading, setLoading] = useState(false);
  const [fateType, setFateType] = useState(null); // State to hold the returned fate type

  const calculateFate = async (values) => {
    try {
      setLoading(true);
  
      // Format the birthdate to 'YYYY-MM-DD'
      const birthdate = values.birthdate.format("YYYY-MM-DD");
  
      // Make the GET request with the birthdate as a query parameter
      const response = await api.get(`fate/calculate?birthdate=${birthdate}`);
  
      // Extract the fate type from the response
      setFateType(response.data.userFate);
      toast.success("Thành công! Mệnh của bạn là: " + response.data.userFate);
    } catch (error) {
      toast.error(
        error.response?.data || "Đã xảy ra lỗi khi tính mệnh"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-template">
      <Card className="auth-card">
        <Title level={2} style={{ textAlign: "center" }}>Nhập Thông Tin Cá Nhân</Title>

        <div className="form-container">
          {/* Input Form on the Left */}
          <Form
            className="input-form"
            onFinish={calculateFate} // Trigger when the form is submitted
            layout="inline" // Use inline layout for DatePicker and Button
          >
            {/* Ngày tháng năm sinh */}
            <Form.Item
              name="birthdate"
              rules={[{ required: true, message: "Please select your birthdate!" }]}
            >
              <DatePicker
                placeholder="Select Birthdate"
                className="form-style"
                style={{ width: "250px" }} // Set a fixed width for the DatePicker
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
                loading={loading} // Display a loading indicator while submitting
                style={{ marginLeft: "10px" }} // Space between DatePicker and button
              >
                {loading ? <Spin size="small" /> : "Tính Mệnh"}
              </Button>
            </Form.Item>
          </Form>

          {/* Result Display on the Right */}
          <motion.div
            className="result-container"
            initial={{ opacity: 0, x: 100 }} // Start hidden and off to the right
            animate={fateType ? { opacity: 1, x: 0 } : {}} // Animate in when fateType is set
            transition={{ duration: 0.5 }} // Animation duration
            style={{ textAlign: "right", marginTop: "20px", flex: 1 }} // Align result to the right
          >
            {fateType && (
              <>
                <Title level={3}>Kết quả:</Title>
                <Paragraph className="result-text">Mệnh của bạn là: <strong>{fateType}</strong></Paragraph>
              </>
            )}
          </motion.div>
        </div>
      </Card>
    </div>
  );
};

export default Destiny;
