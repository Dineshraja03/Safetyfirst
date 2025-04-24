import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FaUser, FaEdit, FaSignOutAlt, FaPhone, FaShieldAlt, FaCalendarAlt, FaVenusMars, FaIdCard, FaUserCircle } from 'react-icons/fa';
import { auth, db } from '../firebase/config';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Navbar from '../components/Home/Navbar';
import './ProfilePage.css';
import Chatbot from '../Chatbot/Chatbot';
import EmergencyButton from '../EmergencyButton';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    emergencyContact: '',
    photoURL: null,
    email: '',
    joinedDate: 'January 2023',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('personal');
  const history = useHistory();
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          history.push('/login');
          return;
        }
        
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          // Calculate account age
          const joinDate = userDoc.data().createdAt ? 
                          new Date(userDoc.data().createdAt.toDate()).toLocaleDateString('en-US', 
                          {month: 'long', year: 'numeric'}) : 
                          'January 2023';
                          
          setProfile({
            name: userDoc.data().name || user.displayName || 'Not set',
            age: userDoc.data().age || 'Not set',
            gender: userDoc.data().gender || 'Not set',
            emergencyContact: userDoc.data().emergencyContact || 'Not set',
            photoURL: user.photoURL || null,
            email: user.email || 'Not set',
            joinedDate: joinDate
          });
        } else {
          // If user doesn't have a profile document yet
          setProfile({
            name: user.displayName || 'Not set',
            age: 'Not set',
            gender: 'Not set',
            emergencyContact: 'Not set',
            photoURL: user.photoURL || null,
            email: user.email || 'Not set',
            joinedDate: 'January 2023'
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [history]);
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const user = auth.currentUser;
      const userDocRef = doc(db, "users", user.uid);
      
      // Validate age
      if (profile.age && (isNaN(profile.age) || parseInt(profile.age) <= 0 || parseInt(profile.age) > 120)) {
        alert("Please enter a valid age");
        return;
      }

      // Validate emergency contact (basic format)
      if (profile.emergencyContact && !(/^[+]?[\d\s()-]{8,20}$/.test(profile.emergencyContact))) {
        alert("Please enter a valid emergency contact number");
        return;
      }
      
      await updateDoc(userDocRef, {
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        emergencyContact: profile.emergencyContact
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.push('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <Chatbot />
      <EmergencyButton />
      
      <div className="profile-page-wrapper">
        <div className="profile-hero-section">
          <div className="profile-banner"></div>
          <div className="profile-main-info">
            <div className="profile-avatar-container">
              {profile.photoURL ? (
                <img 
                  src={profile.photoURL} 
                  alt="Profile" 
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  <FaUserCircle />
                </div>
              )}
            </div>
            <div className="profile-name-container">
              <h1>{profile.name}</h1>
              <p className="profile-email">{profile.email}</p>
              <div className="profile-joined">
                <FaCalendarAlt /> Member since {profile.joinedDate}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-container">
          <div className="profile-sidebar">
            <div 
              className={`sidebar-item ${activeSection === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveSection('personal')}
            >
              <FaUser /> Personal Info
            </div>
            <div 
              className={`sidebar-item ${activeSection === 'security' ? 'active' : ''}`}
              onClick={() => setActiveSection('security')}
            >
              <FaShieldAlt /> Security
            </div>
            <div 
              className={`sidebar-item ${activeSection === 'emergency' ? 'active' : ''}`}
              onClick={() => setActiveSection('emergency')}
            >
              <FaPhone /> Emergency Contact
            </div>
            <div className="sidebar-divider"></div>
            <div className="sidebar-item logout-item" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </div>
          </div>
          
          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-card-header">
                <h2>
                  {activeSection === 'personal' && 'Personal Information'}
                  {activeSection === 'security' && 'Account Security'}
                  {activeSection === 'emergency' && 'Emergency Contacts'}
                </h2>
                {!isEditing && activeSection === 'personal' && (
                  <button 
                    className="edit-button"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit /> Edit Profile
                  </button>
                )}
              </div>
              
              {activeSection === 'personal' && (
                isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="profile-edit-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Age</label>
                        <input
                          type="number"
                          name="age"
                          min="1"
                          max="120"
                          value={profile.age}
                          onChange={handleInputChange}
                          placeholder="Your age"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Gender</label>
                        <select 
                          name="gender"
                          value={profile.gender}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="profile-form-buttons">
                      <button type="submit" className="save-button">
                        Save Changes
                      </button>
                      <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-info-cards">
                    <div className="info-card">
                      <div className="info-card-icon">
                        <FaIdCard />
                      </div>
                      <div className="info-card-content">
                        <h3>Full Name</h3>
                        <p>{profile.name}</p>
                      </div>
                    </div>
                    
                    <div className="info-card">
                      <div className="info-card-icon">
                        <FaCalendarAlt />
                      </div>
                      <div className="info-card-content">
                        <h3>Age</h3>
                        <p>{profile.age}</p>
                      </div>
                    </div>
                    
                    <div className="info-card">
                      <div className="info-card-icon">
                        <FaVenusMars />
                      </div>
                      <div className="info-card-content">
                        <h3>Gender</h3>
                        <p>{profile.gender}</p>
                      </div>
                    </div>
                  </div>
                )
              )}
              
              {activeSection === 'security' && (
                <div className="security-section">
                  <div className="info-card">
                    <div className="info-card-icon secure">
                      <FaShieldAlt />
                    </div>
                    <div className="info-card-content">
                      <h3>Email Address</h3>
                      <p>{profile.email}</p>
                    </div>
                  </div>
                  
                  <div className="security-options">
                    <h3>Security Options</h3>
                    <button className="security-button">Change Password</button>
                    <button className="security-button">Enable Two-Factor Authentication</button>
                  </div>
                </div>
              )}
              
              {activeSection === 'emergency' && (
                <div className="emergency-section">
                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="profile-edit-form">
                      <div className="form-group">
                        <label>Emergency Contact Number</label>
                        <input
                          type="tel"
                          name="emergencyContact"
                          value={profile.emergencyContact}
                          onChange={handleInputChange}
                          placeholder="Enter emergency contact number"
                        />
                      </div>
                      
                      <div className="profile-form-buttons">
                        <button type="submit" className="save-button">
                          Save Contact
                        </button>
                        <button 
                          type="button" 
                          className="cancel-button"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="info-card emergency-card">
                        <div className="info-card-icon emergency">
                          <FaPhone />
                        </div>
                        <div className="info-card-content">
                          <h3>Emergency Contact Number</h3>
                          <p>{profile.emergencyContact}</p>
                        </div>
                      </div>
                      
                      <div className="emergency-note">
                        <p>
                          Your emergency contact will be used only in crisis situations 
                          when our support team determines immediate assistance is required.
                        </p>
                        <button 
                          className="edit-contact-button"
                          onClick={() => {
                            setActiveSection('emergency');
                            setIsEditing(true);
                          }}
                        >
                          <FaEdit /> Update Emergency Contact
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;