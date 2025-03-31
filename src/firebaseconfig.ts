// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, DocumentData } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA6lLMQdihHjZRk_EFybSmQTu-y_ptsVT8",
    authDomain: "anshif-4ae5e.firebaseapp.com",
    projectId: "anshif-4ae5e",
    storageBucket: "anshif-4ae5e.firebasestorage.app",
    messagingSenderId: "27047660075",
    appId: "1:27047660075:web:389acc33cb8ab5bdb5f86e"
};

interface Admin {
  id: string;
  name: string;
  role: string;
  username: string;
}

interface AuthResult {
  success: boolean;
  message?: string;
  admin?: Admin;
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to authenticate admin
export const authenticateAdmin = async (username: string, password: string): Promise<AuthResult> => {
  try {
    // Query the admin collection for the username
    const adminCollectionRef = collection(db, "admin");
    const q = query(adminCollectionRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, message: "Invalid username" };
    }
    
    // Check if password matches
    const adminDoc = querySnapshot.docs[0];
    const adminData = adminDoc.data() as DocumentData;
    
    if (adminData.password === password) {
      return { 
        success: true, 
        admin: { 
          id: adminDoc.id, 
          name: adminData.name, 
          role: adminData.role, 
          username: adminData.username 
        } 
      };
    } else {
      return { success: false, message: "Invalid password" };
    }
  } catch (error) {
    console.error("Error authenticating admin:", error);
    return { success: false, message: "Authentication error" };
  }
};

export { app, db }; 