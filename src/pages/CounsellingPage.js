import React, { useState } from 'react';
import { FaHeartbeat, FaComment, FaMapMarkerAlt, FaHandHoldingHeart, FaCalendarCheck, FaBrain, FaChevronRight } from 'react-icons/fa';
import { useHistory } from 'react-router-dom'; // Add this import
import Navbar from '../components/Home/Navbar';
import './CounsellingPage.css';
import Chatbot from '../Chatbot/Chatbot';
import EmergencyButton from '../EmergencyButton';
import StressTestButton from '../components/StressTestButton';
import CounselorsMap from '../components/Counselling/CounselorsMap';

const CounsellingPage = () => {
    const [showCounselorsMap, setShowCounselorsMap] = useState(false);
    const history = useHistory(); // Add this line
    
    const handleMapClose = () => {
        setShowCounselorsMap(false);
    };
    
    return (
        <>
            <Chatbot />
            <EmergencyButton />
            <Navbar />
            <div className="counselling-page">
                {/* Hero Section */}
                <div className="counselling-hero">
                    <div className="hero-icon">
                        <FaHeartbeat />
                    </div>
                    <div className="hero-content">
                        <h1>Professional Counselling Services</h1>
                        <p className="quote">"Healing starts with a conversation. You're not alone in this journey."</p>
                    </div>
                </div>
                
                {/* Options Grid */}
                <div className="counselling-options-container">
                    <h2>How would you like to connect?</h2>
                    <div className="counselling-grid">
                        <div className="counselling-option">
                            <div className="option-icon">
                                <FaComment />
                            </div>
                            <h3>Talk to a Counsellor</h3>
                            <p>One-on-one private sessions with our certified counsellors</p>
                            <button 
                                className="option-btn"
                                onClick={() => history.push('/talk-to-counselor')} // Add this onClick handler
                            >
                                Schedule Call
                            </button>
                        </div>
                        
                        <div className="counselling-option">
                            <div className="option-icon">
                                <FaMapMarkerAlt />
                            </div>
                            <h3>Counsellors Near Me</h3>
                            <p>Find professional help in your local area</p>
                            <button 
                                className="option-btn"
                                onClick={() => setShowCounselorsMap(true)}
                            >
                                Find Nearby
                            </button>
                        </div>
                        
                        <div className="counselling-option">
                            <div className="option-icon">
                                <FaHandHoldingHeart />
                            </div>
                            <h3>Chat with a Counsellor</h3>
                            <p>Instant messaging support when you need guidance</p>
                            <button 
                                className="option-btn"
                                onClick={() => window.open('https://wa.me/919999666555', '_blank')}
                            >
                                Start Chat
                            </button>
                        </div>
                        
                        <div className="counselling-option">
                            <div className="option-icon">
                                <FaCalendarCheck />
                            </div>
                            <h3>Free Therapy Session</h3>
                            <p>Join our complimentary group sessions with experts</p>
                            <button 
                                className="option-btn"
                                onClick={() => history.push('/free-therapy')}
                            >
                                Join Session
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Stress Test Section */}
                <div className="stress-assessment-section">
                    <div className="assessment-content">
                        <div className="assessment-icon">
                            <FaBrain />
                        </div>
                        <div className="assessment-text">
                            <h2>Are you feeling stressed?</h2>
                            <p>Understanding your stress levels is the first step toward better mental health. Our quick 10-question assessment can help you identify your current stress levels and provide personalized recommendations.</p>
                            <div className="assessment-details">
                                <div className="detail-item">
                                    <span className="detail-number">10</span>
                                    <span className="detail-label">Questions</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-number">2</span>
                                    <span className="detail-label">Minutes</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-number">100%</span>
                                    <span className="detail-label">Confidential</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="assessment-action">
                        <StressTestButton centered variant="standard" />
                        <p className="assessment-note">Based on the scientifically validated Perceived Stress Scale (PSS-10)</p>
                    </div>
                </div>
                
                {/* Counselors Map Modal */}
                <CounselorsMap isOpen={showCounselorsMap} onClose={handleMapClose} />
            </div>
        </>
    );
};

export default CounsellingPage;