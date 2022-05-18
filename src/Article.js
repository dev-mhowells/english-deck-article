import React from "react";
import { db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";
import Flashcards from "./Flashcards";
import Comments from "./Comments";
import Quiz from "./Quiz";

import eye from "./images/eye.png";

export default function Article() {
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

  //----------------------------------------------------------------

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
    } else {
      console.log("duplicate found and eradicated");
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
        <p className="article-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Natoque
          vulputate augue suspendisse iaculis eleifend. Hac a, cras semper
          laoreet nec id. Pretium integer consectetur volutpat nulla adipiscing
          dui. Scelerisque vel diam in vel sapien dictum sapien ac sed.
        </p>
      </div>
    ) : (
      <div className="card-text-pair">
        <p className="article-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Natoque
          vulputate augue suspendisse iaculis eleifend. Hac a, cras semper
          laoreet nec id. Pretium integer consectetur volutpat nulla adipiscing
          dui. Scelerisque vel diam in vel sapien dictum sapien ac sed.
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
            <b>Level:</b> Intermediate
          </p>
          <h2 className="article-title">Lorem Ipsum Dolor sit Amet</h2>
          <p>
            <b>Author:</b> Michael Howells
          </p>
        </div>
      </div>
      {flashymap}
      {savedCards[0] && (
        <Flashcards
          savedCards={savedCards}
          save={save}
          flashcards={savedCards}
          deleteCard={deleteCard}
        />
      )}
      <div className="quiz-comment-box">
        <button className="toggle-quiz-btn" onClick={toggleQuizStory}>
          Quiz
        </button>
        <button className="toggle-story-btn" onClick={toggleQuizStory}>
          Your Story
        </button>
        {quizStoryDisp ? <Quiz /> : <Comments flashcards={flashcards} />}
      </div>
    </div>
  );
}
