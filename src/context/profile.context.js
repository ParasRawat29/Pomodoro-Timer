import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { onValue, ref } from "@firebase/database";
const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(database, "profiles/" + user.uid + "/");
        onValue(userRef, (snap) => {
          const data = {
            ...snap.val(),
            uid: user.uid,
            email: user.email,
            photoUrl: user.photoURL,
          };
          setProfiles(() => data);
          setIsLoading(false);
        });
      } else {
        setProfiles(null);
        setIsLoading(false);
      }
    });
  }, []);
  return (
    <ProfileContext.Provider value={{ profiles, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export { ProfileContext };
