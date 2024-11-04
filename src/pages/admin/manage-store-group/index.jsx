import React, { useState } from 'react';
import { Button, Form, Input, Select, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './ManageServiceGroup.css'; 
import api from '../../../config/axios';

function ManageServiceGroup() {
    const [form] = Form.useForm();
    const [thumbnailFileList, setThumbnailFileList] = useState([]);
    const [imageFileList, setImageFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleBlogPost = async (values) => {
        const formData = new FormData();
        
        formData.append("title", values.title);
        formData.append("content", values.content);
        formData.append("shortDescription", values.shortDescription);
        formData.append("categoryName", values.categoryName);
        formData.append("tags", JSON.stringify(values.tags.split(',').map(tag => tag.trim())));
        
        if (thumbnailFileList.length > 0) {
            formData.append("thumbnail", thumbnailFileList[0].originFileObj);
        }
        if (imageFileList.length > 0) {
            formData.append("imageFile", imageFileList[0].originFileObj);
        }

        setLoading(true);
        try {
            await api.post("/blogs/post", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success("Blog post created successfully");
            form.resetFields();
            setThumbnailFileList([]);
            setImageFileList([]);
        } catch (error) {
            message.error("Failed to create blog post. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    const handleThumbnailChange = ({ fileList }) => {
        setThumbnailFileList(fileList);
    };

    const handleImageFileChange = ({ fileList }) => {
        setImageFileList(fileList);
    };
    const navigateToBlogReview = () => {
        navigate('/dashboard/service-group');
    };

    return (
        <div className="blog-post-container">
            <h1>Create Blog Post</h1>
            <Spin spinning={loading} tip="Submitting...">
                <Form
                    form={form}
                    className="blog-post-form"
                    onFinish={handleBlogPost}
                >
                    <Form.Item
                        name="title"
                        rules={[{ required: true, message: "Please input the title" }]}
                    >
                        <Input placeholder="Title" />
                    </Form.Item>

                    <Form.Item
                        name="thumbnail"
                        label="Upload Thumbnail"
                    >
                        <Upload
                            listType="picture"
                            fileList={thumbnailFileList}
                            beforeUpload={() => false}
                            onChange={handleThumbnailChange}
                        >
                            <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="shortDescription"
                        rules={[{ required: true, message: "Please input a short description" }]}
                    >
                        <Input.TextArea placeholder="Short Description" rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        rules={[{ required: true, message: "Please input the content" }]}
                    >
                        <Input.TextArea placeholder="Content" rows={6} />
                    </Form.Item>

                    <Form.Item
                        name="categoryName"
                        rules={[{ required: true, message: "Please select a category" }]}
                    >
                        <Select placeholder="Select Category">
                            <Select.Option value="category1">Category 1</Select.Option>
                            <Select.Option value="category2">Category 2</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="tags"
                        rules={[{ required: true, message: "Please input tags separated by commas" }]}
                    >
                        <Input placeholder="Tags (comma separated)" />
                    </Form.Item>

                    <Form.Item
                        name="imageFile"
                        label="Upload Image File"
                    >
                        <Upload
                            listType="picture"
                            fileList={imageFileList}
                            beforeUpload={() => false}
                            onChange={handleImageFileChange}
                        >
                            <Button icon={<UploadOutlined />}>Upload Image File</Button>
                        </Upload>
                    </Form.Item>

                    <Button type="primary" htmlType="submit" disabled={loading}>
                        Submit
                    </Button>
                </Form>
            </Spin>
            <Button type="default" onClick={navigateToBlogReview} style={{ marginTop: '20px' }}>
                Go to Blog Review
            </Button>
        </div>
    );
}

export default ManageServiceGroup;
