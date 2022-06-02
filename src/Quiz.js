import React, { useEffect } from "react";
import { db } from "./firebase-config";
import {
  collection,
  connectFirestoreEmulator,
  getDocs,
} from "firebase/firestore";
import QuestionAns from "./QuestionAns";

export default function Quiz() {
  // -------------------------- FIREBASE STUFF ---------------------------

  const [quiz, setQuiz] = React.useState([]);

  // creates reference for particular database in firebase
  const quizCollectionRef = collection(db, "quiz1");

  // useEffect so data loads on page render
  // structure is particular to useEffect when using APIs
  React.useEffect(() => {
    const getData = async () => {
      // getdocs is a firebase function
      const data = await getDocs(quizCollectionRef);
      // data straight from firebase is very cluttered:
      //   console.log(data);
      // notation here is confusing. .data() is firebase function
      // below returns data from firebase database and the unique ID
      setQuiz(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      //   RECENTLY ADDED: RANDOMISES ANSWERS FOR EACH OBJECT
      setQuiz((prevQuiz) =>
        prevQuiz.map((quizObj) => ({
          ...quizObj,
          answers: quizObj.answers.sort((a, b) => 0.5 - Math.random()),
        }))
      );
    };
    getData();
  }, []);
  //-----------------------------------------------------------------------

  // questionSet is generated when QuestionsAns is created, serves as an ID for each QuestionAns component
  // i serves as an ID for each object in quiz array
  // selected is only modified onClick if QuestionAns ID matches the object ID
  // necessary because otherwise onClick will modify select for all objects in quiz array at once
  // if 'choseCorrectly' is a property of any quiz object, it means check answers has been clicked
  // therefore should not be able to select any more answers until quiz is reset
  function selectA(e, questionSet) {
    !quiz[0].hasOwnProperty("choseCorrectly") &&
      setQuiz((prevQuiz) =>
        prevQuiz.map((questionAnswer, i) => {
          if (i === questionSet) {
            return {
              ...questionAnswer,
              selected: e.target.outerText,
            };
          } else {
            return questionAnswer;
          }
        })
      );
  }

  // adds a chose correctly property to each quiz object with value of true or false
  // depending on whether the selected property matches the correct property
  function checkAnswers() {
    setQuiz((prevQuiz) =>
      prevQuiz.map((questionAnswer) => ({
        ...questionAnswer,
        choseCorrectly:
          questionAnswer.correct === questionAnswer.selected ? true : false,
      }))
    );
  }

  // removes selected and choseCorrectly properties of quiz, therefore resetting its display
  function resetQuiz() {
    setQuiz((prevQuiz) =>
      prevQuiz.map(({ selected, choseCorrectly, ...rest }) => {
        return rest;
      })
    );
  }

  const quizDisplay = quiz.map((qa, questionSet) => (
    <QuestionAns
      qaObject={qa}
      question={qa.question}
      answers={qa.answers}
      selectA={selectA}
      questionSet={questionSet}
    />
  ));

  return (
    <div className="app-container">
      <div className="quiz-title-container">
        <h2 className="quiz-title">How much did you understand?</h2>
        {quiz[0] && quiz[0].hasOwnProperty("choseCorrectly") && (
          <button className="again-btn" onClick={resetQuiz}>
            try again
          </button>
        )}
      </div>
      <div className="quiz-container">{quizDisplay}</div>
      <button className="check-btn" onClick={checkAnswers}>
        check
      </button>
    </div>
  );
}
