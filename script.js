/* ===== GAME VARIABLES ===== */
const colors = ["green", "red", "yellow", "blue"];
let gameSequence = [];
let playerSequence = [];
let level = 0;
let score = 0;
let isPlaying = false;

/* ===== DOM ELEMENTS ===== */
const statusText = document.getElementById("status");
const levelText = document.getElementById("level");
const scoreText = document.getElementById("score");
const buttons = document.querySelectorAll(".btn");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const leaderboardList = document.getElementById("leaderboardList");

/* ===== SOUND EFFECTS ===== */
const sounds = {
    green: new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"),
    red: new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg"),
    yellow: new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"),
    blue: new Audio("https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum_hit.ogg"),
    wrong: new Audio("https://actions.google.com/sounds/v1/cartoon/metal_clang.ogg")
};

/* ===== START GAME ===== */
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);

/* ===== BUTTON CLICK ===== */
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        if (!isPlaying) return;
        const color = btn.dataset.color;
        playerSequence.push(color);
        playSound(color);
        animateButton(btn);
        checkInput(playerSequence.length - 1);
    });
});

/* ===== FUNCTIONS ===== */

function startGame() {
    if (isPlaying) return;
    resetGame();
    isPlaying = true;
    statusText.textContent = "Watch the sequence...";
    nextLevel();
}

function nextLevel() {
    playerSequence = [];
    level++;
    score += 10;
    levelText.textContent = level;
    scoreText.textContent = score;

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameSequence.push(randomColor);

    playSequence();
}

function playSequence() {
    let i = 0;
    statusText.textContent = "Watch carefully...";
    const interval = setInterval(() => {
        const color = gameSequence[i];
        const btn = document.querySelector(`.${color}`);
        playSound(color);
        animateButton(btn);
        i++;
        if (i >= gameSequence.length) {
            clearInterval(interval);
            statusText.textContent = "Your turn!";
        }
    }, 700);
}

function checkInput(index) {
    if (playerSequence[index] !== gameSequence[index]) {
        gameOver();
        return;
    }

    if (playerSequence.length === gameSequence.length) {
        setTimeout(nextLevel, 800);
    }
}

function gameOver() {
    playSound("wrong");
    statusText.textContent = "Game Over!";
    document.querySelector(".game-container").classList.add("game-over");
    saveScore();
    isPlaying = false;
    setTimeout(() => {
        document.querySelector(".game-container").classList.remove("game-over");
    }, 500);
}

function resetGame() {
    gameSequence = [];
    playerSequence = [];
    level = 0;
    score = 0;
    levelText.textContent = 0;
    scoreText.textContent = 0;
    statusText.textContent = "Press Start to Play";
}

/* ===== ANIMATION ===== */
function animateButton(btn) {
    btn.classList.add("active");
    setTimeout(() => btn.classList.remove("active"), 300);
}

/* ===== SOUND ===== */
function playSound(color) {
    sounds[color].currentTime = 0;
    sounds[color].play();
}

/* ===== LEADERBOARD ===== */
function saveScore() {
    const name = prompt("Enter your name:");
    if (!name) return;

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    loadLeaderboard();
}

function loadLeaderboard() {
    leaderboardList.innerHTML = "";
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.forEach(player => {
        const li = document.createElement("li");
        li.textContent = `${player.name} - ${player.score}`;
        leaderboardList.appendChild(li);
    });
}

/* Load leaderboard on page load */
loadLeaderboard();
