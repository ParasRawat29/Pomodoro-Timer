import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7yQol2aAlw_OtzuZKl-OHn4KIfq4zF4w",
  authDomain: "pomotimer-o.firebaseapp.com",
  projectId: "pomotimer-o",
  databaseURL: "https://pomotimer-o-default-rtdb.firebaseio.com",
  storageBucket: "pomotimer-o.appspot.com",
  messagingSenderId: "824654293014",
  appId: "1:824654293014:web:61f7c5788578b7960d2d37",
  measurementId: "G-WKGS70S7EN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
