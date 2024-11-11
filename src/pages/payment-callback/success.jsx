import React, { useEffect, useState } from "react";
import { Button, Result } from "antd";
import api from "../../config/axios";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentResultPage() {
    const location = useLocation();
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [adId, setAdId] = useState(null);
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
                setMessage("Có lỗi xảy ra khi xử lý thanh toán.");
            }
        } catch (e) {
            console.log(e);
            setStatus("error");
            setMessage("Có lỗi xảy ra khi xử lý thanh toán.");
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
        <div>
            {status === "success" ? (
                <Result
                    status="success"
                    title={message}
                    subTitle=" "
                    extra={[
                        <Button type="primary" key="approve" onClick={handleFinalApproval}>
                            Public quảng cáo đó
                        </Button>,
                        <Button type="primary" key="redirect" onClick={handleViewAds}>
                            Xem lại quảng cáo
                        </Button>,
                    ]}
                />
            ) : (
                <Result
                    status="error"
                    title="Payment Fail"
                    subTitle="Check your advertisement"
                    extra={[
                        <Button type="primary" key="retry" onClick={handleRetry}>
                            Thử lại
                        </Button>,
                        <Button key="home" onClick={handleBackToHome}>
                            Quay lại trang chủ
                        </Button>,
                    ]}
                />
            )}
        </div>
    );
}
export default PaymentResultPage;
