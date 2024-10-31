import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../config/axios';
import './BlogDetail.scss';


function BlogDetail() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [suggestedBlogs, setSuggestedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);


  const fetchBlogDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/blogs/${blogId}`);
      setBlog(response.data);
      fetchSuggestedBlogs(response.data.categoryName, response.data.blogId);
    } catch (error) {
      setError('Failed to load blog details. Please try again later.');
      console.error('Error fetching blog details:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchSuggestedBlogs = async (categoryId, currentBlogId) => {
    try {
      const response = await api.get(`/blogs/category/${categoryId}?page=0&size=3`);
      const filteredBlogs = response.data.blogs.filter((b) => b.blogId !== currentBlogId);
      setSuggestedBlogs(filteredBlogs);
    } catch (error) {
      console.error('Error fetching suggested blogs:', error);
    }
  };


  useEffect(() => {
    fetchBlogDetail();
  }, [blogId]);


  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
 
    // Add a quick scale effect on click
    const scrollButton = document.querySelector('.scroll-top');
    scrollButton.classList.add('clicked');
    setTimeout(() => scrollButton.classList.remove('clicked'), 150);
  };
 


  const handleBack = () => {
    navigate('/blog');
  };


  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;


  return (
    blog && (
      <div className="blog-detail">
        <button className="back-button" onClick={handleBack}>Back to Blog</button>
        <h1 className="blog-title">{blog.title}</h1>
        <p className="blog-author">By {blog.authorName}</p>
        <div className="blog-meta">
          <span className="blog-date"> {new Date(blog.createdAt).toLocaleDateString()}</span>
          <span className="blog-views"> {blog.viewsCount.toLocaleString()}</span>
        </div>
        <img src={blog.imageUrl || blog.thumbnail} alt={blog.title} className="blog-image" />
        <div className="blog-content">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
        {suggestedBlogs.length > 0 && (
          <div className="suggested-blogs">
            <h3>More from {blog.categoryName}</h3>
            <div className="suggested-blogs-list">
              {suggestedBlogs.map(suggestedBlog => (
                <div key={suggestedBlog.blogId} className="suggested-blog-item">
                  <Link to={`/blog/${suggestedBlog.blogId}`}>
                    <img src={suggestedBlog.thumbnail} alt={suggestedBlog.title} />
                    <h4>{suggestedBlog.title}</h4>
                    <p>{suggestedBlog.shortDescription}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
        {showScrollTop && (
          <button className="scroll-top" onClick={scrollToTop}>↑</button>
        )}
      </div>
    )
  );
}


export default BlogDetail;



