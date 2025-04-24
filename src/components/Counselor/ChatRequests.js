import React, { useState, useEffect } from 'react';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import './ChatRequests.css';

const ChatRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  const db = getFirestore();
  const auth = getAuth();
  
  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    
    return () => unsubscribe();
  }, [auth]);
  
  // Fetch pending chat requests
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchPendingRequests = () => {
      // Query for chats where the counselor is a participant and status is pending
      const chatsQuery = query(
        collection(db, 'chats'),
        where('participantIds', 'array-contains', currentUser.uid),
        where('status', '==', 'pending')
      );
      
      const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
        const requests = [];
        
        for (const doc of snapshot.docs) {
          const chatData = doc.data();
          
          // Find the user ID (not the counselor)
          const userId = chatData.participantIds.find(id => id !== currentUser.uid);
          
          if (userId) {
            // Get user details
            const userDoc = await getDoc(doc(db, 'users', userId));
            const userData = userDoc.exists() ? userDoc.data() : { name: 'Unknown User' };
            
            requests.push({
              id: doc.id,
              userId,
              userName: userData.name || 'Unknown User',
              userPhoto: userData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=random`,
              initialMessage: chatData.initialMessage || 'No initial message',
              createdAt: chatData.createdAt?.toDate() || new Date()
            });
          }
        }
        
        setPendingRequests(requests);
        setLoading(false);
      });
      
      return unsubscribe;
    };
    
    const unsubscribe = fetchPendingRequests();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser, db]);
  
  // Respond to chat request
  const handleChatRequest = async (chatId, approved) => {
    if (!currentUser) return;
    
    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatRef);
      
      if (!chatDoc.exists()) {
        console.error('Chat does not exist');
        return;
      }
      
      const chatData = chatDoc.data();
      const userId = chatData.participantIds.find(id => id !== currentUser.uid);
      
      // Update chat status
      await updateDoc(chatRef, {
        status: approved ? 'approved' : 'declined',
        lastMessage: {
          text: approved ? 'Chat request approved' : 'Chat request declined',
          timestamp: serverTimestamp(),
          senderId: 'system'
        }
      });
      
      // Add system message
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: approved 
          ? `${currentUser.displayName || 'Counselor'} has approved your chat request. You can now send messages.`
          : `${currentUser.displayName || 'Counselor'} has declined your chat request.`,
        senderId: 'system',
        timestamp: serverTimestamp(),
        read: false
      });
      
      // Create notification for the user
      await addDoc(collection(db, 'notifications'), {
        userId: userId,
        type: 'chat_request_response',
        title: approved ? 'Chat Request Approved' : 'Chat Request Declined',
        message: approved 
          ? `${currentUser.displayName || 'A counselor'} has approved your chat request.`
          : `${currentUser.displayName || 'A counselor'} has declined your chat request.`,
        isRead: false,
        createdAt: serverTimestamp(),
        data: {
          chatId: chatId
        }
      });
      
    } catch (error) {
      console.error('Error handling chat request:', error);
    }
  };
  
  // Format date for display
  const formatDate = (date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date >= yesterday) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' }) + 
        ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="chat-requests-container">
      <h2>Pending Chat Requests</h2>
      
      {loading ? (
        <div className="loading-spinner">
          <FaSpinner className="spinning" />
          <p>Loading requests...</p>
        </div>
      ) : pendingRequests.length === 0 ? (
        <div className="no-requests">
          <p>No pending chat requests</p>
        </div>
      ) : (
        <div className="requests-list">
          {pendingRequests.map(request => (
            <div key={request.id} className="request-item">
              <div className="request-user">
                <img src={request.userPhoto} alt={request.userName} className="user-avatar" />
                <div className="request-details">
                  <h3>{request.userName}</h3>
                  <p className="request-time">{formatDate(request.createdAt)}</p>
                  <div className="initial-message">
                    <p>{request.initialMessage}</p>
                  </div>
                </div>
              </div>
              <div className="request-actions">
                <button 
                  className="accept-btn" 
                  onClick={() => handleChatRequest(request.id, true)}
                >
                  <FaCheck /> Accept
                </button>
                <button 
                  className="decline-btn" 
                  onClick={() => handleChatRequest(request.id, false)}
                >
                  <FaTimes /> Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatRequests;