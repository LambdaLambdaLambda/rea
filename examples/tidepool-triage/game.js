const items = [
  {
    name: "Green sea turtle",
    art: "🐢",
    category: "nature",
    explanation: "Sea turtles are part of the ocean's living community."
  },
  {
    name: "Glass bottle",
    art: "🍾",
    category: "litter",
    explanation: "A bottle is made by people and can hurt wildlife if left behind."
  },
  {
    name: "Moon jelly",
    art: "🪼",
    category: "nature",
    explanation: "Jellyfish are living animals that drift through the sea."
  },
  {
    name: "Plastic bag",
    art: "🛍️",
    category: "litter",
    explanation: "A plastic bag is human-made and may look like food to sea animals."
  },
  {
    name: "Spiral shell",
    art: "🐚",
    category: "nature",
    explanation: "A shell is a natural part of life on the seashore."
  },
  {
    name: "Drink can",
    art: "🥫",
    category: "litter",
    explanation: "A can belongs in a bin, not among the tidepool rocks."
  },
  {
    name: "Sea star",
    art: "⭐",
    category: "nature",
    explanation: "Sea stars are animals, even though they do not look like fish."
  },
  {
    name: "Lost fishing line",
    art: "🪢",
    category: "litter",
    explanation: "Fishing line is made by people and can tangle around wildlife."
  },
  {
    name: "Kelp frond",
    art: "🌿",
    category: "nature",
    explanation: "Kelp is a seaweed that grows in the ocean and shelters animals."
  },
  {
    name: "Takeaway cup",
    art: "🥤",
    category: "litter",
    explanation: "A cup is human-made waste; reusing it keeps litter out of the sea."
  }
];

const intro = document.querySelector("#intro");
const game = document.querySelector("#game");
const startButton = document.querySelector("#start-button");
const replayButton = document.querySelector("#replay-button");
const scoreElement = document.querySelector("#score");
const roundLabel = document.querySelector("#round-label");
const progressTrack = document.querySelector(".progress-track");
const progressFill = document.querySelector("#progress-fill");
const itemArt = document.querySelector("#item-art");
const itemName = document.querySelector("#item-name");
const itemPrompt = document.querySelector("#item-prompt");
const choices = [...document.querySelectorAll("[data-choice]")];
const feedback = document.querySelector("#feedback");
const feedbackMark = document.querySelector("#feedback-mark");
const feedbackTitle = document.querySelector("#feedback-title");
const feedbackCopy = document.querySelector("#feedback-copy");
const nextButton = document.querySelector("#next-button");
const finish = document.querySelector("#finish");
const finishTitle = document.querySelector("#finish-title");
const finishCopy = document.querySelector("#finish-copy");

let deck = [];
let currentIndex = 0;
let score = 0;
let answered = false;

function shuffled(itemsToShuffle) {
  const result = [...itemsToShuffle];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function startGame() {
  deck = shuffled(items);
  currentIndex = 0;
  score = 0;
  answered = false;
  intro.hidden = true;
  game.hidden = false;
  finish.hidden = true;
  document.querySelector(".item-card").hidden = false;
  document.querySelector(".choice-label").hidden = false;
  document.querySelector("#choices").hidden = false;
  feedback.hidden = true;
  scoreElement.textContent = "0";
  showItem();
  choices[0].focus();
}

function showItem() {
  const item = deck[currentIndex];
  itemArt.textContent = item.art;
  itemName.textContent = item.name;
  itemPrompt.textContent = "Is it part of nature, or human-made litter?";
  roundLabel.textContent = `ITEM ${currentIndex + 1} OF ${deck.length}`;
  progressTrack.setAttribute("aria-valuenow", String(currentIndex));
  progressFill.style.width = `${(currentIndex / deck.length) * 100}%`;
  feedback.hidden = true;
  answered = false;
  choices.forEach((button) => {
    button.disabled = false;
  });
}

function submitChoice(choice) {
  if (answered || game.hidden || finish.hidden === false) {
    return;
  }

  answered = true;
  const item = deck[currentIndex];
  const correct = choice === item.category;
  const categoryName = item.category === "nature" ? "Nature" : "Litter";

  if (correct) {
    score += 1;
    scoreElement.textContent = String(score);
  }

  choices.forEach((button) => {
    button.disabled = true;
  });

  feedback.classList.toggle("feedback--incorrect", !correct);
  feedbackMark.textContent = correct ? "✓" : "↻";
  feedbackTitle.textContent = correct ? "Good spotting!" : `This one belongs in ${categoryName}.`;
  feedbackCopy.textContent = item.explanation;
  nextButton.innerHTML = currentIndex === deck.length - 1
    ? 'See your result <span aria-hidden="true">→</span>'
    : 'Next find <span aria-hidden="true">→</span>';
  feedback.hidden = false;
  nextButton.focus();
}

function showFinish() {
  document.querySelector(".item-card").hidden = true;
  document.querySelector(".choice-label").hidden = true;
  document.querySelector("#choices").hidden = true;
  feedback.hidden = true;
  finish.hidden = false;
  progressTrack.setAttribute("aria-valuenow", String(deck.length));
  progressFill.style.width = "100%";
  roundLabel.textContent = "SORT COMPLETE";
  finishTitle.textContent = score === deck.length
    ? "The tidepool is looking brighter."
    : "Every careful choice makes a difference.";
  finishCopy.textContent = `You sorted ${score} out of ${deck.length} finds correctly. Thanks for taking a closer look at what belongs in the ocean.`;
  replayButton.focus();
}

startButton.addEventListener("click", startGame);
replayButton.addEventListener("click", startGame);

choices.forEach((button) => {
  button.addEventListener("click", () => submitChoice(button.dataset.choice));
});

nextButton.addEventListener("click", () => {
  currentIndex += 1;
  if (currentIndex === deck.length) {
    showFinish();
    return;
  }

  showItem();
  choices[0].focus();
});

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) {
    return;
  }

  if (event.key === "1") {
    submitChoice("nature");
  } else if (event.key === "2") {
    submitChoice("litter");
  }
});
