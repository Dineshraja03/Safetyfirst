import React from 'react';
import { useHistory } from 'react-router-dom';
import { FaUserFriends, FaGamepad, FaGavel, FaUsers, FaBrain } from 'react-icons/fa';
import StressTestButton from '../StressTestButton';
import './QuickNavigation.css';

const QuickNavigation = () => {
    const history = useHistory();

    const navigateTo = (path) => {
        history.push(path);
    };

    return (
        <div className="quick-nav-container">
            <h2 className="quick-nav-title">Quick Navigation</h2>
            <div className="quick-nav-grid">
                <div className="quick-nav-item counselling" onClick={() => navigateTo('/counselling')}>
                    <FaUserFriends className="quick-nav-icon" />
                    <h3>Counselling</h3>
                    <p>Connect with professional counselors for guidance and support</p>
                </div>
                <div className="quick-nav-item gamified" onClick={() => navigateTo('/games')}>
                    <FaGamepad className="quick-nav-icon" />
                    <h3>Gamified Activities</h3>
                    <p>Learn safety skills through interactive games and activities</p>
                </div>
                <div className="quick-nav-item legal" onClick={() => navigateTo('/legal-rights')}>
                    <FaGavel className="quick-nav-icon" />
                    <h3>Legal Rights & Awareness</h3>
                    <p>Understand your legal rights and protection measures</p>
                </div>
                <div className="quick-nav-item community" onClick={() => navigateTo('/community')}>
                    <FaUsers className="quick-nav-icon" />
                    <h3>Community & Therapy</h3>
                    <p>Join support groups and therapy sessions</p>
                </div>
            </div>
            
            <div className="stress-test-section">
                <h3 className="stress-test-heading">Check Your Mental Wellbeing</h3>
                <p className="stress-test-description">
                    Take our scientifically designed assessment to measure your current stress levels 
                    and get personalized recommendations
                </p>
                <StressTestButton centered variant="standard" />
            </div>
        </div>
    );
};

export default QuickNavigation;