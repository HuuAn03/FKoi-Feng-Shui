import React, { useState } from 'react';
import { Button, Form, Input, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import './ManageServiceGroup.css'; 
import api from '../../../config/axios';

function ManageServiceGroup() {
    const [form] = Form.useForm();
    const [thumbnailFileList, setThumbnailFileList] = useState([]);
    const [imageFileList, setImageFileList] = useState([]);

    // Handle form submission
    const handleBlogPost = async (values) => {
        const blogData = {
            title: values.title,
            thumbnail: thumbnailFileList.length > 0 ? thumbnailFileList[0].name : '', // Lấy tên tệp thumbnail
            content: values.content,
            shortDescription: values.shortDescription,
            categoryName: values.categoryName,
            tags: values.tags.split(',').map(tag => tag.trim()), // Chuyển đổi tags từ chuỗi thành mảng và loại bỏ khoảng trắng
        };

        // Append imageFile if it exists
        if (imageFileList.length > 0) {
            const imageFile = imageFileList[0]; // Lấy tệp đầu tiên từ danh sách
            blogData.imageFile = imageFile.name; // Hoặc bạn có thể lấy URL nếu có
        }

        try {
            const response = await api.post("/blogs/post", blogData);
            message.success("Blog post created successfully");
            form.resetFields(); // Reset các trường sau khi thành công
            setThumbnailFileList([]); // Reset file list cho thumbnail
            setImageFileList([]); // Reset file list cho imageFile
        } catch (error) {
            message.error("Failed to create blog post. Please check your inputs.");
        }
    };

    const handleThumbnailChange = ({ fileList }) => {
        setThumbnailFileList(fileList);
    };

    const handleImageFileChange = ({ fileList }) => {
        setImageFileList(fileList);
    };

    return (
        <div className="blog-post-container">
            <h1>Create Blog Post</h1>
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
                        {/* Thay thế với các tùy chọn thực tế */}
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

                <Button type="primary" htmlType="submit">Submit</Button>
            </Form>
        </div>
    );
}

export default ManageServiceGroup;
