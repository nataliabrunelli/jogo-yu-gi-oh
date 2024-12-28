const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score-points"),
  },
  cardsSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const playerSide = {
  player: "player-cards",
  computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);

  return cardData[randomIndex].id;
}

async function drawSelectedCard(cardId) {
  state.cardsSprites.avatar.src = cardData[cardId].img;
  state.cardsSprites.name.innerText = cardData[cardId].name;
  state.cardsSprites.type.innerText = cardData[cardId].type;
}

async function removeAllCardImage() {
  let cards = document.querySelector("#computer-cards");
  let imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  cards = document.querySelector("#player-cards");
  imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}

async function checkDuelResults(cardId, computerCardId) {
  let duelResults = "Empate";
  let playerCard = cardData[cardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = "Ganhou";
    await playAudio("win");
    state.score.playerScore++;
  } else if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = "Perdeu";
    await playAudio("lose");
    state.score.computerScore++;
  }

  return duelResults;
}

async function drawButton(duelResults) {
  state.actions.button.innerText = duelResults;
  state.actions.button.style.opacity = "1";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} Lose: ${state.score.computerScore}`;
}

async function setCardsField(cardId) {
  await removeAllCardImage();

  let computerCardId = await getRandomCardId();

  state.fieldCards.player.display = "block";
  state.fieldCards.computer.display = "block";

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await drawButton(duelResults);
  await updateScore();
}

async function createCardImage(cardId, fieldSide) {
  const cardImage = document.createElement("img");

  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", cardId);

  cardImage.classList.add("card");

  if (fieldSide === playerSide.player) {
    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });

    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(cardId);
    });
  }

  return cardImage;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const cardId = await getRandomCardId();
    const cardImage = await createCardImage(cardId, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardsSprites.avatar.src = "";
  state.actions.button.style.opacity = "0";

  state.fieldCards.player.src = " ";
  state.fieldCards.computer.src = " ";

  state.cardsSprites.name.innerText = " "
  state.cardsSprites.type.innerText = " "

  init();
}

function init() {
  drawCards(5, playerSide.player);
  drawCards(5, playerSide.computer);

  const bgMusic = document.getElementById("bg-music");
  bgMusic.volume = 0.6;
  bgMusic.play();
  
}

init();
