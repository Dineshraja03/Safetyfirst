import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useState, useEffect } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyCYOoJFD0nqykmFdiaRtIyri6QUoXsLk2U",
  authDomain: "final-year-project-b42fa.firebaseapp.com",
  projectId: "final-year-project-b42fa",
  storageBucket: "final-year-project-b42fa.firebasestorage.app",
  messagingSenderId: "389860480267",
  appId: "1:389860480267:web:4e7ff53e3a8939e0f1fe0e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Custom authentication hook
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { currentUser, loading };
};

export { auth, db };