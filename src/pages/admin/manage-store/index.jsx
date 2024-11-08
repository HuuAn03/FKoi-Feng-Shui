import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { Table } from "antd";
import api from "../../../config/axios";

const ManageStore = () => {
  const [dashboardStats, setDashboardStats] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("dashboard/stats");
        console.log("Fetched data:", response.data);
        setDashboardStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };
    fetchDashboardStats();
  }, []);

  if (!dashboardStats) return <div>Loading...</div>;

  const planPopularityData = Object.entries(dashboardStats.planPopularityPercentage || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const transactionStatusData = [
    { name: "Successful", value: dashboardStats.successfulTransactions || 0 },
    { name: "Failed", value: dashboardStats.failedTransactions || 0 },
  ];

  const monthlyRevenueData = Object.entries(dashboardStats.monthlyRevenue || {}).map(([month, revenue]) => ({
    month: `Month ${month}`,
    revenue,
  }));

  const topUsersColumns = [
    { title: "User ID", dataIndex: "user", key: "user",align: 'left'  },
    { title: "Full Name", dataIndex: "fullName", key: "fullName",align: 'left'  },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" ,align: 'left'},
    { title: "Birthdate", dataIndex: "birthdate", key: "birthdate",align: 'left' },
    { title: "Gender", dataIndex: "gender", key: "gender",align: 'left' },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      
        <div style={{ padding: 24, background: "#fff" }}>
          <h2>Statistics</h2>
          <p>Total Customers: {dashboardStats.totalCustomer}</p>
          <p>Total Ads: {dashboardStats.totalAds}</p>
          <p>Total Revenue: {dashboardStats.totalRevenue}</p>

          <h2>Monthly Revenue</h2>
          <BarChart width={600} height={300} data={monthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#82ca9d" />
          </BarChart>

          <h2>Advertising Packages Popularity</h2>
          <PieChart width={400} height={300}>
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
                <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          <h2>Payment Rate</h2>
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

          <h2>Top Users</h2>
          <Table columns={topUsersColumns} dataSource={dashboardStats.topSpendingUsers} rowKey="user" pagination={false} />
        </div>
      </div>

  );
};

export default ManageStore;
