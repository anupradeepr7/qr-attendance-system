import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function generateQRCode() {
  const newSession = await addDoc(collection(db, "sessions"), {
    createdAt: new Date(),
  });
  return newSession.id;
}
