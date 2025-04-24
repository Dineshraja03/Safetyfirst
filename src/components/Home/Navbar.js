import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FaUser, FaBars, FaTimes, FaHome, FaQuestionCircle, FaShieldAlt, FaGamepad, FaUserCircle, FaSignOutAlt, FaCog, FaBell, FaCalendarCheck, FaComments, FaInfoCircle, FaCheck } from 'react-icons/fa';
import { auth } from '../../firebase/config';
import './Navbar.css';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'session',
      title: 'Counseling Session Reminder',
      message: 'Your session with Dr. Saleem is tomorrow at 4:00 PM',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      message: 'P. Jeya Bala responded to your message',
      time: '5 hours ago',
      unread: true
    },
    {
      id: 3,
      type: 'info',
      title: 'Safety Tips Updated',
      message: 'Check out the new online safety guidelines',
      time: '1 day ago',
      unread: true
    }
  ]); // Example notification data
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const history = useHistory();
  const location = useLocation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Add scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setShowNotifications(false);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setShowDropdown(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navigateToProfile = () => {
    history.push('/profile');
    setShowDropdown(false);
  };

  const navigateToSettings = () => {
    history.push('/settings');
    setShowDropdown(false);
  };

  const navigateToNotificationDetail = (notification) => {
    // Handle navigation based on notification type
    if (notification.type === 'session') {
      history.push('/counselling');
    } else if (notification.type === 'message') {
      history.push('/chat-with-counselor');
    } else {
      history.push('/safety');
    }
    
    // Mark notification as read
    markAsRead(notification.id);
    setShowNotifications(false);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      history.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => n.unread).length;

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'session':
        return <FaCalendarCheck className="notification-type-icon session" />;
      case 'message':
        return <FaComments className="notification-type-icon message" />;
      case 'info':
        return <FaInfoCircle className="notification-type-icon info" />;
      default:
        return <FaBell className="notification-type-icon" />;
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          <span className="logo-text">Safety First</span>
        </Link>
        
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        
        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/home" className={isActive('/home')}>
              <FaHome className="nav-icon" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/counselling" className={isActive('/counselling')}>
              <FaQuestionCircle className="nav-icon" />
              <span>Counselling</span>
            </Link>
          </li>
          <li>
            <Link to="/legal-rights" className={isActive('/safety')}>
              <FaShieldAlt className="nav-icon" />
              <span>Safety</span>
            </Link>
          </li>
          <li>
            <Link to="/games" className={isActive('/games')}>
              <FaGamepad className="nav-icon" />
              <span>Games</span>
            </Link>
          </li>
        </ul>
        
        <div className="navbar-right">
          <div className="notification-container" ref={notificationRef}>
            <div className="notification-icon" onClick={toggleNotifications}>
              <FaBell />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </div>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="mark-all-read" onClick={markAllAsRead}>
                      <FaCheck className="mark-icon" />
                      <span>Mark all as read</span>
                    </button>
                  )}
                </div>
                
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.unread ? 'unread' : ''}`}
                        onClick={() => navigateToNotificationDetail(notification)}
                      >
                        {getNotificationIcon(notification.type)}
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                        {notification.unread && <div className="unread-indicator"></div>}
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">
                      <p>No notifications yet</p>
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="notification-footer">
                    <button onClick={() => history.push('/notifications')}>
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="profile-menu" ref={dropdownRef}>
            <div className="profile-icon" onClick={toggleDropdown}>
              <FaUserCircle />
            </div>
            
            {showDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <h3>Your Account</h3>
                </div>
                <div className="dropdown-content">
                  <button onClick={navigateToProfile}>
                    <FaUser className="dropdown-icon" />
                    My Profile
                  </button>
                  <button onClick={navigateToSettings}>
                    <FaCog className="dropdown-icon" />
                    Settings
                  </button>
                  <button onClick={handleLogout} className="logout-button">
                    <FaSignOutAlt className="dropdown-icon" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;