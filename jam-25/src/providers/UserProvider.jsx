import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import auth from "../firebaseSetup/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseSetup/firebase";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [didTour, setDidTourRaw] = useState(JSON.parse(localStorage.getItem('didTour') ?? 'false'));

  const setDidTour = useCallback((value) => {
    setDidTourRaw(value);
    localStorage.setItem('didTour', JSON.stringify(value));
  }, []);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      if (user) {
        getDoc(doc(firestore, `users/${user.uid}`)).then((snap) => {
          if (snap.exists()) {
            setUser(snap.data());
          }
        });
      } else {
        setUser({});
      }
    });

    return () => unregisterAuthObserver();
  }, []);

  useEffect(() => {
    if (didTour !== user?.didTour) {
      setUser({ ...user, didTour });
    }
  }, [didTour, user]);

  const value = useMemo(() => {
    return {
      user,
      apiKey: user?.apiKey,
      setDidTour
    };
  }, [user, setDidTour]);

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