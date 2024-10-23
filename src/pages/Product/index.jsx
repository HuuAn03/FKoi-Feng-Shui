import React, { useEffect, useState } from "react"; 
import api from "../../config/axios";
import "./index.scss";

function ProductPage() {
  const [ads, setAds] = useState([]);

  const fetchPublishedAds = async () => {
    try {
      const response = await api.get("/ads/my"); // Replace with the correct API endpoint for published ads
      console.log("API response:", response.data);

      if (Array.isArray(response.data.adResponses)) {
        setAds(response.data.adResponses);
      } else {
        console.log("Data is not an array");
        setAds([]); // Fallback to prevent map issues
      }
    } catch (e) {
      console.log("Error fetching ads: ", e);
      setAds([]); // Handle error by setting ads to an empty array
    }
  };

  useEffect(() => {
    fetchPublishedAds();
  }, []);

  return (
    <div>
      <div className="ad-list">
        {ads.map((ad) => (
          <Ad key={ad.adId} ad={ad} />
        ))}
      </div>
    </div>
  );
}

const Ad = ({ ad }) => {
  return (
    <div className="ad">
      <img src={ad.imageUrl} alt={ad.productName} />
      <h3>{ad.productName}</h3>
      <p>Type: {ad.productType}</p>
      <p>{ad.description}</p>
      <p>Price: ${ad.price}</p>
      <p>Contact: {ad.contactInfo}</p>
      <p>Status: {ad.status}</p>
      <p>Posted by: {ad.userName}</p>
      <p>Created at: {new Date(ad.createdAt).toLocaleDateString()}</p>
      {ad.daysLeft > 0 ? <p>Days left: {ad.daysLeft}</p> : <p>Expired</p>}
    </div>
  );
};

export default ProductPage;