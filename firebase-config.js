import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyACr29Nj7xzRb0goAxa7uzfopuCieZvPa8",
  authDomain: "kuwait-analytics-hub.firebaseapp.com",
  projectId: "kuwait-analytics-hub",
  storageBucket: "kuwait-analytics-hub.firebasestorage.app",
  messagingSenderId: "1051687603283",
  appId: "1:1051687603283:web:d0dd5d1df9d3ac4bd68aa6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
