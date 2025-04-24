import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { 
  FaPhone, 
  FaUserMd, 
  FaExclamationTriangle, 
  FaGavel,
  FaArrowLeft,
  FaMapMarkerAlt
} from 'react-icons/fa';
import './EmergencyPage.css';

const EmergencyPage = () => {
  const [location, setLocation] = useState('');
  const history = useHistory();
  
  // Get user's location for local resources (city name)
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.city) {
          setLocation(data.city);
        }
      } catch (error) {
        console.error("Could not fetch location:", error);
      }
    };
    
    fetchLocation();
  }, []);
  
  // Emergency numbers data
  const emergencyContacts = [
    { name: "Police", number: "100" },
    { name: "Emergency Medical Services", number: "108" },
    { name: "Women Helpline", number: "1091" },
    { name: "Child Helpline", number: "1098" },
    { name: "National Emergency Number", number: "112" },
  ];
  
  const handleBack = () => {
    history.push('/home');
  };

  // New function to handle the Find Counselors button click
  const handleFindCounselors = (e) => {
    e.preventDefault();
    window.open("https://www.google.com/maps/search/psychologists+counselors+near+my+location/", "_blank");
  };

  return (
    <div className="emergency-page">
      <div className="emergency-header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft /> Back to Home
        </button>
        <div className="sos-pulse"></div>
      </div>
      
      <div className="emergency-container">
        <div className="emergency-title">
          <h1>Emergency Assistance</h1>
          <p className="subtitle">Get immediate help and support</p>
          {location && (
            <div className="location-indicator">
              <FaMapMarkerAlt /> Current location: {location}
            </div>
          )}
        </div>
        
        <div className="emergency-options">
          <div className="emergency-option">
            <div className="option-icon phone-icon">
              <FaPhone />
            </div>
            <h2>Emergency Contact</h2>
            <div className="emergency-numbers">
              {emergencyContacts.map((contact, index) => (
                <a 
                  key={index} 
                  href={`tel:${contact.number}`} 
                  className="emergency-number-item"
                >
                  <span className="number-name">{contact.name}:</span>
                  <span className="number">{contact.number}</span>
                </a>
              ))}
            </div>
            <a href="tel:112" className="call-now-button">
              Call Emergency Now
            </a>
          </div>
          
          <div className="emergency-option">
            <div className="option-icon counselor-icon">
              <FaUserMd />
            </div>
            <h2>Counselors Near Me</h2>
            <p>Find nearby professional counselors instantly.<br/>Get access to support around you.<br/>Verified experts, just a tap away.<br/>Locate trusted help on the map.<br/>Start your journey with nearby guidance.</p>
            {location ? (
              <p className="location-text">Showing counselors near {location}</p>
            ) : (
              <p className="location-text">Enable location for local results</p>
            )}
            {/* Changed Link to button with onClick handler */}
            <button 
              onClick={handleFindCounselors} 
              className="action-button"
            >
              Find Counselors
            </button>
          </div>
          
          
          <div className="emergency-option">
  <div className="option-icon legal-icon">
    <FaGavel />
  </div>
  <h2>Legal Support</h2>
  <p>Get instant legal advice and support.
<br/>Speak to experts for quick legal solutions.
<br/> Fast, reliable help when you need it most.</p>
  <div className="legal-options">
    {/* Changed from Link to anchor tag with external URL */}
    <a 
      href="https://nalsa.gov.in/services/legal-aid/legal-services" 
      target="_blank"
      rel="noopener noreferrer"
      className="action-button"
    >
      Legal Advice
    </a>
  </div>
</div>
        </div>
        
        <div className="safety-reminder">
          <h3>IMPORTANT</h3>
          <p>If you are in immediate danger, please call the emergency services at <strong>112</strong> right away.</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;