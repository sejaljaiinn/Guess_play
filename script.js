let randomNo;
let guesses = 0;
let maxRange = 100;
let hintUsed = false;

// 🔊 Sound effects (preloaded)
const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");

clickSound.preload = "auto";
winSound.preload = "auto";
hintSound.preload = "auto";

// 🏆 High score
let bestScore = localStorage.getItem("bestScore");

// Display high score
const scoreDiv = document.createElement("div");
scoreDiv.className = "attempts";
scoreDiv.id = "highScore";
scoreDiv.textContent = bestScore ? `🏆 Best Score: ${bestScore}` : "🏆 Best Score: --";
document.querySelector("main").appendChild(scoreDiv);

// 🎯 Generate random number
generateNumber();

function generateNumber() {
  randomNo = Math.floor(Math.random() * maxRange) + 1;
}

// 🎚️ Set difficulty
function setLevel() {
  playSound(clickSound);

  const level = document.getElementById("level").value;
  const levelText = document.getElementById("levelText");

  if (level === "easy") {
    maxRange = 50;
    levelText.textContent = "Easy mode 🐣 (1–50)";
  } else if (level === "medium") {
    maxRange = 100;
    levelText.textContent = "Medium mode 🦄 (1–100)";
  } else {
    maxRange = 500;
    levelText.textContent = "Hard mode 🚀 (1–500)";
  }

  resetGame();
}

// 🎲 Check guess
function checkGuess() {
  playSound(clickSound);

  const input = document.getElementById("guessInput");
  const message = document.getElementById("message");
  const attempts = document.getElementById("attempts");

  const guessedNo = Number(input.value);
  if (!guessedNo) return;

  guesses++;

  if (guessedNo > randomNo) {
    message.textContent = "⬇️ Try smaller";
  } else if (guessedNo < randomNo) {
    message.textContent = "⬆️ Try bigger";
  } else {
    message.textContent = `🎉 You won in ${guesses} tries!`;
    playSound(winSound);
    launchConfetti();
    input.disabled = true;

    // Save best score
    if (!bestScore || guesses < bestScore) {
      bestScore = guesses;
      localStorage.setItem("bestScore", bestScore);
      scoreDiv.textContent = `🏆 Best Score: ${bestScore}`;
    }
  }

  attempts.textContent = `Attempts: ${guesses}`;
  input.value = "";
}

// 💡 Show hint
function showHint() {
  if (hintUsed) return;
  hintUsed = true;
  playSound(hintSound);

  const hint = randomNo % 2 === 0 ? "even" : "odd";
  document.getElementById("message").textContent = `💡 Hint: Number is ${hint}`;
}

// 🔄 Reset game
function resetGame() {
  playSound(clickSound);
  guesses = 0;
  hintUsed = false;
  generateNumber();

  const input = document.getElementById("guessInput");
  input.disabled = false;
  input.value = "";

  document.getElementById("message").textContent = "";
  document.getElementById("attempts").textContent = "Attempts: 0";
}

// 🌙 Dark mode toggle
function toggleDarkMode() {
  playSound(clickSound);
  document.body.classList.toggle("dark");
}

// 🎆 Confetti
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confetti = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti() {
  confetti = [];
  for (let i = 0; i < 150; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 5 + 2
    });
  }
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
    ctx.fill();
    c.y += c.d;
  });
  if (confetti.some(c => c.y < canvas.height)) {
    requestAnimationFrame(animateConfetti);
  }
}

// 🔊 Play sound helper
function playSound(sound) {
  sound.currentTime = 0; // rewind to start
  sound.play().catch(err => console.log("Sound blocked:", err));
}