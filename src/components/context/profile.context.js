import React, { createContext, useEffect, useState } from "react";

const ProfileContext = createContext();
function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   effect;
  //   return () => {
  //     cleanup;
  //   };
  // }, []);
  return (
    <ProfileContext.Provider value={{ profile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export default ProfileProvider;
