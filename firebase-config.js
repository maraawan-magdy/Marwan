const firebaseConfig = {
    apiKey: "AIzaSyCXtsQsTi7tiVrYZqWfY29FkwUOS3-UJqg",
    authDomain: "coca-cola-2abeb.firebaseapp.com",
    databaseURL: "https://coca-cola-2abeb-default-rtdb.firebaseio.com", // <-- Add this line!
    projectId: "coca-cola-2abeb",
    storageBucket: "coca-cola-2abeb.appspot.com", // <-- Fix typo: should be .appspot.com
    messagingSenderId: "927564637580",
    appId: "1:927564637580:web:7070bab08283f48dc8a2a9",
    measurementId: "G-FGSNDPGF4W"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);