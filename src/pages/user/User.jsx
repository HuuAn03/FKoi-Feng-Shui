import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import Modal from './Modal';


const User = () => {
    const [ads, setAds] = useState([]);
    const [plan, setPlan] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAdId, setSelectedAdId] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);


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
            console.log("Plans received:", choosePlan.data);
            setPlan(choosePlan.data);
            setSelectedAdId(adId);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    };


    const handlePlanClick = (plan) => {
        setSelectedPlan(plan);
    };


    const handleConfirmClick = () => {
        setShowConfirmation(true);
    };


    const handleFinalConfirm = async () => {
        if (!selectedAdId || !selectedPlan) {
            console.error("Ad ID or Plan ID is missing!");
            return;
        }


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
            setShowConfirmation(false);
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
                <div className="modal-left">
                    <h3>Selected Plan Details</h3>
                    {selectedPlan ? (
                        <div className="plan-details">
                            <p>Name: {selectedPlan.name}</p>
                            <p>Price: ${selectedPlan.price}</p>
                            <p>Description: {selectedPlan.description}</p>
                            <button onClick={handleConfirmClick}>Confirm</button>
                            {showConfirmation && (
                                <div className="confirmation-message">
                                    <p>Are you sure you want to confirm this plan?</p>
                                    <button onClick={handleFinalConfirm}>Yes, Confirm</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Please select a plan.</p>
                    )}
                </div>


                <div className="modal-right">
                    <h3>Available Plans</h3>
                    <ul>
                        {plan.map((p) => (
                            <li
                                key={p.planId}
                                className={`plan-item ${selectedPlan && selectedPlan.planId === p.planId ? 'selected' : ''}`}
                                onClick={() => handlePlanClick(p)}
                            >
                                {p.name} - ${p.price}
                            </li>
                        ))}
                    </ul>
                </div>
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
