import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDj7ed5OSpjhYAG9l4dUy2IbrDni7OzPyc",
  authDomain: "jam25-01.firebaseapp.com",
  projectId: "jam25-01",
  storageBucket: "jam25-01.firebasestorage.app",
  messagingSenderId: "299605901933",
  appId: "1:299605901933:web:d05643a24d58f543087564"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
