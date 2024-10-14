import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import AuthenTemplate from "../../components/authen-template";
import api from '../../config/axios';
import { toast } from 'react-toastify';


function ADS() {

    const handleAds = async (values) => {
        try {

            const response = await api.post("/ads", values);
            toast.success("Your advertisement been queued");

        } catch (e) {
            toast.error("Check your advertise have some error");
        }
    }
    return (
        <AuthenTemplate>
            <Form
                className="auth-form"
                labelCol={{
                    span: 24,
                }}
                onFinish={handleAds}
            >
                <Form.Item
                    name="productName"
                    rules={[
                        {
                            required: true,
                            message: "Please input name of item",
                        },
                    ]}
                >
                    <Input placeholder="Name" className="form-style" />
                </Form.Item>
                <Form.Item
                    name="productType"
                    rules={[
                        {
                            required: true,
                            message: "Please select type of your product",
                        },
                    ]}
                >
                    <Select
                        className="form-style" // Áp dụng class style
                        placeholder="Please select a type"

                        dropdownStyle={{
                            backgroundColor: '#1f2029',
                            color: '#c4c3ca',
                        }} // Tùy chỉnh màu nền của dropdown
                        style={{
                            backgroundColor: '#1f2029', // Màu nền cho Select
                            color: '#c4c3ca', // Màu chữ
                            border: 'none', // Không có viền
                        }}
                    >
                        <Select.Option value="DECORATION">Decoration</Select.Option>
                        <Select.Option value="KOI_ACCESSORY">Koi</Select.Option>
                        <Select.Option value="POND_ACCESSORY">Pond</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item

                    name="description"
                >
                    <Input placeholder="Description" className="form-style" />
                </Form.Item>
                <Form.Item

                    name="price"
                    rules={[
                        {
                            required: true,
                            message: "Please input the price",
                        },
                        {
                            pattern: /^[0-9]+(\.[0-9]{1,2})?$/, // Sửa biểu thức chính quy
                            message: "Price must be a valid number and up to two decimal places",
                        },
                    ]}
                >
                    <Input placeholder="price" className="form-style" />
                </Form.Item>
                <Form.Item
                    name="contactInfo"
                    rules={[
                        { required: true, message: "Please input your phone number!" },
                        {
                            pattern: /^((\+84)|0)([1-9]{1}[0-9]{8})$/,
                            message: "Please enter a valid Vietnamese phone number!",
                        },
                    ]}
                >
                    <Input placeholder="Contact" className="form-style" />
                </Form.Item>
                <Form.Item
                    name="imageUrl"
                    rules={[
                        {
                            required: true,
                            message: "Please input the image URL!",
                        },
                       
                    ]}
                >
                    <Input placeholder="Image URL" className="form-style" />
                </Form.Item>

                

                <Form.Item
                    name="compatibleFate"
                    rules={[
                        {
                            required: true,
                            message: "Please select the compatible fate",
                        },
                    ]}
                >
                    <Select
                        className="form-style"
                        placeholder="Select Compatible Fate"
                        dropdownStyle={{
                            backgroundColor: '#1f2029',
                            color: '#c4c3ca',
                        }}
                        style={{
                            backgroundColor: '#1f2029',
                            color: '#c4c3ca',
                            border: 'none',
                        }}
                    >
                        <Select.Option value="METAL">Metal</Select.Option>
                        <Select.Option value="WOOD">Wood</Select.Option>
                        <Select.Option value="WATER">WATER</Select.Option>
                        <Select.Option value="FIRE">FIRE</Select.Option>
                        <Select.Option value="EARTH">EARTH</Select.Option>
                        {/* Thêm các tùy chọn khác nếu cần */}
                    </Select>
                </Form.Item>

                <Button type="primary" htmlType="submit" className="btn">
                    Submit
                </Button>
            </Form>
        </AuthenTemplate>
    );
}
export default ADS;
