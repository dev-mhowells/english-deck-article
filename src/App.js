import React from "react";
import Article from "./Article";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase-config";

export default function App() {
  // ---------------------- FIREBASE GOOGLE SIGN IN ------------------------- //

  // authstatechange sets userIn on log in and log out
  const [userIn, setUserIn] = React.useState({});

  onAuthStateChanged(auth, (user) => {
    setUserIn(user);
  });

  function googleSignIn() {
    signInWithPopup(auth, provider);
  }

  function googleSignOut() {
    signOut(auth);
  }
  // --------------------------------------------------------------------------//

  return (
    <div className="whole-page">
      <nav className="nav">
        <div className="nav-left">
          <p className="nav-link">Home</p>
          <p className="nav-link">About</p>
          <p className="nav-link">Contact</p>
        </div>
        <div className="nav-title">
          <h1 className="nav-title">English Deck</h1>
        </div>
        <div className="nav-right">
          <p
            className="nav-link login"
            onClick={!userIn ? googleSignIn : googleSignOut}
          >
            {!userIn ? "Login" : "Log out"}
          </p>
        </div>
      </nav>
      <Article userIn={userIn} googleSignIn={googleSignIn} />
      <footer>
        <p>Home</p>
        <p>Contact</p>
        <p
          className="footer-login"
          onClick={!userIn ? googleSignIn : googleSignOut}
        >
          {!userIn ? "Login" : "Log out"}
        </p>
      </footer>
    </div>
  );
}
