import React from 'react';
import Navbar from '../components/Home/Navbar';
import HeroSection from '../components/Home/HeroSection';
import QuickNavigation from '../components/Home/QuickNavigation';

import Chatbot from '../Chatbot/Chatbot';
import EmergencyButton from '../EmergencyButton';
// import StressTestButton from '../components/StressTestButton';

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <QuickNavigation />
            <Chatbot />
            <EmergencyButton />
            
            
        </div>
        

        
        
    );
};



export default HomePage;