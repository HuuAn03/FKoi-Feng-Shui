const firebaseConfig = {
    apiKey: "AIzaSyBX9yks4VqIFVi5NNckdkvJ5YE25TuyIRQ",
    authDomain: "swp391-fkoi.firebaseapp.com",
    projectId: "swp391-fkoi",
    storageBucket: "swp391-fkoi.firebasestorage.app",
    messagingSenderId: "77371401993",
    appId: "1:77371401993:web:fcd2b4a11c0dddcdd995d8",
    measurementId: "G-G82FCBRP0D"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Retrieve an instance of Firebase Messaging so that it can handle background messages.
  const messaging = firebase.messaging();
  
  messaging.onBackgroundMessage((payload) => {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );
  
    // Customize notification here
    const notificationTitle =
      payload.notification?.title || "Background Message Title";
    const notificationOptions = {
      body: payload.notification?.body || "Background Message body.",
      icon: payload.notification?.icon || "/firebase-logo.png",
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });