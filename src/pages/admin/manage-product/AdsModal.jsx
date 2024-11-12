import React, { useEffect, useState } from 'react';
import api from '../../../config/axios';
import './AdsModal.css';

function AdsModal({ adId, onClose, onStatusChange }) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await api.get(`/ads/id/${adId}`);
        setAd(response.data);
      } catch (err) {
        setError('Failed to fetch ad details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdDetails();
  }, [adId]);

  const handleApprove = async () => {
    try {
      await api.put(`ads/${adId}/status?status=APPROVED`);
      onStatusChange(adId, 'APPROVED');
    } catch (err) {
      console.error('Error approving ad:', err);
    }
  };

  const handleReject = async () => {
    try {
      await api.put(`ads/${adId}/status?status=REJECTED`);
      onStatusChange(adId, 'REJECTED');
    } catch (err) {
      console.error('Error rejecting ad:', err);
    }
  };

  if (loading) return <div className="modal-loading">Loading...</div>;
  if (error) return <div className="modal-error">{error}</div>;
  if (!ad) return null;

  return (
    <div className="blog-modal-overlay" onClick={onClose}>
      <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>Ad Details</h2>
        <img
          className="modal-thumbnail"
          src={ad.imageUrl}
          alt={ad.productName}
        />
        <div className="modal-content">
          <div className="info-item">
            <strong>ID:</strong> <span>{adId}</span>
          </div>
          <div className="info-item">
            <strong>Product Name:</strong> <span>{ad.productName}</span>
          </div>
          <div className="info-item">
            <strong>Type:</strong> <span>{ad.productType}</span>
          </div>
          <div className="info-item">
            <strong>Description:</strong> <span>{ad.description}</span>
          </div>
          <div className="info-item">
            <strong>Price:</strong> <span>{formatCurrency(ad.price)}</span>
          </div>
          <div className="info-item">
            <strong>Status:</strong> <span>{ad.status}</span>
          </div>
          <div className="info-item">
            <strong>Days Left:</strong> <span>{ad.daysLeft}</span>
          </div>
          <div className="info-item">
            <strong>Contact Info:</strong> <span>{ad.contactInfo}</span>
          </div>
          <div className="info-item">
            <strong>Created At:</strong>{' '}
            <span>{new Date(ad.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="modal-actions">
          {ad.status === 'PENDING' && (
            <>
              <button className="approve-btn" onClick={handleApprove}>
                Approve
              </button>
              <button className="reject-btn" onClick={handleReject}>
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdsModal;
