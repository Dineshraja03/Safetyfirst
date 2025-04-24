import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../../firebase/config';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate password match
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        // Validate age
        if (age && (isNaN(age) || parseInt(age) <= 0 || parseInt(age) > 120)) {
            setError("Please enter a valid age");
            setLoading(false);
            return;
        }

        // Validate emergency contact (basic format)
        if (emergencyContact && !(/^[+]?[\d\s()-]{8,20}$/.test(emergencyContact))) {
            setError("Please enter a valid emergency contact number");
            setLoading(false);
            return;
        }

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profile with display name
            await updateProfile(user, {
                displayName: name
            });

            // Create a user document in Firestore with additional fields
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: name,
                email: email,
                age: age || '',
                gender: gender || '',
                emergencyContact: emergencyContact || '',
                userType: 'standard', // Default user type
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                profileComplete: true,
                settings: {
                    notifications: true,
                    dataSharing: false,
                    theme: 'light'
                },
                emergencySettings: {
                    contactName: '',
                    relationship: '',
                    emergencyContactNumber: emergencyContact || '',
                    shareLocationInEmergency: true
                },
                wellbeingScores: {
                    lastAssessment: null,
                    stressLevel: null,
                    anxietyLevel: null,
                    moodScore: null,
                    sleepQuality: null
                }
            });

            console.log("User registered successfully!");
            // Navigate to home page
            history.push('/home');
        } catch (err) {
            switch(err.code) {
                case 'auth/email-already-in-use':
                    setError('Email is already in use');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak');
                    break;
                default:
                    setError('Failed to create an account');
                    console.error(err);
            }
            setLoading(false);
        }
    };

    return (
        <div className="register-form">
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Full Name <span className="required">*</span></label>
                    <input
                        className="form-control"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Email <span className="required">*</span></label>
                    <input
                        className="form-control"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                
                <div className="form-row">
                    <div className="form-group half">
                        <label>Age</label>
                        <input
                            className="form-control"
                            type="number"
                            min="1"
                            max="120"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Your age"
                        />
                    </div>
                    
                    <div className="form-group half">
                        <label>Gender</label>
                        <select
                            className="form-control"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Select gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Emergency Contact</label>
                    <input
                        className="form-control"
                        type="tel"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        placeholder="Emergency contact number"
                    />
                </div>
                
                <div className="form-group">
                    <label>Password <span className="required">*</span></label>
                    <input
                        className="form-control"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Confirm Password <span className="required">*</span></label>
                    <input
                        className="form-control"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                    />
                </div>
                
                <div className="form-group terms-checkbox">
                    <input 
                        type="checkbox" 
                        id="terms" 
                        required 
                    />
                    <label htmlFor="terms">
                        I agree to the <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                    </label>
                </div>
                
                <button 
                    className="btn btn-primary" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;