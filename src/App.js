import React from "react";
import Article from "./Article";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase-config";

export default function App() {
  // ---------------------- FIREBASE GOOGLE SIGN IN ------------------------- //
  const [isAuth, setIsAuth] = React.useState(false);

  function googleSignIn() {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      console.log("signed in");
    });
  }

  function googleSignOut() {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      console.log("signed out");
    });
  }
  // --------------------------------------------------------------------------//

  return (
    <div className="whole-page">
      <nav className="nav">
        <div className="nav-left">
          <h3 className="nav-link">Author</h3>
          <h3 className="nav-link">About</h3>
          <h3 className="nav-link">Contact</h3>
        </div>
        <h1 className="nav-title">English Deck</h1>
        <div className="nav-right">
          <h3 className="nav-link" onClick={googleSignIn}>
            {!isAuth ? "Login" : "Log out"}
          </h3>
          <h3 className="nav-link sign-up" onClick={googleSignOut}>
            Sign Out
          </h3>
        </div>
      </nav>
      <Article isAuth={isAuth}/>
    </div>
  );
}
