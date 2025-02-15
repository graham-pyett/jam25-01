import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import auth from "../firebaseSetup/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseSetup/firebase";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ didTour: false });
  const [didTour, setDidTourRaw] = useState(JSON.parse(localStorage.getItem('didTour') ?? 'false'));
  const [didShopTour, setDidShopTourRaw] = useState(JSON.parse(localStorage.getItem('didShopTour') ?? 'false'));

  const setDidTour = useCallback((value) => {
    setDidTourRaw(value);
    setUser({ ...user, didTour: value });
    localStorage.setItem('didTour', JSON.stringify(value));
  }, [user]);

  const setDidShopTour = useCallback((value) => {
    setDidShopTourRaw(value);
    setUser({ ...user, didShopTour: value });
    localStorage.setItem('didShopTour', JSON.stringify(value));
  }, [user]);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        getDoc(doc(firestore, `users/${user.uid}`)).then((snap) => {
          if (snap.exists()) {
            setUser(snap.data());
          }
        });
      } else {
        setUser({ didTour: false, didShopTour: false });
      }
    });

    return () => unregisterAuthObserver();
  }, []);

  useEffect(() => {
    if (didTour !== user?.didTour) {
      setUser({ ...user, didTour });
    }
  }, [didTour, user]);

  useEffect(() => {
    if (didShopTour !== user?.didShopTour) {
      setUser({ ...user, didShopTour });
    }
  }, [didShopTour, user]);

  const value = useMemo(() => {
    return {
      user,
      apiKey: user?.apiKey,
      setDidTour,
      didShopTour,
      setDidShopTour
    };
  }, [user, setDidTour, didShopTour, setDidShopTour]);

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