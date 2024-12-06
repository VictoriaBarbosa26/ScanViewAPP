import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage

const firebaseConfig = {
  apiKey: "AIzaSyCVBEDISwJQKnFvNMdZn3Tc7yA7oSekk80",
  authDomain: "scanview2024.firebaseapp.com",
  projectId: "scanview2024",
  storageBucket: "scanview2024.appspot.com",
  messagingSenderId: "1012390917118",
  appId: "1:1012390917118:web:934290f93bff62470346af",
  measurementId: "G-E55N701LHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) // Configurando a persistência
});
const db = getFirestore(app);

export { auth, db };
