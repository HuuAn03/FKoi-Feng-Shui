import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { Table, Card, Col, Row } from "antd";
import { UserOutlined, DollarCircleOutlined, ShopOutlined } from "@ant-design/icons";
import { TrophyFilled } from "@ant-design/icons";
import api from "../../../config/axios";

const ManageStore = () => {
  const [dashboardStats, setDashboardStats] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("dashboard/stats");
        setDashboardStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };
    fetchDashboardStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!dashboardStats) return <div>Loading...</div>;

  const statCards = [
    {
      title: "Total Customers",
      value: dashboardStats.totalCustomer,
      icon: <UserOutlined style={{ fontSize: "2rem", color: "#1890ff" }} />,
    },
    {
      title: "Total Ads",
      value: dashboardStats.totalAds,
      icon: <ShopOutlined style={{ fontSize: "2rem", color: "#52c41a" }} />,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardStats.totalRevenue || 0),
      icon: <DollarCircleOutlined style={{ fontSize: "2rem", color: "#faad14" }} />,
    },
  ];

  const monthlyRevenueData = Object.entries(dashboardStats.monthlyRevenue || {}).map(([month, revenue]) => ({
    month: `Month ${month}`,
    revenue: parseInt(revenue, 10),
  }));

  const planPopularityData = Object.entries(dashboardStats.planPopularityPercentage || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const transactionStatusData = [
    { name: "Successful", value: dashboardStats.successfulTransactions || 0 },
    { name: "Failed", value: dashboardStats.failedTransactions || 0 },
  ];

  const topUsersData = (dashboardStats.topSpendingUsers || []).map(({ totalSpent, user }, index) => ({
    rank: index + 1,
    user: user.user,
    fullName: user.fullName || "N/A",
    phoneNumber: user.phoneNumber || "N/A",
    birthdate: user.birthdate || "N/A",
    gender: user.gender || "N/A",
    spending: formatCurrency(totalSpent || 0),
  }));

  const topUsersColumns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      align: "center",
      render: (rank) => {
        if (rank === 1) {
          return <TrophyFilled style={{ color: "#FFD700", fontSize: "1.5rem" }} />; // Gold
        } else if (rank === 2) {
          return <TrophyFilled style={{ color: "#C0C0C0", fontSize: "1.5rem" }} />; // Silver
        } else if (rank === 3) {
          return <TrophyFilled style={{ color: "#CD7F32", fontSize: "1.5rem" }} />; // Bronze
        }
        return rank;
      },
    },
    { title: "User ID", dataIndex: "user", key: "user", align: "left" },
    { title: "Full Name", dataIndex: "fullName", key: "fullName", align: "left" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber", align: "left" },
    { title: "Birthdate", dataIndex: "birthdate", key: "birthdate", align: "left" },
    { title: "Gender", dataIndex: "gender", key: "gender", align: "left" },
    { title: "Spending", dataIndex: "spending", key: "spending", align: "left" },
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "24px", background: "#f0f2f5" }}>
      <h2 style={{ marginBottom: "24px", textAlign: "center" }}>Statistics Overview</h2>
      
      <Row gutter={16} style={{ marginBottom: "32px" }}>
        {statCards.map((stat, index) => (
          <Col span={8} key={index}>
            <Card
              hoverable
              bordered={false}
              style={{
                textAlign: "center",
                borderRadius: "8px",
                background: "#ffffff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            >
              {stat.icon}
              <h3 style={{ marginTop: "16px", fontWeight: "bold" }}>{stat.value}</h3>
              <p>{stat.title}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <h2 style={{ textAlign: "center", marginBottom: "32px" }}>Monthly Revenue</h2>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <BarChart width={600} height={300} data={monthlyRevenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="revenue" name="Revenue (VND)" fill="#82ca9d" />
        </BarChart>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "32px" }}>Advertising Packages Popularity</h2>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <PieChart width={500} height={300}>
          <Pie
            data={planPopularityData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {planPopularityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#cb92c3", "#75b6d1"][index % 6]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "32px" }}>Payment Rate</h2>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <PieChart width={400} height={300}>
          <Pie
            data={transactionStatusData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#82ca9d"
            dataKey="value"
          >
            {transactionStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={["#00C49F", "#FF8042"][index % 2]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "32px" }}>Top Users</h2>
      <Table columns={topUsersColumns} dataSource={topUsersData} rowKey="user" pagination={false} />
    </div>
  );
};

export default ManageStore;
