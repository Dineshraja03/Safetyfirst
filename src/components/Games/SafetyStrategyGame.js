import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import GameLayout from './GameLayout';
import { FaShieldAlt, FaLock, FaUserSecret, FaWifi, FaSave, FaCheck, FaUndo, FaTrophy, FaTimes } from 'react-icons/fa';
import './SafetyStrategyGame.css';

const SafetyStrategyGame = () => {
  const history = useHistory();
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedDefense, setSelectedDefense] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    threats: [],
    defenses: [],
    availableDefenses: [],
    gameOver: false,
    gameWon: false,
    timeRemaining: 60,
    paused: false,
    feedbackMessage: '',
    userStreak: 0,
    threatInterval: null
  });

  // Handle close/exit game
  const handleClose = () => {
    // Clean up any intervals
    if (gameState.threatInterval) {
      clearInterval(gameState.threatInterval);
    }
    // Navigate back to games page
    history.push('/games');
  };

  // All your existing defense and threat data
  const allDefenses = [
    { id: 'password', name: 'Strong Password', icon: <FaLock />, power: 3, description: 'Creates a strong barrier against basic threats', cooldown: 0 },
    { id: 'vpn', name: 'VPN', icon: <FaWifi />, power: 2, description: 'Hides your identity online', cooldown: 0 },
    { id: 'privacy', name: 'Privacy Settings', icon: <FaUserSecret />, power: 2, description: 'Limits data collection', cooldown: 0 },
    { id: 'backup', name: 'Data Backup', icon: <FaSave />, power: 1, description: 'Protects against data loss', cooldown: 0 },
    { id: 'shield', name: 'Antivirus', icon: <FaShieldAlt />, power: 4, description: 'Stops malware attacks', cooldown: 0 }
  ];

  const threatTypes = [
    { type: 'virus', name: 'Malware Attack', power: 3, speed: 5000, color: '#e74c3c' },
    { type: 'phishing', name: 'Phishing Attempt', power: 2, speed: 6000, color: '#f39c12' },
    { type: 'hacker', name: 'Hacker Intrusion', power: 4, speed: 7000, color: '#8e44ad' },
    { type: 'dataLeak', name: 'Data Leak', power: 3, speed: 6500, color: '#3498db' },
    { type: 'scam', name: 'Online Scam', power: 2, speed: 5500, color: '#e67e22' }
  ];

  // Initialize game
  useEffect(() => {
    if (!showInstructions) {
      startGame();
    }
    
    return () => {
      if (gameState.threatInterval) {
        clearInterval(gameState.threatInterval);
      }
    };
  }, [showInstructions]);

  // Timer countdown
  useEffect(() => {
    if (showInstructions || gameState.paused || gameState.gameOver || gameState.gameWon) {
      return;
    }

    const timer = setInterval(() => {
      setGameState(prev => {
        const newTime = prev.timeRemaining - 1;
        
        if (newTime <= 0) {
          clearInterval(timer);
          return {
            ...prev,
            gameOver: true,
            timeRemaining: 0
          };
        }
        
        return {
          ...prev,
          timeRemaining: newTime
        };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [showInstructions, gameState.paused, gameState.gameOver, gameState.gameWon]);

  // Start the game
  const startGame = () => {
    const threatInterval = setInterval(() => {
      if (!gameState.paused && !gameState.gameOver && !gameState.gameWon) {
        spawnThreat();
      }
    }, 2000 + Math.random() * 2000); // Random time between 2-4 seconds
    
    setGameState(prev => ({
      ...prev,
      threatInterval,
      availableDefenses: getInitialDefenses(),
      threats: [],
      score: 0,
      timeRemaining: 60,
      paused: false,
      gameOver: false,
      gameWon: false
    }));
  };

  // Get starting defenses based on level
  const getInitialDefenses = () => {
    // For level 1, give three random defenses
    const shuffled = [...allDefenses].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Spawn a new threat
  const spawnThreat = () => {
    setGameState(prev => {
      const randomThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      const newThreat = {
        id: Date.now(),
        ...randomThreat,
        position: Math.floor(Math.random() * 80) + 10, // Random horizontal position (10-90%)
        progress: 0,
        defeated: false
      };
      
      return {
        ...prev,
        threats: [...prev.threats, newThreat]
      };
    });
  };

  // Update threats position
  useEffect(() => {
    if (showInstructions || gameState.paused || gameState.gameOver || gameState.gameWon) {
      return;
    }

    const threatProgress = setInterval(() => {
      setGameState(prev => {
        const updatedThreats = prev.threats.map(threat => {
          if (threat.defeated) return threat;
          
          const newProgress = threat.progress + (0.5 * (threat.power / 2));
          
          if (newProgress >= 100) {
            // Threat reached the core
            return {
              ...threat, 
              progress: 100, 
              defeated: false
            };
          }
          
          return {
            ...threat,
            progress: newProgress
          };
        });
        
        // Check if any non-defeated threat reached the core
        const threatReachedCore = updatedThreats.some(t => t.progress >= 100 && !t.defeated);
        
        // Calculate current score based on defeated threats
        const newScore = prev.score;
        
        // Check if player won (reached target score)
        const targetScore = prev.level * 10;
        const gameWon = newScore >= targetScore && !threatReachedCore;
        
        return {
          ...prev,
          threats: updatedThreats,
          gameOver: threatReachedCore,
          gameWon: gameWon
        };
      });
    }, 100);
    
    return () => clearInterval(threatProgress);
  }, [showInstructions, gameState.paused, gameState.gameOver, gameState.gameWon]);

  // Use a defense against a threat
  const useDefense = (defenseId, threatId) => {
    setGameState(prev => {
      // Find the defense and threat
      const defense = prev.availableDefenses.find(d => d.id === defenseId);
      const threatIndex = prev.threats.findIndex(t => t.id === threatId);
      
      if (!defense || threatIndex === -1) return prev;
      
      const threat = prev.threats[threatIndex];
      
      // Check if defense is effective against this threat
      const effectiveness = calculateEffectiveness(defense, threat);
      let isEffective = false;
      let newUserStreak = prev.userStreak;
      let feedback = '';
      
      if (effectiveness > 0) {
        isEffective = true;
        newUserStreak += 1;
        feedback = `${defense.name} was effective against ${threat.name}! +${effectiveness} points`;
      } else {
        newUserStreak = 0;
        feedback = `${defense.name} wasn't effective against ${threat.name}. Try another strategy!`;
      }
      
      // Update the threat (mark as defeated if the defense was effective)
      const updatedThreats = [...prev.threats];
      updatedThreats[threatIndex] = {
        ...threat,
        defeated: isEffective
      };
      
      // Calculate score bonus
      const streakBonus = Math.floor(newUserStreak / 3); // Bonus point for every 3 consecutive good moves
      const scoreIncrease = isEffective ? effectiveness + streakBonus : 0;
      
      return {
        ...prev,
        threats: updatedThreats,
        score: prev.score + scoreIncrease,
        userStreak: newUserStreak,
        feedbackMessage: feedback
      };
    });
    
    // Clear feedback message after a delay
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        feedbackMessage: ''
      }));
    }, 3000);
  };
  
  // Calculate how effective a defense is against a threat (0 = not effective, 1-5 = effectiveness level)
  const calculateEffectiveness = (defense, threat) => {
    // Simple matching logic - can be expanded for more complex game mechanics
    switch (threat.type) {
      case 'virus':
        return defense.id === 'shield' ? defense.power : 0;
      case 'phishing':
        return defense.id === 'privacy' || defense.id === 'shield' ? defense.power - 1 : 0;
      case 'hacker':
        return defense.id === 'password' || defense.id === 'vpn' ? defense.power : 0;
      case 'dataLeak':
        return defense.id === 'backup' || defense.id === 'privacy' ? defense.power : 0;
      case 'scam':
        return defense.id === 'privacy' || defense.id === 'shield' ? defense.power - 1 : 0;
      default:
        return 0;
    }
  };

  // Start next level
  const nextLevel = () => {
    setGameState(prev => ({
      ...prev,
      level: prev.level + 1,
      gameWon: false,
      gameOver: false,
      timeRemaining: 60 + (prev.level * 10), // More time for higher levels
      threats: [],
      availableDefenses: [...allDefenses], // All defenses available for higher levels
      score: 0
    }));
  };

  // Restart the game
  const restartGame = () => {
    // Clear the old interval
    if (gameState.threatInterval) {
      clearInterval(gameState.threatInterval);
    }
    
    setGameState(prev => ({
      ...prev,
      score: 0,
      level: 1,
      threats: [],
      defenses: [],
      availableDefenses: [],
      gameOver: false,
      gameWon: false,
      threatInterval: null,
      timeRemaining: 60,
      paused: false,
      feedbackMessage: '',
      userStreak: 0
    }));
    
    // Re-initialize the game
    startGame();
  };

  // Toggle pause state
  const togglePause = () => {
    setGameState(prev => ({
      ...prev,
      paused: !prev.paused
    }));
  };

  // Close instructions and start game
  const closeInstructions = () => {
    setShowInstructions(false);
  };

  // Render game instructions
  const renderInstructions = () => (
    <div className="game-instructions-overlay">
      <div className="game-instructions">
        <h2>Safety Strategy Game</h2>
        <h3>How to Play:</h3>
        <ol>
          <li>Cyber threats will approach your digital fortress from the outside</li>
          <li>Select a defense tool and click on an approaching threat to stop it</li>
          <li>Different threats require different defense tools</li>
          <li>If a threat reaches your core, you lose</li>
          <li>Reach the target score to advance to the next level</li>
        </ol>
        
        <div className="defenses-guide">
          <h3>Defense Tools:</h3>
          <div className="defense-guide-items">
            {allDefenses.map(defense => (
              <div key={defense.id} className="defense-guide-item">
                <div className="defense-icon">{defense.icon}</div>
                <div className="defense-info">
                  <h4>{defense.name}</h4>
                  <p>{defense.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="threats-guide">
          <h3>Common Threats:</h3>
          <div className="threat-guide-items">
            {threatTypes.map(threat => (
              <div key={threat.type} className="threat-guide-item">
                <div className="threat-color" style={{backgroundColor: threat.color}}></div>
                <div className="threat-info">
                  <h4>{threat.name}</h4>
                  <p>Power: {Array(threat.power).fill('⚡').join('')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button className="start-game-button" onClick={closeInstructions}>
          Start Game
        </button>
      </div>
    </div>
  );

  // Render game over screen
  const renderGameOver = () => (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h2>Game Over</h2>
        <p>Your digital fortress was breached!</p>
        <p>Score: {gameState.score}</p>
        <p>Level: {gameState.level}</p>
        <div className="game-over-buttons">
          <button onClick={restartGame}>Try Again</button>
          <button onClick={handleClose}>Exit Game</button>
        </div>
      </div>
    </div>
  );

  // Render game won screen
  const renderGameWon = () => (
    <div className="game-won-overlay">
      <div className="game-won-content">
        <h2>Level Complete!</h2>
        <p>You've successfully defended your digital fortress!</p>
        <p>Score: {gameState.score}</p>
        <p>Level: {gameState.level}</p>
        <div className="game-won-buttons">
          <button onClick={nextLevel}>Next Level</button>
          <button onClick={handleClose}>Exit Game</button>
        </div>
      </div>
    </div>
  );

  // Instructions text - this is important for GameLayout
  const instructions = `
    <p>Safety Strategy Game helps you learn about online safety:</p>
    <ol>
      <li><strong>Defend Your Digital Fortress</strong> - Cyber threats will approach from the outside. Stop them before they reach your core!</li>
      <li><strong>Choose the Right Tools</strong> - Different defense tools work against specific threats:</li>
      <ul>
        <li>Strong Password - effective against hacker intrusions</li>
        <li>VPN - hides your identity from hackers</li>
        <li>Privacy Settings - helps with phishing and data leaks</li>
        <li>Data Backup - protects against data loss</li>
        <li>Antivirus - stops malware and some scams</li>
      </ul>
      <li><strong>Advance Through Levels</strong> - Each level brings new challenges and threats. Reach the target score to advance!</li>
    </ol>
  `;

  return (
    <GameLayout
      title="Safety Strategy Game"
      description="Learn online safety by defending against cyber threats."
      showInstructions={showInstructions ? instructions : false}
      setShowInstructions={setShowInstructions}
    >
      <div className="safety-strategy-container">
        <div className="game-header">
          <h2>Digital Fortress: Safety Strategy Game</h2>
          <div className="game-stats">
            <div className="stat">Level: {gameState.level}</div>
            <div className="stat">Score: {gameState.score}/{gameState.level * 10}</div>
            <div className="stat">Time: {gameState.timeRemaining}s</div>
            <button className="close-game-button" onClick={handleClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className={`game-arena ${gameState.paused ? 'paused' : ''}`}>
          {/* Digital fortress (center) */}
          <div className="digital-fortress">
            <div className="fortress-core"></div>
          </div>

          {/* Threats approaching the fortress */}
          {gameState.threats.map(threat => (
            <div 
              key={threat.id}
              className={`threat ${threat.defeated ? 'defeated' : ''}`}
              style={{ 
                left: `${threat.position}%`, 
                bottom: `${threat.progress}%`,
                backgroundColor: threat.color
              }}
              onClick={() => {
                if (!selectedDefense) return;
                useDefense(selectedDefense, threat.id);
                setSelectedDefense(null);
              }}
            >
              <div className="threat-name">{threat.name}</div>
              {threat.defeated && <FaCheck className="defeated-icon" />}
            </div>
          ))}
        </div>

        {/* Defense tools */}
        <div className="defense-panel">
          <h3>Defense Tools</h3>
          <div className="available-defenses">
            {gameState.availableDefenses.map(defense => (
              <div 
                key={defense.id}
                className={`defense-tool ${selectedDefense === defense.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedDefense(selectedDefense === defense.id ? null : defense.id);
                }}
              >
                <div className="defense-icon">{defense.icon}</div>
                <div className="defense-name">{defense.name}</div>
              </div>
            ))}
          </div>
          
          <div className="game-controls">
            <button onClick={togglePause}>
              {gameState.paused ? 'Resume Game' : 'Pause Game'}
            </button>
            <button onClick={restartGame} className="restart-button">
              <FaUndo /> Restart
            </button>
          </div>
        </div>

        {gameState.feedbackMessage && (
          <div className="feedback-message">
            {gameState.feedbackMessage}
          </div>
        )}

        {showInstructions && renderInstructions()}
        {gameState.gameOver && !showInstructions && renderGameOver()}
        {gameState.gameWon && !showInstructions && renderGameWon()}
      </div>
    </GameLayout>
  );
};

export default SafetyStrategyGame;