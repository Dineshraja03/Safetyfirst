import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Add this import
import { FaArrowRight, FaRedo, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import Navbar from '../components/Home/Navbar';
import './StressTest.css';

const StressTest = () => {
  const history = useHistory(); // Add this line
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [stressScore, setStressScore] = useState(0);
  const [stressLevel, setStressLevel] = useState('');
  const [animation, setAnimation] = useState('');
  
  const questions = [
    {
      id: 1,
      text: "Been upset because of something that happened unexpectedly?",
      isPositive: false
    },
    {
      id: 2,
      text: "Felt that you were unable to control important things in your life?",
      isPositive: false
    },
    {
      id: 3,
      text: "Felt nervous and 'stressed'?",
      isPositive: false
    },
    {
      id: 4,
      text: "Felt confident about your ability to handle your personal problems?",
      isPositive: true
    },
    {
      id: 5,
      text: "Felt that things were going your way?",
      isPositive: true
    },
    {
      id: 6,
      text: "Found that you could NOT cope with all the things you had to do?",
      isPositive: false
    },
    {
      id: 7,
      text: "Been able to control irritations in your life?",
      isPositive: true
    },
    {
      id: 8,
      text: "Felt that you were on top of things?",
      isPositive: true
    },
    {
      id: 9,
      text: "Been angered because of things that happened that were out of your control?",
      isPositive: false
    },
    {
      id: 10,
      text: "Felt difficulties were piling up so high that you could not overcome them?",
      isPositive: false
    }
  ];

  const options = [
    { value: 0, label: "Never" },
    { value: 1, label: "Almost Never" },
    { value: 2, label: "Sometimes" },
    { value: 3, label: "Fairly Often" },
    { value: 4, label: "Very Often" }
  ];

  const handleOptionSelect = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Auto-advance to next question after short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setAnimation('slide-out');
        
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          setAnimation('slide-in');
        }, 300);
      }
    }, 500);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setAnimation('slide-out-right');
      
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
        setAnimation('slide-in-left');
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setAnimation('slide-out');
      
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setAnimation('slide-in');
      }, 300);
    }
  };

  const calculateResults = () => {
    // Calculate raw score (0-40 scale)
    let totalScore = 0;
    
    questions.forEach(question => {
      const value = answers[question.id] || 0;
      
      // For positive questions, reverse the scoring
      if (question.isPositive) {
        totalScore += 4 - value;
      } else {
        totalScore += value;
      }
    });
    
    // Convert to 0-100 scale
    const normalizedScore = Math.round((totalScore / 40) * 100);
    setStressScore(normalizedScore);
    
    // Set stress level category
    if (normalizedScore < 25) {
      setStressLevel('Low Stress');
    } else if (normalizedScore < 50) {
      setStressLevel('Moderate Stress');
    } else if (normalizedScore < 75) {
      setStressLevel('High Stress');
    } else {
      setStressLevel('Very High Stress');
    }
    
    setShowResults(true);
  };

  const handleSubmit = () => {
    calculateResults();
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setStressScore(0);
    setAnimation('slide-in');
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  const getRecommendations = () => {
    if (stressScore < 25) {
      return [
        "Maintain your healthy lifestyle and coping mechanisms",
        "Continue regular exercise and relaxation techniques",
        "Keep up your social connections and support network",
        "Practice gratitude journaling to maintain positive outlook"
      ];
    } else if (stressScore < 50) {
      return [
        "Incorporate more regular relaxation techniques into your routine",
        "Practice mindfulness meditation for 10 minutes daily",
        "Ensure you're getting enough quality sleep",
        "Consider time management strategies for better work-life balance"
      ];
    } else if (stressScore < 75) {
      return [
        "Schedule time for self-care activities each day",
        "Try deep breathing exercises when feeling overwhelmed",
        "Consider talking to a friend or family member about your stressors",
        "Limit caffeine and alcohol which can exacerbate stress",
        "Explore professional counseling options for additional support"
      ];
    } else {
      return [
        "Consider speaking with a mental health professional",
        "Prioritize stress reduction in your daily routine",
        "Implement immediate coping strategies like deep breathing and progressive muscle relaxation",
        "Evaluate responsibilities that could be delegated or postponed",
        "Make sleep, nutrition and exercise priorities",
        "Connect with supportive friends and family"
      ];
    }
  };

  const getColorForStressLevel = () => {
    if (stressScore < 25) return "#4caf50"; // Green
    if (stressScore < 50) return "#ffca28"; // Amber
    if (stressScore < 75) return "#ff9800"; // Orange
    return "#f44336"; // Red
  };

  const answersCompleted = Object.keys(answers).length === questions.length;

  const handleStressReliefRedirect = () => {
    history.push('/games');
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Navbar />
      <div className="stress-test-container">
        <div className="stress-test-header">
          <h1>Stress Self-Assessment Tool</h1>
          <p className="subtitle">
            Based on the Perceived Stress Scale (PSS-10), a widely used psychological 
            instrument for measuring perception of stress.
          </p>
        </div>

        {!showResults ? (
          <div className="test-section">
            <div className="progress-bar-container">
              <div className="progress-text">Question {currentQuestion + 1} of {questions.length}</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className={`question-container ${animation}`}>
              <h3>In the LAST MONTH, how often have you:</h3>
              <h2>{questions[currentQuestion].text}</h2>
              
              <div className="options-container">
                {options.map((option) => (
                  <button
                    key={option.value}
                    className={`option-button ${answers[questions[currentQuestion].id] === option.value ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(questions[currentQuestion].id, option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              <div className="navigation-buttons">
                <button 
                  className="nav-button prev"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </button>
                
                {currentQuestion < questions.length - 1 ? (
                  <button 
                    className="nav-button next"
                    onClick={handleNext}
                    disabled={!answers[questions[currentQuestion].id] && answers[questions[currentQuestion].id] !== 0}
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    className="nav-button submit"
                    onClick={handleSubmit}
                    disabled={!answersCompleted}
                  >
                    See Results <FaChartLine />
                  </button>
                )}
              </div>
              
              {!answersCompleted && currentQuestion === questions.length - 1 && (
                <div className="incomplete-warning">
                  <FaExclamationTriangle />
                  <p>Please answer all questions to see your results</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="results-container">
            <h2>Your Stress Assessment Results</h2>
            
            <div className="score-container">
              <div 
                className="score-circle"
                style={{ 
                  background: `conic-gradient(
                    ${getColorForStressLevel()} ${stressScore}%, 
                    #e0e0e0 ${stressScore}%
                  )` 
                }}
              >
                <div className="score-inner">
                  <span className="score-value">{stressScore}</span>
                  <span className="score-label">SCORE</span>
                </div>
              </div>
              
              <div className="stress-level" style={{ color: getColorForStressLevel() }}>
                {stressLevel}
              </div>
            </div>
            
            <div className="result-interpretation">
              <h3>What Your Score Means</h3>
              
              <p className="interpretation-text">
                {stressScore < 25 
                  ? "Your responses suggest you're experiencing low levels of perceived stress. You appear to have effective coping mechanisms in place."
                  : stressScore < 50 
                    ? "Your responses indicate moderate stress levels. While you're managing well in some areas, there may be some aspects of your life causing you concern."
                    : stressScore < 75 
                      ? "Your responses indicate high stress levels. You may be experiencing significant challenges in managing life's demands."
                      : "Your responses suggest very high stress levels. It appears you're facing substantial challenges that may be overwhelming your current coping capacity."
                }
              </p>
            </div>
            
            <div className="recommendations">
              <h3>Recommended Actions</h3>
              
              <ul className="recommendations-list">
                {getRecommendations().map((rec, index) => (
                  <li key={index}>
                    <span className="recommendation-bullet">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="results-actions">
              <button className="action-button retake" onClick={resetTest}>
                <FaRedo /> Retake Assessment
              </button>
              
              <button 
                className="action-button resources" 
                onClick={handleStressReliefRedirect}
              >
                <FaArrowRight /> Access Stress Relief Resources
              </button>
            </div>
            
            <div className="disclaimer">
              <p>
                <strong>Note:</strong> This self-assessment tool provides general information only and is not a diagnostic instrument. 
                If you're concerned about your stress levels, please consult with a qualified healthcare professional.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StressTest;