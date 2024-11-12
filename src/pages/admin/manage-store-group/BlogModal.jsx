import React, { useEffect, useState } from 'react';
import api from '../../../config/axios';
import './BlogModal.css';

function BlogModal({ blogId, onClose }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await api.get(`/blogs/get/${blogId}`);
        setBlog(response.data);
      } catch (err) {
        setError('Failed to fetch blog details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [blogId]);

  if (loading) return <div className="modal-loading">Loading...</div>;
  if (error) return <div className="modal-error">{error}</div>;
  if (!blog) return null;

  return (
    <div className="blog-modal-overlay" onClick={onClose}>
      <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <img src={blog.thumbnail || blog.imageUrl} alt={blog.title} className="modal-thumbnail" />
        <h2>{blog.title}</h2>
        <p><strong>Author:</strong> {blog.authorName}</p>
        <p><strong>Category:</strong> {blog.categoryName}</p>
        <p><strong>Created At:</strong> {new Date(blog.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(blog.updatedAt).toLocaleString()}</p>
        <p><strong>Views:</strong> {blog.viewsCount}</p>
        <p><strong>Tags:</strong> {blog.tags.join(', ')}</p>
        <div
          className="modal-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>

      </div>
    </div>
  );
}

export default BlogModal;
