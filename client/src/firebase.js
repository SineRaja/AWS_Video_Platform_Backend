import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCB7cz_ofKEevJt7XUc54XBGzsMdHRBZD4",
  authDomain: "onlinevideoplatform-4993c.firebaseapp.com",
  projectId: "onlinevideoplatform-4993c",
  storageBucket: "onlinevideoplatform-4993c.appspot.com",
  messagingSenderId: "892365172140",
  appId: "1:892365172140:web:2dfb1d80d2d8d608709e09",
  measurementId: "G-VX2DRQCREZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;