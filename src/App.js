import React from "react";
import Article from "./Article";
import Quiz from "./Quiz";

export default function App() {
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
          <h3 className="nav-link">Login</h3>
          <h3 className="nav-link sign-up">Sign Up</h3>
        </div>
      </nav>
      <Article />
    </div>
  );
}
