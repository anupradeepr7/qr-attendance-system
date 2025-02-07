"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function TestFirestore() {
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchSessions();
      } else {
        setError("User is not authenticated. Please log in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSessions = async () => {
    try {
      const snapshot = await getDocs(collection(db, "sessions"));
      setSessions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setError("Firestore permission error. Please check security rules.");
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1>Firestore Data</h1>
      {user ? (
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>{session.id}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
