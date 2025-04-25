import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import GameLayout from './GameLayout';
import { FaRegCircle, FaCircle, FaCheck, FaLeaf, FaSun, FaHandPaper, FaSmile, FaArrowRight } from 'react-icons/fa';
import { MdAir, MdSentimentVerySatisfied, MdSentimentSatisfied, MdSentimentNeutral, MdSentimentDissatisfied } from 'react-icons/md';
import './MindfulnessGame.css';

// Helper for screen readers
const SROnly = ({ children }) => (
  <span className="sr-only">{children}</span>
);

// Animation component with proper transitions
const AnimatedDiv = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const MindfulnessGame = () => {
  const history = useHistory();
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale'); // inhale, hold, exhale
  const [isComplete, setIsComplete] = useState(false);
  const [fadeTransition, setFadeTransition] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  // Refs for cleanup
  const breathingTimersRef = useRef([]);
  const audioRef = useRef(null);
  const containerRef = useRef(null);

  // Body scan state
  const [bodyScanPart, setBodyScanPart] = useState(0);
  const bodyScanInstructions = [
    "Focus on your feet and toes. Notice any sensations - warmth, coolness, tension, or relaxation.",
    "Move your awareness to your legs. Feel the weight of them against the chair or floor.",
    "Bring attention to your abdomen and chest. Notice your breath moving in and out.",
    "Focus on your arms and hands. Are they tense or relaxed?",
    "Pay attention to your neck and shoulders. Release any tension you find there.",
    "Finally, bring awareness to your face and head. Relax your jaw, eyes, and forehead."
  ];

  // Grounding exercise state
  const [groundingCurrent, setGroundingCurrent] = useState(0);
  const [groundingInputs, setGroundingInputs] = useState(Array(5).fill().map(() => []));
  const groundingSteps = [
    { sense: "See", count: 5, instruction: "Look around and identify 5 things you can see.", icon: <FaLeaf /> },
    { sense: "Touch", count: 4, instruction: "Find 4 things you can feel or touch.", icon: <FaHandPaper /> },
    { sense: "Hear", count: 3, instruction: "Listen for 3 sounds in your environment.", icon: <MdAir /> },
    { sense: "Smell", count: 2, instruction: "Identify or imagine 2 things you can smell.", icon: <FaSun /> },
    { sense: "Taste", count: 1, instruction: "Notice or recall 1 thing you can taste.", icon: <FaSmile /> }
  ];

  // Create ambient sound for meditation with proper loading and error handling
  useEffect(() => {
    const audio = new Audio('/sounds/ambient-meditation.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    
    // Set up event listeners for proper audio loading
    audio.addEventListener('canplaythrough', () => setAudioLoaded(true));
    audio.addEventListener('error', () => console.warn("Audio failed to load"));
    
    // Preload audio
    audio.load();
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ''; // Clear source
        audioRef.current = null;
      }
      // Clean up any remaining timers
      breathingTimersRef.current.forEach(timer => clearTimeout(timer));
      breathingTimersRef.current = [];
    };
  }, []);

  // Smooth transition effect between steps
  useEffect(() => {
    if (fadeTransition) {
      const timer = setTimeout(() => {
        setFadeTransition(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fadeTransition]);

  // Focus management for accessibility
  useEffect(() => {
    // When changing steps, ensure focus is set properly
    if (containerRef.current && !fadeTransition) {
      containerRef.current.focus();
    }
  }, [currentStep, fadeTransition]);

  // Exercises definition
  const exercises = [
    {
      title: "Breath Awareness",
      description: "Start by taking 5 deep breaths. Click the circle to begin and follow the breathing pattern.",
      icon: <MdAir className="exercise-icon breath-icon" />,
      content: () => (
        <AnimatedDiv className="breath-exercise">
          <div 
            className={`breath-circle ${isBreathing ? `breath-${breathPhase}` : ''}`}
            onClick={() => {
              if (!isBreathing) startBreathingExercise();
            }}
            aria-live="polite"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isBreathing) startBreathingExercise();
            }}
            aria-label={isBreathing 
              ? `Currently ${breathPhase === 'inhale' ? 'inhaling' : breathPhase === 'hold' ? 'holding breath' : 'exhaling'}. ${breathCount} of 5 breaths completed.` 
              : 'Click to start breathing exercise'}
          >
            {isBreathing && breathPhase === 'inhale' && <p>Breathe In</p>}
            {isBreathing && breathPhase === 'hold' && <p>Hold</p>}
            {isBreathing && breathPhase === 'exhale' && <p>Breathe Out</p>}
            {!isBreathing && <p>Click to Begin</p>}
          </div>
          <div className="breath-counter">
            <span>{breathCount}/5 breaths</span>
          </div>
          <button 
            className="game-button" 
            onClick={() => {
              if (!isBreathing) startBreathingExercise();
            }}
            disabled={isBreathing}
            aria-label={isBreathing ? "Breathing exercise in progress" : "Start breathing exercise"}
          >
            {isBreathing ? 'Breathing...' : 'Start Breathing Exercise'}
          </button>
        </AnimatedDiv>
      ),
    },
    {
      title: "Body Scan",
      description: "Notice sensations in different parts of your body, from your toes to your head.",
      icon: <FaSun className="exercise-icon body-icon" />,
      content: () => (
        <AnimatedDiv className="body-scan">
          <div className="body-scan-image">
            <img src="/images/body-scan.svg" alt="Human body outline" />
            <div 
              className={`scan-highlight part-${bodyScanPart}`}
              aria-hidden="true"
            ></div>
          </div>
          <div className="body-scan-progress">
            {bodyScanInstructions.map((_, idx) => (
              <div 
                key={idx}
                className={`progress-indicator ${idx === bodyScanPart ? 'active' : ''} ${idx < bodyScanPart ? 'completed' : ''}`}
                aria-hidden="true"
              ></div>
            ))}
          </div>
          <p className="scan-instruction" aria-live="polite">
            {bodyScanInstructions[bodyScanPart]}
          </p>
          <button 
            className="game-button" 
            onClick={() => {
              if (bodyScanPart < 5) {
                setBodyScanPart(bodyScanPart + 1);
              } else {
                prepareNextStep();
              }
            }}
            aria-label={bodyScanPart < 5 ? 'Continue to next body part' : 'Complete body scan and continue'}
          >
            {bodyScanPart < 5 ? (
              <>Continue <FaArrowRight className="button-icon" aria-hidden="true" /></>
            ) : (
              'Complete Body Scan'
            )}
          </button>
        </AnimatedDiv>
      ),
    },
    {
      title: "Grounding Exercise",
      description: "Connect with your surroundings using all five senses to ground yourself in the present moment.",
      icon: <FaLeaf className="exercise-icon grounding-icon" />,
      content: () => (
        <AnimatedDiv className="grounding-exercise">
          <div className="grounding-progress">
            {groundingSteps.map((step, idx) => (
              <div 
                key={idx} 
                className={`grounding-step ${groundingCurrent === idx ? 'active' : ''} ${groundingCurrent > idx ? 'completed' : ''}`}
                aria-current={groundingCurrent === idx ? "step" : null}
              >
                <div className="step-icon" aria-hidden="true">
                  {step.icon}
                </div>
                <div className="step-number">{idx + 1}</div>
                <div className="step-label">{step.sense}</div>
                {groundingCurrent > idx && <FaCheck className="step-check" aria-hidden="true" />}
              </div>
            ))}
          </div>
          <div className="grounding-content">
            <h3>
              <span className="grounding-step-count">{groundingCurrent + 1}/5:</span> {groundingSteps[groundingCurrent].sense}
            </h3>
            <p>{groundingSteps[groundingCurrent].instruction}</p>
            <div className="grounding-inputs">
              {Array(groundingSteps[groundingCurrent].count).fill().map((_, idx) => (
                <input 
                  key={idx}
                  type="text"
                  placeholder={`Enter something you can ${groundingSteps[groundingCurrent].sense.toLowerCase()}`}
                  value={(groundingInputs[groundingCurrent] && groundingInputs[groundingCurrent][idx]) || ''}
                  onChange={(e) => handleGroundingInput(idx, e.target.value)}
                  aria-label={`Item ${idx + 1} you can ${groundingSteps[groundingCurrent].sense.toLowerCase()}`}
                />
              ))}
            </div>
            <button 
              className="game-button" 
              onClick={handleGroundingNext} 
              disabled={!canProgressGrounding()}
              aria-label={groundingCurrent < groundingSteps.length - 1 
                ? `Continue to ${groundingSteps[groundingCurrent + 1].sense} sense` 
                : 'Complete the grounding exercise'}
            >
              {groundingCurrent < groundingSteps.length - 1 ? (
                <>Next: {groundingSteps[groundingCurrent + 1].sense} <FaArrowRight className="button-icon" aria-hidden="true" /></>
              ) : (
                'Complete Exercise'
              )}
            </button>
          </div>
        </AnimatedDiv>
      ),
    },
  ];

  // Prepare transition to next step with smooth animation
  const prepareNextStep = () => {
    setFadeTransition(true);
    
    // Clear any existing breath timers
    breathingTimersRef.current.forEach(timer => clearTimeout(timer));
    breathingTimersRef.current = [];
    
    // Stop audio if it's playing
    if (audioRef.current && !audioRef.current.paused) {
      fadeOutAudio(() => {
        audioRef.current.pause();
      });
    }
    
    setTimeout(() => {
      setCurrentStep(currentStep + 1);
      if (currentStep === 0) {
        setBodyScanPart(0);
      } else if (currentStep === 1) {
        setGroundingCurrent(0);
        setGroundingInputs(Array(5).fill([]));
      } else {
        setIsComplete(true);
      }
    }, 500);
  };

  // Breathing exercise with improved timing and animation
  const startBreathingExercise = () => {
    if (isBreathing) return;
    
    setIsBreathing(true);
    setBreathPhase('inhale');
    
    // Play ambient sound with fallback
    if (audioRef.current) {
      try {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn("Audio play prevented:", error);
            // Try again with user interaction later
          });
        }
      } catch (err) {
        console.warn("Audio playback error:", err);
      }
    }
    
    runBreathingCycle();
  };

  // Fade out audio smoothly
  const fadeOutAudio = (callback) => {
    if (!audioRef.current || audioRef.current.paused) {
      if (callback) callback();
      return;
    }
    
    const originalVolume = audioRef.current.volume;
    const fadeInterval = setInterval(() => {
      if (audioRef.current) {
        if (audioRef.current.volume > 0.05) {
          audioRef.current.volume -= 0.05;
        } else {
          clearInterval(fadeInterval);
          if (callback) callback();
          // Reset volume for future use
          audioRef.current.volume = originalVolume;
        }
      } else {
        clearInterval(fadeInterval);
        if (callback) callback();
      }
    }, 50);
  };

  const runBreathingCycle = () => {
    // Clear previous timers to avoid conflicts
    breathingTimersRef.current.forEach(timer => clearTimeout(timer));
    breathingTimersRef.current = [];
    
    // Inhale for 4 seconds
    const timer1 = setTimeout(() => {
      setBreathPhase('hold');
      // Hold for 4 seconds
      const timer2 = setTimeout(() => {
        setBreathPhase('exhale');
        // Exhale for 6 seconds
        const timer3 = setTimeout(() => {
          setBreathCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 5) {
              setIsBreathing(false);
              
              // Fade out sound
              if (audioRef.current && !audioRef.current.paused) {
                fadeOutAudio();
              }
              
              const timer4 = setTimeout(() => {
                prepareNextStep();
              }, 1000);
              breathingTimersRef.current.push(timer4);
              return 5;
            } else {
              setBreathPhase('inhale');
              runBreathingCycle();
              return newCount;
            }
          });
        }, 6000);
        breathingTimersRef.current.push(timer3);
      }, 4000);
      breathingTimersRef.current.push(timer2);
    }, 4000);
    breathingTimersRef.current.push(timer1);
  };

  // Improved grounding exercise handlers
  const handleGroundingInput = (index, value) => {
    setGroundingInputs(prevInputs => {
      const newInputs = [...prevInputs];
      if (!newInputs[groundingCurrent]) {
        newInputs[groundingCurrent] = [];
      }
      newInputs[groundingCurrent][index] = value;
      return newInputs;
    });
  };

  const canProgressGrounding = () => {
    const currentInputs = groundingInputs[groundingCurrent] || [];
    return currentInputs.filter(Boolean).length === groundingSteps[groundingCurrent].count;
  };

  const handleGroundingNext = () => {
    if (!canProgressGrounding()) return;
    
    if (groundingCurrent < groundingSteps.length - 1) {
      setGroundingCurrent(prev => prev + 1);
    } else {
      prepareNextStep();
    }
  };

  // Handle mood selection with smooth transition
  const handleMoodSelection = (mood) => {
    console.log(`User selected mood: ${mood}`);
    
    setFadeTransition(true);
    setTimeout(() => {
      history.push('/games');
    }, 800);
  };

  // Instructions text
  const instructions = `
    <p>Welcome to Mindfulness Journey, a guided meditation and awareness practice designed to help you reconnect with the present moment.</p>
    <h3>How to Practice:</h3>
    <ol>
      <li><strong>Breath Awareness</strong> - Follow the breathing circle to take deep, mindful breaths. This helps calm your nervous system and center your attention.</li>
      <li><strong>Body Scan</strong> - Bring attention to different parts of your body, noticing sensations without judgment. This practice develops bodily awareness and helps release tension.</li>
      <li><strong>Grounding Exercise</strong> - Connect with your surroundings using all five senses. This technique is particularly helpful for reducing anxiety and bringing you into the present moment.</li>
    </ol>
    <h3>Tips for Success:</h3>
    <ul>
      <li>Find a quiet space where you won't be disturbed.</li>
      <li>Take your time with each exercise. There's no rush.</li>
      <li>If your mind wanders, gently bring your attention back to the exercise.</li>
      <li>Practice non-judgment toward whatever arises during your practice.</li>
    </ul>
    <p>The goal is simply to be present with whatever you're experiencing right now.</p>
  `;

  return (
    <GameLayout
      title="Mindfulness Journey"
      description="A guided meditation experience to help you become more aware of your body, breath, and surroundings."
      showInstructions={showInstructions}
      setShowInstructions={setShowInstructions}
    >
      <React.Fragment>
        {!isComplete ? (
          <div 
            className={`mindfulness-container ${fadeTransition ? 'fade-out' : 'fade-in'}`}
            key="exercises"
            ref={containerRef}
            tabIndex={-1}
          >
            <div className="exercise-header">
              <div className="exercise-icon-wrapper">
                {exercises[currentStep].icon}
              </div>
              <h2>{exercises[currentStep].title}</h2>
              <p>{exercises[currentStep].description}</p>
            </div>
            
            <div className="exercise-content">
              {exercises[currentStep].content()}
            </div>
            
            <div className="exercise-progress" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin="1" aria-valuemax={exercises.length}>
              {exercises.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`progress-dot ${currentStep === idx ? 'active' : ''} ${currentStep > idx ? 'completed' : ''}`}
                  aria-hidden="true"
                >
                  {currentStep > idx ? <FaCircle /> : <FaRegCircle />}
                </span>
              ))}
              <SROnly>Step {currentStep + 1} of {exercises.length}</SROnly>
            </div>
          </div>
        ) : (
          <div 
            className="game-complete"
            key="complete"
            ref={containerRef}
            tabIndex={-1}
          >
            <div className="trophy-animation">
              <div className="trophy-icon">🏆</div>
              <div className="celebration-particles" aria-hidden="true">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="particle"></div>
                ))}
              </div>
            </div>
            <h2>Mindfulness Journey Complete!</h2>
            <p>Great job completing all mindfulness exercises. Taking time for self-awareness is an important part of mental health. How do you feel now?</p>
            <div className="mood-selection" role="group" aria-label="Select how you feel now">
              <button 
                className="mood-button" 
                onClick={() => handleMoodSelection('Very Calm')}
                aria-label="I feel very calm"
              >
                <MdSentimentVerySatisfied className="mood-icon" /> Very Calm
              </button>
              <button 
                className="mood-button" 
                onClick={() => handleMoodSelection('Calm')}
                aria-label="I feel calm"
              >
                <MdSentimentSatisfied className="mood-icon" /> Calm
              </button>
              <button 
                className="mood-button" 
                onClick={() => handleMoodSelection('Neutral')}
                aria-label="I feel neutral"
              >
                <MdSentimentNeutral className="mood-icon" /> Neutral
              </button>
              <button 
                className="mood-button" 
                onClick={() => handleMoodSelection('Still Stressed')}
                aria-label="I still feel stressed"
              >
                <MdSentimentDissatisfied className="mood-icon" /> Still Stressed
              </button>
            </div>
            <button 
              className="game-button" 
              onClick={() => history.push('/games')}
              aria-label="Return to games menu"
            >
              Return to Games
            </button>
          </div>
        )}
      </React.Fragment>
    </GameLayout>
  );
};

export default MindfulnessGame;