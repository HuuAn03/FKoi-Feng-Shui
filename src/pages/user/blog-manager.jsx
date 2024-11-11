import React, { useEffect, useState } from 'react';
import api from "../../config/axios";
import './UserBlogs.css';

const UserBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0); 
    const [totalPages, setTotalPages] = useState(0); 

    useEffect(() => {
        fetchUserBlogs(page);
    }, [page]);

    const fetchUserBlogs = async (pageNumber = 0, pageSize = 8) => {
        setLoading(true);
        try {
            const response = await api.get(`/blogs/my?page=${pageNumber}&size=${pageSize}`);
            setBlogs(response.data.blogs); 
            setTotalPages(response.data.totalPages); 
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlogClick = (blog) => {
        setSelectedBlog(blog);
    };

    const handleBackToList = () => {
        setSelectedBlog(null);
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 0) setPage(page - 1);
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="user-blogs-container">
            <h1>Your Blogs</h1>

            {selectedBlog ? (
                <div className="blog-details">
                    <button onClick={handleBackToList} className="back-button">Back to Blog List</button>

                    <h2>{selectedBlog.title}</h2>

                    <p><strong>Author:</strong> {selectedBlog.authorName}</p>
                    <p><strong>Category:</strong> {selectedBlog.categoryName}</p>
                    <p><strong>Posted on:</strong> {new Date(selectedBlog.createdAt).toLocaleDateString()}</p>
                    <p><strong>Description:</strong> {selectedBlog.shortDescription}</p>
                    
                    {selectedBlog.imageUrl && (
                        <img src={selectedBlog.imageUrl} alt="Blog Main" className="blog-main-image" />
                    )}

                    <div className="blog-content">
                        <strong>Content:</strong>
                        <p>{selectedBlog.content}</p>
                    </div>

                    <div className="blog-tags">
                        <strong>Tags:</strong>
                        {selectedBlog.tags && selectedBlog.tags.length > 0 ? (
                            <ul>
                                {selectedBlog.tags.map((tag, index) => (
                                    <li key={index} className="tag">{tag}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No tags available</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="blog-list">
                    {blogs.length > 0 ? (
                        blogs.map(blog => (
                            <div key={blog.blogId} className="blog-card" onClick={() => handleBlogClick(blog)}>
                                {blog.thumbnail && (
                                    <img src={blog.thumbnail} alt="Blog Thumbnail" className="blog-thumbnail" />
                                )}
                                <h2>{blog.title}</h2>
                                <p>{blog.shortDescription}</p>
                                <p><strong>Status:</strong> {blog.status}</p>
                                <p>Posted on: {new Date(blog.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))
                    ) : (
                        <p>You haven't posted any blogs yet.</p>
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={page === 0}>
                    Previous
                </button>
                <span>Page {page + 1} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserBlogs;
