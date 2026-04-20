importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDFhuWjxhqeB-AnduOD7Ho2fdTORNHpKYs",
    authDomain: "ez-subcontractor.firebaseapp.com",
    projectId: "ez-subcontractor",
    messagingSenderId: "900367896212",
    appId: "1:900367896212:web:d1122497083f86e284ae81",
});

const messaging = firebase.messaging();

// Background notification
messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(
        payload.notification.title,
        {
            body: payload.notification.body,
        }
    );
});
