import React from "react";
import Article from "./Article";
import {
  signInWithPopup,
  signOut,
  getAuth,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, provider } from "./firebase-config";

export default function App() {
  // ---------------------- FIREBASE GOOGLE SIGN IN ------------------------- //
  const [isAuth, setIsAuth] = React.useState(false);

  // const auth = getAuth();
  // localStorage.setItem("isAuth", true);
  // setPersistence(auth, browserSessionPersistence).then(() => {
  //   return googleSignIn;
  // });

  // function googleSignIn() {
  //   const auth = getAuth();
  //   setPersistence(auth, browserSessionPersistence)
  //     .then(() => {
  //       // Existing and future Auth states are now persisted in the current
  //       // session only. Closing the window would clear any existing state even
  //       // if a user forgets to sign out.
  //       // ...
  //       // New sign-in will be persisted with session persistence.
  //       return signInWithPopup(auth, provider);
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //     });
  // }

  // authstatechange sets userIn on log in and log out
  const [userIn, setUserIn] = React.useState({});

  onAuthStateChanged(auth, (user) => {
    console.log("user state change", user);
    setUserIn(user);
  });

  function googleSignIn() {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      // console.log("signed in");
    });
  }

  function googleSignOut() {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      console.log("signed out");
      // setUserIn(null);
    });
  }
  // --------------------------------------------------------------------------//

  return (
    <div className="whole-page">
      <nav className="nav">
        <div className="nav-left">
          <h3 className="nav-link">Home</h3>
          <h3 className="nav-link">About</h3>
          <h3 className="nav-link">Contact</h3>
        </div>
        <h1 className="nav-title">English Deck</h1>
        <div className="nav-right">
          <h3
            className="nav-link login"
            onClick={!userIn ? googleSignIn : googleSignOut}
          >
            {!userIn ? "Login" : "Log out"}
          </h3>
          {/* <h3 className="nav-link sign-up" onClick={googleSignOut}>
            Sign Out
          </h3> */}
        </div>
      </nav>
      <Article isAuth={isAuth} userIn={userIn} googleSignIn={googleSignIn} />
    </div>
  );
}
