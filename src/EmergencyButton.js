import React from 'react';
import { useHistory } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import './EmergencyButton.css';

const EmergencyButton = () => {
  const history = useHistory();
  
  const handleEmergencyClick = () => {
    history.push('/emergency');
  };
  
  return (
    <button 
      className="floating-emergency-button"
      onClick={handleEmergencyClick}
      aria-label="Emergency assistance"
    >
      <FaExclamationTriangle />
      <span className="button-text">Emergency</span>
    </button>
  );
};

export default EmergencyButton;