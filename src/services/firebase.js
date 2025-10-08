const {initializeApp} = require("firebase/app");

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: "playground-358323.appspot.com",
    messagingSenderId: "74816207123",
    appId: "1:74816207123:web:de919367778f6a04d242e6",
    measurementId: "G-G4NG7QDS15"
};

const app = initializeApp(firebaseConfig);

module.exports = app;
