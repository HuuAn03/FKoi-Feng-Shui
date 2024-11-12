import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import { PieChartOutlined, HomeOutlined, LogoutOutlined } from "@ant-design/icons";
const { Content, Sider } = Layout;

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label: <Link to={`/dashboard/${key}`}>{label}</Link>,
  };
}

const items = [
  getItem("Statistic", "store", <PieChartOutlined />),
  getItem("Blog", "service-group", <PieChartOutlined />),
  getItem("Advertisment", "manage-product", <PieChartOutlined />),
  getItem("Users", "manage-users", <PieChartOutlined />),
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
          <div style={{ padding: "16px", display: "flex", flexDirection: "row", gap: "8px" }}>
            <Button
              type="primary"
              icon={<HomeOutlined />}
              onClick={goToHomePage}
              style={{
                background: "#1890ff",
                borderColor: "#1890ff",
              }}
            />

            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                background: "#ff4d4f",
                borderColor: "#ff4d4f",
              }}
            />
          </div>

          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} style={{ flexGrow: 1 }} />
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
