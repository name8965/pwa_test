self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("message", event);
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
self.addEventListener("push", function (event) {
  console.log(event);
  console.log(event.data);
  console.log(event.data.json());
  console.log(event.data.json().notification);
  const title = event.data.json().notification.title;
  console.log(title);

  const options = {
    body: event.data.json().notification.body,
    icon: "favicon.ico",
  };
  console.log(options.body);

  event.waitUntil(self.registration.showNotification(title, options)); // showNotification을 통해 푸시 알림을 생성, Promise가 반환되며 waitUntil을 통해 이벤트를 연장 시켜야함
});

self.addEventListener("notificationclick", function (event) {
  console.log("notificationclick", event);

  event.notification.close();
  event.waitUntil(
    self.clients.openWindow("https://zzzapp.co.kr") // 예시로 일단 로컬호스트로 링크 누르면 가지는걸로 해놨다.
  );
});

// import { initializeApp } from "firebase/app";
// import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
// // Initialize the Firebase app in the service worker by passing in
// // your app's Firebase config object.
// // https://firebase.google.com/docs/web/setup#config-object
// const firebaseApp = initializeApp({
//   apiKey: "AIzaSyBTwSgVb4te8rw917dbGQsIAPzVExk56LE",
//   authDomain: "test-pwa-b91b2.firebaseapp.com",
//   projectId: "test-pwa-b91b2",
//   storageBucket: "test-pwa-b91b2.appspot.com",
//   messagingSenderId: "1037402900826",
//   appId: "1:1037402900826:web:f268fc128ed5fe0aee0b63",
// });

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = getMessaging(firebaseApp);

// onBackgroundMessage(messaging, (payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   // Customize notification here
//   const notificationTitle = "Background Message Title";
//   const notificationOptions = {
//     body: "Background Message body.",
//     icon: "/firebase-logo.png",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
