const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const messageBox = document.getElementById("messageBox");

let keys = {};
let gameWon = false;

const player = {
  x: 40,
  y: 330,
  width: 35,
  height: 45,
  speed: 5,
  velocityY: 0,
  jumping: false
};

const gravity = 0.7;

const platforms = [
  { x: 0, y: 400, width: 900, height: 50 },
  { x: 160, y: 330, width: 120, height: 20 },
  { x: 340, y: 270, width: 120, height: 20 },
  { x: 530, y: 330, width: 120, height: 20 },
  { x: 710, y: 260, width: 130, height: 20 }
];

const hearts = [
  { x: 190, y: 290, collected: false, text: "Our first connection 💬" },
  { x: 375, y: 230, collected: false, text: "Our first date memory 🥹" },
  { x: 565, y: 290, collected: false, text: "Every visit was worth it 💕" },
  { x: 755, y: 220, collected: false, text: "One step closer to forever 💍" }
];

const obstacles = [
  { x: 300, y: 365, width: 45, height: 35, label: "Distance" },
  { x: 470, y: 365, width: 45, height: 35, label: "Waiting" },
  { x: 670, y: 365, width: 45, height: 35, label: "Stress" }
];

const goal = {
  x: 835,
  y: 330,
  width: 45,
  height: 70
};

document.addEventListener("keydown", e => {
  keys[e.key] = true;

  if ((e.key === " " || e.key === "ArrowUp") && !player.jumping) {
    player.velocityY = -14;
    player.jumping = true;
  }
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

function drawPlayer() {
  ctx.fillStyle = "#ff4f9a";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = "white";
  ctx.fillRect(player.x + 8, player.y + 10, 6, 6);
  ctx.fillRect(player.x + 22, player.y + 10, 6, 6);

  ctx.fillStyle = "#ffb6d9";
  ctx.fillRect(player.x + 8, player.y + 30, 20, 8);
}

function drawPlatforms() {
  ctx.fillStyle = "#4caf50";
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });
}

function drawHearts() {
  hearts.forEach(h => {
    if (!h.collected) {
      ctx.fillStyle = "#ff0055";
      ctx.beginPath();
      ctx.arc(h.x, h.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText("❤", h.x - 8, h.y + 6);
    }
  });
}

function drawObstacles() {
  obstacles.forEach(o => {
    ctx.fillStyle = "#333";
    ctx.fillRect(o.x, o.y, o.width, o.height);

    ctx.fillStyle = "white";
    ctx.font = "10px Courier New";
    ctx.fillText(o.label, o.x - 5, o.y - 5);
  });
}

function drawGoal() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

  ctx.fillStyle = "#ff4f9a";
  ctx.font = "16px Courier New";
  ctx.fillText("ME", goal.x + 10, goal.y + 40);
}

function updatePlayer() {
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;

  player.velocityY += gravity;
  player.y += player.velocityY;

  player.jumping = true;

  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height < p.y + 20 &&
      player.y + player.height + player.velocityY >= p.y
    ) {
      player.y = p.y - player.height;
      player.velocityY = 0;
      player.jumping = false;
    }
  });

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

  if (player.y > canvas.height) resetPlayer();
}

function checkHearts() {
  hearts.forEach(h => {
    if (
      !h.collected &&
      player.x < h.x + 20 &&
      player.x + player.width > h.x - 20 &&
      player.y < h.y + 20 &&
      player.y + player.height > h.y - 20
    ) {
      h.collected = true;
      messageBox.innerText = h.text;
    }
  });
}

function checkObstacles() {
  obstacles.forEach(o => {
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      messageBox.innerText = "Distance tried to stop us, but love wins 💪";
      resetPlayer();
    }
  });
}

function checkGoal() {
  if (
    player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y < goal.y + goal.height &&
    player.y + player.height > goal.y
  ) {
    gameWon = true;
    messageBox.innerText = "You made it through everything. I love you. 💖";
  }
}

function resetPlayer() {
  player.x = 40;
  player.y = 330;
  player.velocityY = 0;
}

function drawWinScreen() {
  ctx.fillStyle = "rgba(255, 105, 180, 0.9)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "36px Courier New";
  ctx.fillText("YOU MADE IT 💖", 290, 180);

  ctx.font = "24px Courier New";
  ctx.fillText("You made it through everything.", 235, 230);
  ctx.fillText("I love you.", 385, 270);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameWon) {
    drawWinScreen();
    return;
  }

  drawPlatforms();
  drawHearts();
  drawObstacles();
  drawGoal();
  drawPlayer();

  updatePlayer();
  checkHearts();
  checkObstacles();
  checkGoal();

  requestAnimationFrame(gameLoop);
}

messageBox.innerText = "Use arrow keys or A/D to move. Space or Up to jump.";
gameLoop();
