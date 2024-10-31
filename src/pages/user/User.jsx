import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker } from 'antd';
import api from "../../config/axios";
import Modal from './Modal';
import './user.css';

const User = () => {
    const [ads, setAds] = useState([]);
    const [plan, setPlan] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAdId, setSelectedAdId] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // User info state
    const [userInfo, setUserInfo] = useState({
        fullName: "",
        phoneNumber: "",
        birthdate: "",
        gender: "",
        username: "",  // Thêm trường username
        email: ""      // Thêm trường email
    });

    // Fetch ads data
    const fetchPublishedAds = async () => {
        try {
            const response = await api.get("ads/my");
            setAds(Array.isArray(response.data.ads) ? response.data.ads : []);
        } catch (e) {
            console.log("Error fetching ads: ", e);
            setAds([]);
        }
    };

    // Tách hàm gọi API
    const updateUserInfo = async (userData) => {
        try {
            const accountId = localStorage.getItem("accountId");
            const token = localStorage.getItem("token");
            const response = await api.put(`/api/user/${accountId}`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Update response:", response.data);
            alert("User information saved successfully.");
        } catch (error) {
            console.error("Error saving user information:", error);
        }
    };

    // Handle user form submit
    const handleUserSubmit = async (values) => {
        const userData = {
            fullName: values.fullName,
            phoneNumber: values.phoneNumber,
            birthdate: values.birthdate.format("YYYY-MM-DD"), // Định dạng ngày tháng
            gender: values.gender,
            
        };
        await updateUserInfo(userData); // Gọi hàm cập nhật thông tin người dùng
    };

    useEffect(() => {
        fetchPublishedAds();
    }, []);

    // Handle ad payment logic
    const handlePayment = async (adId) => {
        try {
            const choosePlan = await api.get("/plan");
            setPlan(choosePlan.data);
            setSelectedAdId(adId);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    };

    const handlePlanClick = (plan) => setSelectedPlan(plan);
    const handleConfirmClick = () => setShowConfirmation(true);

    const handleFinalConfirm = async () => {
        if (!selectedAdId || !selectedPlan) {
            console.error("Ad ID or Plan ID is missing!");
            return;
        }

        try {
            const requestBody = {
                adId: selectedAdId,
                planId: selectedPlan.planId,
            };

            const response = await api.post(`/ads/${selectedAdId}/subscription`, requestBody);
            window.location.href = response.data;
            setShowModal(false);
            setShowConfirmation(false);
        } catch (error) {
            console.error("Error subscribing to plan:", error);
        }
    };

    return (
        <div className="user-container">
            <Form
                name="userForm"
                className="auth-form"
                labelCol={{ span: 24 }}
                onFinish={handleUserSubmit}
                initialValues={userInfo}
            >
                <h3>Personal Information</h3>
                <Form.Item
                    name="fullName"
                    rules={[{ required: true, message: "Please input your full name!" }]}
                >
                    <div className="form-group">
                        <span className="input-icon">
                            <i className="uil uil-user"></i>
                        </span>
                        <Input placeholder="Full Name" className="form-style" />
                    </div>
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    rules={[{ required: true, message: "Please input your phone number!" }]}
                >
                    <div className="form-group">
                        <span className="input-icon">
                            <i className="uil uil-phone"></i>
                        </span>
                        <Input placeholder="Phone Number" className="form-style" />
                    </div>
                </Form.Item>

                <Form.Item
                    name="birthdate"
                    rules={[{ required: true, message: "Please input your birthdate!" }]}
                >
                    <div className="form-group">
                        <span className="input-icon">
                            <i className="uil uil-calendar-alt"></i>
                        </span>
                        <DatePicker placeholder="Birthdate" className="form-style" />
                    </div>
                </Form.Item>

                <Form.Item
                    name="gender"
                    rules={[{ required: true, message: "Please select your gender!" }]}
                >
                    <div className="form-group">
                        <span className="input-icon">
                            <i className="uil uil-venus-mars"></i>
                        </span>
                        <Select
                            className="ads-select"
                            placeholder="Select type of product"
                            options={[
                                { value: 'MALE', label: 'Male' },
                                { value: 'FEMALE', label: 'Female' },
                                { value: 'OTHER', label: 'Other' },
                            ]}
                            allowClear
                        />
                    </div>
                </Form.Item>

                <button type="submit" className="form-submit-btn" onClick={handleUserSubmit}>Submit</button>
            </Form>

            <div className="ad-list-container">
                <div className="ad-list">
                    {ads.map((ad) => (
                        <Ad key={ad.adId} ad={ad} handlePayment={handlePayment} />
                    ))}
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="modal-left">
                    <h3>Selected Plan Details</h3>
                    {selectedPlan ? (
                        <div className="plan-details">
                            <p>Name: {selectedPlan.name}</p>
                            <p>Price:{selectedPlan.price}VND</p>
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
                                {p.name} - {p.price}VND
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
