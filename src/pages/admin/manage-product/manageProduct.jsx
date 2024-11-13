import React, { useEffect, useState } from 'react';
import api from '../../../config/axios';
import AdsModal from './AdsModal';
import './ManageProduct.css';

function ManageProduct() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrencyVND = (amount) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const fetchAds = async (pageNumber = 0, pageSize = 8) => {
    setLoading(true);
    try {
      const response = await api.get(`/ads/all?page=${pageNumber}&size=${pageSize}`);
      const sortedAds = response.data.ads.sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        return 0;
      });
      setAds(sortedAds);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds(page);
  }, [page]);

  const handleApprove = async (adId) => {
    try {
      await api.put(`ads/${adId}/status?status=APPROVED`);
      setAds((prevAds) =>
        prevAds.map((ad) => (ad.adId === adId ? { ...ad, status: 'APPROVED' } : ad))
      );
    } catch (error) {
      console.error("Error approving ad:", error);
    }
  };

  const handleReject = async (adId) => {
    try {
      await api.put(`ads/${adId}/status?status=REJECTED`);
      setAds((prevAds) =>
        prevAds.map((ad) => (ad.adId === adId ? { ...ad, status: 'REJECTED' } : ad))
      );
    } catch (error) {
      console.error("Error rejecting ad:", error);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleAdClick = (adId) => {
    setSelectedAdId(adId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAdId(null);
    setIsModalOpen(false);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1>Manage Products</h1>
      {ads.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad.adId} onClick={() => handleAdClick(ad.adId)}>
                <td>{ad.adId}</td>
                <td>{ad.productName}</td>
                <td>{ad.productType}</td>
                <td>{formatCurrencyVND(ad.price)}</td>
                <td>{ad.status}</td>
                <td>
                  {ad.status === 'PENDING' && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(ad.adId);
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(ad.adId);
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
                <div className="tooltip">Click to view details</div>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-ads">No ads available</div>
      )}

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 0}>
          Previous
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages - 1}>
          Next
        </button>
      </div>

      {isModalOpen && <AdsModal
        adId={selectedAdId}
        onClose={handleCloseModal}
        onStatusChange={(adId, newStatus) => {
          setAds((prevAds) =>
            prevAds.map((ad) =>
              ad.adId === adId ? { ...ad, status: newStatus } : ad
            )
          );
          handleCloseModal(); // Đóng modal sau khi cập nhật
        }}
      />
      }
    </div>
  );
}

export default ManageProduct;
