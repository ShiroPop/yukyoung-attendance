// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCi5jUjCBl_0NQSU-3hmQFRwfnUo5_LcbU",
  authDomain: "school-attendance-test.firebaseapp.com",
  projectId: "school-attendance-test",
  storageBucket: "school-attendance-test.firebasestorage.app",
  messagingSenderId: "52608519331",
  appId: "1:52608519331:web:687222cf06dd8bb6efc316",
  measurementId: "G-SFC0E8YP7M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
