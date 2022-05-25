import React from "react";
import { db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";
import Flashcards from "./Flashcards";
import Comments from "./Comments";
import Quiz from "./Quiz";

import eye from "./images/eye.png";
import leftTriangle from "./icons/left-triangle.png";
import rightTriangle from "./icons/right-triangle.png";

export default function Article(props) {
  //----------------------------FIREBASE-----------------------------
  const [flashcards, setFlashcards] = React.useState([]); // data from firebase
  const [posts, setPosts] = React.useState([]);

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

  React.useEffect(() => {
    async function getPosts() {
      const postsCol = collection(db, "posts");
      const postsSnapshot = await getDocs(postsCol);
      const allPosts = postsSnapshot.docs.map((doc) => doc.data());

      setPosts(allPosts);
    }
    getPosts();
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

  // ----------- MANAGE WHICH COMMENT TO DISPLAY --------------------------//
  const [currentComment, setCurrentComment] = React.useState(0);

  function nextComment() {
    currentComment < postsDisplay.length - 1 &&
      setCurrentComment((prevComment) => prevComment + 1);
  }

  function lastComment() {
    currentComment > 0 && setCurrentComment((prevComment) => prevComment - 1);
  }
  // ------------------------------ ARTICLE BODY + FLASHCARDS -------------------

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

  // --------------------------------------------------------------------------

  const postsDisplay = posts.map((post) => {
    // let allFlashTitles = [];
    // for (let i in flashcards) {
    //   let flashTitles = flashcards[i].map((flashcard) => flashcard.title);
    //   allFlashTitles = [...allFlashTitles, ...flashTitles];
    // }

    // const words = post.post.split(" ");
    // words.forEach((word) => {
    //   if (allFlashTitles.includes(word)) {
    //     word = "FOUND!!!!";
    //   }
    // });

    return (
      <div className="posted-story">
        <p className="post-body">{post.post}</p>
        <p className="post-author">
          <b>By: </b>
          {post.author.name}
        </p>
      </div>
    );
  });

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
          <Comments flashcards={flashcards} isAuth={props.isAuth} googleSignIn={props.googleSignIn}/>
        )}
      </div>
      <div className="posts-container">
        <h2 className="comments-title">Comments and Stories</h2>
        <div className="comment-slider">
          <img
            src={leftTriangle}
            onClick={lastComment}
            className="triangle"
          ></img>
          {postsDisplay[currentComment]}
          <img
            src={rightTriangle}
            onClick={nextComment}
            className="triangle"
          ></img>
        </div>
      </div>
      <footer>
        <h4>Home</h4>
        <h4>Contact</h4>
        <h4>{!props.isAuth ? "Login" : "Log out"}</h4>
      </footer>
    </div>
  );
}
