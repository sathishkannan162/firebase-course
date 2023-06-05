import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider } from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCDk5EeWZdb61oThrFrBvHziP8aHC_EpXM",
  authDomain: "fir-course-c4dfa.firebaseapp.com",
  projectId: "fir-course-c4dfa",
  storageBucket: "fir-course-c4dfa.appspot.com",
  messagingSenderId: "727960273478",
  appId: "1:727960273478:web:07a23e38413a61fc7e0047",
  measurementId: "G-CRK2ZHHD78"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
