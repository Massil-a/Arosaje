import admin from 'firebase-admin';

// Firebase configuration from your Firebase project settings
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = admin.storage().bucket();

export { bucket };


// import { initializeApp } from 'firebase/app';
// import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: 'AIzaSyDSjrhka5acnnNS4B9J20M4qjkhMrmA22c',
//   authDomain: 'arosaje-d6a14.firebaseapp.com',
//   projectId: 'arosaje-d6a14',
//   storageBucket: 'arosaje-d6a14.appspot.com',
//   messagingSenderId: '1047496683232',
//   appId: '1:1047496683232:web:e0fe4494be04b2cb7eaa85',
//   measurementId: 'G-JH3ZZB4ZZE'
// };

// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);  // Initialize Firebase Storage

// const uploadFile = async (file: Express.Multer.File, userId: number) => {
//   const storageRef = ref(storage, `profilePictures/${userId}_pp`);
//   await uploadBytes(storageRef, file.buffer);
//   return getDownloadURL(storageRef);
// };

// const getFileURL = async (userId: number) => {
//   const storageRef = ref(storage, `profilePictures/${userId}_pp`);
//   const url = await getDownloadURL(storageRef);
//   return url;
// };

// const deleteFile = async (userId: number) => {
//   const storageRef = ref(storage, `profilePictures/${userId}_pp`);
//   await deleteObject(storageRef);
// };

// export { uploadFile, getFileURL, deleteFile };


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDSjrhka5acnnNS4B9J20M4qjkhMrmA22c",
//   authDomain: "arosaje-d6a14.firebaseapp.com",
//   projectId: "arosaje-d6a14",
//   storageBucket: "arosaje-d6a14.appspot.com",
//   messagingSenderId: "1047496683232",
//   appId: "1:1047496683232:web:e0fe4494be04b2cb7eaa85",
//   measurementId: "G-JH3ZZB4ZZE"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);