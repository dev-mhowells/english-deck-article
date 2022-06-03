import React from "react";
import check from "./icons/check.png";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  serverTimestamp,
  query,
  deleteDoc,
  doc,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { db, auth } from "./firebase-config";

import leftTriangle from "./icons/left-triangle-small.png";
import rightTriangle from "./icons/right-triangle-small.png";
import downArrow from "./icons/small-down-arrow.png";
import binBtn from "./icons/bin.png";
import editBtn from "./icons/edit.png";

export default function Comments(props) {
  const [userStory, setUserStory] = React.useState("");
  const [checklist, setChecklist] = React.useState([]);
  const [usedWords, setUsedWords] = React.useState([]);
  const [posts, setPosts] = React.useState([]);

  // let now = new Date();
  // let date = now.getFullYear() + "" + now.getMonth() + "" + now.getDate();
  // let time = now.getHours() + "" + now.getMinutes() + "" + now.getSeconds();
  // let dateTime = date + "" + time;
  // console.log(dateTime);

  // React.useEffect(() => {
  //   async function getPosts() {
  //     const postsCol = collection(db, "posts");
  //     const postsSnapshot = await getDocs(postsCol);
  //     console.log("posties", postsSnapshot.docs);
  //     const allPosts = postsSnapshot.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }));

  //     // setPosts(allPosts);
  //   }
  //   getPosts();
  // }, []);

  // -------------------- MANAGE WHICH COMMENT TO DISPLAY --------------------------//
  const [currentComment, setCurrentComment] = React.useState(0);

  function nextComment() {
    currentComment < postsDisplay.length - 1 &&
      setCurrentComment((prevComment) => prevComment + 1);
  }

  function lastComment() {
    currentComment > 0 && setCurrentComment((prevComment) => prevComment - 1);
  }

  console.log("CURRENT", currentComment);

  //------

  const postsCollectionRef = collection(db, "posts");

  const q = query(postsCollectionRef, orderBy("createdAt", "desc"));

  async function createPost() {
    await addDoc(postsCollectionRef, {
      createdAt: serverTimestamp(),
      post: userStory,
      usedWords: usedWords,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
    });
    setUserStory("");
    setUsedWords([]);
    lastComment();
  }

  // subscription / real time snapshot update of data - use onSnapshot instead of getDocs
  // fires on initial render, does not return promise
  // inside useEffect to prevent infinite rendering.. not sure why happens
  // also, why update in real time if in useEffect?

  React.useEffect(() => {
    onSnapshot(q, (snapshot) => {
      const allPosts = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPosts(allPosts);
    });
  }, []);

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
  // BUG - ONE KEYSTROKE DELAY HERE!!!!!!!!!!!!!!!!!!!!!!
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

  async function deletePost(postId) {
    const postDoc = doc(db, "posts", postId);
    await deleteDoc(postDoc);
  }

  // sets text in textarea (takes post.post), deletes post
  // sets used words to the array saved in the post object of words used
  // state updates used words checklist
  function edit(text, postId, postUsedWords) {
    setUserStory(text);
    deletePost(postId);
    setUsedWords(postUsedWords);
  }

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

  const postsDisplay = posts.map((post) => {
    return (
      <div className="posted-story">
        {props.userIn && post.author.id === auth.currentUser.uid && (
          <img
            className="post-icons"
            src={binBtn}
            onClick={() => {
              deletePost(post.id);
            }}
          ></img>
        )}
        {props.userIn && post.author.id === auth.currentUser.uid && (
          <img
            className="post-icons edit-btn"
            src={editBtn}
            onClick={() => edit(post.post, post.id, post.usedWords)}
          ></img>
        )}

        <p className="post-body">{post.post}</p>
        <p className="post-author">
          <b>By: </b>
          {post.author.name}
        </p>
      </div>
    );
  });

  return (
    <div>
      <div className="comment-section-container">
        <div className="comment-section">
          <h2 className="comment-section-title">
            Practice using the words from the article
          </h2>
          <h4 className="comment-section-subtitle">
            Leave a comment or tell your own story!
          </h4>
          <div className="post-box">
            <textarea
              className="textarea"
              value={userStory}
              onChange={readStory}
            ></textarea>
            <button
              className="post-btn"
              onClick={props.userIn ? createPost : props.googleSignIn}
            >
              {props.userIn ? "post" : "log in to post"}
            </button>
          </div>
          <div className="checklist-container">{checklistDisplay}</div>
          <div className="more-stories">
            <img src={downArrow}></img>
            <p>Stories from other learners</p>
          </div>
        </div>
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
    </div>
  );
}
