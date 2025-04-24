import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from '../components/Home/Navbar';
import './FreeTherapyPage.css';
import Chatbot from '../Chatbot/Chatbot';
import EmergencyButton from '../EmergencyButton';
import { FaArrowLeft, FaCalendarDay, FaGlobe, FaMobile, FaPhoneAlt, FaVideo, FaWhatsapp } from 'react-icons/fa';
import { BiMessageDetail } from 'react-icons/bi';
import { MdGroups, MdLocationOn, MdAccessTime } from 'react-icons/md';

const FreeTherapyPage = () => {
    const history = useHistory();
    const [activeSession, setActiveSession] = useState(null);
    const [showResourceDetails, setShowResourceDetails] = useState(null);

    // Mock upcoming free sessions
    

    // Free therapy resources
    const therapyResources = [
        {
            id: 1,
            name: "Free Group Therapy Resources",
            description: "Access no-cost group therapy sessions led by licensed therapists. Sessions cover various mental health topics including anxiety, depression, and stress management.",
            link: "https://sites.google.com/view/freegrouptherapy/home",
            icon: <MdGroups />,
            type: "Online Group Sessions",
            features: [
                "Licensed therapists",
                "Various mental health topics",
                "Supportive group environment",
                "Weekly and monthly sessions"
            ],
            buttonText: "Access Free Groups"
        },
        {
            id: 2,
            name: "Tele-MANAS Initiative",
            description: "Government-backed mental health assistance by telephone. Trained counselors provide support, guidance, and referrals when needed.",
            link: "https://telemanas.mohfw.gov.in/home",
            icon: <FaPhoneAlt />,
            type: "Government Initiative",
            features: [
                "Toll-free helpline",
                "Confidential support",
                "Available in multiple languages",
                "24/7 emergency support"
            ],
            buttonText: "Learn More"
        },
        {
            id: 3,
            name: "Vandrevala Foundation",
            description: "Professional counseling services with both free and paid options. Their mission is to provide immediate emotional support and guidance.",
            link: "https://www.vandrevalafoundation.com/paid-counseling",
            icon: <BiMessageDetail />,
            type: "Free & Paid Counseling",
            isPaid: true,
            features: [
                "Crisis intervention",
                "Trained professionals",
                "Sliding scale payment options",
                "Specialized services available"
            ],
            buttonText: "Explore Services"
        },
        {
            id: 4,
            name: "WhatsApp Counseling",
            description: "Instant messaging support through WhatsApp. Connect directly with a counselor for personalized guidance and support.",
            link: "https://api.whatsapp.com/send?phone=919999666555",
            icon: <FaWhatsapp />,
            type: "WhatsApp Support",
            features: [
                "Instant messaging",
                "Personal counselor",
                "Chat at your convenience",
                "Easy to access"
            ],
            buttonText: "Connect on WhatsApp"
        },
        {
            id: 5,
            name: "August AI Mental Chatbot",
            description: "AI-powered mental health chatbot that provides support, resources, and coping strategies through WhatsApp.",
            link: "https://api.whatsapp.com/send?phone=918738030604",
            icon: <BiMessageDetail />,
            type: "AI Chatbot",
            features: [
                "Available 24/7",
                "Personalized responses",
                "Privacy focused",
                "Easy to use"
            ],
            buttonText: "Chat with August AI"
        }
    ];

    // Handle clicking on session
    const handleSessionClick = (session) => {
        setActiveSession(activeSession === session.id ? null : session.id);
    };

    // Handle joining a session
    const handleJoinSession = (session) => {
        alert(`You're now joining "${session.title}" session. In a real application, this would connect to ${session.platform}.`);
    };

    // Handle viewing resource details
    const handleViewResourceDetails = (resourceId) => {
        setShowResourceDetails(showResourceDetails === resourceId ? null : resourceId);
    };

    return (
        <>
            <Navbar />
            <Chatbot />
            <EmergencyButton />
            
            <div className="free-therapy-page">
                {/* Header Section */}
                <div className="free-therapy-header">
                    <div className="header-content">
                        <button 
                            className="back-button" 
                            onClick={() => history.push('/counselling')}
                        >
                            <FaArrowLeft /> Back to Counselling
                        </button>
                        <h1>Free Therapy & Mental Health Resources</h1>
                        <p>Access no-cost mental health support and join our community sessions</p>
                    </div>
                </div>
                
               
                {/* Resources Section */}
                <div className="free-therapy-section resources-section">
                    <div className="section-header">
                        <h2>Free Mental Health Resources</h2>
                        <p>Discover support services available to you at no cost</p>
                    </div>
                    
                    <div className="resources-grid">
                        {therapyResources.map(resource => (
                            <div 
                                key={resource.id} 
                                className={`resource-card ${resource.isPaid ? 'paid' : 'free'}`}
                            >
                                <div className="resource-header">
                                    <div className="resource-icon">
                                        {resource.icon}
                                        {resource.isPaid && <span className="paid-badge">Paid Option</span>}
                                    </div>
                                    <div className="resource-type">{resource.type}</div>
                                </div>
                                <h3>{resource.name}</h3>
                                <p className="resource-description">{resource.description}</p>
                                
                                <div className={`resource-details ${showResourceDetails === resource.id ? 'visible' : ''}`}>
                                    <h4>Key Features:</h4>
                                    <ul className="features-list">
                                        {resource.features.map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="resource-actions">
                                    <button 
                                        className="details-btn"
                                        onClick={() => handleViewResourceDetails(resource.id)}
                                    >
                                        {showResourceDetails === resource.id ? 'Hide Details' : 'View Details'}
                                    </button>
                                    <a 
                                        href={resource.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="resource-link-btn"
                                    >
                                        {resource.buttonText}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Information Section */}
                <div className="free-therapy-section info-section">
                    <div className="info-cards">
                        <div className="info-card">
                            <div className="info-icon">
                                <MdAccessTime />
                            </div>
                            <h3>24/7 Support</h3>
                            <p>Mental health doesn't follow a schedule. Many resources offer round-the-clock support when you need it most.</p>
                        </div>
                        
                        <div className="info-card">
                            <div className="info-icon">
                                <MdGroups />
                            </div>
                            <h3>Community Healing</h3>
                            <p>Group therapy sessions provide peer support and remind you that you're not alone in your journey.</p>
                        </div>
                        
                        <div className="info-card">
                            <div className="info-icon">
                                <MdLocationOn />
                            </div>
                            <h3>Access Anywhere</h3>
                            <p>Virtual sessions and digital resources break down geographical barriers to quality mental health care.</p>
                        </div>
                    </div>
                </div>
                
               
            </div>
        </>
    );
};

export default FreeTherapyPage;