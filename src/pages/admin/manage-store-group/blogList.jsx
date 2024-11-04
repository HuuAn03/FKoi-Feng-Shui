import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/axios'; 
import './BlogList.css';

function BlogList() {
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [approvedBlogs, setApprovedBlogs] = useState([]);
  const [rejectedBlogs, setRejectedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async (status, setter) => {
      try {
        const response = await api.get(`/blogs/get?blogStatus=${status}&page=0&size=8`);
        setter(response.data.blogs);
      } catch (err) {
        setError('Failed to fetch blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchBlogs('PENDING', setPendingBlogs);
    fetchBlogs('APPROVED', setApprovedBlogs);
    fetchBlogs('REJECTED', setRejectedBlogs);
  }, []);

  const handleUpdateStatus = async (blogId, status) => {
    try {
      await api.put(`/blogs/${blogId}/status?status=${status}`);
      const updatedPendingBlogs = pendingBlogs.filter(blog => blog.blogId !== blogId);
      setPendingBlogs(updatedPendingBlogs);
      if (status === 'APPROVED') {
        const approvedBlog = pendingBlogs.find(blog => blog.blogId === blogId);
        setApprovedBlogs([...approvedBlogs, { ...approvedBlog, status: 'APPROVED' }]);
      } else if (status === 'REJECTED') {
        const rejectedBlog = pendingBlogs.find(blog => blog.blogId === blogId);
        setRejectedBlogs([...rejectedBlogs, { ...rejectedBlog, status: 'REJECTED' }]);
      }
    } catch (err) {
      setError('Failed to update blog status. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const renderBlogs = (blogs, title, isPending = false) => (
    <div className="blogs-section">
      <h2>{title}</h2>
      {blogs.length > 0 ? (
        <div className="blogs">
          {blogs.map((blog) => (
            <div className="blog-card" key={blog.blogId}>
              <img src={blog.thumbnail || blog.imageUrl} alt={blog.title} className="blog-thumbnail" />
              <div className="blog-content">
                <h2 className="blog-title">{blog.title}</h2>
                <p className="blog-description">{blog.shortDescription}</p>
                <div className="blog-meta">
                  <span>Author: {blog.authorName}</span>
                  <span>Category: {blog.categoryName}</span>
                  <span>Views: {blog.viewsCount}</span>
                </div>
                {isPending && (
                  <div className="status-buttons">
                    <button
                      className="approve-btn"
                      onClick={() => handleUpdateStatus(blog.blogId, 'APPROVED')}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleUpdateStatus(blog.blogId, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-blogs">No blogs available</div>
      )}
    </div>
  );

  const handlePostBlog = () => {
    navigate('/dashboard/manage-blog'); 
  };

  return (
    <div>
      <h1>Blog List</h1>
      <button className="post-blog-btn" onClick={handlePostBlog}>Post Blog</button>
      <div className="pending-section blogs-section">
        {renderBlogs(pendingBlogs, 'Pending Blogs', true)}
      </div>
      <div className="approved-section blogs-section">
        {renderBlogs(approvedBlogs, 'Approved Blogs')}
      </div>
      <div className="rejected-section blogs-section">
        {renderBlogs(rejectedBlogs, 'Rejected Blogs')}
      </div>
    </div>
  );
}

export default BlogList;
