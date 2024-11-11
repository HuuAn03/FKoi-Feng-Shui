import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/axios';
import BlogModal from './BlogModal';
import './BlogList.css';

function BlogList() {
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [approvedBlogs, setApprovedBlogs] = useState([]);
  const [rejectedBlogs, setRejectedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  // Pagination state
  const [pendingPage, setPendingPage] = useState(0);
  const [approvedPage, setApprovedPage] = useState(0);
  const [rejectedPage, setRejectedPage] = useState(0);
  const [totalPendingPages, setTotalPendingPages] = useState(1);
  const [totalApprovedPages, setTotalApprovedPages] = useState(1);
  const [totalRejectedPages, setTotalRejectedPages] = useState(1);

  const navigate = useNavigate();

  // Fetch pending blogs when pendingPage changes
  useEffect(() => {
    const fetchPendingBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/blogs/get?blogStatus=PENDING&page=${pendingPage}&size=4`);
        setPendingBlogs(response.data.blogs);
        setTotalPendingPages(response.data.totalPages);
      } catch (err) {
        setError('Failed to fetch pending blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPendingBlogs();
  }, [pendingPage]);

  // Fetch approved blogs when approvedPage changes
  useEffect(() => {
    const fetchApprovedBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/blogs/get?blogStatus=APPROVED&page=${approvedPage}&size=4`);
        setApprovedBlogs(response.data.blogs);
        setTotalApprovedPages(response.data.totalPages);
      } catch (err) {
        setError('Failed to fetch approved blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedBlogs();
  }, [approvedPage]);

  // Fetch rejected blogs when rejectedPage changes
  useEffect(() => {
    const fetchRejectedBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/blogs/get?blogStatus=REJECTED&page=${rejectedPage}&size=4`);
        setRejectedBlogs(response.data.blogs);
        setTotalRejectedPages(response.data.totalPages);
      } catch (err) {
        setError('Failed to fetch rejected blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchRejectedBlogs();
  }, [rejectedPage]);

  const handleUpdateStatus = async (blogId, status) => {
    try {
      await api.put(`/blogs/${blogId}/status?status=${status}`);
      setPendingBlogs(pendingBlogs.filter(blog => blog.blogId !== blogId));
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

  const handleDeleteBlog = async (blogId) => {
    try {
      await api.delete(`/blogs/${blogId}`);
      setPendingBlogs(pendingBlogs.filter(blog => blog.blogId !== blogId));
      setApprovedBlogs(approvedBlogs.filter(blog => blog.blogId !== blogId));
      setRejectedBlogs(rejectedBlogs.filter(blog => blog.blogId !== blogId));
    } catch (err) {
      setError('Failed to delete blog. Please try again.');
    }
  };

  const handlePageChange = (type, direction) => {
    if (type === 'PENDING') {
      setPendingPage((prev) => Math.max(0, prev + direction));
    } else if (type === 'APPROVED') {
      setApprovedPage((prev) => Math.max(0, prev + direction));
    } else if (type === 'REJECTED') {
      setRejectedPage((prev) => Math.max(0, prev + direction));
    }
  };

  const renderPaginationControls = (page, totalPages, type) => (
    <div className="pagination-controls">
      <button
        onClick={() => handlePageChange(type, -1)}
        disabled={page === 0}
      >
        Previous
      </button>
      <span>Page {page + 1} of {totalPages}</span>
      <button
        onClick={() => handlePageChange(type, 1)}
        disabled={page + 1 >= totalPages}
      >
        Next
      </button>
    </div>
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const renderBlogs = (blogs, title, isPending = false, page, totalPages, type) => (
    <div className="blogs-section">
      <h2>{title}</h2>
      {blogs.length > 0 ? (
        <div>
          <div className="blogs">
            {blogs.map((blog) => (
              <div
                className="blog-card"
                key={blog.blogId}
                onClick={() => setSelectedBlogId(blog.blogId)}
              >
                <img src={blog.thumbnail || blog.imageUrl} alt={blog.title} className="blog-thumbnail" />
                <div className="blog-content">
                  <h2 className="blog-title">{blog.title}</h2>
                  <p className="blog-description">{blog.shortDescription}</p>
                  <div className="blog-meta">
                    <span>Author: {blog.authorName}</span>
                    <span>Category: {blog.categoryName}</span>
                    <span>Views: {blog.viewsCount}</span>
                  </div>
                  <div className="status-buttons">
                    {isPending && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(blog.blogId, 'APPROVED');
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(blog.blogId, 'REJECTED');
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {!isPending && (
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBlog(blog.blogId);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {renderPaginationControls(page, totalPages, type)}
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
        {renderBlogs(pendingBlogs, 'Pending Blogs', true, pendingPage, totalPendingPages, 'PENDING')}
      </div>
      <div className="approved-section blogs-section">
        {renderBlogs(approvedBlogs, 'Approved Blogs', false, approvedPage, totalApprovedPages, 'APPROVED')}
      </div>
      <div className="rejected-section blogs-section">
        {renderBlogs(rejectedBlogs, 'Rejected Blogs', false, rejectedPage, totalRejectedPages, 'REJECTED')}
      </div>

      {selectedBlogId && (
        <BlogModal
          blogId={selectedBlogId}
          onClose={() => setSelectedBlogId(null)}
        />
      )}
    </div>
  );
}

export default BlogList;
