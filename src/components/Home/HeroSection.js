import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaHeartbeat, FaComments } from 'react-icons/fa';
import './HeroSection.css';
import hero from '../../assets/hero.jpg';

const HeroSection = () => {
    const [activeQuote, setActiveQuote] = useState(0);
    const supportQuotes = [
        "Small steps make big changes. We're here for each step.",
        "Your mental health matters. You are not alone on this journey.",
        "Sending love and light to those who are struggling.",
        "Safety and support, whenever and wherever you need it."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveQuote(prevQuote => (prevQuote + 1) % supportQuotes.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hero-container">
            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-title-block">
                        <h1>Find <span>Safety</span> and <span>Support</span> in Your <span>Online</span> Journey</h1>
                        
                        <div className="hero-quote">
                            <p>{supportQuotes[activeQuote]}</p>
                            <div className="quote-indicators">
                                {supportQuotes.map((_, index) => (
                                    <span 
                                        key={index} 
                                        className={`indicator ${index === activeQuote ? 'active' : ''}`}
                                        onClick={() => setActiveQuote(index)}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="hero-features">
                        <div className="feature">
                            <div className="feature-icon safety">
                                <FaShieldAlt />
                            </div>
                            <span>Online Safety</span>
                        </div>
                        
                        <div className="feature">
                            <div className="feature-icon wellbeing">
                                <FaHeartbeat />
                            </div>
                            <span>Mental Wellbeing</span>
                        </div>
                        
                        <div className="feature">
                            <div className="feature-icon counseling">
                                <FaComments />
                            </div>
                            <span>Expert Counseling</span>
                        </div>
                    </div>

                    <div className="hero-buttons">
                        <Link to="/counselling" className="btn primary-btn">
                            Speak to a Counselor
                        </Link>
                        <Link to="/legal-rights" className="btn secondary-btn">
                            Safety Resources
                        </Link>
                    </div>
                </div>
                
                <div className="hero-image">
                    <div className="image-wrapper">
                        <img src={hero} alt="Mental health support" />
                        <div className="image-overlay"></div>
                    </div>
                    
                    <div className="support-badge">
                        <div className="badge-content">
                            <div className="badge-title">24/7</div>
                            <div className="badge-text">Support Available</div>
                        </div>
                    </div>
                    
                    <div className="testimonial">
                        <p>"This platform was there when I needed support the most."</p>
                        <span>- Student, 19</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;