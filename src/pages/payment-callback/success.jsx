import React, { useEffect, useState } from "react";
import { Button, Result, Spin } from "antd";
import api from "../../config/axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./payment.css";

function PaymentResultPage() {
    const location = useLocation();
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [adId, setAdId] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Added state to manage loading status
    const navigate = useNavigate();

    const postOrderID = async () => {
        const queryParams = new URLSearchParams(location.search);
        const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
        const vnp_TxnRef = queryParams.get("vnp_TxnRef");
        
        try {
            const response = await api.get(`/ads/vn-pay-callback`, {
                params: {
                    vnp_ResponseCode,
                    vnp_TxnRef,
                },
            });
            console.log(response.data);
            setMessage(response.data.message);
            setAdId(response.data.adId);

            // Check for success or failure codes
            if (vnp_ResponseCode === "00") {
                setStatus("success");
            } else if (["01", "02"].includes(vnp_ResponseCode)) {
                setStatus("error");
            } else {
                setStatus("error");
                setMessage("An error occurred while processing the payment.");
            }
        } catch (e) {
            console.log(e);
            setStatus("error");
            setMessage("An error occurred while processing the payment.");
        } finally {
            setIsLoading(false); // Turn off loading status when API results are available
        }
    };

    const handleFinalApproval = async () => {
        if (adId) {
            try {
                await api.put(`/ads/${adId}/approval`);
                navigate("/user");
            } catch (e) {
                console.log(e);
            }
        }
    };

    const handleViewAds = () => {
        if (adId) {
            navigate(`/product/${adId}`);
        }
    };

    const handleRetry = () => {
        navigate("/user");
    };

    const handleBackToHome = () => {
        navigate("/");
    };

    useEffect(() => {
        postOrderID();
    }, []);

    return (
        <div className="payment-result-page">
            {isLoading ? (
                <Spin tip="Processing payment..." size="large" /> // Display loading while waiting for API
            ) : status === "success" ? (
                <Result
                    status="success"
                    title={message}
                    subTitle=" "
                    extra={[
                        <Button type="primary" key="approve" onClick={handleFinalApproval}>
                            Publish Advertisement
                        </Button>,
                        <Button type="primary" key="redirect" onClick={handleViewAds}>
                            View Advertisement
                        </Button>,
                    ]}
                />
            ) : (
                <Result
                    status="error"
                    title="Payment Failed"
                    subTitle="Check your advertisement"
                    extra={[
                        <Button type="primary" key="retry" onClick={handleRetry}>
                            Retry
                        </Button>,
                        <Button key="home" onClick={handleBackToHome}>
                            Back to Home
                        </Button>,
                    ]}
                />
            )}
        </div>
    );
}

export default PaymentResultPage;
