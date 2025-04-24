import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaPlus, 
  FaLock, 
  FaClock, 
  FaCheck,
  FaComments,
  FaUserMd,
  FaReply,
  FaHeartbeat,  // Add this import
  FaArrowRight  // Add this import
} from 'react-icons/fa';
import Navbar from '../components/Home/Navbar';
import { auth, db } from '../firebase/config';
import { useHistory } from 'react-router-dom'; // Make sure this import exists
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  serverTimestamp, 
  orderBy,
  updateDoc,
  limit
} from 'firebase/firestore';
import './CommunityPage.css';
import Chatbot from '../Chatbot/Chatbot';
import EmergencyButton from '../EmergencyButton';

const ResponseModal = ({ isOpen, onClose, post, onSubmit }) => {
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!response.trim()) {
      setError('Please enter your response');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const user = auth.currentUser;
      
      // Reference to the post document
      const postRef = doc(db, "community_posts", post.id);
      
      // Add response as a comment
      const commentRef = await addDoc(collection(db, "comments"), {
        postId: post.id,
        userId: user.uid,
        userName: user.displayName || 'User',
        content: response,
        createdAt: serverTimestamp(),
        parentCommentId: null,
        likeCount: 0,
        reported: false
      });
      
      // Update post to show it's been responded to
      await updateDoc(postRef, {
        updatedAt: serverTimestamp(),
        commentCount: (post.commentCount || 0) + 1
      });
      
      onSubmit();
      onClose();
    } catch (err) {
      console.error("Error submitting response:", err);
      setError('Failed to submit response. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Respond to Post</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="post-summary">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
          
          {error && <div className="modal-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="response">Your Response</label>
              <textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Share your thoughts, advice, or support..."
                rows="6"
                required
              ></textarea>
            </div>
            
            <div className="response-guidelines">
              <h4>Community Guidelines</h4>
              <ul>
                <li>Be respectful and supportive</li>
                <li>Share personal experiences if relevant</li>
                <li>Keep information confidential</li>
                <li>Don't give harmful advice</li>
              </ul>
            </div>
            
            <div className="form-buttons">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    isAnonymous: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('standard');
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postComments, setPostComments] = useState({});
  const history = useHistory(); // Make sure this is defined

  // Check if current user is a counselor
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log("No user logged in");
          return;
        }
        
        console.log("Checking role for user:", user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data retrieved:", userData.userType);
          setUserRole(userData.userType || 'standard');
        } else {
          console.log("User document does not exist");
        }
      } catch (err) {
        console.error("Error checking user role:", err);
      }
    };
    
    checkUserRole();
  }, []);

  // Fetch all posts and their comments
  useEffect(() => {
    const fetchPosts = async () => {
      console.log("Fetching posts");
      setLoading(true);
      setError(null);
      
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          setError("Please log in to view community posts");
          return;
        }

        // All users can see all posts
        const postsQuery = query(
          collection(db, "community_posts"),
          orderBy("createdAt", "desc")
        );
        console.log("Fetching all posts");

        console.log("Executing query...");
        const querySnapshot = await getDocs(postsQuery);
        console.log(`Retrieved ${querySnapshot.docs.length} posts`);
        
        const postsData = [];
        const commentsMap = {};
        
        // Process all posts first
        for (const postDoc of querySnapshot.docs) {
          const postData = postDoc.data();
          
          // Add post to array with its ID
          postsData.push({
            id: postDoc.id,
            ...postData,
            // Initialize with default values according to your schema
            status: postData.status || 'pending',
            commentCount: postData.commentCount || 0,
            likeCount: postData.likeCount || 0,
            reported: postData.reported || false,
            // Format timestamp for display
            createdAt: postData.createdAt || serverTimestamp()
          });
        }
        
        // Now fetch comments for all posts
        for (const post of postsData) {
          const commentsQuery = query(
            collection(db, "comments"),
            where("postId", "==", post.id),
            orderBy("createdAt", "asc")
          );
          
          const commentsSnapshot = await getDocs(commentsQuery);
          const comments = commentsSnapshot.docs.map(commentDoc => {
            const commentData = commentDoc.data();
            return {
              id: commentDoc.id,
              ...commentData,
              isFromPoster: commentData.userId === post.userId,
            };
          });
          
          commentsMap[post.id] = comments;
          
          // Check for user info for each comment author
          for (const comment of comments) {
            try {
              const userDoc = await getDoc(doc(db, "users", comment.userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                // Find the comment in our map and add the user role
                const commentIndex = commentsMap[post.id].findIndex(c => c.id === comment.id);
                if (commentIndex !== -1) {
                  commentsMap[post.id][commentIndex].userRole = userData.userType || 'standard';
                }
              }
            } catch (err) {
              console.error("Error getting comment author details:", err);
            }
          }
        }
        
        setPosts(postsData);
        setPostComments(commentsMap);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(`Failed to load community posts: ${err.message}`);
        setLoading(false);
      }
    };

    if (auth.currentUser) {
      fetchPosts();
    } else {
      setLoading(false);
      setError("Please log in to view community posts");
    }
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewPost({
      title: '',
      content: '',
      category: '',
      isAnonymous: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.category) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to create a post");
        return;
      }
      
      console.log("Creating new post...");
      
      // Create tags array from category
      const tags = [newPost.category.toLowerCase()];
      
      // Create new post based on your schema
      const docRef = await addDoc(collection(db, "community_posts"), {
        userId: user.uid,
        userName: newPost.isAnonymous ? "Anonymous" : user.displayName || "User",
        title: newPost.title,
        content: newPost.content,
        tags: tags,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likeCount: 0,
        commentCount: 0,
        reported: false,
        status: "pending" // Custom field for tracking response status
      });

      console.log("Post created with ID:", docRef.id);
      
      // Close modal and add the new post to state
      handleCloseModal();
      
      // Add the new post to the state
      setPosts(prevPosts => [{
        id: docRef.id,
        userId: user.uid,
        userName: newPost.isAnonymous ? "Anonymous" : user.displayName || "User",
        title: newPost.title,
        content: newPost.content,
        tags: tags,
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 0,
        commentCount: 0,
        reported: false,
        status: "pending"
      }, ...prevPosts]);
      
      // Initialize empty comments array for this post
      setPostComments(prev => ({
        ...prev,
        [docRef.id]: []
      }));
      
      setError(null); // Clear any previous errors
      
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again. " + err.message);
    }
  };

  const handleOpenResponseModal = (post) => {
    setSelectedPost(post);
    setIsResponseModalOpen(true);
  };

  const handleCloseResponseModal = () => {
    setIsResponseModalOpen(false);
    setSelectedPost(null);
  };

  const handleResponseSubmit = async () => {
    // Refresh posts after response submission
    setLoading(true);
    setError(null);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Please log in to view community posts");
        setLoading(false);
        return;
      }

      // All users can see all posts
      const postsQuery = query(
        collection(db, "community_posts"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(postsQuery);
      
      const postsData = [];
      const commentsMap = {};
      
      // Process all posts first
      for (const postDoc of querySnapshot.docs) {
        const postData = postDoc.data();
        
        postsData.push({
          id: postDoc.id,
          ...postData,
          status: postData.status || 'pending',
          commentCount: postData.commentCount || 0,
          likeCount: postData.likeCount || 0,
          reported: postData.reported || false,
          createdAt: postData.createdAt || serverTimestamp()
        });
      }
      
      // Fetch comments for all posts
      for (const post of postsData) {
        const commentsQuery = query(
          collection(db, "comments"),
          where("postId", "==", post.id),
          orderBy("createdAt", "asc")
        );
        
        const commentsSnapshot = await getDocs(commentsQuery);
        const comments = commentsSnapshot.docs.map(commentDoc => {
          const commentData = commentDoc.data();
          return {
            id: commentDoc.id,
            ...commentData,
            isFromPoster: commentData.userId === post.userId,
          };
        });
        
        commentsMap[post.id] = comments;
        
        // Check for user info for each comment author
        for (const comment of comments) {
          try {
            const userDoc = await getDoc(doc(db, "users", comment.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              // Find the comment in our map and add the user role
              const commentIndex = commentsMap[post.id].findIndex(c => c.id === comment.id);
              if (commentIndex !== -1) {
                commentsMap[post.id][commentIndex].userRole = userData.userType || 'standard';
              }
            }
          } catch (err) {
            console.error("Error getting comment author details:", err);
          }
        }
      }
      
      setPosts(postsData);
      setPostComments(commentsMap);
      setLoading(false);
      
    } catch (err) {
      console.error("Error refreshing posts:", err);
      setError("Failed to refresh posts after response");
      setLoading(false);
    }
  };

  // Function to get comments for a post
  const getPostComments = (postId) => {
    return postComments[postId] || [];
  };

  return (
    <>
      <Chatbot />
      <EmergencyButton />
      <Navbar />
      <div className="community-container">
        {/* Hero Section */}
        <div className="community-hero">
          <div className="hero-icon">
            <FaUsers />
          </div>
          <div className="hero-content">
            <h1>Community Forum</h1>
            <p className="quote">
              "Share your thoughts, ask questions, and support each other in our community."
            </p>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="community-main">
          {/* Info Panel */}
          <div className="community-info-panel">
            <h2>How It Works</h2>
            <div className="info-steps">
              <div className="info-step">
                <div className="step-icon">1</div>
                <div className="step-content">
                  <h3>Create a Post</h3>
                  <p>Share your question or experience with the community.</p>
                </div>
              </div>
              
              <div className="info-step">
                <div className="step-icon">2</div>
                <div className="step-content">
                  <h3>Community Engagement</h3>
                  <p>Other members can respond with advice and support.</p>
                </div>
              </div>
              
              <div className="info-step">
                <div className="step-icon">3</div>
                <div className="step-content">
                  <h3>Connect & Grow</h3>
                  <p>Build connections and learn from shared experiences.</p>
                </div>
              </div>
            </div>
            
            <button className="new-post-button" onClick={handleOpenModal}>
              <FaPlus /> Create New Post
            </button>
          </div>
          
          {/* Posts Area */}
          <div className="community-posts">
            <h2>Community Posts</h2>
            
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading posts...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                {!auth.currentUser && <p>Please log in to access community features.</p>}
                {error.includes("Failed to load") && (
                  <button 
                    className="retry-button"
                    onClick={() => {
                      setLoading(true);
                      setError(null);
                      // Retry loading posts
                      setTimeout(() => {
                        const user = auth.currentUser;
                        if (!user) {
                          setLoading(false);
                          setError("Please log in to view community posts");
                          return;
                        }
                        
                        // Create first post if none exist
                        if (posts.length === 0) {
                          handleOpenModal();
                        }
                      }, 1000);
                    }}
                  >
                    Retry
                  </button>
                )}
              </div>
            ) : posts.length === 0 ? (
              <div className="empty-posts">
                <div className="empty-icon">📝</div>
                <h3>No posts yet</h3>
                <p>Be the first to start a discussion in our community.</p>
                <button className="new-post-button small" onClick={handleOpenModal}>
                  <FaPlus /> Create New Post
                </button>
              </div>
            ) : (
              <div className="posts-list">
                {posts.map(post => (
                  <div 
                    key={post.id} 
                    className="post-card"
                  >
                    <div className="post-header">
                      <div className="post-category">{post.tags && post.tags[0]}</div>
                      <div className="comment-count">
                        <FaComments /> {post.commentCount || 0}
                      </div>
                    </div>
                    
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-content">{post.content}</p>
                    
                    <div className="post-meta">
                      <span className="post-author">
                        Posted by: {post.userName}
                      </span>
                      <span className="post-date">
                        {post.createdAt?.toDate ? 
                          new Date(post.createdAt.toDate()).toLocaleDateString() : 
                          "Just now"}
                      </span>
                    </div>
                    
                    {getPostComments(post.id).length > 0 && (
                      <div className="post-responses">
                        <h4>Responses:</h4>
                        {getPostComments(post.id).map((comment, index) => (
                          <div 
                            key={comment.id} 
                            className={`response ${comment.isFromPoster ? 'from-poster' : ''} ${
                              comment.userRole === 'counselor' ? 'from-counselor' : 
                              comment.userRole === 'admin' ? 'from-admin' : ''
                            }`}
                          >
                            <div className="response-header">
                              <span className="commenter-info">
                                {comment.userRole === 'counselor' ? (
                                  <><FaUserMd /> Counselor</>
                                ) : comment.isFromPoster ? (
                                  <>Original Poster</>
                                ) : (
                                  <>Community Member</>
                                )}
                              </span>
                              <span className="response-date">
                                {comment.createdAt?.toDate ? 
                                  new Date(comment.createdAt.toDate()).toLocaleDateString() : 
                                  "Just now"}
                              </span>
                            </div>
                            <p>{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="post-actions">
                      <button 
                        className="reply-button"
                        onClick={() => handleOpenResponseModal(post)}
                      >
                        <FaReply /> Reply to Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Therapy Information Section */}
      <section className="therapy-info-section">
        <div className="therapy-info-container">
          <div className="therapy-icon">
            <FaHeartbeat />
          </div>
          <div className="therapy-content">
            <h2>Professional Therapy Services</h2>
            <p>
              Therapy provides a safe, confidential space to work through challenges with a trained professional.
              Whether you're dealing with stress, anxiety, depression, or just need someone to talk to,
              our qualified therapists are here to help you on your journey to better mental health.
            </p>
            <p>
              <strong>Our free therapy sessions include:</strong>
            </p>
            <ul className="therapy-benefits">
              <li>One-on-one counseling with certified professionals</li>
              <li>Group support sessions with peers facing similar challenges</li>
              <li>Practical coping strategies you can apply in daily life</li>
              <li>A judgment-free space to express yourself openly</li>
            </ul>
            <button 
              className="therapy-button" 
              onClick={() => history.push('/free-therapy')}
            >
              Join Free Therapy Session <FaArrowRight />
            </button>
          </div>
        </div>
      </section>
      
      {/* New Post Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Post</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-body">
              {error && <div className="modal-error">{error}</div>}
              
              <form onSubmit={handleSubmitPost}>
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={newPost.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Relationships">Relationships</option>
                    <option value="Safety Concerns">Safety Concerns</option>
                    <option value="Bullying">Bullying</option>
                    <option value="General Advice">General Advice</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newPost.title}
                    onChange={handleInputChange}
                    placeholder="Brief title for your post"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="content">Your Question or Concern *</label>
                  <textarea
                    id="content"
                    name="content"
                    value={newPost.content}
                    onChange={handleInputChange}
                    placeholder="Describe your situation or question in detail"
                    rows="6"
                    required
                  ></textarea>
                </div>
                
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={newPost.isAnonymous}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="isAnonymous">Post anonymously</label>
                </div>
                
                <div className="privacy-reminder">
                  <FaLock />
                  <p>Your post will be visible to all members of the community.</p>
                </div>
                
                <div className="form-buttons">
                  <button type="button" className="cancel-button" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Submit Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal - renamed from CounselorResponseModal */}
      <ResponseModal
        isOpen={isResponseModalOpen}
        onClose={handleCloseResponseModal}
        post={selectedPost}
        onSubmit={handleResponseSubmit}
      />
    </>
  );
};

export default CommunityPage;