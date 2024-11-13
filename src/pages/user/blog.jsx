import React, { useState } from 'react';
import { Button, Form, Input, Select, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './blog.css';
import api from '../../config/axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Blog = () => {
    const [form] = Form.useForm();
    const [thumbnailFileList, setThumbnailFileList] = useState([]);
    const [imageFileList, setImageFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');

    const handleBlogPost = async (values) => {
        const formData = new FormData();
    
        formData.append("title", values.title);
        formData.append("content", content);
        formData.append("shortDescription", values.shortDescription);
        formData.append("categoryName", values.categoryName);
    
        values.tags.split(',').map(tag => formData.append("tags", tag.trim()));
    
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
            setContent('');
        } catch (error) {
            message.error("Failed to create blog post. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    const handleThumbnailChange = ({ fileList }) => setThumbnailFileList(fileList);
    const handleImageFileChange = ({ fileList }) => setImageFileList(fileList);

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

                    <Form.Item name="thumbnail" label="Upload Thumbnail">
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
                        <ReactQuill
                            value={content}
                            onChange={setContent}
                            placeholder="Write your content here..."
                        />
                    </Form.Item>

                    <Form.Item
                        name="categoryName"
                        rules={[{ required: true, message: "Please select a category" }]}
                    >
                        <Select placeholder="Select Category">
                            <Select.Option value="WEATH">Weath</Select.Option>
                            <Select.Option value="TRADITIONS">Traditions</Select.Option>
                            <Select.Option value="PHYSIOGNOMY">Physiognomy</Select.Option>
                            <Select.Option value="OFFICE">Office</Select.Option>
                            <Select.Option value="LOVE">Love</Select.Option>
                            <Select.Option value="LIFESTYLE">Lifestyle</Select.Option>
                            <Select.Option value="HOMEDECOR">Home&Decor</Select.Option>
                            <Select.Option value="CRYSTALS">Crystals</Select.Option>
                            <Select.Option value="CURES">Cures&Enhancers</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="tags"
                        rules={[{ required: true, message: "Please input tags separated by commas" }]}
                    >
                        <Input placeholder="Tags (comma separated)" />
                    </Form.Item>

                    <Form.Item name="imageFile" label="Upload Image File">
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
        </div>
    );
};

export default Blog;