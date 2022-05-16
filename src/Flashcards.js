import React from "react";
import add from "./icons/add.png";
import minus from "./icons/minus.png";
import flip from "./icons/flip.png";
import leftArrow from "./icons/left-arrow.png";
import rightArrow from "./icons/right-arrow.png";
import dot from "./icons/dot.png";
import emptyDot from "./icons/empty-dot.png";

export default function Flashcards(props) {
  const [count, setCount] = React.useState(0); // current card
  const [cardData, setCardData] = React.useState({}); // depends on flashcards(array of objects) and count(index)
  const [flipped, setFlipped] = React.useState(false);

  React.useEffect(() => {
    props.flashcards.length > 0 && setCardData(props.flashcards[count]);
  }, [count, props.flashcards]);

  // modifies count up
  function cardUp() {
    count < props.flashcards.length - 1 &&
      setCount((prevCount) => prevCount + 1);
  }
  // modifies count down
  function cardDown() {
    count > 0 && setCount((prevCount) => prevCount - 1);
  }

  // flips card
  function flipper() {
    setFlipped((flipped) => !flipped);
  }

  function handleDelete() {
    props.deleteCard(count);
    cardDown();
  }
  // creates correct number of nav dots depending on no. of cards, controls movement of filled dot
  const createDots = props.flashcards.map((card, i) => {
    return <img src={count === i ? dot : emptyDot} key={card.title}></img>;
  });

  // the check for groupnumber is because the saved cards has no groupnumber..
  // if has props.deleteCard it means it is the saved cards deck and needs a diff class
  return (
    <div
      className={`card-container group-${props.groupNumber} ${
        props.deleteCard && "saved-cards-container"
      }`}
    >
      <div className={`card-main ${props.deleteCard && "saved-cards"}`}>
        <div className="top-icons">
          {typeof props.groupNumber === "number" ? (
            <img
              src={add}
              className="add-minus"
              onClick={() => props.save(count, props.groupNumber)}
            ></img>
          ) : (
            <img src={minus} className="add-minus" onClick={handleDelete}></img>
          )}
          <img src={flip} className="flip" onClick={flipper}></img>
        </div>

        {!flipped ? (
          <h2 className="title">{cardData.title}</h2>
        ) : (
          <div className="card-back">
            <h3 className="definition">{cardData.definition}</h3>
            <div className="example">
              <p>Example:</p>
              <p>{cardData.example}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bottom-icons">
        <img src={leftArrow} className="arrow" onClick={cardDown}></img>
        {createDots}
        <img src={rightArrow} className="arrow" onClick={cardUp}></img>
      </div>
    </div>
  );
}
