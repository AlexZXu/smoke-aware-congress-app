// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "smoke-tracker-app.firebaseapp.com",
  projectId: "smoke-tracker-app",
  storageBucket: "smoke-tracker-app.appspot.com",
  messagingSenderId: "889081187488",
  appId: process.env.FIREBASE_APP_ID,
  measurementId: "G-F7PW4VZN6W"
};

let analytics;
// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (typeof window != 'undefined') {
    analytics = getAnalytics(app);
}

export const db = getFirestore(app)
export {analytics}