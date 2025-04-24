import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaArrowRight, 
  FaExclamationCircle, 
  FaBrain, 
  FaUsers, 
  FaGraduationCap, 
  FaLock,
} from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-container">
            <div className="landing-overlay"></div>
            
            <header className="landing-header">
                <div className="logo">
                    <FaShieldAlt />
                    <span>Safety First</span>
                </div>
                <div className="emergency-header-link">
                    <Link to="/emergency">
                        <FaExclamationCircle /> Emergency Help
                    </Link>
                </div>
            </header>
            
            <main className="landing-content">
                <div className="hero-section">
                    <h1>Your Safe Space for Mental Wellbeing</h1>
                    
                    <div className="cta-buttons">
                        <Link to="/login" className="primary-button">
                            Get Started <FaArrowRight />
                        </Link>
                        <Link to="/emergency" className="emergency-button">
                            <FaExclamationCircle /> Emergency Support
                        </Link>
                    </div>
                </div>
                
                <div className="features-section">
                    <div className="feature-card">
                        <div className="feature-icon-wrapper mental-health">
                            <FaBrain className="feature-icon" />
                        </div>
                        <h3>Mental Health Resources</h3>
                        <p>Access professional guidance, self-help tools, and support materials</p>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon-wrapper community">
                            <FaUsers className="feature-icon" />
                        </div>
                        <h3>Supportive Community</h3>
                        <p>Connect with counselors and peers in a safe, moderated environment</p>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon-wrapper education">
                            <FaGraduationCap className="feature-icon" />
                        </div>
                        <h3>Interactive Learning</h3>
                        <p>Build resilience and life skills through engaging activities and games</p>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon-wrapper safety">
                            <FaLock className="feature-icon" />
                        </div>
                        <h3>Safety Resources</h3>
                        <p>Learn about rights, reporting procedures, and protection measures</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;