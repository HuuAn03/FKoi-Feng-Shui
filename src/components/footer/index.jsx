import { Layout } from "antd";

const { Footer } = Layout;

const COPYRIGHT_TEXT = "©2024 Created by MyApp";
const FOOTER_STYLE = {
  textAlign: "center",
  backgroundColor: "#f0f2f5", // Optional: To match Ant Design default background color
  padding: "20px 50px",
};

const AppFooter = () => {
  return <Footer style={FOOTER_STYLE}>{COPYRIGHT_TEXT}</Footer>;
};

export default AppFooter;