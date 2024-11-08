import React, { useState } from "react";
import { Form, Button, DatePicker, Typography, Card, Spin, Table } from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { motion } from "framer-motion";
import "./Destiny.css";


const { Title, Paragraph } = Typography;


const Destiny = () => {
  const [loading, setLoading] = useState(false);
  const [fate, setFateType] = useState(null);
  const [consultLoading, setConsultLoading] = useState(false);
  const [consultData, setConsultData] = useState(null);


  const calculateFate = async (values) => {
    try {
      setLoading(true);
      const birthdate = values.birthdate.format("YYYY-MM-DD");
      const response = await api.get(`fate/calculate?birthdate=${birthdate}`);
      const fateResponse = {
        fateId: response.data.fateId,
        fateType: response.data.fateType,
        description: response.data.description,
        compatibleColors: response.data.compatibleColors,
        incompatibleColors: response.data.incompatibleColors,
      };


      setFateType(fateResponse);
    } catch (error) {
      toast.error("Failed to calculate fate");
    } finally {
      setLoading(false);
    }
  };


  const handleConsult = async () => {
    try {
      setConsultLoading(true);
      const response = await api.get(`/consultations?fate=${fate.fateType}`);
      setConsultData(response.data);
    } catch (error) {
      toast.error(error.response?.data || "Failed to fetch consultation data");
    } finally {
      setConsultLoading(false);
    }
  };


  const renderColors = (colors) => {
    return colors.map((color, index) => (
      <span
        key={index}
        style={{
          backgroundColor: color.toLowerCase(),
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          margin: "2px",
        }}
      >
        {color}
      </span>
    ));
  };


  const renderKoiTable = () => {
    if (!consultData || !consultData.koiRecommendations || consultData.koiRecommendations.length === 0) {
      return null;
    }
 
    const koiColumns = [
      {
        title: "Image",
        dataIndex: "image",
        key: "image",
        render: (imageUrl) => (
          <img src={imageUrl} alt="Koi" style={{ width: 200, height: 200, borderRadius: "10px" }} />
        ),
        width: 250,
        align: "center",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 150,
        align: "center",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 500,
        align: "center",
      },
      {
        title: "Market Price",
        dataIndex: "price",
        key: "price",
        render: (text) => `${text} VND`,
        width: 150,
        align: "right",
      },
      {
        title: "Compatibility Rate",
        dataIndex: "compatibilityRate",
        key: "compatibilityRate",
        render: (rate) => (
          <div
            className="compatibility-circle"
            style={{ "--percentage": `${rate}%` }}
          >
            <span>{rate}%</span>
          </div>
        ),
        width: 150,
        align: "center",
      }      
    ];
 
    const koiDataSource = consultData.koiRecommendations.map((koi) => ({
      key: koi.koi.koiId,
      image: koi.koi.imageUrl,
      name: koi.koi.species,
      description: koi.koi.description,
      size: koi.recommendSize,
      price: koi.koi.marketValue,
      compatibilityRate: koi.compatibilityRate,
    }));
 
    return (
      <Table
        dataSource={koiDataSource}
        columns={koiColumns}
        pagination={false}
        rowKey="key"
        title={() => <Title level={4} className="table-title">Koi Recommendations</Title>}
        className="table-cell-content"
        style={{ marginTop: 20 }}
      />
    );
  };
 
  const renderPondTable = () => {
    if (!consultData || !consultData.pondRecommendations || consultData.pondRecommendations.length === 0) {
      return null;
    }
 
    const pondColumns = [
      {
        title: "Placement",
        dataIndex: "placement",
        key: "placement",
        width: 150,
        align: "center",
      },
      {
        title: "Direction",
        dataIndex: "direction",
        key: "direction",
        width: 150,
        align: "center",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 500,
        align: "center",
      },
      {
        title: "Compatibility Rate",
        dataIndex: "compatibilityRate",
        key: "compatibilityRate",
        render: (rate) => (
          <div
            className="compatibility-circle"
            style={{ "--percentage": `${rate}%` }}
          >
            <span>{rate}%</span>
          </div>
        ),
        width: 150,
        align: "center",
      }      
    ];
 
    const pondDataSource = consultData.pondRecommendations.map((pond) => ({
      key: pond.pond.pondFeatureId,
      placement: pond.pond.placement,
      direction: pond.pond.direction,
      description: pond.pond.description,
      compatibilityRate: pond.compatibilityRate,
    }));
 
    return (
      <Table
        dataSource={pondDataSource}
        columns={pondColumns}
        pagination={false}
        rowKey="key"
        title={() => <Title level={4} className="table-title">Pond Recommendations</Title>}
        className="table-cell-content"
        style={{ marginTop: 20 }}
      />
    );
  };
 


  const renderProductTable = () => {
    if (!consultData || !consultData.productRecommendations || consultData.productRecommendations.length === 0) {
      return null;
    }


    const productColumns = [
      {
        title: "Image",
        dataIndex: "image",
        key: "image",
        render: (imageUrl) => <img src={imageUrl} alt="Product" style={{ width: 50, height: 50 }} />,
        width: 100,
        align: "center",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 150,
        align: "center",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 500,
        align: "center",
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        render: (text) => `${text} VND`,
        width: 150,
        align: "right",
      },
    ];


    const productDataSource = consultData.productRecommendations.map((product) => ({
      key: product.product.productId,
      image: product.product.imageUrl,
      name: product.product.name,
      description: product.product.description,
      price: product.product.price,
    }));


    return (
      <Table
        dataSource={productDataSource}
        columns={productColumns}
        pagination={false}
        rowKey="key"
        title={() => <Title level={4} className="table-title">Product Recommendations</Title>}
        className="table-cell-content"
        style={{ marginTop: 20 }}
      />
    );
  };


  return (
    <div className="auth-template">
      <div className="form-container">
        <Card className="input-card">
          <Title level={2} style={{ textAlign: "center" }}>Nhập Thông Tin Cá Nhân</Title>
          <Form onFinish={calculateFate} layout="vertical">
            <Form.Item name="birthdate" rules={[{ required: true, message: "Please select your birthdate!" }]}>
              <DatePicker placeholder="Select Birthdate" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="submit-button" loading={loading}>
                {loading ? <Spin size="small" /> : "Tính Mệnh"}
              </Button>
            </Form.Item>
          </Form>
        </Card>


        <Card className="result-card">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={fate ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center" }}
          >
            {fate && (
              <div className="transparent-container">
                <Title level={3}>Kết quả:</Title>
                <Paragraph>Mệnh của bạn là: <strong>{fate.fateType}</strong></Paragraph>
                <Paragraph>{fate.description}</Paragraph>
                <Paragraph>Hợp màu: {renderColors(fate.compatibleColors)}</Paragraph>
                <Paragraph>Không hợp màu: {renderColors(fate.incompatibleColors)}</Paragraph>
                <Button type="default" className="consult-button" onClick={handleConsult} loading={consultLoading}>
                  Consult Item
                </Button>
              </div>
            )}
          </motion.div>
        </Card>
      </div>
      {renderProductTable()}
      {renderKoiTable()}
      {renderPondTable()}
    </div>
  );
};

export default Destiny;



