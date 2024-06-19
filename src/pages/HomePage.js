import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminMessage = async () => {
      try {
        const response = await axios.get('https://seeknook-backend-2564a672bd98.herokuapp.com/api/messages/admin-message');
        if (response.data.message) {
          setAdminMessage(response.data.message);
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Error fetching admin message:', error);
      }
    };

    fetchAdminMessage();
  }, []);

  const handleExploreListings = () => {
    navigate('/business-list');
  };

  const handleCreateListing = () => {
    navigate('/login');
  };

  return (
    <div className="homepage-container">
      {showBanner && (
        <div className="alert-container">
          <Alert
            message="Message from Admin"
            description={adminMessage}
            type="info"
            showIcon
            closable
            onClose={() => setShowBanner(false)}
          />
        </div>
      )}
      <header className="header">
        <h1>Welcome to SeekNook</h1>
        <p className="intro-text">
          SeekNook is an innovative online advertisement platform designed to connect community members with local service providers. From tutoring and handyman services to homemade food and dog walking, SeekNook offers a user-friendly and clutter free space where individuals can find trusted, services nearby. Additionally, the platform features advertisements from franchises, offering opportunities for users and service providers interested in starting their own franchise.
        </p>
        <div className="cta-buttons">
          <Button className="cta-button" onClick={handleExploreListings}>Explore Listings</Button>
          <Button className="cta-button" onClick={handleCreateListing}>Create a Listing</Button>
        </div>
      </header>
      <div className="features-section">
        <h2>Why Choose SeekNook?</h2>
        <ul className="features-list">
          <li>
            <strong>Truly Unique Experience:</strong> Our Ad Portal offers a distinctive approach to online advertising, setting us apart from any other platform on the market.
          </li>
          <li>
            <strong>Robust Search Features:</strong>
            <ul>
              <li>Zip Code Searches: Prioritize local businesses to boost community engagement and support.</li>
              <li>Keyword Searches: Easily retrieve the information you need with intuitive keyword functionality.</li>
              <li>Category Searches: Explore a wide range of businesses through broad category filters.</li>
            </ul>
          </li>
          <li>
            <strong>User-Friendly Design:</strong> Enjoy a simple, clutter-free interface that makes navigation a breeze.
          </li>
          <li>
            <strong>Ad-Free and Secure:</strong> Experience a seamless browsing experience without annoying pop-ups or harmful advertisements.
          </li>
          <li>
            <strong>Eye-Catching Display:</strong> Search results are presented in a clear, box format, making it easy on the eyes and providing concise visual information.
          </li>
          <li>
            <strong>Affordable Pricing:</strong> Benefit from our cost-effective yearly pricing, ensuring your advertisement stays longer and reaches more potential customers.
          </li>
          <li>
            <strong>Free and Accessible:</strong> Use our platform for free without needing to log in. Create a profile only if you wish to save your favorite businesses for easy access later.
          </li>
        </ul>
      </div>
      <footer className="footer">
        &copy; {new Date().getFullYear()} SeekNook | <Link to="/terms-of-use">Terms of Use</Link> | <Link to="/privacy-policy">Privacy Policy</Link> | <Link to="/avoid-scams">Scam Protection Guide</Link> | <Link to="/contact-us">Contact Us</Link>
      </footer>
    </div>
  );
};

export default HomePage;
