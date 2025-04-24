import React, { useState, useRef, useEffect } from 'react';
import GameLayout from './GameLayout';
import { FaSmile, FaFrown, FaMeh, FaAngry, FaSurprise, FaTrophy, FaCheck } from 'react-icons/fa';
import './EmotionPuzzleGame.css';

const EmotionPuzzleGame = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [draggedEmotion, setDraggedEmotion] = useState(null);
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Game levels
  const levels = [
    {
      title: "Matching Emotions",
      description: "Match the emotion to the correct scenario by dragging the emotion to the scenario.",
      scenarios: [
        { 
          id: "scenario1", 
          text: "Your friend invited you to their birthday party.",
          correctEmotion: "happy" 
        },
        { 
          id: "scenario2", 
          text: "You lost your favorite toy.",
          correctEmotion: "sad" 
        },
        { 
          id: "scenario3", 
          text: "Someone took your snack without asking.",
          correctEmotion: "angry" 
        }
      ],
      emotions: ["happy", "sad", "angry", "surprised"]
    },
    {
      title: "Identifying Feelings",
      description: "Read each situation and select what you would feel in that moment.",
      scenarios: [
        { 
          id: "scenario1", 
          text: "You're about to go on a rollercoaster for the first time.",
          correctEmotion: "scared", 
          options: ["happy", "scared", "sad", "angry"] 
        },
        { 
          id: "scenario2", 
          text: "You got a much lower grade than you expected.",
          correctEmotion: "disappointed", 
          options: ["surprised", "happy", "disappointed", "angry"] 
        },
        { 
          id: "scenario3", 
          text: "Your friend shares their snack with you.",
          correctEmotion: "grateful", 
          options: ["grateful", "jealous", "indifferent", "excited"] 
        },
        { 
          id: "scenario4", 
          text: "You see a friend being bullied.",
          correctEmotion: "concerned", 
          options: ["amused", "concerned", "indifferent", "confused"] 
        }
      ]
    },
    {
      title: "Emotions in Context",
      description: "For each situation, choose whether the emotion is appropriate or not.",
      scenarios: [
        { 
          id: "scenario1", 
          text: "Your sibling broke your toy and you feel angry.",
          emotion: "angry",
          correct: "appropriate" 
        },
        { 
          id: "scenario2", 
          text: "Your friend got a new bike and you feel jealous and want to damage it.",
          emotion: "vindictive",
          correct: "inappropriate" 
        },
        { 
          id: "scenario3", 
          text: "You feel happy when you see someone get hurt.",
          emotion: "happy",
          correct: "inappropriate" 
        },
        { 
          id: "scenario4", 
          text: "You feel nervous before giving a presentation in class.",
          emotion: "nervous",
          correct: "appropriate" 
        }
      ]
    }
  ];

  const emotionIcons = {
    happy: <FaSmile style={{ color: '#FFD700' }} />,
    sad: <FaFrown style={{ color: '#4682B4' }} />,
    angry: <FaAngry style={{ color: '#FF6347' }} />,
    surprised: <FaSurprise style={{ color: '#9370DB' }} />,
    scared: <FaFrown style={{ color: '#800080' }} />,
    disappointed: <FaMeh style={{ color: '#708090' }} />,
    grateful: <FaSmile style={{ color: '#32CD32' }} />,
    jealous: <FaMeh style={{ color: '#228B22' }} />,
    indifferent: <FaMeh style={{ color: '#A9A9A9' }} />,
    excited: <FaSmile style={{ color: '#FF69B4' }} />,
    amused: <FaSmile style={{ color: '#FF8C00' }} />,
    concerned: <FaMeh style={{ color: '#6495ED' }} />,
    confused: <FaMeh style={{ color: '#DDA0DD' }} />,
    nervous: <FaMeh style={{ color: '#FF7F50' }} />,
    vindictive: <FaAngry style={{ color: '#800000' }} />
  };

  // Track completed scenarios for the current level
  const [completedScenarios, setCompletedScenarios] = useState([]);

  // Handle drag and drop for level 1
  const handleDragStart = (e, emotion) => {
    setDraggedEmotion(emotion);
    dragItem.current = emotion;
  };

  const handleDragEnter = (e, scenarioId) => {
    e.preventDefault();
    dragOverItem.current = scenarioId;
  };

  const handleDrop = (e, scenarioId) => {
    e.preventDefault();
    const scenario = levels[currentLevel].scenarios.find(s => s.id === scenarioId);
    
    if (draggedEmotion === scenario.correctEmotion) {
      // Correct match
      if (!completedScenarios.includes(scenarioId)) {
        setScore(score + 10);
        setCompletedScenarios([...completedScenarios, scenarioId]);
        setFeedback({
          type: 'success',
          message: 'Correct! Good job identifying the emotion.'
        });
      }
    } else {
      // Wrong match
      setFeedback({
        type: 'error',
        message: `Not quite. Try thinking about how you might feel in this situation.`
      });
    }
  };

  // Handle choice selection for level 2
  const handleEmotionSelect = (emotion, scenarioId) => {
    setSelectedEmotion(emotion);
    const scenario = levels[currentLevel].scenarios.find(s => s.id === scenarioId);
    
    if (emotion === scenario.correctEmotion) {
      // Correct choice
      if (!completedScenarios.includes(scenarioId)) {
        setScore(score + 10);
        setCompletedScenarios([...completedScenarios, scenarioId]);
        setFeedback({
          type: 'success',
          message: 'That\'s right! You correctly identified the emotion.'
        });
      }
    } else {
      // Wrong choice
      setFeedback({
        type: 'error',
        message: 'That\'s not quite right. Think again about how you might feel in this situation.'
      });
    }
  };

  // Handle appropriateness judgment for level 3
  const handleAppropriatenessJudgment = (judgment, scenarioId) => {
    const scenario = levels[currentLevel].scenarios.find(s => s.id === scenarioId);
    
    if (judgment === scenario.correct) {
      // Correct judgment
      if (!completedScenarios.includes(scenarioId)) {
        setScore(score + 10);
        setCompletedScenarios([...completedScenarios, scenarioId]);
        setFeedback({
          type: 'success',
          message: 'Great judgment! You correctly assessed the appropriateness of the emotion.'
        });
      }
    } else {
      // Wrong judgment
      setFeedback({
        type: 'error',
        message: 'Think again about whether this emotion is helpful or harmful in this situation.'
      });
    }
  };

  // Check if all scenarios in current level are completed
  useEffect(() => {
    if (completedScenarios.length === levels[currentLevel].scenarios.length) {
      setTimeout(() => {
        if (currentLevel < levels.length - 1) {
          setCurrentLevel(currentLevel + 1);
          setCompletedScenarios([]);
          setFeedback(null);
        } else {
          setIsComplete(true);
        }
      }, 1500);
    }
  }, [completedScenarios, currentLevel]);

  // Clear feedback message after 3 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Instructions text
  const instructions = `
    <p>Emotion Puzzle helps you understand and identify emotions in different situations:</p>
    <ol>
      <li><strong>Level 1: Matching Emotions</strong> - Drag the emotion icons to match with the appropriate scenarios.</li>
      <li><strong>Level 2: Identifying Feelings</strong> - Read each scenario and select what you would feel in that situation.</li>
      <li><strong>Level 3: Emotions in Context</strong> - Decide if the described emotions are appropriate or inappropriate for each situation.</li>
    </ol>
    <p>Completing each level will help you develop emotional intelligence and empathy!</p>
  `;

  return (
    <GameLayout
      title="Emotion Puzzle"
      description="Match emotions to scenarios and learn to identify feelings in different situations."
      showInstructions={showInstructions ? instructions : false}
      setShowInstructions={setShowInstructions}
    >
      {!isComplete ? (
        <div className="emotion-puzzle-container">
          <div className="level-header">
            <div>
              <h2>{levels[currentLevel].title}</h2>
              <p>{levels[currentLevel].description}</p>
            </div>
            <div className="score-display">
              <span>Score: {score}</span>
            </div>
          </div>
          
          <div className="game-area">
            {/* Level 1: Drag and drop matching */}
            {currentLevel === 0 && (
              <div className="matching-game">
                <div className="scenarios-container">
                  {levels[0].scenarios.map((scenario) => (
                    <div 
                      key={scenario.id}
                      className={`scenario-card ${completedScenarios.includes(scenario.id) ? 'completed' : ''}`}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnter={(e) => handleDragEnter(e, scenario.id)}
                      onDrop={(e) => handleDrop(e, scenario.id)}
                    >
                      <p>{scenario.text}</p>
                      <div className="drop-area">
                        {completedScenarios.includes(scenario.id) ? (
                          <div className="correct-emotion">
                            {emotionIcons[scenario.correctEmotion]}
                            <span>{scenario.correctEmotion}</span>
                            <FaCheck className="check-icon" />
                          </div>
                        ) : (
                          <span className="drop-placeholder">Drop emotion here</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="emotions-container">
                  {levels[0].emotions.map((emotion) => (
                    <div 
                      key={emotion}
                      className="emotion-item"
                      draggable
                      onDragStart={(e) => handleDragStart(e, emotion)}
                    >
                      {emotionIcons[emotion]}
                      <span>{emotion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Level 2: Multiple choice */}
            {currentLevel === 1 && (
              <div className="multiple-choice-game">
                {levels[1].scenarios.map((scenario) => (
                  <div 
                    key={scenario.id}
                    className={`scenario-card ${completedScenarios.includes(scenario.id) ? 'completed' : ''}`}
                  >
                    <p>{scenario.text}</p>
                    <div className="emotion-options">
                      {scenario.options.map((option) => (
                        <button
                          key={option}
                          className={`emotion-option ${completedScenarios.includes(scenario.id) && scenario.correctEmotion === option ? 'correct' : ''}`}
                          onClick={() => !completedScenarios.includes(scenario.id) && handleEmotionSelect(option, scenario.id)}
                          disabled={completedScenarios.includes(scenario.id)}
                        >
                          {emotionIcons[option]}
                          <span>{option}</span>
                          {completedScenarios.includes(scenario.id) && scenario.correctEmotion === option && (
                            <FaCheck className="check-icon" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Level 3: Appropriate or inappropriate */}
            {currentLevel === 2 && (
              <div className="appropriateness-game">
                {levels[2].scenarios.map((scenario) => (
                  <div 
                    key={scenario.id}
                    className={`scenario-card ${completedScenarios.includes(scenario.id) ? 'completed' : ''}`}
                  >
                    <div className="scenario-content">
                      <p>{scenario.text}</p>
                      <div className="emotion-label">
                        {emotionIcons[scenario.emotion]}
                        <span>{scenario.emotion}</span>
                      </div>
                    </div>
                    <div className="judgment-buttons">
                      <button 
                        className={`judgment-button ${completedScenarios.includes(scenario.id) && scenario.correct === 'appropriate' ? 'correct' : ''}`}
                        onClick={() => !completedScenarios.includes(scenario.id) && handleAppropriatenessJudgment('appropriate', scenario.id)}
                        disabled={completedScenarios.includes(scenario.id)}
                      >
                        Appropriate
                        {completedScenarios.includes(scenario.id) && scenario.correct === 'appropriate' && (
                          <FaCheck className="check-icon" />
                        )}
                      </button>
                      <button 
                        className={`judgment-button ${completedScenarios.includes(scenario.id) && scenario.correct === 'inappropriate' ? 'correct' : ''}`}
                        onClick={() => !completedScenarios.includes(scenario.id) && handleAppropriatenessJudgment('inappropriate', scenario.id)}
                        disabled={completedScenarios.includes(scenario.id)}
                      >
                        Inappropriate
                        {completedScenarios.includes(scenario.id) && scenario.correct === 'inappropriate' && (
                          <FaCheck className="check-icon" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {feedback && (
            <div className={`feedback-message ${feedback.type}`}>
              {feedback.message}
            </div>
          )}

          <div className="level-progress">
            {levels.map((_, idx) => (
              <div 
                key={idx}
                className={`level-indicator ${currentLevel === idx ? 'active' : ''} ${currentLevel > idx ? 'completed' : ''}`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="game-complete">
          <div className="trophy-icon">
            <FaTrophy />
          </div>
          <h2>Well Done!</h2>
          <p>You've completed all levels of the Emotion Puzzle with a score of {score}!</p>
          <p>You've demonstrated excellent emotional intelligence and empathy skills.</p>
          <button className="game-button" onClick={() => window.location.href = '/games'}>
            Back to Games
          </button>
        </div>
      )}
    </GameLayout>
  );
};

export default EmotionPuzzleGame;