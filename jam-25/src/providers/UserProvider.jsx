import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import auth from "../firebaseSetup/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseSetup/firebase";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      if (user) {
        getDoc(doc(firestore, `users/${user.uid}`)).then((snap) => {
          if (snap.exists()) {
            setUser(snap.data());
          }
        });
      } else {
        setUser(null);
      }
    });

    return () => unregisterAuthObserver();
  }, []);

  const value = useMemo(() => {
    return {
      user,
      apiKey: user?.apiKey,
    };
  }, [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

export { UserProvider, UserContext, useUser };