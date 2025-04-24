import React, { useState, useEffect } from 'react';
import { FaStar, FaSearch, FaFilter, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaCheck, FaClock, FaMapMarkerAlt, FaLanguage } from 'react-icons/fa';
import Navbar from '../components/Home/Navbar';
import './TalkToCounselorPage.css';
import Chatbot from '../Chatbot/Chatbot';
import EmergencyButton from '../EmergencyButton';
import { useHistory } from 'react-router-dom';
import men from '../assets/men.png';
import women from '../assets/women.png';

const TalkToCounselorPage = () => {
    const history = useHistory();
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCounselor, setSelectedCounselor] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [filters, setFilters] = useState({
        specializations: [],
        minRating: 0,
        languages: [],
        availability: 'any',
        verified: false
    });
    const [showFilters, setShowFilters] = useState(false);

    // Get the next 7 days for booking calendar
    const getDates = () => {
        const dates = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        
        return dates;
    };

    // Mock time slots
    const getTimeSlots = () => {
        return [
            "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
            "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
        ];
    };

    // Format date for display
    const formatDate = (date) => {
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    };

    // Check if a date is today
    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() && 
               date.getMonth() === today.getMonth() && 
               date.getFullYear() === today.getFullYear();
    };

    // Fetch counselors data
    useEffect(() => {
        // Simulate API call to fetch counselors
        const fetchCounselors = async () => {
            setLoading(true);
            try {
                // This would be replaced with your actual API call
                setTimeout(() => {
                    setCounselors([
                        {
                            id: 1,
                            name: "Dr. Saleem Akbar",
                            title: "Clinical Psychologist",
                            rating: 4.7,
                            reviewsCount: 124,
                            specializations: ["Cognitive Behavioral Therapy", "Anger Management", "Hypnotherapy"],
                            experience: 22,
                            languages: ["English", "Tamil"],
                            hourlyRate: 1200,
                            location: "Dindigul, Tamil Nadu",
                            bio: "Dr. Saleem Akbar has over two decades of experience in counseling psychology, offering services in various therapeutic modalities.",
                            verified: true,
                            availability: "Available Today",
                            profileImg: men
                        },
                        {
                            id: 2,
                            name: "P. Jeya Bala",
                            title: "Counseling Psychologist",
                            rating: 4.5,
                            reviewsCount: 98,
                            specializations: ["Counseling Psychology", "Cognitive Behavioral Therapy", "Stress Management", "Anger Management"],
                            experience: 15,
                            languages: ["English", "Tamil"],
                            hourlyRate: 900,
                            location: "Dindigul, Tamil Nadu",
                            bio: "P. Jeya Bala specializes in counseling psychology with a focus on stress and anger management.",
                            verified: true,
                            availability: "Available Tomorrow",
                            profileImg: women
                        },
                        {
                            id: 3,
                            name: "Dr. Mahalakshmi S",
                            title: "Psychiatrist",
                            rating: 4.6,
                            reviewsCount: 112,
                            specializations: ["Psychiatry", "Depression Treatment", "Anxiety Disorders"],
                            experience: 18,
                            languages: ["English", "Tamil"],
                            hourlyRate: 1500,
                            location: "Madurai, Tamil Nadu",
                            bio: "Dr. Mahalakshmi practices at Ramana Hospital, offering psychiatric consultations and therapy.",
                            verified: true,
                            availability: "Available Today",
                            profileImg: women
                        },
                        {
                            id: 4,
                            name: "Kulandaisamy A",
                            title: "Psychiatric Social Worker",
                            rating: 4.4,
                            reviewsCount: 76,
                            specializations: ["Addiction", "Family Therapy"],
                            experience: 15,
                            languages: ["English", "Tamil"],
                            hourlyRate: 800,
                            location: "Palani, Tamil Nadu",
                            bio: "Kulandaisamy A is a Psychiatric Social Worker specializing in addiction and family therapy.",
                            verified: false,
                            availability: "Available in 2 Days",
                            profileImg: men
                        },
                        {
                            id: 5,
                            name: "Dr. Ambiliya Raj",
                            title: "Counseling Psychologist",
                            rating: 4.3,
                            reviewsCount: 63,
                            specializations: ["Counseling Psychology", "Psychotherapy"],
                            experience: 10,
                            languages: ["English", "Tamil"],
                            hourlyRate: 1000,
                            location: "Dindigul, Tamil Nadu",
                            bio: "Ambiliya Raj is a counseling psychologist at Mind Refresh Counselling & Psychotherapy Center.",
                            verified: true,
                            availability: "Available Today",
                            profileImg: men
                        },
                        {
                            id: 6,
                            name: "Ms. Rajalakshmi",
                            title: "Spiritual Psychologist",
                            rating: 4.5,
                            reviewsCount: 87,
                            specializations: ["Spiritually Based Psychotherapy", "Past Life Regression Therapy", "Pre-marital Counseling"],
                            experience: 5,
                            languages: ["English", "Tamil"],
                            hourlyRate: 1100,
                            location: "Madurai, Tamil Nadu",
                            bio: "Ms. Rajalakshmi is a psychologist specializing in spiritually based psychotherapy and counseling.",
                            verified: true,
                            availability: "Available Tomorrow",
                            profileImg: women
                        }
                    ]);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching counselors:", error);
                setLoading(false);
            }
        };

        fetchCounselors();
    }, []);

    // Filter counselors based on search term and filters
    const filteredCounselors = counselors.filter(counselor => {
        // Search term filter
        if (searchTerm && !counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !counselor.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))) {
            return false;
        }
        
        // Rating filter
        if (filters.minRating > 0 && counselor.rating < filters.minRating) {
            return false;
        }
        
        // Verified filter
        if (filters.verified && !counselor.verified) {
            return false;
        }
        
        // Specializations filter
        if (filters.specializations.length > 0 && 
            !counselor.specializations.some(spec => filters.specializations.includes(spec))) {
            return false;
        }
        
        // Languages filter
        if (filters.languages.length > 0 && 
            !counselor.languages.some(lang => filters.languages.includes(lang))) {
            return false;
        }
        
        // Availability filter
        if (filters.availability !== 'any') {
            if (filters.availability === 'today' && counselor.availability !== 'Available Today') {
                return false;
            } else if (filters.availability === 'tomorrow' && counselor.availability !== 'Available Tomorrow') {
                return false;
            }
        }
        
        return true;
    });

    // Handle filter changes
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => {
            if (filterType === 'specializations' || filterType === 'languages') {
                // Toggle the value in the array
                const currentValues = [...prev[filterType]];
                if (currentValues.includes(value)) {
                    return {
                        ...prev,
                        [filterType]: currentValues.filter(v => v !== value)
                    };
                } else {
                    return {
                        ...prev,
                        [filterType]: [...currentValues, value]
                    };
                }
            }
            
            return {
                ...prev,
                [filterType]: value
            };
        });
    };

    // Available specializations for filtering
    const availableSpecializations = [
        "Cognitive Behavioral Therapy", "Stress Management", "Anger Management", 
        "Depression Treatment", "Anxiety Disorders", "Family Therapy", 
        "Addiction", "Spiritually Based Psychotherapy"
    ];

    // Available languages for filtering
    const availableLanguages = ["English", "Tamil", "Hindi", "Telugu", "Malayalam"];

    // Handle booking submission
    const handleBookingSubmit = () => {
        // Simulate API call to book appointment
        setBookingSuccess(true);
        
        // Reset after displaying success message
        setTimeout(() => {
            setBookingSuccess(false);
            setShowBookingModal(false);
            setSelectedDate(null);
            setSelectedTimeSlot(null);
        }, 3000);
    };

    return (
        <>
            <Chatbot />
            <EmergencyButton />
            <Navbar />
            <div className="talk-counselor-page">
                {/* Header Section */}
                <div className="talk-counselor-header">
                    <div className="container">
                        <button onClick={() => history.push('/counselling')} className="back-link">
                            <FaChevronLeft /> Back to Counselling Options
                        </button>
                        <h1>Talk to a Professional Counselor</h1>
                        <p>Connect with our verified mental health professionals for personalized guidance and support</p>
                    </div>
                </div>
                
                {/* Search and Filter Section */}
                <div className="search-filter-section">
                    <div className="container">
                        <div className="search-bar">
                            <FaSearch className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search by name or specialization..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-toggle">
                            <button 
                                className={`filter-btn ${showFilters ? 'active' : ''}`} 
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Filter Panel */}
                {showFilters && (
                    <div className="filters-panel">
                        <div className="container">
                            <div className="filters-grid">
                                <div className="filter-group">
                                    <h3>Minimum Rating</h3>
                                    <div className="rating-buttons">
                                        {[0, 3, 3.5, 4, 4.5].map(rating => (
                                            <button 
                                                key={rating} 
                                                className={filters.minRating === rating ? 'active' : ''}
                                                onClick={() => handleFilterChange('minRating', rating)}
                                            >
                                                {rating === 0 ? 'Any' : rating+'+'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="filter-group">
                                    <h3>Specializations</h3>
                                    <div className="filter-tags">
                                        {availableSpecializations.map(spec => (
                                            <button 
                                                key={spec} 
                                                className={filters.specializations.includes(spec) ? 'active' : ''}
                                                onClick={() => handleFilterChange('specializations', spec)}
                                            >
                                                {spec}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="filter-group">
                                    <h3>Languages</h3>
                                    <div className="filter-tags">
                                        {availableLanguages.map(lang => (
                                            <button 
                                                key={lang} 
                                                className={filters.languages.includes(lang) ? 'active' : ''}
                                                onClick={() => handleFilterChange('languages', lang)}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="filter-group">
                                    <h3>Availability</h3>
                                    <div className="availability-options">
                                        <button 
                                            className={filters.availability === 'any' ? 'active' : ''}
                                            onClick={() => handleFilterChange('availability', 'any')}
                                        >
                                            Any Time
                                        </button>
                                        <button 
                                            className={filters.availability === 'today' ? 'active' : ''}
                                            onClick={() => handleFilterChange('availability', 'today')}
                                        >
                                            Today
                                        </button>
                                        <button 
                                            className={filters.availability === 'tomorrow' ? 'active' : ''}
                                            onClick={() => handleFilterChange('availability', 'tomorrow')}
                                        >
                                            Tomorrow
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="filter-group verified-filter">
                                    <h3>Verified Only</h3>
                                    <label className="toggle-switch">
                                        <input 
                                            type="checkbox"
                                            checked={filters.verified}
                                            onChange={() => handleFilterChange('verified', !filters.verified)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="filter-actions">
                                <button 
                                    className="clear-filters"
                                    onClick={() => setFilters({
                                        specializations: [],
                                        minRating: 0,
                                        languages: [],
                                        availability: 'any',
                                        verified: false
                                    })}
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Counselors List Section */}
                <div className="counselors-list-section">
                    <div className="container">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Finding available counselors...</p>
                            </div>
                        ) : filteredCounselors.length === 0 ? (
                            <div className="no-results">
                                <h2>No counselors match your search</h2>
                                <p>Try adjusting your filters or search term</p>
                                <button 
                                    className="reset-search" 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilters({
                                            specializations: [],
                                            minRating: 0,
                                            languages: [],
                                            availability: 'any',
                                            verified: false
                                        });
                                    }}
                                >
                                    Reset Search
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="results-count">
                                    <p>Showing <span>{filteredCounselors.length}</span> counselors</p>
                                </div>
                                <div className="counselors-grid">
                                    {filteredCounselors.map(counselor => (
                                        <div className="counselor-card" key={counselor.id}>
                                            <div className="counselor-header">
                                                <div className="counselor-img-container">
                                                    <img src={counselor.profileImg} alt={counselor.name} />
                                                    {counselor.verified && (
                                                        <span className="verified-badge" title="Verified Professional">
                                                            <FaCheck />
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="counselor-top-info">
                                                    <h3>{counselor.name}</h3>
                                                    <p className="counselor-title">{counselor.title}</p>
                                                    <div className="counselor-rating">
                                                        <div className="stars">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar 
                                                                    key={i} 
                                                                    className={i < Math.floor(counselor.rating) ? "filled" : ""}
                                                                />
                                                            ))}
                                                            <span className="rating-value">{counselor.rating}</span>
                                                        </div>
                                                        <span className="reviews-count">({counselor.reviewsCount})</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="specialization-tags">
                                                {counselor.specializations.slice(0, 3).map((spec, idx) => (
                                                    <span key={idx} className="tag">{spec}</span>
                                                ))}
                                                {counselor.specializations.length > 3 && (
                                                    <span className="tag more-tag">+{counselor.specializations.length - 3}</span>
                                                )}
                                            </div>
                                            
                                            <div className="counselor-quick-info">
                                                <div className="info-pill"><FaMapMarkerAlt /> {counselor.location}</div>
                                                <div className="info-pill"><FaLanguage /> {counselor.languages.join(', ')}</div>
                                                <div className="info-pill availability"><FaClock /> {counselor.availability}</div>
                                            </div>
                                            
                                            <div className="counselor-footer">
                                                <div className="price">
                                                    <span className="amount">₹{counselor.hourlyRate}</span>
                                                    <span className="period">per session</span>
                                                </div>
                                                <button 
                                                    className="schedule-btn"
                                                    onClick={() => {
                                                        setSelectedCounselor(counselor);
                                                        setShowBookingModal(true);
                                                    }}
                                                >
                                                    <FaCalendarAlt /> Schedule
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Booking Modal */}
                {showBookingModal && selectedCounselor && (
                    <div className="booking-modal-overlay">
                        <div className="booking-modal">
                            {bookingSuccess ? (
                                <div className="booking-success">
                                    <div className="success-icon">
                                        <FaCheck />
                                    </div>
                                    <h3>Booking Successful!</h3>
                                    <p>Your session with Dr. {selectedCounselor.name} has been scheduled.</p>
                                    <p>Check your email for details and confirmation.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="booking-header">
                                        <h3>Schedule a Call with {selectedCounselor.name}</h3>
                                        <button className="close-modal" onClick={() => setShowBookingModal(false)}>×</button>
                                    </div>
                                    <div className="booking-content">
                                        <div className="counselor-brief">
                                            <img src={selectedCounselor.profileImg} alt={selectedCounselor.name} />
                                            <div>
                                                <h4>{selectedCounselor.name}</h4>
                                                <p>{selectedCounselor.title}</p>
                                                <div className="stars small">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <FaStar 
                                                            key={star} 
                                                            className={star <= Math.floor(selectedCounselor.rating) ? "filled" : ""}
                                                        />
                                                    ))}
                                                    <span>{selectedCounselor.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="booking-form">
                                            <h4>Select a Date</h4>
                                            <div className="date-picker">
                                                {getDates().map((date, index) => (
                                                    <button 
                                                        key={index} 
                                                        className={`date-option ${selectedDate && selectedDate.getTime() === date.getTime() ? 'selected' : ''}`}
                                                        onClick={() => setSelectedDate(date)}
                                                    >
                                                        <span className="day">{formatDate(date).split(',')[0]}</span>
                                                        <span className="date">{date.getDate()}</span>
                                                        {isToday(date) && <span className="today-marker">Today</span>}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            {selectedDate && (
                                                <>
                                                    <h4>Select a Time</h4>
                                                    <div className="time-slots">
                                                        {getTimeSlots().map((timeSlot, index) => (
                                                            <button 
                                                                key={index}
                                                                className={`time-slot ${selectedTimeSlot === timeSlot ? 'selected' : ''}`}
                                                                onClick={() => setSelectedTimeSlot(timeSlot)}
                                                            >
                                                                {timeSlot}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                            
                                            <div className="session-summary">
                                                <h4>Session Summary</h4>
                                                <div className="summary-details">
                                                    <div className="summary-item">
                                                        <span>Duration:</span>
                                                        <span>60 minutes</span>
                                                    </div>
                                                    <div className="summary-item">
                                                        <span>Price:</span>
                                                        <span>₹{selectedCounselor.hourlyRate}</span>
                                                    </div>
                                                    {selectedDate && selectedTimeSlot && (
                                                        <div className="summary-item">
                                                            <span>Scheduled for:</span>
                                                            <span>{formatDate(selectedDate)} at {selectedTimeSlot}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="booking-actions">
                                                <button 
                                                    className="cancel-btn" 
                                                    onClick={() => setShowBookingModal(false)}
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    className="confirm-btn"
                                                    disabled={!selectedDate || !selectedTimeSlot}
                                                    onClick={handleBookingSubmit}
                                                >
                                                    Confirm Booking
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TalkToCounselorPage;