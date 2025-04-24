import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGamepad, 
  FaBrain, 
  FaPuzzlePiece, 
  FaChessKnight, 
  FaRegLightbulb, 
  FaSmile 
} from 'react-icons/fa';
import Navbar from '../components/Home/Navbar';
import './Gamespage.css';
import Chatbot from '../Chatbot/Chatbot';
import EmergencyButton from '../EmergencyButton';

const GamesPage = () => {
  return (
    <>
    <Chatbot />
    <EmergencyButton />
      <Navbar />
      <div className="games-container">
        {/* Hero Section */}
        <div className="games-hero">
          <div className="hero-content">
            <div className="hero-icon">
              <FaGamepad />
            </div>
            <div>
              <h1>Learning Through Play</h1>
              <p className="hero-description">
                Engage with fun activities designed to improve mental health, build confidence, 
                and develop essential life skills.
              </p>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="games-section">
          <h2>Choose a Game to Play</h2>
          
          <div className="games-grid">
            <div className="game-card">
              <div className="game-icon">
                <FaBrain />
              </div>
              <div className="game-content">
                <h3>Mindfulness Journey</h3>
                <p>Practice mindfulness and develop emotional awareness through guided interactive exercises.</p>
                <div className="game-meta">
                  <span className="game-difficulty">Beginner</span>
                  {/* <span className="game-time">5-10 min</span> */}
                </div>
                <Link to="/games/mindfulness" className="play-button">Play Now</Link>
              </div>
            </div>

            <div className="game-card">
              <div className="game-icon">
                <FaPuzzlePiece />
              </div>
              <div className="game-content">
                <h3>Emotion Puzzle</h3>
                <p>Identify and match emotions to situations, building emotional intelligence and empathy.</p>
                <div className="game-meta">
                  <span className="game-difficulty">Intermediate</span>
                  {/* <span className="game-time">10-15 min</span> */}
                </div>
                <Link to="/games/emotion-puzzle" className="play-button">Play Now</Link>
              </div>
            </div>

            <div className="game-card">
              <div className="game-icon">
                <FaChessKnight />
              </div>
              <div className="game-content">
                <h3>Safety Strategy</h3>
                <p>Learn safety strategies through scenario-based decision-making challenges.</p>
                <div className="game-meta">
                  <span className="game-difficulty">Advanced</span>
                  {/* <span className="game-time">15-20 min</span> */}
                </div>
                <Link to="/games/safety-strategy" className="play-button">Play Now</Link>
              </div>
            </div>

           
          </div>
        </div>
        
        {/* Benefits Section */}
        <div className="benefits-section">
          <h2>Benefits of Mental Health Games</h2>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>Stress Reduction</h3>
              <p>Regular gameplay can help reduce anxiety and stress levels through mindful engagement.</p>
            </div>
            
            <div className="benefit-card">
              <h3>Emotional Intelligence</h3>
              <p>Games help develop awareness and understanding of emotions in yourself and others.</p>
            </div>
            
            <div className="benefit-card">
              <h3>Coping Skills</h3>
              <p>Learn practical strategies to handle difficult situations and emotions effectively.</p>
            </div>
            
            <div className="benefit-card">
              <h3>Confidence Building</h3>
              <p>Achievement in games translates to increased self-efficacy and confidence in real life.</p>
            </div>
          </div>
        </div>
        
        {/* Achievement Tracker */}
        <div className="achievement-tracker">
          <h2>Your Gaming Progress</h2>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '35%' }}></div>
            </div>
            <p className="progress-text">You've completed 7 out of 20 levels across all games!</p>
          </div>
          
          <div className="achievement-badges">
            <div className="badge unlocked">
              <div className="badge-icon">🏆</div>
              <p>First Game</p>
            </div>
            <div className="badge unlocked">
              <div className="badge-icon">🌟</div>
              <p>Mindfulness</p>
            </div>
            <div className="badge">
              <div className="badge-icon">🧩</div>
              <p>Puzzle Master</p>
            </div>
            <div className="badge">
              <div className="badge-icon">🛡️</div>
              <p>Safety Pro</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamesPage;