import React from "react";
import { db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";
import Flashcards from "./Flashcards";
import Comments from "./Comments";
import Quiz from "./Quiz";

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

  // maps over number of flashcard groups (firebase collections)
  // passes in group and identifier of group as groupNumber so card can be id'd and saved
  const flashymap = flashcards.map((group, i) => (
    <Flashcards
      savedCards={savedCards}
      save={save}
      flashcards={group}
      groupNumber={i}
    />
  ));

  // // -------------------------- USER STORY -------------------------

  // const [userStory, setUserStory] = React.useState("");
  // const [checklist, setChecklist] = React.useState([]);
  // const [usedWords, setUsedWords] = React.useState([]);

  // // set state for checklist inside useEffect because it was creating an infinite loop
  // // can't work out why right now, but this fixes it...
  // // also needs to run more than once or else list does not load on initial page-load
  // // I think because flashcards would be an empty array at that time
  // // therefore runs again on flashcard state change
  // React.useEffect(() => {
  //   let allFlashyTitles = [];
  //   // loops over array of flashcards, creates new array for each flashcard, takes title
  //   for (let i in flashcards) {
  //     let flashTitles = flashcards[i].map((flashcard) => flashcard.title);
  //     allFlashyTitles = [...allFlashyTitles, ...flashTitles];
  //     setChecklist(allFlashyTitles);
  //   }
  // }, [flashcards]);

  // // reads input on keystroke, checks if checklist word is written, if so adds to usedWords
  // // also checks usedWords, if item in usedWords is no longer in input, removes
  // // from usedWords
  // function readStory(e) {
  //   setUserStory(e.target.value);

  //   for (let i in checklist) {
  //     if (
  //       userStory.includes(checklist[i]) &&
  //       !usedWords.includes(checklist[i])
  //     ) {
  //       setUsedWords((prevUsedWords) => [...prevUsedWords, checklist[i]]);
  //     } else if (
  //       !userStory.includes(checklist[i]) &&
  //       usedWords.includes(checklist[i])
  //     ) {
  //       setUsedWords((prevUsedWords) =>
  //         prevUsedWords.filter((word) => word !== checklist[i])
  //       );
  //     }
  //   }
  // }
  // console.log(usedWords);

  // const checklistDisplay = checklist.map((title) => (
  //   <p
  //     className={`checklist-items ${usedWords.includes(title) && "used-word"}`}
  //   >
  //     {title}
  //   </p>
  // ));

  // console.log(userStory);

  return (
    <div className="article-container">
      {flashymap}
      <p className="article-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Natoque
        vulputate augue suspendisse iaculis eleifend. Hac a, cras semper laoreet
        nec id. Pretium integer consectetur volutpat nulla adipiscing dui.
        Scelerisque vel diam in vel sapien dictum sapien ac sed.
      </p>
      <p className="article-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Natoque
        vulputate augue suspendisse iaculis eleifend. Hac a, cras semper laoreet
        nec id. Pretium integer consectetur volutpat nulla adipiscing dui.
        Scelerisque vel diam in vel sapien dictum sapien ac sed.
      </p>
      {savedCards[0] && (
        <Flashcards
          savedCards={savedCards}
          save={save}
          flashcards={savedCards}
          deleteCard={deleteCard}
        />
      )}
      {/* <div className="comment-section">
        <textarea className="textarea" onChange={readStory}></textarea>
        <div className="checklist-container">{checklistDisplay}</div>
      </div> */}
      <Quiz />
      <Comments flashcards={flashcards} />
    </div>
  );
}
