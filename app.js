let questions = [];
let filteredQuestions = [];
let currentIndex = 0;

const topicSelect = document.getElementById("topicSelect");
const startBtn = document.getElementById("startBtn");
const quizSection = document.getElementById("quizSection");
const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");

// comment A
fetch("data/questions.json")
  .then(response => response.json())
  .then(data => {
    questions = data;
    loadTopics();
  });

function loadTopics() {
  const topics = [...new Set(questions.map(q => q.topic))];
  topics.forEach(topic => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    topicSelect.appendChild(option);
  });
}

startBtn.addEventListener("click", () => {
  const selectedTopic = topicSelect.value;
  filteredQuestions = questions.filter(q => q.topic === selectedTopic);
  currentIndex = 0;
  quizSection.classList.remove("hidden");
  showQuestion();
});

function showQuestion() {
  resetState();
  const q = filteredQuestions[currentIndex];
  questionText.textContent = q.question;

  q.options.forEach((option, index) => {
    const div = document.createElement("div");
    div.textContent = option;
    div.className = "option";
    div.addEventListener("click", () => checkAnswer(index));
    optionsDiv.appendChild(div);
  });
}

function checkAnswer(selectedIndex) {
  const q = filteredQuestions[currentIndex];
  const optionElements = document.querySelectorAll(".option");

  optionElements.forEach((el, index) => {
    if (index === q.answerIndex) {
      el.classList.add("correct");
    }
    if (index === selectedIndex && index !== q.answerIndex) {
      el.classList.add("incorrect");
    }
    el.style.pointerEvents = "none";
  });

  feedback.textContent = q.explanation;
  nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < filteredQuestions.length) {
    showQuestion();
  } else {
    questionText.textContent = "Quiz completed 🎉";
    optionsDiv.innerHTML = "";
    feedback.textContent = "";
    nextBtn.classList.add("hidden");
  }
});

function resetState() {
  optionsDiv.innerHTML = "";
  feedback.textContent = "";
  nextBtn.classList.add("hidden");
}