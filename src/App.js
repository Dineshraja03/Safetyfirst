import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CounsellingPage from './pages/CounsellingPage';
import LegalRightsPage from './pages/LegalRightsPage';
import GamesPage from './pages/Gamespage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import EmergencyPage from './pages/EmergencyPage';
import StressTest from './components/StressTest';
import ProtectedRoute from './routes/ProtectedRoute';
import './styles/global.css';
import Footer from './components/Footer';
import MindfulnessGame from './components/Games/MindfulnessGame';
import EmotionPuzzleGame from './components/Games/EmotionPuzzleGame';
import SafetyStrategyGame from './components/Games/SafetyStrategyGame';
import ScrollToTop from './components/Scroll';
import TalkToCounselorPage from './pages/TalkToCounselorPage';
// import ChatWithCounselorPage from './pages/ChatWithCounsellorPage';
import FreeTherapyPage from './pages/FreeTherapyPage';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/emergency" component={EmergencyPage} />
                <ProtectedRoute path="/home" component={HomePage} />
                <ProtectedRoute path="/counselling" component={CounsellingPage} />
                <ProtectedRoute path="/legal-rights" component={LegalRightsPage} />
                <ProtectedRoute path="/community" component={CommunityPage} />
                <ProtectedRoute path="/profile" component={ProfilePage} />
                <ProtectedRoute path="/stress-test" component={StressTest} />
                
                <Route path="/games/mindfulness" component={MindfulnessGame} />
                <Route path="/games/emotion-puzzle" component={EmotionPuzzleGame} />
                <Route path="/games/safety-strategy" component={SafetyStrategyGame} />
                
                <ProtectedRoute path="/games" component={GamesPage} />
                <Route path="/talk-to-counselor" component={TalkToCounselorPage} />
                {/* <Route path="/chat-with-counselor" component={ChatWithCounselorPage } /> */}
                <Route path="/free-therapy" component={FreeTherapyPage} />
            </Switch>
            <Footer />
        </Router>
    );
}

export default App;