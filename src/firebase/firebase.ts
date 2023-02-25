// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBYwxBlIxPWAy2oLrU7tEJHSMcdy7mN-yU',
  authDomain: 'fuelin-faf52.firebaseapp.com',
  projectId: 'fuelin-faf52',
  storageBucket: 'fuelin-faf52.appspot.com',
  messagingSenderId: '40879367261',
  appId: '1:40879367261:web:633a9d31bb481811fc59b4',
  measurementId: 'G-X5GZP7VC84'
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export { auth, provider, db, signInWithPopup };
