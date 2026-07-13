/* ═══════════════════════════════════════════
   🌸 Ward Shop - Firebase Configuration
   ═══════════════════════════════════════════ */

const firebaseConfig = {
  apiKey: "AIzaSyCiSYCfj9jWS84irzIKbU57seFwSkGgN2w",
  authDomain: "himour-flower.firebaseapp.com",
  projectId: "himour-flower",
  storageBucket: "himour-flower.firebasestorage.app",
  messagingSenderId: "881097210463",
  appId: "1:881097210463:web:0495b6f12031090bbc39ea"
};

// تهيئة Firebase
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
  window.auth = firebase.auth();
  if (firebase.storage) {
    window.storage = firebase.storage();
  }
  console.log("Firebase has been initialized successfully!");
} else {
  console.error("Firebase SDK is not loaded. Please check CDN scripts in HTML.");
}
