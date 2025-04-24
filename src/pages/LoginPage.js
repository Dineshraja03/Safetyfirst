import React, { useState } from 'react';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import './LoginPage.css';

const LoginPage = () => {
    const [showRegister, setShowRegister] = useState(false);
    
    const toggleForm = () => {
        setShowRegister(!showRegister);
    };

    return (
        <div className="login-container">
            <div className="auth-card">
                {!showRegister ? (
                    <>
                        <h2 className="form-title">Login</h2>
                        <Login />
                        <div className="form-switch">
                            <p>
                                New user? 
                                <button 
                                    className="switch-button" 
                                    onClick={toggleForm}
                                >
                                    Register here
                                </button>
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="form-title">Create Account</h2>
                        <Register />
                        <div className="form-switch">
                            <p>
                                Already have an account? 
                                <button 
                                    className="switch-button" 
                                    onClick={toggleForm}
                                >
                                    Login here
                                </button>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginPage;