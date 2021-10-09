import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../../config/firebase";
import { onValue, ref } from "@firebase/database";
const DataTimeContext = createContext();

export function DataTimeProvider({ children }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(database, "profiles/" + user.uid + "/data");
        onValue(userRef, (snap) => {
          const data = {
            ...snap.val(),
          };
          setData(() => data);
          setIsLoading(false);
        });
      } else {
        setData(null);
        setIsLoading(false);
      }
    });
  }, []);
  return (
    <DataTimeContext.Provider value={{ data, isLoading }}>
      {children}
    </DataTimeContext.Provider>
  );
}

export { DataTimeContext };
