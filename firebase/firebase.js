import firebase from "firebase/compat/app";
import 'firebase/compat/database';
const firebaseConfig = {
  apiKey: "AIzaSyDwMi-9FOTMXgK7alUBGsmzGGBN2w0H6JA",
  authDomain: "chat-app-reactnative-125fa.firebaseapp.com",
  databaseURL: "https://chat-app-reactnative-125fa-default-rtdb.firebaseio.com",
  projectId: "chat-app-reactnative-125fa",
  storageBucket: "chat-app-reactnative-125fa.appspot.com",
  messagingSenderId: "1053423187466",
  appId: "1:1053423187466:web:8bb86c5c9cd55157af91f3"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const dbRealtime=app.database();

export default dbRealtime;

