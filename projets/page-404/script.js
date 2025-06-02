// Fond animé avec particules
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let width, height;

function resize() {
  width = Math.max(document.body.scrollWidth, window.innerWidth);
  height = Math.max(document.body.scrollHeight, window.innerHeight);
  console.log(document.body.scrollHeight, window.innerHeight);
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener("resize", resize);
resize();

const pixelCount = 250;
const pixels = [];

for (let i = 0; i < pixelCount; i++) {
  pixels.push({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 6 + 3,
    speedX: (Math.random() - 0.5) * 1.5,
    speedY: (Math.random() - 0.5) * 1.5,
    alpha: Math.random() * 0.5 + 0.3,
  });
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  for (let p of pixels) {
    ctx.fillStyle = `rgba(243, 178, 224, ${p.alpha})`;
    ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);

    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > width) p.speedX *= -1;
    if (p.y < 0 || p.y > height) p.speedY *= -1;
  }

  requestAnimationFrame(draw);
}
draw();

// Jeu du morpion
const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let currentPlayer = "X";
let grid = Array(9).fill(null);

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // lignes
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // colonnes
  [0, 4, 8],
  [2, 4, 6], // diagonales
];

function checkWinner() {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
      return grid[a];
    }
  }
  if (!grid.includes(null)) return "Egalité";
  return null;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (grid[index] || checkWinner()) return;

  grid[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add("taken");

  const winner = checkWinner();
  if (winner) {
    statusText.textContent =
      winner === "Egalité" ? "Match nul !" : `Joueur ${winner} a gagné !`;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `À ${currentPlayer} de jouer`;
  }
}

function resetGame() {
  grid = Array(9).fill(null);
  currentPlayer = "X";
  statusText.textContent = "Joueur X commence";
  board.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken");
  });
}

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
}

resetBtn.addEventListener("click", resetGame);

createBoard();
