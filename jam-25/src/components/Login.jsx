import firebase from 'firebase/compat/app';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import React, { useEffect } from "react";
import auth from "../firebaseSetup/auth";
import { useUser } from "../providers/UserProvider";
import { firestore } from '../firebaseSetup/firebase';
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";

const LoginModal = ({ show, setShow }) => {
  const { user } = useUser();

  useEffect(() => {
    if (show) {
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

      ui.start('#firebaseui-auth-container', {
        signInFlow: 'popup',
        signInOptions: [
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false,
          },
          {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            requireDisplayName: false,
          },
        ],
        callbacks: {
          // Avoid redirects after sign-in.
          signInSuccessWithAuthResult: (authResult) => {
            const newUser = authResult.user;
            if (newUser) {
              const userRef = doc(firestore, 'users', newUser.uid);
              getDoc(userRef).then((snap) => {
                if (!snap.exists()) {
                  setDoc(doc(firestore, 'users', newUser.uid), { email: newUser.email.toLowerCase(), uid: newUser.uid, name: newUser.displayName ?? '', didTour: false, didShopTour: false, savedGame: null });
                }
              })

            }
            setShow(false);
          },
        },
      });
    }
  }, [show, setShow]);

  return (
    <Dialog keepMounted open={show} onClose={() => setShow(false)}>
      <DialogTitle>
        <Typography variant="overline">
          Login
        </Typography>
      </DialogTitle>
      <DialogContent>
        <div id="firebaseui-auth-container"></div>
        {
          user?.uid && (
            <>Successfully logged in!</>
          )
        }
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;