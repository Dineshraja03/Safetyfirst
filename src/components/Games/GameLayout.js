import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaQuestion, FaTrophy, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './GameLayout.css';
import Chatbot from '../../Chatbot/Chatbot';
import EmergencyButton from '../../EmergencyButton';

const GameLayout = ({ title, description, children, onComplete, showInstructions, setShowInstructions }) => {
  const [sound, setSound] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll position
  const lastScrollY = useRef(0);

  // Handle scroll effect for nav bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Detect scroll direction and distance
      if (currentScrollY < 10) {
        // At the top of the page - always show header
        setHeaderVisible(true);
        setIsScrolled(false);
      } else {
        // Scrolled down - check direction
        setIsScrolled(true);
        
        // Hide header when scrolling down, show when scrolling up
        // Add a threshold of 5px to prevent tiny movements from toggling the header
        if (currentScrollY > lastScrollY.current + 5) {
          setHeaderVisible(false); // Scrolling down
        } else if (currentScrollY < lastScrollY.current - 5) {
          setHeaderVisible(true); // Scrolling up
        }
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle sound toggle
  const toggleSound = () => {
    setSound(!sound);
    // Implement actual sound control logic here
  };

  // Parse HTML content for instructions if it's a string
  const parseHTMLInstructions = (htmlContent) => {
    if (typeof htmlContent === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    }
    return <p>Follow the on-screen instructions to play this game.</p>;
  };

  return (
    <>
      <Chatbot />
      <EmergencyButton />
      <div className="game-layout">
        <header className={`game-header ${isScrolled ? 'scrolled' : ''} ${headerVisible ? 'visible' : 'hidden'}`}>
          <div className="game-nav">
            <div className="nav-left">
              <Link to="/games" className="back-button">
                <FaArrowLeft /> <span></span>
              </Link>
            </div>
            
            <div className="nav-center">
              <h1>{title}</h1>
            </div>
            
            <div className="nav-right">
              <div className="game-controls">
                <button 
                  className="control-button sound-button"
                  onClick={toggleSound}
                  title={sound ? "Mute Sound" : "Enable Sound"}
                >
                  {sound ? <FaVolumeUp /> : <FaVolumeMute />}
                </button>
                <button 
                  className="control-button help-button" 
                  onClick={() => setShowInstructions(true)}
                  title="Instructions"
                >
                  <FaQuestion />
                </button>
              </div>
            </div>
          </div>
          
          <div className="game-info">
            <p className="game-description">{description}</p>
          </div>
        </header>
        
        <main className="game-content">
          {children}
        </main>

        {showInstructions && (
          <div className="instructions-overlay">
            <div className="instructions-panel">
              <div className="instructions-header">
                <h2>How to Play</h2>
                <div className="instructions-decoration"></div>
              </div>
              
              <div className="instructions-content">
                {parseHTMLInstructions(showInstructions)}
              </div>
              
              <button 
                className="close-instructions" 
                onClick={() => setShowInstructions(false)}
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GameLayout;