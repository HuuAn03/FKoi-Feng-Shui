import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker } from 'antd';
import api from "../../config/axios";
import Modal from './Modal';
import './user.css';
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Blog from "./blog";
import UserBlogs from "./blog-manager";

const User = () => {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [plan, setPlan] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [renewModalVisible, setRenewModalVisible] = useState(false);
    const [transactionModalVisible, setTransactionModalVisible] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [selectedAdId, setSelectedAdId] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [transactionPage, setTransactionPage] = useState(0);
    const [transactionTotalPages, setTransactionTotalPages] = useState(0);
    const [page, setPage] = useState(parseInt(localStorage.getItem("page") || 0));
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [showUserBlogs, setShowUserBlogs] = useState(false);

    const [userInfo, setUserInfo] = useState({
        fullName: "",
        phoneNumber: "",
        birthdate: null,
        gender: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            fetchUserProfile();
            fetchPublishedAds();
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            fetchUserProfile();
            fetchPublishedAds();
        }
    }, [navigate]);

    const fetchPublishedAds = async (pageNumber = page, pageSize = 8) => {
        try {
            const response = await api.get(`ads/my?page=${pageNumber}&size=${pageSize}`);
            setAds(Array.isArray(response.data.ads) ? response.data.ads : []);
            setTotalPages(response.data.totalPages);
        } catch (e) {
            console.log("Error fetching ads: ", e);
            setAds([]);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            const nextPage = page + 1;
            setPage(nextPage);
            localStorage.setItem("page", nextPage);
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            const prevPage = page - 1;
            setPage(prevPage);
            localStorage.setItem("page", prevPage);
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
        fetchPublishedAds(page);
    }, [page]);

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

    const handleRenewAd = (adId) => {
        setSelectedAdId(adId);
        setRenewModalVisible(true);
    };

    const confirmRenewal = async () => {
        if (!selectedAdId) return;
        try {
            const response = await api.put(`/ads/${selectedAdId}/renew`);
            window.location.href = response.data;
            setRenewModalVisible(false);
        } catch (error) {
            console.error("Error renewing ad:", error);
            setRenewModalVisible(false);
        }
    };

    const fetchTransactions = async (transactionPageNumber = transactionPage) => {
        try {
            const response = await api.get(`transactions/my?page=${transactionPageNumber}&size=5`);
            setTransactions(response.data.transactions);
            setTransactionTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const handleTransactionNextPage = () => {
        if (transactionPage < transactionTotalPages - 1) {
            setTransactionPage(transactionPage + 1);
            fetchTransactions(transactionPage + 1);
        }
    };

    const handleTransactionPreviousPage = () => {
        if (transactionPage > 0) {
            setTransactionPage(transactionPage - 1);
            fetchTransactions(transactionPage - 1);
        }
    };

    return (
        <div className="user-container">
            {/* Custom Sidebar */}
            <div className="custom-sidebar">
                <button onClick={() => {
                    setShowProfileForm(true);
                    setShowBlogForm(false);
                    setShowUserBlogs(false); // Hide User Blogs when other options are selected
                    fetchUserProfile();
                }} className="sidebar-btn">
                    Personal Information
                </button>
                <button onClick={() => {
                    setShowProfileForm(false);
                    setShowBlogForm(false);
                    setShowUserBlogs(false); // Hide User Blogs
                }} className="sidebar-btn">Advertisement</button>
                <button onClick={() => {
                    setShowProfileForm(false);
                    setShowBlogForm(true);
                    setShowUserBlogs(false); // Hide User Blogs
                }} className="sidebar-btn">
                    Post Blog
                </button>
                <button onClick={() => {
                    setShowProfileForm(false);
                    setShowBlogForm(false);
                    setShowUserBlogs(true); // Show User Blogs
                }} className="sidebar-btn">
                    My Blog
                </button>
                <button onClick={() => {
                    setTransactionModalVisible(true);
                    fetchTransactions();
                }} className="sidebar-btn">
                    View Transaction History
                </button>
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
                ) : showBlogForm ? (
                    <Blog />  // Render Blog form component
                ) : showUserBlogs ? (
                    <UserBlogs />  // Render UserBlogs component
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
                                        <td className="image-cell"><img src={ad.imageUrl} alt={ad.productName} className="ad-image" /></td>
                                        <td>{ad.productName}</td>
                                        <td>{ad.description}</td>
                                        <td>{ad.status}</td>
                                        <td>{ad.contactInfo}</td>
                                        <td>{ad.price.toLocaleString()} VND</td>
                                        <td>
                                            {ad.status === 'APPROVED' && (
                                                <button className="choose-plan" onClick={() => handlePayment(ad.adId)}>Choose Plan</button>
                                            )}
                                            {ad.status === 'QUEUED_FOR_POST' && (
                                                <button className="post-ad" onClick={() => handleFinalApproval(ad.adId)}>Post Ad</button>
                                            )}
                                            {ad.status === 'EXPIRED' && (
                                                <button className="renew" onClick={() => handleRenewAd(ad.adId)}>Renew</button>
                                            )}
                                            {ad.status === 'EXPIRED' && (
                                                <button className="renew" onClick={() => handleRenewAd(ad.adId)}>Repay</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                <div className="pagination">
                                    <button onClick={handlePreviousPage} disabled={page === 0}>
                                        Previous
                                    </button>
                                    <span>Page {page + 1} of {totalPages}</span>
                                    <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                                        Next
                                    </button>
                                </div>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Transaction History Modal */}
            {transactionModalVisible && (
                <Modal show={transactionModalVisible} onClose={() => setTransactionModalVisible(false)}>
                    <h3>Transaction History</h3>
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Plan Name</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((transaction, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="tooltip">
                                                {transaction.transactionId || 'N/A'}
                                                <span className="tooltip-text">Transaction ID</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="tooltip">
                                                {transaction.userName || 'N/A'}
                                                <span className="tooltip-text">User Name</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="tooltip">
                                                {transaction.amount ? transaction.amount.toLocaleString() : '0'}
                                                <span className="tooltip-text">Amount - VND</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="tooltip">
                                                {transaction.planName || 'N/A'}
                                                <span className="tooltip-text">Plan</span>
                                            </div>
                                        </td>
                                        <td>{transaction.transactionDate ? moment(transaction.transactionDate).format("DD/MM/YYYY") : 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button onClick={handleTransactionPreviousPage} disabled={transactionPage === 0}>
                            Previous
                        </button>
                        <span>Page {transactionPage + 1} of {transactionTotalPages}</span>
                        <button onClick={handleTransactionNextPage} disabled={transactionPage === transactionTotalPages - 1}>
                            Next
                        </button>
                    </div>
                </Modal>
            )}

            {/* Plan Selection Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="modal-container">
                    <div className="modal-left">
                        <h3>Selected Plan Details</h3>
                        {selectedPlan ? (
                            <div className="plan-details">
                                <p>Duration: {selectedPlan.duration}</p>
                                <p>Priority: {selectedPlan.adPlacementPriority}</p>
                                <p>Price: {selectedPlan.price.toLocaleString()} VND</p>
                                <p>Description: {selectedPlan.description}</p>
                            </div>
                        ) : (
                            <p>Please select a plan from the list.</p>
                        )}
                    </div>
                    <div className="modal-right">
                        <h3>Choose Plan</h3>
                        <ul>
                            {plan.map((item, index) => (
                                <li
                                    key={item.planId}
                                    onClick={() => handlePlanClick(item)}
                                    className={`plan-item ${selectedPlan?.planId === item.planId ? 'selected' : ''}`}
                                >
                                    {item.planName} - {item.price} VND
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <button onClick={handleConfirmClick} className="modal-button modal-button-confirm">Confirm</button>
                {showConfirmation && (
                    <div>
                        <p>Are you sure you want to subscribe to this plan?</p>
                        <button onClick={handleFinalConfirm} className="modal-button modal-button-confirm">Yes, Subscribe</button>
                        <button onClick={() => setShowConfirmation(false)} className="modal-button modal-button-cancel">Cancel</button>
                    </div>
                )}
            </Modal>

            {/* Renewal Confirmation Modal */}
            {renewModalVisible && (
                <Modal show={renewModalVisible} onClose={() => setRenewModalVisible(false)}>
                    <h3>Confirm Renewal</h3>
                    <p>Are you sure you want to renew this ad?</p>
                    <button className="modal-button modal-button-confirm" onClick={confirmRenewal}>Yes, Pay for it</button>
                    <button className="modal-button modal-button-cancel" onClick={() => setRenewModalVisible(false)}>Cancel</button>
                </Modal>
            )}
        </div>
    );
};

export default User;