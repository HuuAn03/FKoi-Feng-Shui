import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import { PieChartOutlined } from "@ant-design/icons";
const { Content, Sider } = Layout;

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label: <Link to={`/dashboard/${key}`}>{label}</Link>,
  };
}

const items = [
  getItem("Manage Category", "category", <PieChartOutlined />),
  getItem("Manage Advertisement", "store", <PieChartOutlined />),
  getItem("Manage Blog", "service-group", <PieChartOutlined />),
  getItem("Manage Product", "manage-product", <PieChartOutlined />),
  getItem("Manage Users", "manage-users", <PieChartOutlined />),
];


const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  const goToHomePage = () => {
    navigate("/"); 
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} style={{ flexGrow: 1 }} />
          
          <Button
            type="primary"
            onClick={goToHomePage}
            style={{
              background: "#1890ff",
              borderColor: "#1890ff",
              margin: "16px",
            }}
          >
            Home Page
          </Button>

          <Button
            type="primary"
            onClick={handleLogout}
            style={{
              background: "#ff4d4f",
              borderColor: "#ff4d4f",
              margin: "16px",
            }}
          >
            Logout
          </Button>
        </div>
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            <Outlet />
          </div>
        </Content>    
      </Layout>
    </Layout>
  );
};

export default Dashboard;
