// Global Variables
let currentQuestionIndex = 0;
let score = 0;
let timer = 10;
let quizInterval;
let quizData = [];  // This will hold data fetched from the API

// Fetch quiz data from the API
async function fetchQuizData() {
  try {
    const response = await fetch('https://api.jsonserve.com/Uw5CrX');
    const data = await response.json();
    quizData = data;  // Assuming the API returns an array of questions
    loadQuestion();   // Load the first question once the data is fetched
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    alert("Failed to load quiz data. Please try again later.");
  }
}

// Load the first question when the page is ready
document.addEventListener("DOMContentLoaded", () => {
  fetchQuizData(); // Start the quiz by fetching data from the API
});

// Start the quiz and load the first question
function loadQuestion() {
  if (quizData.length === 0) {
    alert("No quiz data available.");
    return;
  }

  // First, change the "Question will appear here" text
  document.getElementById('question-text').textContent = quizData[currentQuestionIndex].question;

  // Load the answer options dynamically
  const options = document.querySelectorAll('.answer-btn');
  options.forEach((btn, index) => {
    btn.textContent = quizData[currentQuestionIndex].options[index];
    btn.onclick = () => chooseAnswer(index);
  });

  // Start the timer for each question
  timer = 10;
  document.getElementById('time-left').textContent = timer;
  quizInterval = setInterval(countdownTimer, 1000);
}

// Timer countdown for each question
function countdownTimer() {
  if (timer > 0) {
    timer--;
    document.getElementById('time-left').textContent = timer;
  } else {
    clearInterval(quizInterval);
    // Move to the next question or submit the quiz
    submitQuiz();
  }
}

// Handle user's answer choice
function chooseAnswer(selectedIndex) {
  const correctAnswer = quizData[currentQuestionIndex].answer;
  if (selectedIndex === correctAnswer) {
    score++;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    submitQuiz();
  }
}

// Submit quiz and redirect to results page
function submitQuiz() {
  clearInterval(quizInterval);
  window.location.href = "result.html?score=" + score;  // Redirect to result page with score
}

// Function to get score from the URL
function getScoreFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('score') || 0;  // Default to 0 if no score is found
}

// Display the score on the result page
document.getElementById('final-score').textContent = getScoreFromURL();

// Play again and redirect to the launch page
function playAgain() {
  window.location.href = "index.html";  // Redirect to the launch page to start a new game
}
