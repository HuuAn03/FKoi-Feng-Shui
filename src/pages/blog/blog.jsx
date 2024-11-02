
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/axios';
import './blog.css';


function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);


  const fetchBlogs = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/blogs/get', {
        params: {
          blogStatus: 'APPROVED',
          page: pageNumber,
          size: 8
          
        }
      });
      const { blogs, totalPages } = response.data;
      setBlogs(blogs);
      setTotalPages(totalPages);
      setPage(pageNumber);
    } catch (error) {
      setError('Failed to load blogs. Please try again later.');
      console.error('Error fetching blogs:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBlogs(0);
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };


    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handlePageChange = (newPage) => {
    fetchBlogs(newPage);
  };


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="blog-page">
      <header className="blog-header">
        <h1>Latest Blog Posts</h1>
      </header>


      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && blogs.length === 0 && <div className="no-blogs">No blogs available</div>}


      <div className="blog-list">
        {blogs.map((blog) => (
          <div key={blog.blogId} className="blog-item">
            <Link to={`/blog/${blog.blogId}`}>
              <img src={blog.thumbnail} alt={blog.title} className="blog-thumbnail" />
            </Link>
            <div className="blog-content">
              <div className="blog-meta">
                <span className="blog-date"> {new Date(blog.createdAt).toLocaleDateString()}</span>
                <span className="blog-views"> {blog.viewsCount.toLocaleString()}</span>
              </div>
              <Link to={`/blog/${blog.blogId}`} className="blog-title">
                <h2>{blog.title}</h2>
              </Link>
              <p className="blog-description">{blog.shortDescription}</p>
            </div>
          </div>
        ))}
      </div>


      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page + 1 >= totalPages}
        >
          Next
        </button>
      </div>


      {showScrollTop && (
  <button className="scroll-top" onClick={scrollToTop}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L12 20M12 4L6 10M12 4L18 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
)}


    </div>
  );
}


export default BlogPage;



