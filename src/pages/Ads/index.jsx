import React, { useState } from 'react';
import { Button, Form, Input, Select, Upload, Card } from 'antd';
import { PhoneOutlined, DollarOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import './Ads.css';

function ADS() {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(''); // State to store the image URL

    // Handle form submission
    const handleAds = async (values) => {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });

        // Append the image file if it exists
        if (fileList.length > 0) {
            formData.append('imageFile', fileList[0].originFileObj);
        }

        try {
            const response = await api.post("/ads", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });          
            const { imageUrl } = response.data;             
            if (imageUrl) {
                setUploadedImageUrl(imageUrl); // Store the image URL
                toast.success("Your advertisement has been queued");
            }
        } catch (e) {
            toast.error("Check your advertisement for errors");
        }
    };

    const handleFileChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const plans = [
        { label: '3 Days', price: '150,000 VND', description: 'Ideal for quick promotions.' },
        { label: '7 Days', price: '300,000 VND', description: 'Best for weekly offers.' },
        { label: '30 Days', price: '1,200,000 VND', description: 'Perfect for long-term visibility.' },
    ];

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

                    {/* File Upload */}
                    <Form.Item
                        name="file"
                        label="Upload File"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList}
                    >
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                        >
                            <Button icon={<UploadOutlined />}>Upload File</Button>
                        </Upload>
                    </Form.Item>

                    <Button type="primary" htmlType="submit" className="ads-submit-btn">
                        Submit
                    </Button>
                </Form>

                {/* Display the uploaded image */}
                {uploadedImageUrl && (
                    <div className="ads-image-preview">
                        <h2>Uploaded Image Preview</h2>
                        <img src={uploadedImageUrl} alt="Uploaded Ad" style={{ width: '100%', maxWidth: '300px' }} />
                    </div>
                )}

                <div className="ads-plan-details">
                    <h2>Advertisement Plans</h2>
                    <div className="ads-plan-cards">
                        {plans.map((plan) => (
                            <Card key={plan.label} className="ads-plan-card">
                                <h3>{plan.label}</h3>
                                <p>{plan.description}</p>
                                <p><strong>{plan.price}</strong></p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ADS;
