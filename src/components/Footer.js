import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaShieldAlt, 
  FaTwitter, 
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <FaShieldAlt className="footer-logo" />
                    <span>Safety First</span>
                </div>
                
                <div className="footer-links">
                    <Link to="/home">Home</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/counselling">Counselling</Link>
                    <Link to="/games">Mental Health</Link>
                    <Link to="/community">Community</Link>
                </div>
                
                <div className="footer-social">
                    <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                    <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                    <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {currentYear} Safety First</p>
                <div className="footer-legal">
                    <Link to="/privacy-policy">Privacy</Link>
                    <Link to="/terms-of-service">Terms</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;