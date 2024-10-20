import React from "react";
import { Form, Input, Button, DatePicker, Select } from "antd";
import "./index.css"; // Import CSS Scoped
import { toast } from "react-toastify";


function Destiny(){
const { Option } = Select;
const handelDestiny = async (values)  =>{
  try {
    const response = await api.post("fate/calculate", values)
  } catch (error) {
    toast.error(err.response?.data);
  }
};
  return (
    <div className="auth-template">
      <Form className="auth-form" onFinish={handelDestiny}>
        <h2>Nhập Thông Tin Cá Nhân</h2>

        {/* Ngày tháng năm sinh */}
        <Form.Item
          name="birthdate"
          rules={[{ required: true, message: "Please select your birthdate!" }]}
        >
          <div className="form-group">
            <span className="input-icon">
              <i className="uil uil-calendar-alt"></i>
            </span>
            <DatePicker
              placeholder="Select Birthdate"
              className="form-style"
              style={{ width: "100%" }}
            />
          </div>
        </Form.Item>

        {/* Giới tính */}
        <Form.Item
          name="gender"
          rules={[{ required: true, message: "Please select your gender!" }]}
        >
          <div className="form-group">
            <span className="input-icon">
              <i className="uil uil-user"></i>
            </span>
            <Select placeholder="Select Gender" className="form-style">
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
              <Option value="other">Khác</Option>
            </Select>
          </div>
        </Form.Item>

        {/* Nút Submit */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="submit-button">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

}
export default Destiny;
