// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXtsQsTi7tiVrYZqWfY29FkwUOS3-UJqg",
  authDomain: "coca-cola-2abeb.firebaseapp.com",
  databaseURL: "https://coca-cola-2abeb-default-rtdb.firebaseio.com",
  projectId: "coca-cola-2abeb",
  storageBucket: "coca-cola-2abeb.appspot.com",
  messagingSenderId: "927564637580",
  appId: "1:927564637580:web:5060173b7bad897ec8a2a9",
  measurementId: "G-BZBCY2X8J6"
};

// Initialize Firebase (using v8 syntax)
firebase.initializeApp(firebaseConfig);
const database = firebase.database(); // Make database globally accessible
