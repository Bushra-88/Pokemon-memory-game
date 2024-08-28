const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resumeButton = document.getElementById("resume");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".control-container");
const gameInstructions = document.querySelector(".game-instructions");
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let minutesValue;
let secondsValue;
//Items Array
const items = [
  { name: "darkness", image: "./images/darkness.jpg" },
  { name: "double", image: "./images/double.jpg" },
  { name: "fairy", image: "./images/fairy.jpg" },
  { name: "fighting", image: "./images/fighting.jpg" },
  { name: "fire", image: "./images/fire.jpg" },
  { name: "grass", image: "./images/grass.jpg" },
  { name: "lightning", image: "./images/lightning.jpg" },
  { name: "metal", image: "./images/metal.jpg" },
  { name: "psychic", image: "./images/psychic.jpg" },
  { name: "water", image: "./images/water.jpg" },
];

//Initial Time
let seconds = 0;
let minutes = 0;

//Initial moves and win count
let movesCount = 0;
let winCount = 0;

//For Timer
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }

  //Format time before displaying
  if (seconds < 10) {
    secondsValue = `0${seconds}`;
  } else {
    secondsValue = seconds;
  }
  if (minutes < 10) {
    minutesValue = `0${minutes}`;
  } else {
    minutesValue = minutes;
  }
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
  console.log(timeValue.innerHTML);
};

//For calculate moves
const movesCounter = () => {
  console.log("Moves counter called");
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Pick random objects from the items array
const generateRandom = (size = 4) => {
  //temporary Array
  let tempArray = [...items];
  //Initializes card values array
  let cardValues = [];
  //Size should be double(4*4)/2 since paris of objects would exist
  size = (size * size) / 2;

  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simply shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
     <div class="card-before">?</div>
     <div class="card-after">
     <img src="${cardValues[i].image}"class="image"/></div>
     `;
  }

  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //Flip the card
        card.classList.add("flipped");
        //If it's the firstCard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will be firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue === secondCardValue) {
            //if both cards match add matched class so these cards would be ignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //Check if winCount == half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won!</h2>
              <h4>Moves:${movesCount}</h4>`;
              stopGame();
              startButton.classList.remove("hide");
            }
          } else {
            //if cards don't match then flip them back
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//// Start the game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //Restart game controls and movements
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  resumeButton.classList.add("hide");
  gameInstructions.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //Initial moves
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
  initializer();
});

//Stop Game
stopButton.addEventListener("click", () => {
  // Determine if the game is won or not
  if (winCount === Math.floor(cards.length / 2)) {
    // When the game has been won, keep instructions hidden
    gameInstructions.classList.add("hide");
    resumeButton.classList.add("hide");
  } else {
    // When the game has not been won, show instructions
    gameInstructions.classList.remove("hide");
    resumeButton.classList.remove("hide");
  }
  // Set the game state to stop
  controls.classList.remove("hide"); // Show control container
  stopButton.classList.add("hide"); // Hide stop button
  startButton.classList.remove("hide"); // Show start button
  clearInterval(interval); // Stop the timer
});

//Resume Game
resumeButton.addEventListener("click", () => {
  controls.classList.add("hide"); // Hide control container
  stopButton.classList.remove("hide"); // Show stop button
  resumeButton.classList.add("hide"); // Hide resume button
  gameInstructions.classList.add("hide"); // Hide instructions
  //Resume timer
  interval = setInterval(timeGenerator, 1000);
});
// Initialize values and function calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};
