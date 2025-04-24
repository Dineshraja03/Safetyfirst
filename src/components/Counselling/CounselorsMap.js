import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaStar, FaPhone, FaEnvelope, FaCalendarAlt, FaArrowLeft, FaLocationArrow, FaFilter, FaCheck } from 'react-icons/fa';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './CounselorsMap.css';
import men from '../../assets/men.png';
import women from '../../assets/women.png'; 

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Create custom marker icons
const createCustomIcon = (verified) => {
    return L.divIcon({
        className: `custom-marker ${verified ? 'verified' : 'standard'}`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        html: `<div class="marker-inner ${verified ? 'verified' : 'standard'}"></div>`
    });
};

// Component to recenter map
function RecenterMap({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 13);
        }
    }, [map, position]);
    return null;
}

const CounselorsMap = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [counselors, setCounselors] = useState([]);
    const [selectedCounselor, setSelectedCounselor] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [searchRadius, setSearchRadius] = useState(10); // in kilometers
    const [filters, setFilters] = useState({
        specializations: [],
        minRating: 0,
        showOnlyVerified: false
    });
    const [showFilters, setShowFilters] = useState(false);
    const [centerPosition, setCenterPosition] = useState([20.5937, 78.9629]); // Default center of India
    const [mapReference, setMapReference] = useState(null);
    
    // Get user's location when component mounts
    useEffect(() => {
        if (!isOpen) return;
        
        const getUserLocation = () => {
            setLoading(true);
            
            // Get user's current location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userPos = [latitude, longitude];
                    setUserLocation(userPos);
                    setCenterPosition(userPos);
                    
                    // Fetch counselors after getting location
                    fetchCounselors(userPos);
                },
                (err) => {
                    console.error('Error getting location:', err);
                    setError('Unable to access your location. Please enable location services and try again.');
                    setLoading(false);
                    
                    // Use a default location and fetch counselors
                    fetchCounselors([20.5937, 78.9629]);
                }
            );
        };
        
        getUserLocation();
        
    }, [isOpen]);
    
    // Update counselors when filters or search radius changes
    useEffect(() => {
        if (!userLocation) return;
        fetchCounselors(userLocation);
    }, [filters, searchRadius, userLocation]);
    
    // Store map reference when available
    const setMap = useCallback((map) => {
        setMapReference(map);
    }, []);
    
    // Fetch counselors from Firestore
    const fetchCounselors = async (location) => {
        setLoading(true);
        try {
            // Demo data for testing - replace with your actual Firestore query
            const demoData = [
                {
                    id: '1',
                    name: 'Dr. Saleem Akbar',
                    rating: 4.7,
                    verified: true,
                    specializations: ['Cognitive Behavioral Therapy', 'Anger Management', 'Hypnotherapy'],
                    yearsOfExperience: 22,
                    languages: ['English', 'Tamil'],
                    biography: 'Dr. Saleem Akbar has over two decades of experience in counseling psychology, offering services in various therapeutic modalities.',
                    qualifications: [
                        { degree: 'PhD in Psychology', institution: 'Not specified', year: '2016' }
                    ],
                    phone: '9360221594',
                    email: 'Not specified',
                    location: {
                        latitude: 10.3623,
                        longitude: 77.9706
                    },
                    profilePicture: men
                },
                {
                    id: '2',
                    name: 'P. Jeya Bala',
                    rating: 4.5,
                    verified: true,
                    specializations: ['Counseling Psychology', 'Cognitive Behavioral Therapy', 'Stress Management', 'Anger Management'],
                    yearsOfExperience: null,
                    languages: ['English', 'Tamil'],
                    biography: 'P. Jeya Bala specializes in counseling psychology with a focus on stress and anger management.',
                    qualifications: [],
                    phone: '8939186562',
                    email: 'Not specified',
                    location: {
                        latitude: 10.3708,
                        longitude: 77.9782
                    },
                    profilePicture: women
                },
                {
                    id: '3',
                    name: 'Dr. K. Mahalakshmi',
                    rating: 4.6,
                    verified: true,
                    specializations: ['Psychiatry'],
                    yearsOfExperience: null,
                    languages: ['English', 'Tamil'],
                    biography: 'Dr. K. Mahalakshmi practices at Ramana Hospital in Dindigul, offering psychiatric consultations.',
                    qualifications: [
                        { degree: 'MBBS', institution: 'Not specified', year: 'Not specified' },
                        { degree: 'D.P.M.', institution: 'Not specified', year: 'Not specified' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                        latitude: 10.3582,
                        longitude: 77.9647
                    },
                    profilePicture: women
                },
                {
                    id: '4',
                    name: 'Dr. R. Balaguru',
                    rating: 4.6,
                    verified: true,
                    specializations: ['Psychiatry'],
                    yearsOfExperience: null,
                    languages: ['English', 'Tamil'],
                    biography: 'Dr. R. Balaguru practices at Mahatma Mind Care Centre in Dindigul, providing psychiatric services.',
                    qualifications: [
                        { degree: 'MBBS', institution: 'Not specified', year: 'Not specified' },
                        { degree: 'D.P.M.', institution: 'Not specified', year: 'Not specified' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                        latitude: 10.3619,
                        longitude: 77.9575
                    },
                    profilePicture: men
                },
                {
                    id: '5',
                    name: 'Kulandaisamy A',
                    rating: 4.4,
                    verified: true,
                    specializations: ['Addiction', 'Family Therapy'],
                    yearsOfExperience: 15,
                    languages: ['English', 'Tamil'],
                    biography: 'Kulandaisamy A is a Psychiatric Social Worker specializing in addiction and family therapy.',
                    qualifications: [
                      { degree: 'M.A. in Social Work', institution: 'Not specified', year: '2008' }
                    ],
                    phone: '8056502382',
                    email: 'Not specified',
                    location: {
                      latitude: 10.4500,
                      longitude: 77.5200
                    },
                    profilePicture: men
                  },
                  {
                    id: '6',
                    name: 'Ambiliya Raj',
                    rating: 4.3,
                    verified: true,
                    specializations: ['Counseling Psychology', 'Psychotherapy'],
                    yearsOfExperience: 10,
                    languages: ['English', 'Tamil'],
                    biography: 'Ambiliya Raj is a counseling psychologist at Mind Refresh Counselling & Psychotherapy Center in Dindigul.',
                    qualifications: [
                      { degree: 'M.Sc. in Psychology', institution: 'MKU Madurai', year: '2013' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                      latitude: 10.3600,
                      longitude: 77.9700
                    },
                    profilePicture: men
                  },
                  {
                    id: '7',
                    name: 'Muthalakshmi M',
                    rating: 4.5,
                    verified: true,
                    specializations: ['Therapy', 'Counseling'],
                    yearsOfExperience: 12,
                    languages: ['English', 'Tamil'],
                    biography: 'Muthalakshmi M is a consultant psychologist at Mesmer Speak Your Mind in Dindigul.',
                    qualifications: [
                      { degree: 'M.A. in Psychology', institution: 'Not specified', year: '2011' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                      latitude: 10.3620,
                      longitude: 77.9650
                    },
                    profilePicture: women
                  },
                  {
                    id: '8',
                    name: 'Palani Pushpam Paramasivam',
                    rating: 4.2,
                    verified: true,
                    specializations: ['Hospital Counseling'],
                    yearsOfExperience: 8,
                    languages: ['English', 'Tamil'],
                    biography: 'Palani Pushpam Paramasivam is a hospital counsellor at PSG Hospitals in Coimbatore.',
                    qualifications: [
                      { degree: 'M.A. in Psychology', institution: 'PSG College of Arts and Science', year: '2015' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                      latitude: 11.0168,
                      longitude: 76.9558
                    },
                    profilePicture: men
                  },
                  {
                    id: '9',
                    name: 'Dr. Vikhram Ramasubramanian',
                    rating: 4.6,
                    verified: true,
                    specializations: ['Adult Counseling'],
                    yearsOfExperience: 22,
                    languages: ['English', 'Tamil'],
                    biography: 'Dr. Vikhram Ramasubramanian is a psychiatrist specializing in adult counseling in Madurai.',
                    qualifications: [
                      { degree: 'M.B.B.S.', institution: 'Not specified', year: '2003' },
                      { degree: 'M.D. in Psychiatry', institution: 'Not specified', year: '2006' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                      latitude: 9.9252,
                      longitude: 78.1198
                    },
                    profilePicture: men
                  },
                  {
                    id: '10',
                    name: 'Dr. Mahalakshmi Saravanan',
                    rating: 4.5,
                    verified: true,
                    specializations: ['Adult Counseling'],
                    yearsOfExperience: 27,
                    languages: ['English', 'Tamil'],
                    biography: 'Dr. Mahalakshmi Saravanan is a psychiatrist with extensive experience in adult counseling in Madurai.',
                    qualifications: [
                      { degree: 'M.B.B.S.', institution: 'Not specified', year: '1995' },
                      { degree: 'M.D. in Psychiatry', institution: 'Not specified', year: '1998' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                      latitude: 9.9252,
                      longitude: 78.1198
                    },
                    profilePicture: women
                  },
                  {
                    id: '11',
                    name: 'Dr. Sabhesan Sivam',
                    rating: 4.9,
                    verified: true,
                    specializations: ['Adult Counseling'],
                    yearsOfExperience: 51,
                    languages: ['English', 'Tamil'],
                    biography: 'Dr. Sabhesan Sivam is a highly experienced psychiatrist specializing in adult counseling in Madurai.',
                    qualifications: [
                      { degree: 'M.B.B.S.', institution: 'Not specified', year: '1970' },
                      { degree: 'M.D. in Psychiatry', institution: 'Not specified', year: '1973' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                      latitude: 9.9252,
                      longitude: 78.1198
                    },
                    profilePicture: men
                  },
                  {
                    id: '12',
                    name: 'Ms. Rajalakshmi',
                    rating: 4.5,
                    verified: true,
                    specializations: ['Spiritually Based Psychotherapy', 'Past Life Regression Therapy', 'Pre-marital Counseling'],
                    yearsOfExperience: 5,
                    languages: ['English', 'Tamil'],
                    biography: 'Ms. Rajalakshmi is a psychologist at Apollo Speciality Hospitals KK Nagar in Madurai, specializing in spiritually based psychotherapy and counseling.',
                    qualifications: [
                        { degree: 'M.Sc. in Psychology', institution: 'Madurai Kamaraj University', year: '2018' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                        latitude: 9.9342,
                        longitude: 78.1126
                    },
                    profilePicture: women
                },
                {
                    id: '13',
                    name: 'Dr. N. Natarajan',
                    rating: 4.4,
                    verified: true,
                    specializations: ['Child Psychology', 'Behavioral Therapy'],
                    yearsOfExperience: 18,
                    languages: ['English', 'Tamil'],
                    biography: 'Dr. N. Natarajan is a child psychologist practicing in Madurai, focused on behavioral and developmental therapy for children and adolescents.',
                    qualifications: [
                        { degree: 'M.D. in Psychiatry', institution: 'Stanley Medical College', year: '2005' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                        latitude: 9.9175,
                        longitude: 78.1283
                    },
                    profilePicture: men
                },
                {
                    id: '14',
                    name: 'Revathi S',
                    rating: 4.3,
                    verified: true,
                    specializations: ['Family Therapy', 'Teen Counseling'],
                    yearsOfExperience: 9,
                    languages: ['English', 'Tamil'],
                    biography: 'Revathi is a licensed counseling psychologist in Palani working with families and teenagers to improve mental wellness and emotional balance.',
                    qualifications: [
                        { degree: 'M.Phil in Psychology', institution: 'Annamalai University', year: '2014' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                        latitude: 10.4508,
                        longitude: 77.5205
                    },
                    profilePicture: women
                },
                {
                    id: '15',
                    name: 'Dr. Ram Ganesh',
                    rating: 4.7,
                    verified: true,
                    specializations: ['Addiction Recovery', 'Depression', 'Stress Management'],
                    yearsOfExperience: 11,
                    languages: ['English', 'Tamil', 'Hindi'],
                    biography: 'Dr. Ram Ganesh runs a private clinic in Dindigul and offers therapy for individuals struggling with addiction and chronic stress.',
                    qualifications: [
                        { degree: 'M.D. Psychiatry', institution: 'Madras Medical College', year: '2012' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                        latitude: 10.3615,
                        longitude: 77.9620
                    },
                    profilePicture: men
                },
                {
                    id: '16',
                    name: 'Dr. Swetha Narayan',
                    rating: 4.8,
                    verified: true,
                    specializations: ['Anxiety', 'Panic Disorders', 'Sleep Therapy'],
                    yearsOfExperience: 10,
                    languages: ['English', 'Tamil'],
                    biography: 'Dr. Swetha Narayan is a clinical psychologist based in Madurai helping individuals deal with panic attacks, insomnia, and stress disorders.',
                    qualifications: [
                        { degree: 'PhD in Clinical Psychology', institution: 'TISS Mumbai', year: '2013' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                        latitude: 9.9282,
                        longitude: 78.1156
                    },
                    profilePicture: women
                },
                {
                    id: '17',
                    name: 'Kumaravel A',
                    rating: 4.4,
                    verified: true,
                    specializations: ['Career Counseling', 'Relationship Therapy'],
                    yearsOfExperience: 6,
                    languages: ['English', 'Tamil'],
                    biography: 'Kumaravel specializes in career and relationship counseling for young adults, operating a mental wellness center in Palani.',
                    qualifications: [
                        { degree: 'M.A. in Counseling Psychology', institution: 'Loyola College', year: '2016' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                        latitude: 10.4487,
                        longitude: 77.5190
                    },
                    profilePicture: men
                },
                {
                    id: '18',
                    name: 'Dr. Shanti V',
                    rating: 4.5,
                    verified: true,
                    specializations: ['Postpartum Depression', 'Grief Therapy'],
                    yearsOfExperience: 13,
                    languages: ['English', 'Tamil'],
                    biography: 'Dr. Shanti offers emotional support to mothers dealing with postpartum issues and grief, practicing at Blossom Women’s Clinic, Madurai.',
                    qualifications: [
                        { degree: 'M.D. Psychiatry', institution: 'JIPMER', year: '2010' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                        latitude: 9.9264,
                        longitude: 78.1212
                    },
                    profilePicture: women
                },
                {
                    id: '19',
                    name: 'Ms. Deepika Suresh',
                    rating: 4.6,
                    verified: true,
                    specializations: ['Mindfulness Therapy', 'Life Coaching'],
                    yearsOfExperience: 7,
                    languages: ['English', 'Tamil'],
                    biography: 'Deepika is a certified life coach and counselor based in Madurai who works with professionals and students.',
                    qualifications: [
                        { degree: 'Diploma in Life Coaching', institution: 'IIS Bengaluru', year: '2017' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                        latitude: 9.9325,
                        longitude: 78.1181
                    },
                    profilePicture: women
                },
                {
                    id: '20',
                    name: 'Ganapathy Raj',
                    rating: 4.3,
                    verified: true,
                    specializations: ['Adolescent Therapy', 'Behavioral Disorders'],
                    yearsOfExperience: 8,
                    languages: ['English', 'Tamil'],
                    biography: 'Ganapathy Raj supports teenagers in developing positive coping mechanisms through behavioral therapy.',
                    qualifications: [
                        { degree: 'M.Sc. Clinical Psychology', institution: 'IGNOU', year: '2015' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                        latitude: 10.4600,
                        longitude: 77.5300
                    },
                    profilePicture: men
                },
                {
                    id: '21',
                    name: ' Miss. Vidhya Dharani',
                    rating: 4.3,
                    verified: true,
                    specializations: ['Not specified', 'Not specified'],
                    yearsOfExperience: 15,
                    languages: ['English', 'Tamil'],
                    biography: 'Not specified',
                    qualifications: [
                        { degree: 'Not specified', institution: 'Not specified', year: 'Not specified' }
                    ],
                    phone: 'Not specified',
                    email: 'Not specified',
                    location: {
                        latitude: 10.4163861,
                        longitude: 77.9006933
                    },
                    profilePicture: women
                }
            ];
            
            // Process counselors and calculate distance from user
            const counselorsData = demoData.map(counselor => {
                // Calculate distance from user location
                const distance = calculateDistance(
                    location[0], 
                    location[1],
                    counselor.location.latitude,
                    counselor.location.longitude
                );
                
                return {
                    ...counselor,
                    distance,
                    position: [counselor.location.latitude, counselor.location.longitude]
                };
            }).filter(counselor => {
                // Apply filters
                if (counselor.distance > searchRadius) return false;
                
                if (filters.showOnlyVerified && !counselor.verified) return false;
                
                if (filters.minRating > 0 && counselor.rating < filters.minRating) return false;
                
                if (filters.specializations.length > 0) {
                    const hasSpecialization = counselor.specializations.some(spec => 
                        filters.specializations.includes(spec)
                    );
                    if (!hasSpecialization) return false;
                }
                
                return true;
            }).sort((a, b) => a.distance - b.distance);
            
            setCounselors(counselorsData);
            setLoading(false);
            
            // Uncomment this when you're ready to use actual Firestore data
            /*
            // Create a query to fetch counselors
            let counselorsQuery = query(
                collection(db, "counselors"),
                orderBy("rating", "desc"),
                limit(50)
            );
            
            const counselorsSnapshot = await getDocs(counselorsQuery);
            const counselorsData = [];
            
            // Process counselors and calculate distance from user
            counselorsSnapshot.forEach((doc) => {
                const counselorData = doc.data();
                
                // Calculate distance from user location if counselor has location data
                let distance = null;
                if (counselorData.location && counselorData.location.latitude && counselorData.location.longitude) {
                    distance = calculateDistance(
                        location[0], 
                        location[1],
                        counselorData.location.latitude,
                        counselorData.location.longitude
                    );
                }
                
                // Add counselor to array if within search radius and matches filters
                if (distance !== null && distance <= searchRadius) {
                    // Check filters
                    if (filters.showOnlyVerified && !counselorData.verified) {
                        return; // Skip unverified counselors if filter is active
                    }
                    
                    if (filters.minRating > 0 && counselorData.rating < filters.minRating) {
                        return; // Skip if below minimum rating
                    }
                    
                    if (filters.specializations.length > 0) {
                        const hasSpecialization = counselorData.specializations?.some(spec => 
                            filters.specializations.includes(spec)
                        );
                        if (!hasSpecialization) {
                            return; // Skip if doesn't have any of the selected specializations
                        }
                    }
                    
                    counselorsData.push({
                        id: doc.id,
                        ...counselorData,
                        distance: distance,
                        position: [counselorData.location.latitude, counselorData.location.longitude]
                    });
                }
            });
            
            // Sort by distance
            counselorsData.sort((a, b) => a.distance - b.distance);
            
            setCounselors(counselorsData);
            setLoading(false);
            */
            
        } catch (err) {
            console.error('Error fetching counselors:', err);
            setError('Failed to load counselors. Please try again.');
            setLoading(false);
        }
    };
    
    // Function to calculate distance between two coordinates using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c; // Distance in km
        return distance;
    };
    
    const deg2rad = (deg) => {
        return deg * (Math.PI/180);
    };
    
    // Center map on user location
    const centerOnUser = () => {
        if (userLocation) {
            setCenterPosition(userLocation);
        }
    };
    
    // Handle filter changes
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => {
            if (filterType === 'specializations') {
                // Toggle the specialization in the array
                let newSpecializations = [...prev.specializations];
                if (newSpecializations.includes(value)) {
                    newSpecializations = newSpecializations.filter(s => s !== value);
                } else {
                    newSpecializations.push(value);
                }
                return { ...prev, specializations: newSpecializations };
            }
            
            return { ...prev, [filterType]: value };
        });
    };
    
    // Available specializations for filtering
    const availableSpecializations = [
        'Anxiety', 'Depression', 'Trauma', 'Stress Management', 
        'Family Therapy', 'Youth Counseling', 'Addiction', 'PTSD'
    ];
    
    // Render counselor details when one is selected
    const renderCounselorDetails = () => {
        if (!selectedCounselor) return null;
        
        return (
            <div className="counselor-details">
                <div className="details-header">
                    <button 
                        className="back-button2" 
                        onClick={() => setSelectedCounselor(null)}
                        aria-label="Back to counselors list"
                    >
                        <FaArrowLeft />
                    </button>
                    <h2>{selectedCounselor.name}</h2>
                </div>
                
                <div className="counselor-profile">
                    <div className="profile-image">
                        <img 
                            src={selectedCounselor.profilePicture || 'https://via.placeholder.com/150'} 
                            alt={selectedCounselor.name}
                        />
                        {selectedCounselor.verified && (
                            <span className="verified-badge">Verified</span>
                        )}
                    </div>
                    
                    <div className="profile-info">
                        <div className="rating">
                            {Array(5).fill().map((_, i) => (
                                <FaStar 
                                    key={i} 
                                    className={i < Math.round(selectedCounselor.rating) ? "star filled" : "star"} 
                                />
                            ))}
                            <span className="rating-number">({selectedCounselor.rating.toFixed(1)})</span>
                        </div>
                        
                        <div className="profile-detail">
                            <div className="detail-label">Experience:</div>
                            <div className="detail-value">{selectedCounselor.yearsOfExperience ? `${selectedCounselor.yearsOfExperience} years` : 'Not specified'}</div>
                        </div>
                        
                        <div className="profile-detail">
                            <div className="detail-label">Distance:</div>
                            <div className="detail-value">{selectedCounselor.distance.toFixed(1)} km away</div>
                        </div>
                        
                        <div className="profile-detail">
                            <div className="detail-label">Languages:</div>
                            <div className="detail-value">{selectedCounselor.languages?.join(', ') || 'English'}</div>
                        </div>
                        
                        <div className="profile-detail">
                            <div className="detail-label">Specializes in:</div>
                            <div className="detail-value">
                                <div className="specialization-tags">
                                    {selectedCounselor.specializations?.map((spec, index) => (
                                        <span key={index} className="specialization-tag">{spec}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="counselor-bio">
                    <h3>About</h3>
                    <p>{selectedCounselor.biography || "No biography available."}</p>
                </div>
                
                <div className="counselor-qualifications">
                    <h3>Qualifications</h3>
                    {selectedCounselor.qualifications?.length > 0 ? (
                        <ul>
                            {selectedCounselor.qualifications.map((qual, index) => (
                                <li key={index}>{qual.degree} {qual.institution ? `- ${qual.institution}` : ''} {qual.year && qual.year !== 'Not specified' ? `(${qual.year})` : ''}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>Information not available</p>
                    )}
                </div>
                
                <div className="action-buttons">
                    <a 
                        href={selectedCounselor.phone && selectedCounselor.phone !== 'Not specified' ? `tel:${selectedCounselor.phone}` : '#'}
                        className="action-button call"
                        onClick={e => {
                            if (selectedCounselor.phone === 'Not specified') {
                                e.preventDefault();
                                alert('Phone number not available');
                            }
                        }}
                    >
                        <FaPhone /> Call
                    </a>
                    <a 
                        href={selectedCounselor.email && selectedCounselor.email !== 'Not specified' ? `mailto:${selectedCounselor.email}` : '#'}
                        className="action-button email"
                        onClick={e => {
                            if (selectedCounselor.email === 'Not specified') {
                                e.preventDefault();
                                alert('Email not available');
                            }
                        }}
                    >
                        <FaEnvelope /> Email
                    </a>
                    <button className="action-button schedule">
                        <FaCalendarAlt /> Schedule Session
                    </button>
                </div>
            </div>
        );
    };

    // If the modal is not open, don't render anything
    if (!isOpen) return null;

    return (
        <div className="counselors-map-modal">
            <div className="map-modal-content">
                <div className="map-modal-header">
                    <h2>Counselors Near Me</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                
                <div className="map-content-container">
                    {/* Map Container */}
                    <div className="map-container">
                        {loading && !error && (
                            <div className="loading-overlay">
                                <div className="spinner"></div>
                                <p>Finding counselors near you...</p>
                            </div>
                        )}
                        
                        {error && (
                            <div className="error-overlay">
                                <p>{error}</p>
                                <button onClick={() => window.location.reload()}>Try Again</button>
                            </div>
                        )}
                        
                        <MapContainer 
                            center={centerPosition} 
                            zoom={13} 
                            style={{ height: '100%', width: '100%' }}
                            whenCreated={setMap}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            
                            {/* Recenter map when position changes */}
                            <RecenterMap position={centerPosition} />
                            
                            {/* Show user location marker */}
                            {userLocation && (
                                <>
                                    <Marker 
                                        position={userLocation}
                                        icon={L.divIcon({
                                            className: 'user-location-marker',
                                            iconSize: [20, 20],
                                            html: '<div class="user-dot"></div>'
                                        })}
                                    >
                                        <Popup>You are here</Popup>
                                    </Marker>
                                    
                                    <Circle 
                                        center={userLocation} 
                                        radius={searchRadius * 1000} 
                                        pathOptions={{ 
                                            color: '#4285F4', 
                                            fillColor: '#4285F4',
                                            fillOpacity: 0.1,
                                            weight: 1
                                        }} 
                                    />
                                </>
                            )}
                            
                            {/* Show markers for counselors */}
                            {counselors.map(counselor => (
                                <Marker 
                                    key={counselor.id} 
                                    position={counselor.position}
                                    icon={createCustomIcon(counselor.verified)}
                                    eventHandlers={{
                                        click: () => {
                                            setSelectedCounselor(counselor);
                                        }
                                    }}
                                >
                                    <Popup>
                                        <div className="counselor-popup">
                                            <h3>{counselor.name}</h3>
                                            <p>{counselor.distance.toFixed(1)} km away</p>
                                            <button 
                                                className="view-details-btn"
                                                onClick={() => setSelectedCounselor(counselor)}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                        
                        <div className="map-controls">
                            <button className="location-button" onClick={centerOnUser} title="Center on your location">
                                <FaLocationArrow />
                            </button>
                            <button 
                                className={`filter-button ${showFilters ? 'active' : ''}`}
                                onClick={() => setShowFilters(!showFilters)}
                                title="Filter counselors"
                            >
                                <FaFilter />
                            </button>
                        </div>
                        
                        {showFilters && (
                            <div className="filter-panel">
                                <h3>Filter Counselors</h3>
                                
                                <div className="filter-section">
                                    <label>Search Radius: {searchRadius} km</label>
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="200" 
                                        value={searchRadius} 
                                        onChange={(e) => setSearchRadius(Number(e.target.value))}
                                    />
                                </div>
                                
                                <div className="filter-section">
                                    <label>Minimum Rating:</label>
                                    <div className="rating-filter">
                                        {[0, 1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                className={filters.minRating === rating ? 'active' : ''}
                                                onClick={() => handleFilterChange('minRating', rating)}
                                            >
                                                {rating === 0 ? 'Any' : `${rating}+`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="filter-section">
                                    <label>Verified Only:</label>
                                    <label className="switch">
                                        <input 
                                            type="checkbox" 
                                            checked={filters.showOnlyVerified}
                                            onChange={(e) => handleFilterChange('showOnlyVerified', e.target.checked)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                
                                <div className="filter-section">
                                    <label>Specializations:</label>
                                    <div className="specialization-filters">
                                        {availableSpecializations.map((spec) => (
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
                            </div>
                        )}
                    </div>
                    
                    {/* Counselor List Panel */}
                    <div className="counselor-panel">
                        {selectedCounselor ? (
                            renderCounselorDetails()
                        ) : (
                            <>
                                <div className="counselor-list-header">
                                    <h3>Nearby Counselors ({counselors.length})</h3>
                                    <div className="sort-options">
                                        <select defaultValue="distance">
                                            <option value="distance">Distance</option>
                                            <option value="rating">Rating</option>
                                            <option value="experience">Experience</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {counselors.length === 0 && !loading ? (
                                    <div className="no-results">
                                        <p>No counselors found within {searchRadius} km. Try increasing your search radius.</p>
                                    </div>
                                ) : (
                                    <div className="counselor-grid">
                                        {counselors.map(counselor => (
                                            <div 
                                                key={counselor.id} 
                                                className="counselor-block"
                                                onClick={() => setSelectedCounselor(counselor)}
                                            >
                                                <div className="counselor-block-image">
                                                    <img 
                                                        src={counselor.profilePicture || 'https://via.placeholder.com/200'} 
                                                        alt={counselor.name} 
                                                    />
                                                    {counselor.verified && (
                                                        <div className="verified-badge-small">
                                                            <FaCheck /> Verified
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="counselor-block-content">
                                                    <h4 className="counselor-block-name">{counselor.name}</h4>
                                                    <div className="rating-block">
                                                        {Array(5).fill().map((_, i) => (
                                                            <FaStar 
                                                                key={i} 
                                                                className={i < Math.round(counselor.rating) ? "star filled" : "star"} 
                                                            />
                                                        ))}
                                                        <span className="rating-text">({counselor.rating.toFixed(1)})</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CounselorsMap;