import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker } from 'antd';
import api from "../../config/axios";
import Modal from './Modal';
import './user.css';
import { toast } from "react-toastify";
import moment from "moment";

const User = () => {
    const [ads, setAds] = useState([]);
    const [plan, setPlan] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [renewModalVisible, setRenewModalVisible] = useState(false);
    const [renewUrl, setRenewUrl] = useState(null);
    const [selectedAdId, setSelectedAdId] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(false);

    const [userInfo, setUserInfo] = useState({
        fullName: "",
        phoneNumber: "",
        birthdate: null,
        gender: "",
    });

    const fetchPublishedAds = async () => {
        try {
            const response = await api.get("ads/my");
            setAds(Array.isArray(response.data.ads) ? response.data.ads : []);
        } catch (e) {
            console.log("Error fetching ads: ", e);
            setAds([]);
        }
    };
    const fetchUserProfile = async () => {
        try {
            const accountId = localStorage.getItem("accountId");
            const response = await api.get(`/user/${accountId}/profile`);
            const profileData = response.data;
            setUserInfo({
                fullName: profileData.fullName || "",
                phoneNumber: profileData.phoneNumber || "",
                birthdate: profileData.birthdate ? moment(profileData.birthdate) : null,
                gender: profileData.gender || "",
            });
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const updateUserInfo = async (userData) => {
        try {
            const accountId = localStorage.getItem("accountId");
            const token = localStorage.getItem("token");
            const response = await api.put(`/user/${accountId}`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserInfo(response.data);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving user information:", error);
        }
    };

    const handleUserSubmit = async () => {
        const userData = {
            ...userInfo,
            birthdate: userInfo.birthdate ? userInfo.birthdate.format("YYYY-MM-DD") : null,
        };
        await updateUserInfo(userData);
    };

    const handleInputChange = (field, value) => {
        setUserInfo((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    useEffect(() => {
        fetchPublishedAds();
    }, []);

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
            console.error("Error subscribing to plan:", error.response ? error.response.data : error.message);
        }
    };
    const handleFinalApproval = async (adId) => {
        if (adId) {
            try {
                const response = await api.put(`/ads/${adId}/approval`);
                console.log(response.data);
                window.location.reload();
            } catch (e) {
                console.log(e);
            }
        }
    };

    const handleRenewAd = async (adId) => {
        try {
            const response = await api.put(`/ads/${adId}/renew`);
            setRenewUrl(response.data); 
            setRenewModalVisible(true); 
        } catch (e) {
            console.error("Error renewing ad:", e);
        }
    };

    const confirmRenewal = () => {
        if (renewUrl) {
            window.location.href = renewUrl; 
        }
        setRenewModalVisible(false); 
    };

    return (
        <div className="user-container">
            {/* Custom Sidebar */}
            <div className="custom-sidebar">
                <button onClick={() => {
                    setShowProfileForm(true);
                    fetchUserProfile();
                }} className="sidebar-btn">
                    Personal Information
                </button>
                <button onClick={() => setShowProfileForm(false)} className="sidebar-btn">Advertisement</button>
            </div>

            {/* Main Content */}
            <div className="content">
                {showProfileForm ? (
                    <Form
                        name="userForm"
                        labelCol={{ span: 24 }}
                        onFinish={handleUserSubmit}
                        initialValues={userInfo}
                    >
                        <h3>Personal Information</h3>
                        <Form.Item
                            name="fullName"
                            rules={[{ required: true, message: "Please input your full name!" }]}
                        >
                            <Input
                                placeholder="Full Name"
                                className="form-style"
                                value={userInfo.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item
                            name="phoneNumber"
                            rules={[{ required: true, message: "Please input your phone number!" }]}
                        >
                            <Input
                                placeholder="Phone Number"
                                className="form-style"
                                value={userInfo.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item
                            name="birthdate"
                            rules={[{ required: true, message: "Please input your birthdate!" }]}
                        >
                            <DatePicker
                                placeholder="Birthdate"
                                className="form-style"
                                value={userInfo.birthdate}
                                onChange={(date) => handleInputChange('birthdate', date)}
                            />
                        </Form.Item>
                        <Form.Item
                            name="gender"
                            rules={[{ required: true, message: "Please select your gender!" }]}
                        >
                            <Select
                                className="ads-select"
                                placeholder="Select gender"
                                value={userInfo.gender}
                                options={[
                                    { value: 'MALE', label: 'Male' },
                                    { value: 'FEMALE', label: 'Female' },
                                    { value: 'OTHER', label: 'Other' },
                                ]}
                                onChange={(value) => handleInputChange('gender', value)}
                            />
                        </Form.Item>
                        <button type="submit" className="form-submit-btn">Submit</button>
                    </Form>
                ) : (
                    <div className="ad-list-container">
                        <table className="ad-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Contact</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ads.map((ad) => (
                                    <tr key={ad.adId} className="ad-row">
                                        <td><img src={ad.imageUrl} alt={ad.productName} className="ad-image" /></td>
                                        <td>{ad.productName}</td>
                                        <td>{ad.description}</td>
                                        <td>{ad.status}</td>
                                        <td>{ad.contactInfo}</td>
                                        <td>{ad.price} VND</td>                               
                                        <td>
                                            {ad.status === 'APPROVED' && (
                                                <button onClick={() => handlePayment(ad.adId)}>Choose Plan</button>
                                            )}
                                            {ad.status === 'QUEUED_FOR_POST' && (
                                                <button onClick={() => handleFinalApproval(ad.adId)}>Post Ad</button>
                                            )}
                                            {ad.status === 'EXPIRED' && (
                                                <button onClick={() => handleRenewAd(ad.adId)}>Renew</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Plan Selection Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="modal-left">
                    <h3>Selected Plan Details</h3>
                    {selectedPlan ? (
                        <div className="plan-details">
                            <p>Name: {selectedPlan.name}</p>
                            <p>Price: {selectedPlan.price}</p>
                            <p>Features: {selectedPlan.features}</p>
                        </div>
                    ) : (
                        <p>Please select a plan from the list.</p>
                    )}
                </div>
                <div className="modal-right">
                    <h3>Choose Plan</h3>
                    <ul>
                        {plan.map((item) => (
                            <li key={item.planId} onClick={() => handlePlanClick(item)}>
                                {item.name} - {item.price} VND
                            </li>
                        ))}
                    </ul>
                </div>
                <button onClick={handleConfirmClick}>Confirm</button>
                {showConfirmation && (
                    <div>
                        <p>Are you sure you want to subscribe to this plan?</p>
                        <button onClick={handleFinalConfirm}>Yes, Subscribe</button>
                        <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                    </div>
                )}
            </Modal>

            {/* Renewal Confirmation Modal */}
            {renewModalVisible && (
                <Modal show={renewModalVisible} onClose={() => setRenewModalVisible(false)}>
                    <h3>Confirm Renewal</h3>
                    <p>Are you sure you want to renew this ad?</p>
                    <button onClick={confirmRenewal}>Yes, Renew</button>
                    <button onClick={() => setRenewModalVisible(false)}>Cancel</button>
                </Modal>
            )}
        </div>
    );
};

export default User;
