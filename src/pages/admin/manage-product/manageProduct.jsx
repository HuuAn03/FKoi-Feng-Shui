import React, { useEffect, useState } from 'react';
import api from '../../../config/axios';
import './ManageProduct.css';

function ManageProduct() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // Track current page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages

  const fetchAds = async (pageNumber = 0, pageSize = 8) => {
    setLoading(true);
    try {
      const response = await api.get(`/ads/all?page=${pageNumber}&size=${pageSize}`);
      setAds(response.data.ads);
      setTotalPages(response.data.totalPages); // Assuming totalPages is in the response
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds(page); // Fetch ads whenever `page` changes
  }, [page]);

  const handleApprove = async (adId) => {
    try {
      await api.put(`ads/${adId}/status?status=APPROVED`);
      setAds((prevAds) =>
        prevAds.map((ad) =>
          ad.adId === adId ? { ...ad, status: 'APPROVED' } : ad
        )
      );
    } catch (error) {
      console.error("Error approving ad:", error);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1>Manage Products</h1>
      {ads.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Type</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Days Left</th>
              <th>Contact Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad.adId}>
                <td>{ad.productName}</td>
                <td>{ad.productType}</td>
                <td>{ad.description}</td>
                <td>{ad.price}</td>
                <td>{ad.status}</td>
                <td>{ad.daysLeft}</td>
                <td>{ad.contactInfo}</td>
                <td>
                  {ad.status === 'PENDING' && (
                    <button onClick={() => handleApprove(ad.adId)}>Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-ads">No ads available</div>
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
}

export default ManageProduct;
