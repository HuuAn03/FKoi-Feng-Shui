import React, { useEffect, useState } from "react";
import { Button, Result } from "antd";
import api from "../../config/axios";
import { useLocation, useNavigate } from "react-router-dom";


function SuccessPage() {
    const location = useLocation();
    const [message, setMessage] = useState([]);
    const [redirectUrl, setRedirectUrl] = useState([]);
    const [adId1, setAdId1] = useState(null);
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
            setAdId1(response.data.adId);
        } catch (e) {
            console.log(e);
        }
    };


    const handleFinalApproval = async () => {
        if (adId1) {
            try {
                const response = await api.put(`/ads/${adId1}/approval`);
                console.log(response.data);
                navigate(redirectUrl);
            } catch (e) {
                console.log(e);
            }
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
                subTitle=" "
                extra={[
                    <Button type="primary" key="approve" onClick={handleFinalApproval}>
                        Public quảng cáo đó
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
