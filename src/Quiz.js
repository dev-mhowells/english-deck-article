import React from "react";
import { db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";
import QuestionAns from "./QuestionAns";
import { v4 as uuidv4 } from "uuid";

export default function Quiz() {
  // -------------------------- FIREBASE STUFF ---------------------------

  const [quiz, setQuiz] = React.useState([]);

  const quizCollectionRef = collection(db, "quiz1");

  React.useEffect(() => {
    const getData = async () => {
      const data = await getDocs(quizCollectionRef);
      // data() is firebase function. Return data and the unique ID
      setQuiz(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      // randomize answer order
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

  // questionSet is the index of quiz.map, and serves as an ID for each QuestionAns component
  // i serves as an ID for each object in quiz array
  // selected is only modified onClick if QuestionAns component ID matches the object ID
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
      key={uuidv4()}
    />
  ));

  return (
    <div className="app-container">
      <div className="quiz-title-container">
        <h4 className="quiz-title">How much did you understand?</h4>
        {quiz[0] && quiz[0].hasOwnProperty("choseCorrectly") && (
          <button className="again-btn" onClick={resetQuiz}>
            reset
          </button>
        )}
      </div>
      <div className="quiz-container">{quizDisplay}</div>
      <button
        className={`check-btn ${
          quiz[0] && quiz[0].hasOwnProperty("choseCorrectly") && "disabled"
        }`}
        onClick={checkAnswers}
      >
        check
      </button>
    </div>
  );
}
