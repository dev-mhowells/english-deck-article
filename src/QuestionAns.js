export default function QuestionAns(props) {
  const allAnswers = props.answers.map((answer, answerNum) => {
    return (
      <button
        // if the value of selected matches the value of current answer, change bckrd colour
        className={`answer ${
          props.qaObject.selected === props.answers[answerNum] && "selected"
        } ${
          // if the question answer pair has the 'choseCorrectly' property, which is generated on clicking 'check'
          // and has a value of true or false, change colour to green. Essentially checking that answer has been chosen
          // and then changing colour of all correct answers
          props.qaObject.hasOwnProperty("choseCorrectly") &&
          props.qaObject.correct === props.answers[answerNum] &&
          "correct"
        } ${
          // if this answer is selected, and this answer is wrong
          props.qaObject.selected === props.answers[answerNum] &&
          props.qaObject.choseCorrectly === false &&
          "incorrect"
        } ${
          props.qaObject.hasOwnProperty("choseCorrectly") &&
          props.qaObject.correct !== props.answers[answerNum] &&
          "faded"
        }
        `}
        onClick={(e) => props.selectA(e, props.questionSet)}
      >
        {props.answers[answerNum]}
      </button>
    );
  });

  return (
    <div className="qa-container">
      <h2 className="question">{props.question}</h2>
      <div className="answer-box">{allAnswers}</div>
    </div>
  );
}