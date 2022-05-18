import React from "react";
import check from "./icons/check.png";

export default function Comments(props) {
  const [userStory, setUserStory] = React.useState("");
  const [checklist, setChecklist] = React.useState([]);
  const [usedWords, setUsedWords] = React.useState([]);

  // set state for checklist inside useEffect because it was creating an infinite loop
  // can't work out why right now, but this fixes it...
  // also needs to run more than once or else list does not load on initial page-load
  // I think because flashcards would be an empty array at that time
  // therefore runs again on flashcard state change
  React.useEffect(() => {
    let allFlashyTitles = [];
    // loops over array of flashcards, creates new array for each flashcard, takes title
    for (let i in props.flashcards) {
      let flashTitles = props.flashcards[i].map((flashcard) => flashcard.title);
      allFlashyTitles = [...allFlashyTitles, ...flashTitles];
      setChecklist(allFlashyTitles);
    }
  }, [props.flashcards]);

  // reads input on keystroke, checks if checklist word is written, if so adds to usedWords
  // also checks usedWords, if item in usedWords is no longer in input, removes
  // from usedWords
  function readStory(e) {
    setUserStory(e.target.value);

    for (let i in checklist) {
      if (
        userStory.includes(checklist[i]) &&
        !usedWords.includes(checklist[i])
      ) {
        setUsedWords((prevUsedWords) => [...prevUsedWords, checklist[i]]);
      } else if (
        !userStory.includes(checklist[i]) &&
        usedWords.includes(checklist[i])
      ) {
        setUsedWords((prevUsedWords) =>
          prevUsedWords.filter((word) => word !== checklist[i])
        );
      }
    }
  }
  console.log(usedWords);

  const checklistDisplay = checklist.map((title) => (
    <div className="check-word-pair">
      {usedWords.includes(title) && <img src={check} className="check"></img>}
      <p
        className={`checklist-items ${
          usedWords.includes(title) && "used-word"
        }`}
      >
        {title}
      </p>
    </div>
  ));

  console.log(userStory);

  return (
    <div className="comment-section">
      <textarea className="textarea" onChange={readStory}></textarea>
      <div className="checklist-container">{checklistDisplay}</div>
    </div>
  );
}
