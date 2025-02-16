import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import auth from "../firebaseSetup/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { firestore } from "../firebaseSetup/firebase";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ didTour: false });
  const [didTour, setDidTourRaw] = useState(JSON.parse(localStorage.getItem('didTour') ?? 'false'));
  const [didShopTour, setDidShopTourRaw] = useState(JSON.parse(localStorage.getItem('didShopTour') ?? 'false'));

  const setDidTour = useCallback((value) => {
    setDidTourRaw(value);
    if (user?.uid) {
      setDoc(doc(firestore, 'users', user.uid), { ...user, didTour: value });
    }
    localStorage.setItem('didTour', JSON.stringify(value));
  }, [user]);

  const setDidShopTour = useCallback((value) => {
    setDidShopTourRaw(value);
    if (user?.uid) {
      setDoc(doc(firestore, 'users', user.uid), { ...user, didShopTour: value });
    }
    localStorage.setItem('didShopTour', JSON.stringify(value));
  }, [user]);

  useEffect(() => {
    let unsubListener = () => {};
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        unsubListener = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
          setUser(doc.data());
        });
        
      } else {
        unsubListener();
        setUser({ didTour: false, didShopTour: false });
      }
    });

    return () => { unsubListener(); unregisterAuthObserver(); };
  }, []);

  useEffect(() => {
    if (didTour !== user?.didTour) {
      if (user?.uid) {
        setDoc(doc(firestore, 'users', user?.uid), { ...user, didTour });
      } else {
        setUser({ ...user, didTour });
      }
    }
  }, [didTour, user]);

  useEffect(() => {
    if (didShopTour !== user?.didShopTour) {
      if (user?.uid) {
        setDoc(doc(firestore, 'users', user.uid), { ...user, didShopTour });
      } else {
        setUser({ ...user, didShopTour });
      }
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