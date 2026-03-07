// config/firebase.js
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK using service account JSON file
// Download the service account key from Firebase Console > Project settings > Service accounts
// Place the JSON file in the backend/config/ directory and name it serviceAccountKey.json
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

export default admin;