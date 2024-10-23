import React, { useEffect, useState } from "react"; // Thêm useState vào import
import { Button, Result } from "antd";
import api from "../../config/axios";
import { useLocation, useNavigate } from "react-router-dom";

function SuccessPage() {
    const location = useLocation();
    const [message, setMessage] = useState([]);
    const [redirectUrl, setRedirectUrl] = useState([]);
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
            setRedirectUrl(response.data.redirectUrl);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        postOrderID();
    }, []);

    return (
        <div>
            <Result
                status="success"
                title={message}
                subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                extra={[
                    <Button type="primary" key="history" onClick={() => navigate('/order-history')}>
                        Go To Order History
                    </Button>,
                    <Button type="primary" key="redirect" onClick={() => navigate(redirectUrl)}>
                        Xem lại quảng cáo
                    </Button>,
                ]}
            />
        </div>
    );
}

export default SuccessPage;