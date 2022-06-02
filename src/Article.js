import React from "react";
import { db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";

import Flashcards from "./Flashcards";
import Comments from "./Comments";
import Quiz from "./Quiz";

import eye from "./images/eye.png";

export default function Article(props) {
  //----------------------------FIREBASE-----------------------------
  const [flashcards, setFlashcards] = React.useState([]); // data from firebase
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    async function getFlashcards() {
      const flashcardsCol = collection(db, "feats-flash1");
      const flashcardsSnapshot = await getDocs(flashcardsCol);
      const flashcardsList = flashcardsSnapshot.docs.map((doc) => doc.data());

      const flashcardsCol2 = collection(db, "feats-flash2");
      const flashcardsSnapshot2 = await getDocs(flashcardsCol2);
      const flashcardsList2 = flashcardsSnapshot2.docs.map((doc) => doc.data());

      // each collection is a seperate array of flashcards
      setFlashcards([flashcardsList, flashcardsList2]);
    }
    getFlashcards();
  }, []);

  // returns array with object for each paragraph
  React.useEffect(() => {
    async function getText() {
      const textCol = collection(db, "article1");
      const textColSnapshot = await getDocs(textCol);
      const text1 = textColSnapshot.docs.map((doc) => doc.data());

      setText(text1);
    }
    getText();
  }, []);

  //-----------------------------------------------------------------------

  const [savedCards, setSavedCards] = React.useState([]);

  // count is passed into the function in Flashcard.js to ensure current card is saved!
  // groupNumber is passed in to ensure the correct flashcard group
  function save(count, groupNumber) {
    // First checks if card with the same title already exists in saved cards, so no dupes added
    let shouldProceed = true;
    for (let savedCard of savedCards) {
      if (flashcards[groupNumber][count].title === savedCard.title) {
        shouldProceed = false;
      }
    }
    // if not a dupe, adds card to savedCards
    if (shouldProceed === true) {
      setSavedCards((prevSavedcards) => [
        ...prevSavedcards,
        flashcards[groupNumber][count],
      ]);
    }
  }

  // filter saved cards, if count matches index of card, don't include it
  function deleteCard(count) {
    setSavedCards((prevSavedcards) =>
      prevSavedcards.filter((_, index) => index !== count)
    );
  }

  const [quizStoryDisp, setQuizStoryDisp] = React.useState(true);

  function toggleQuizStory() {
    setQuizStoryDisp((prevQuizStoryDisp) => !prevQuizStoryDisp);
  }

  // ------------------------------ ARTICLE BODY + FLASHCARDS ------------------------

  // gets all titles of flashcards i.e. all vocab (repeated code)
  let allFlashTitles = [];
  for (let i in flashcards) {
    let flashTitles = flashcards[i].map((flashcard) => flashcard.title);
    allFlashTitles = [...allFlashTitles, ...flashTitles];
  }

  // returns text with styled words if words are in flashcard titles
  function highlightWords(text) {
    if (text.text) {
      console.log("text", text);
      const words = text.text.split(" ");

      const highlightedText = words.map((word) => {
        if (allFlashTitles.includes(word)) {
          word = <b className="inline">{`${word + " "}`}</b>;
          return word;
        } else return word + " ";
      });

      return highlightedText;
    }
  }

  // maps over number of flashcard groups (firebase collections)
  // passes in group and identifier of group as groupNumber so card can be id'd and saved
  const flashymap = flashcards.map((group, i) =>
    i % 2 !== 0 ? (
      <div className="card-text-pair">
        <Flashcards
          savedCards={savedCards}
          save={save}
          flashcards={group}
          groupNumber={i}
        />
        {<p className="article-text test-flex">{highlightWords(text[1])}</p>}
      </div>
    ) : (
      <div className="card-text-pair">
        <p className="article-text">{highlightWords(text[0])}</p>
        <Flashcards
          savedCards={savedCards}
          save={save}
          flashcards={group}
          groupNumber={i}
        />
      </div>
    )
  );

  // --------------------------------------------------------------------------

  return (
    <div className="article-container">
      <div className="card-text-pair">
        <div className="title-image-container">
          <div className="image-border">
            <img src={eye} className="title-image"></img>
          </div>
        </div>
        <div className="article-title-container">
          <p>
            <b>Level:</b> Advanced
          </p>
          <h2 className="article-title">
            Alex Honnold: Preperation and Greatness
          </h2>
          <p>
            <b>Author:</b> Michael Howells
          </p>
        </div>
      </div>
      {flashymap}
      {savedCards[0] && (
        <div>
          <h2 className="saved-cards-title">Your Saved Cards</h2>
          <Flashcards
            savedCards={savedCards}
            save={save}
            flashcards={savedCards}
            deleteCard={deleteCard}
          />
        </div>
      )}
      <div className="quiz-comment-box">
        <button
          className={`toggle-quiz-btn ${quizStoryDisp && "selected-btn"}`}
          onClick={toggleQuizStory}
        >
          Quiz
        </button>
        <button
          className={`toggle-story-btn ${!quizStoryDisp && "selected-btn"}`}
          onClick={toggleQuizStory}
        >
          Your Story
        </button>
        {quizStoryDisp ? (
          <Quiz />
        ) : (
          <Comments
            flashcards={flashcards}
            isAuth={props.isAuth}
            googleSignIn={props.googleSignIn}
            // posts={posts}
          />
        )}
      </div>
      <footer>
        <h4>Home</h4>
        <h4>Contact</h4>
        <h4>{!props.isAuth ? "Login" : "Log out"}</h4>
      </footer>
    </div>
  );
}
