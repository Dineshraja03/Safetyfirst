import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaChartLine } from 'react-icons/fa';
import './StressTestButton.css';

const StressTestButton = ({ 
  variant = 'standard', 
  className = '', 
  showLabel = true,
  centered = false,
  centeredPage = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Periodically animate the button to draw attention
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }, 15000); // Animate every 15 seconds
    
    return () => clearInterval(animationInterval);
  }, []);

  // Component classes based on variant and centering options
  const buttonClasses = `
    stress-test-button 
    ${variant} 
    ${isAnimating ? 'pulse' : ''} 
    ${centeredPage ? 'centered-page' : ''} 
    ${className}
  `;
  
  // If centered is true, wrap button in a container
  if (centered) {
    return (
      <div className="stress-test-button-container">
        <Link 
          to="/stress-test" 
          className={buttonClasses}
          aria-label="Take stress assessment test"
        >
          <div className="button-content">
            <div className="icon-container">
              <FaBrain className="brain-icon" />
              <FaChartLine className="chart-icon" />
            </div>
            
            {showLabel && (
              <div className="button-text">
                <span className="button-label">Stress Test</span>
                <span className="button-description">Check your stress levels</span>
              </div>
            )}
          </div>
        </Link>
      </div>
    );
  }
  
  // Default rendering without centering container
  return (
    <Link 
      to="/stress-test" 
      className={buttonClasses}
      aria-label="Take stress assessment test"
    >
      <div className="button-content">
        <div className="icon-container">
          <FaBrain className="brain-icon" />
          <FaChartLine className="chart-icon" />
        </div>
        
        {showLabel && (
          <div className="button-text">
            <span className="button-label">Stress Test</span>
            <span className="button-description">Check your stress levels</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default StressTestButton;