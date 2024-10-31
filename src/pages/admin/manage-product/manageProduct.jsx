import React, { useEffect, useState } from 'react';
import api from '../../../config/axios';
import './ManageProduct.css';

function ManageProduct() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await api.get('/ads/all');
        setAds(response.data.ads);
      } catch (error) {
        setError('Failed to load ads');
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
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
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-ads">No ads available</div>
      )}
    </div>
  );
}
export default ManageProduct;
