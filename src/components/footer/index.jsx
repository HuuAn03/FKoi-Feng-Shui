import { Layout, Button } from "antd";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { EnvironmentOutlined, FacebookOutlined, TwitterOutlined, InstagramOutlined } from "@ant-design/icons";
import "./footer.css";

const { Footer } = Layout;
const position = [10.841369959018065, 106.80988299999999];

// Custom icon for marker
const companyIcon = new L.Icon({
  iconUrl: "https://img.freepik.com/premium-vector/vector-illustration-koi-fish-with-beautiful-colors-minimalist-flat-style_1287411-59.jpg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const AppFooter = () => {
  const handleOpenGoogleMap = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=Lô+E2a-7,+Đường+D1,+Đ.+D1,+Long+Thạnh+Mỹ,+Thành+Phố+Thủ+Đức,+Hồ+Chí+Minh+700000,+Việt+Nam`,
      "_blank"
    );
  };

  return (
    <Footer className="footer-container">
      {/* Left Column: Contact Information */}
      <div className="contact-info">
        <h5>Contact Us</h5>
        <p>Email: contact@myapp.com</p>
        <p>Phone: +1 (555) 123-4567</p>
        <p>Address: Lot E2a-7, D1 Street, Long Thanh My, Thu Duc City</p>
        <div className="social-icons">
          <a href="https://www.facebook.com/hieuphihihihihi/" target="_blank" rel="noopener noreferrer">
            <FacebookOutlined className="social-icon" />
          </a>
          <a href="https://twitter.com/your_twitter_profile" target="_blank" rel="noopener noreferrer">
            <TwitterOutlined className="social-icon" />
          </a>
          <a href="https://www.instagram.com/hieuphinehehe/" target="_blank" rel="noopener noreferrer">
            <InstagramOutlined className="social-icon" />
          </a>
        </div>

      </div>

      {/* Center Column: Quick Links */}
      <div className="quick-links">
        <h5>Quick Links</h5>
        <ul>
          <li><a href="/#">About Us</a></li>
          <li><a href="/#">FAQ</a></li>
          <li><a href="/#">Terms of Service</a></li>
          <li><a href="/#">Privacy Policy</a></li>
        </ul>
      </div>

      {/* Right Column: Map Section */}
      <div className="map-container">
        <div className="map-title">
          <EnvironmentOutlined className="map-title-icon" />
          <span>Our Location</span>
        </div>
        <MapContainer
          center={position}
          zoom={17}
          maxZoom={20}
          style={{ height: "250px", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={companyIcon}>
            <Popup>
              <strong>GenKiKoi</strong>
            </Popup>
          </Marker>
        </MapContainer>
        <Button
          className="map-button"
          onClick={handleOpenGoogleMap}
        >
          View Larger Map
        </Button>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-3 footer-bottom-text" style={{ width: "100%" }}>
        ©2024 Created by MyApp
      </div>
    </Footer>
  );
};

export default AppFooter;
