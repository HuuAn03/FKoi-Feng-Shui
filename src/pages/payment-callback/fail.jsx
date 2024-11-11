import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function FailPage() {
    const navigate = useNavigate();

    const handleRetry = () => {
        navigate("/user"); 
    };

    const handleBackToHome = () => {
        navigate("/");
    };

    return (
        <div>
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
        </div>
    );
}

export default FailPage;
