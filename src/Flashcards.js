import React from "react";
import add from "./icons/add.png";
import addFilled from "./icons/add-filled.png";
import minusSmall from "./icons/minus-small.png";
import flipSmall from "./icons/flip-small.png";
import leftArrow from "./icons/left-arrow.png";
import rightArrow from "./icons/right-arrow.png";
import dot from "./icons/dot.png";
import emptyDot from "./icons/empty-dot.png";

export default function Flashcards(props) {
  const [count, setCount] = React.useState(0); // current card number
  const [cardData, setCardData] = React.useState({}); // current card display
  const [flipped, setFlipped] = React.useState(false); // display front or back of card

  // depends on flashcards(array of objects) and count(index)
  React.useEffect(() => {
    props.flashcards.length > 0 && setCardData(props.flashcards[count]);
  }, [count, props.flashcards]);

  function test() {
    if (props.savedCards) {
      for (let savedCard of props.savedCards) {
        if (cardData.title === savedCard.title) {
          return addFilled;
        }
      }
    }
    return add;
  }

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

  // deletes card
  function handleDelete() {
    props.deleteCard(count);
    cardDown();
  }
  // creates correct number of nav dots depending on no. of cards, controls movement of filled dot
  const createDots = props.flashcards.map((card, i) => {
    return (
      <img
        className="dot"
        src={count === i ? dot : emptyDot}
        key={card.title}
      ></img>
    );
  });

  return (
    <div
      className={`card-container  ${
        props.deleteCard && "saved-cards-container"
      }`}
    >
      <div className={`card-main ${props.deleteCard && "saved-cards"}`}>
        <div className="top-icons">
          {typeof props.groupNumber === "number" ? (
            <img
              src={test()}
              className="add-minus"
              onClick={() => {
                props.save(count, props.groupNumber);
                test();
              }}
            ></img>
          ) : (
            <img
              src={minusSmall}
              className="minus"
              onClick={handleDelete}
            ></img>
          )}
          <img src={flipSmall} className="flip" onClick={flipper}></img>
        </div>

        {!flipped ? (
          <h2 className="title">{cardData.title}</h2>
        ) : (
          <div className="card-back">
            <p className="definition">
              <b>{cardData.definition}</b>
            </p>
            <div className="example">
              <p>Example:</p>
              <p>
                <i>{cardData.example}</i>
              </p>
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
