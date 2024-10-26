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
      toast.success("Thành công! Mệnh của bạn là: " + fateResponse.fateType);
    } catch (error) {
      toast.error(error.response?.data || "Đã xảy ra lỗi khi tính mệnh");
    } finally {
      setLoading(false);
    }
  };

  const handleConsult = async () => {
    try {
      setConsultLoading(true);
      const response = await api.get(`/consultations?fate=${fate.fateType}`);
      setConsultData(response.data);
      toast.success("Consultation data fetched successfully!");
    } catch (error) {
      toast.error(error.response?.data || "Đã xảy ra lỗi khi lấy thông tin tư vấn");
    } finally {
      setConsultLoading(false);
    }
  };
  const renderKoiTable = () => {
    if (!consultData || !consultData.koiRecommendations || consultData.koiRecommendations.length === 0) {
      return null; 
    }

    const koiColumns = [
      {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        render: (imageUrl) => <img src={imageUrl} alt="Koi" style={{ width: 50, height: 50 }} />,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (text) => `${text} VND`,
      },
    ];

    const koiDataSource = consultData.koiRecommendations.map(koi => ({
      key: koi.koi.koiId, 
      image: koi.koi.imageUrl, 
      name: koi.koi.species,
      description: koi.koi.description,
      size: koi.recommendSize, 
      price: koi.koi.marketValue, 
    }));

    return (
      <Table
        dataSource={koiDataSource}
        columns={koiColumns}
        pagination={false}
        rowKey="key" 
        title={() => <Title level={4}>Koi Recommendations</Title>}
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
        title: 'Placement',
        dataIndex: 'placement',
        key: 'placement',
      },
      {
        title: 'Direction',
        dataIndex: 'direction',
        key: 'direction',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
    ];

    const pondDataSource = consultData.pondRecommendations.map(pond => ({
      key: pond.pond.pondFeatureId, 
      placement: pond.pond.placement,
      direction: pond.pond.direction,
      description: pond.pond.description,
    }));

    return (
      <Table
        dataSource={pondDataSource}
        columns={pondColumns}
        pagination={false}
        rowKey="key" 
        title={() => <Title level={4}>Pond Recommendations</Title>}
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
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        render: (imageUrl) => <img src={imageUrl} alt="Product" style={{ width: 50, height: 50 }} />,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (text) => `${text} VND`,
      },
    ];

    const productDataSource = consultData.productRecommendations.map(product => ({
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
        title={() => <Title level={4}>Product Recommendations</Title>}
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
                <Paragraph>Hợp màu: <strong>{fate.compatibleColors}</strong></Paragraph>
                <Paragraph>Hợp không màu: <strong>{fate.incompatibleColors}</strong></Paragraph>
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
