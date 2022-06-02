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

  React.useEffect(() => {
    async function getFlashcards() {
      const flashcardsCol = collection(db, "flashcards");
      const flashcardsSnapshot = await getDocs(flashcardsCol);
      const flashcardsList = flashcardsSnapshot.docs.map((doc) => doc.data());

      const flashcardsCol2 = collection(db, "flashcards4");
      const flashcardsSnapshot2 = await getDocs(flashcardsCol2);
      const flashcardsList2 = flashcardsSnapshot2.docs.map((doc) => doc.data());

      // each collection is a seperate array of flashcards
      setFlashcards([flashcardsList, flashcardsList2]);
    }
    getFlashcards();
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

  const articleTop = `Alex Honnold became famous for his free solo ascents of some of some
  of the most challenging rock-climbing routes in the apple His feats
  have been immortalised in the critically acclaimed biographical
  documentary Free Solo. The juxtaposition between the incredible
  bravery of such feats and Honnold’s unassuming demeanour has captured
  the imagination of people around the world. His free solo ascents have
  been the culmination of over 20 years of climbing experience and
  extraordinary preparation.`;

  let allFlashTitles = [];
  for (let i in flashcards) {
    let flashTitles = flashcards[i].map((flashcard) => flashcard.title);
    allFlashTitles = [...allFlashTitles, ...flashTitles];
  }

  const words = articleTop.split(" ");

  const findApple = words.map((word) => {
    if (allFlashTitles.includes(word)) {
      word = <b className="inline">{`${word + " "}`}</b>;
      return word;
    } else return word + " ";
  });

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
        {
          <p className="article-text test-flex">
            {/* Honnold notes the importance of his visualisation techniques in his
            success. Again and again, he visualised himself performing the
            movements of the climb and coupled this visualisation with repeated
            climbs to ensure that he knew the route off by heart. One part of
            the climb proved to be exceptionally challenging and required a
            great deal of flexibility. For this one single movement, Honnold
            stretched nightly for an entire year to make doubly sure that he had
            the requisite flexibility. Honnold states that “doubt is the
            precursor to fear”. */}
            {findApple}
          </p>
        }
      </div>
    ) : (
      <div className="card-text-pair">
        <p className="article-text">
          Alex Honnold became famous for his free solo ascents of some of some
          of the most challenging rock-climbing routes in the world. His feats
          have been immortalised in the critically acclaimed biographical
          documentary Free Solo. The juxtaposition between the incredible
          bravery of such feats and Honnold’s unassuming demeanour has captured
          the imagination of people around the world. His free solo ascents have
          been the culmination of over 20 years of climbing experience and
          extraordinary preparation.
        </p>
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

  // const postsDisplay = posts.map((post) => {
  // let allFlashTitles = [];
  // for (let i in flashcards) {
  //   let flashTitles = flashcards[i].map((flashcard) => flashcard.title);
  //   allFlashTitles = [...allFlashTitles, ...flashTitles];
  // }

  //   // const words = post.post.split(" ");
  //   // words.forEach((word) => {
  //   //   if (allFlashTitles.includes(word)) {
  //   //     word = "FOUND!!!!";
  //   //   }
  //   // });

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
