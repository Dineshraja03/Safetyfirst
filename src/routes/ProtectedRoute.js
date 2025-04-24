import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../firebase/config';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100vh'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <Route
            {...rest}
            render={props => {
                return currentUser ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }}
        />
    );
};

export default ProtectedRoute;