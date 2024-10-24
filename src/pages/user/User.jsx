import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import Modal from './Modal';

const User = () => {
    const [ads, setAds] = useState([]);
    const [plan, setPlan] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAdId, setSelectedAdId] = useState(null);

    const fetchPublishedAds = async () => {
        try {
            const response = await api.get("/ads/my");
            if (Array.isArray(response.data.ads)) {
                setAds(response.data.ads);
            } else {
                setAds([]);
            }
        } catch (e) {
            console.log("Error fetching ads: ", e);
            setAds([]);
        }
    };

    useEffect(() => {
        fetchPublishedAds();
    }, []);

    const handlePayment = async (adId) => {
        try {
            const choosePlan = await api.get("/plan");
            console.log("Plans received:", choosePlan.data); // Kiểm tra dữ liệu nhận được
            setPlan(choosePlan.data);
            setSelectedAdId(adId);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    };

    const handlePlanClick = async (selectedPlan) => {
        if (!selectedAdId) {
            console.error("No Ad ID selected!");
            return;
        }

        // Kiểm tra giá trị
        console.log("Selected Ad ID:", selectedAdId);
        console.log("Selected Plan ID:", selectedPlan.planId);

        try {
            const requestBody = {
                adId: selectedAdId,
                planId: selectedPlan.planId,
            };

            const response = await api.post(`/ads/${selectedAdId}/subscription`, requestBody);
            const paymentUrl = response.data;

            window.location.href = paymentUrl; 
            console.log(paymentUrl);
            setShowModal(false); 
        } catch (error) {
            console.error("Error subscribing to plan:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
            } else {
                console.error("No response received or other error:", error.message);
            }
        }
    };

    return (
        <div>
            <div className="ad-list">
                {ads.map((ad) => (
                    <Ad key={ad.adId} ad={ad} handlePayment={handlePayment} />
                ))}
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <h2>Select a Plan</h2>
                {plan.length > 0 ? (
                    <ul>
                        {plan.map((p) => (
                            <li
                                key={p.planId} 
                                className="plan-item"
                                onClick={() => {
                                    console.log("Plan clicked:", p); 
                                    handlePlanClick(p); 
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                {p.name} - ${p.price}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Loading plans...</p>
                )}
            </Modal>
        </div>
    );
};

const Ad = ({ ad, handlePayment }) => {
    return (
        <div className="ad">
            <img src={ad.imageUrl} alt={ad.productName} />
            <h3>{ad.productName}</h3>
            <p>Type: {ad.productType}</p>
            <p>{ad.description}</p>
            <p>Price: {ad.price} VND</p>
            <p>Contact: {ad.contactInfo}</p>
            <p>Status: {ad.status}</p>
            <button onClick={() => handlePayment(ad.adId)}>Choose Plan</button>
        </div>
    );
};

export default User;