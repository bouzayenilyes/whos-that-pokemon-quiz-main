// 1) Get DOM elements
const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointsValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.getElementsByClassName("container");
const loadingContainer = document.getElementById("loadingContainer");

// 8.1) Initialize variables
let usedPokemonIds = []; // Array used to store the list of already used/displayed pokemon
let showLoading = false; // 16.1) Boolean used to determined HTML elements shown.
let count = 0; // 15.3) Count of total answers clicked / answers given.
let points = 0; // 15.8)

// 2) Function to fetch one pokemon with and ID
async function fetchPokemonById(id) {
  // 16.3) Show loading while fetching data.
  showLoading = true;
  // 2.1)
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return data;
}

// 3) TEST function to see result of step 2
// async function testFetch() {
//   const pokemon = await fetchPokemonById(getRandomPokemonId());
//   console.log(pokemon);
// }

// 4) Call TEST function
// testFetch();

// 6) Function to load question with options
async function loadQuestionWithOptions() {
  // 16.4) Show loading / show puzzle based on showLoading boolean.
  if (showLoading) {
    showLoadingWindow();
    hidePuzzleWindow();
  }

  // 7) Fetch correct answer first
  let pokemonId = getRandomPokemonId();

  // 8.2) Check if the current question has allready been used/displayed earlier
  while (usedPokemonIds.includes(pokemonId)) {
    pokemonId = getRandomPokemonId();
  }

  // 8.3) If a pokemon has not been displayed yet, it is added to usedPokemonIds, and it is set as the new const pokemon
  usedPokemonIds.push(pokemonId);
  const pokemon = await fetchPokemonById(pokemonId);

  // 9.2) Create/reset the options array with the correct answer (pokemon.name)
  const options = [pokemon.name];
  const optionsIds = [pokemon.id];

  // 10) Fetch additional random Pokemon names to use as options
  while (options.length < 4) {
    let randomPokemonId = getRandomPokemonId();
    // 10.1) Ensure fetched option does not exist in the options list. Creates a new random id until it does not exist in optionsId.
    while (optionsIds.includes(randomPokemonId)) {
      randomPokemonId = getRandomPokemonId();
    }
    optionsIds.push(randomPokemonId);

    // 10.2) Fetching a random pokemon with the newly made ID, and adding it to the options array.
    const randomPokemon = await fetchPokemonById(randomPokemonId);
    const randomOption = randomPokemon.name;
    options.push(randomOption);

    // 10.3) TEST show how arrays look.
    // console.log(options);
    // console.log(optionsIds);

    // 16.5) Turn of loading if all optiosn have been fetched.
    if (options.length === 4) {
      showLoading = false;
    }
  }

  // 12.2) Shuffle the 4 options array to always change the place of the right answer.
  shuffleArray(options);

  // 13) Clear any previous result and update pokemon image to fetched image URL from the "sprites"
  resultElement.textContent = "Who's that Pokemon?";
  pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;

  // 14) Create options HTML elements from options array in the DOM
  optionsContainer.innerHTML = ""; // Reset
  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = (event) => checkAnswer(option === pokemon.name, event); // 15.10) CheckAnswer: if option === pokemon.name => true, else false. plus event which is button click.
    optionsContainer.appendChild(button);
  });
  // 16.2) Hide / Unhide HTML elements based on async status
  if (!showLoading) {
    hideLoadingWindow();
    showPuzzleWindow();
  }
}

// 11) Initial load
loadQuestionWithOptions();

// 15) Create check answer function
function checkAnswer(isCorrect, event) {
  // 15.1) Check if any button is already selected, if falsy => no element => "null".
  const selectedButton = document.querySelector(".selected");

  // 15.2) If already a button is selected, do nothing, exit function
  if (selectedButton) {
    return;
  }

  // 15.4) Else, mark the clicked button as selected and increase the count of quetion by 1
  event.target.classList.add("selected");
  count++;
  totalCount.textContent = count;

  // 15.6) Choose text for right / wrong answer.
  if (isCorrect) {
    // 15.7) Call displayResult function.
    displayResult("Correct answer!", "correct");
    // 15.8) If correct increase the points by 1
    points++;
    pointsElement.textContent = points;
    event.target.classList.add("correct");
  } else {
    displayResult("Wrong answer...", "wrong");
    event.target.classList.add("wrong");
  }

  // 15.9) Load next question with 1 sec delay for user to read the result
  setTimeout(() => {
    showLoading = true;
    loadQuestionWithOptions();
  }, 1000);
}

// --- UTILITY FUNCTIONS ---

// 5) Function to randomize the pokemon ID
function getRandomPokemonId() {
  return Math.floor(Math.random() * 151) + 1;
}

// 12.1) Create the shuffleArray function
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5); // The sort method expects the callback function to return a value less than 0, equal to 0, or greater than 0. Based on this returned value, it determines the sorting order. If you used Math.random() directly without subtracting 0.5, the callback function would generate values between 0 and 1. Since the sort method expects a comparison result that can be negative, zero, or positive, the absence of the 0.5 would lead to a biased sorting behavior. By subtracting 0.5, you ensure that the values generated by Math.random() are equally likely to be negative or positive.
}

// 15.5) Function to update result text and class name
function displayResult(result) {
  resultElement.textContent = result;
}

// 17) Hide loading window
function hideLoadingWindow() {
  loadingContainer.classList.add("hide");
}

// 18) Show loading window
function showLoadingWindow() {
  mainContainer[0].classList.remove("show");
  loadingContainer.classList.remove("hide");
  loadingContainer.classList.add("show");
}

// 19) Show puzzle window
function showPuzzleWindow() {
  loadingContainer.classList.remove("show");
  mainContainer[0].classList.remove("hide");
  mainContainer[0].classList.add("show");
}

// 20) Hide puzzle window
function hidePuzzleWindow() {
  mainContainer[0].classList.add("hide");
}
