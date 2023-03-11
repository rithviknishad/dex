"use client";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD_XEO50MX37U3jn5zEpecqr3DMccrazvk",
  authDomain: "dex-prosumers.firebaseapp.com",
  databaseURL:
    "https://dex-prosumers-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dex-prosumers",
  storageBucket: "dex-prosumers.appspot.com",
  messagingSenderId: "286008575065",
  appId: "1:286008575065:web:e4f1d15c426bdf84d35d48",
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
