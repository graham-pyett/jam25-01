import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
import { getFunctions } from '@firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyDj7ed5OSpjhYAG9l4dUy2IbrDni7OzPyc",
  authDomain: "jam25-01.firebaseapp.com",
  projectId: "jam25-01",
  storageBucket: "jam25-01.firebasestorage.app",
  messagingSenderId: "299605901933",
  appId: "1:299605901933:web:d05643a24d58f543087564"
};


const app = initializeApp(firebaseConfig);

export const firebaseApp = app;

export const firestore = getFirestore(app)

export const functions = getFunctions(app);