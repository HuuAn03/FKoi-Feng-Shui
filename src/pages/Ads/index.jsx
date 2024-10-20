import React, { useState } from 'react';
import { Button, Form, Input, Card, Select } from 'antd';
import { PhoneOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import './ADS.css';

function ADS() {
    const [form] = Form.useForm(); // Tạo form instance
    const [selectedPlan, setSelectedPlan] = useState(null); // Track plan được chọn

    const handleAds = async (values) => {
        try {
            const response = await api.post("/ads", { ...values, advertisingPlan: selectedPlan });
            toast.success("Your advertisement has been queued");
        } catch (e) {
            toast.error("Check your advertisement for errors");
        }
    };

    const handlePlanClick = (plan) => {
        setSelectedPlan(plan); // Cập nhật plan được chọn
    };

    return (
        <div className="ads-page-container">
            {/* Banner Section */}
            <div className="ads-banner">
                <h1>Create Your Advertisement</h1>
                <p>Promote your products with our tailored plans!</p>
            </div>

            <div className="ads-content">
                {/* Left-side form */}
                <Form
                    form={form}
                    className="ads-form-container"
                    labelCol={{ span: 24 }}
                    onFinish={handleAds}
                >
                    <Form.Item
                        name="productName"
                        rules={[{ required: true, message: "Please input the name of the item" }]}
                    >
                        <Input
                            placeholder="Item Name"
                            prefix={<UserOutlined />}
                            className="ads-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="productType"
                        rules={[{ required: true, message: "Please select the product type" }]}
                    >
                        <Select
                            className="ads-select"
                            placeholder="Select type of product"
                            options={[
                                { value: 'DECORATION', label: 'Decoration' },
                                { value: 'KOI_ACCESSORY', label: 'Koi' },
                                { value: 'POND_ACCESSORY', label: 'Pond' },
                            ]}
                            allowClear
                        />
                    </Form.Item>

                    <Form.Item name="description">
                        <Input.TextArea
                            placeholder="Description"
                            className="ads-input"
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        rules={[
                            { required: true, message: "Please input the price" },
                            { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: "Invalid price format" },
                        ]}
                    >
                        <Input
                            placeholder="Price"
                            prefix={<DollarOutlined />}
                            className="ads-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="contactInfo"
                        rules={[
                            { required: true, message: "Please input your contact number" },
                            { pattern: /^((\+84)|0)([1-9]{1}[0-9]{8})$/, message: "Invalid phone number" },
                        ]}
                    >
                        <Input
                            placeholder="Contact Info"
                            prefix={<PhoneOutlined />}
                            className="ads-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="compatibleFate"
                        rules={[{ required: true, message: "Please select the compatible fate" }]}
                    >
                        <Select
                            className="ads-select"
                            placeholder="Select compatible fate"
                            options={[
                                { value: 'METAL', label: 'Metal' },
                                { value: 'WOOD', label: 'Wood' },
                                { value: 'WATER', label: 'Water' },
                                { value: 'FIRE', label: 'Fire' },
                                { value: 'EARTH', label: 'Earth' },
                            ]}
                            allowClear
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        className="ads-submit-btn"
                        disabled={!selectedPlan} // Disable nếu chưa chọn plan
                    >
                        Submit
                    </Button>
                </Form>

                {/* Right-side advertisement plan details as Cards */}
                <div className="ads-plan-details">
                    <h2>Advertisement Plans</h2>
                    <div className="ads-plan-cards">
                        {[
                            { label: '1 Day', value: 'planId', price: '$5' },
                            { label: '3 Days', value: '3_days', price: '$12' },
                            { label: '7 Days', value: '7_days', price: '$25' },
                            { label: '30 Days', value: '30_days', price: '$80' },
                            { label: '365 Days', value: '365_days', price: '$900' },
                        ].map((plan) => (
                            <Card
                                key={plan.value}
                                className={`ads-plan-card ${selectedPlan === plan.value ? 'selected' : ''}`}
                                onClick={() => handlePlanClick(plan.value)}
                            >
                                <h3>{plan.label}</h3>
                                <p>{plan.price}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ADS;
