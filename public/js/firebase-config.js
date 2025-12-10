// Firebase Configuration
// NOTE: Firebase API keys are safe to expose in client-side code.
// They identify your Firebase project but do not authenticate users.
// Security is enforced through Firebase Security Rules in database.rules.json
const firebaseConfig = {
  apiKey: "AIzaSyB6hEMEUZtBR9c2JxyBYuHivLlacSVbs0w",
  authDomain: "trickortreat-8c078.firebaseapp.com",
  databaseURL: "https://trickortreat-8c078-default-rtdb.firebaseio.com",
  projectId: "trickortreat-8c078",
  storageBucket: "trickortreat-8c078.firebasestorage.app",
  messagingSenderId: "201980753480",
  appId: "1:201980753480:web:f3f107a716abb614ae8a7d",
  measurementId: "G-3DEQ8DYRMG"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Analytics (basic tracking starts automatically upon initialization)
const analytics = firebase.analytics();

// Get database reference
const database = firebase.database();
