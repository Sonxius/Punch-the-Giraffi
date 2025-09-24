let totalPoints = 0;
let punches = 0;
let playerTotalApples = 0;
let comboTimer;
let comboClicks = 0;
let punchTimes = [];
let fastPunchTimer = null;
let isDead = false;
let ownedGloveIds = new Set([1]);
let comboBlackValue = 0;
let comboRedValue = 0;
let comboDecayInterval = null;
let redBarInterval = null;
let redBarDecayInterval = null;
let redBarDecayTimeout = null;
let clickStopTimeout = null;
let beeCatches = 0;
let giraffiKills = 0;
let wamboScale = 1;
let feedActive = false;
let feedTimeLeft = 0;
let feedInterval;
let applesFeeding = 0;

const maxWamboScale = 4;
const wamboGrowStep = 0.02;

const comboBarBlack = document.getElementById("comboBarBlack");
const comboBarRed = document.getElementById("comboBarRed");

const headlineImg = document.getElementById("headlineImg");
const comboDelay = 1500;
const cpsThreshold = 10;
const requiredFastPunchDuration = 4000;
const cpsElement = document.getElementById("cps");

const clickCount = document.getElementById("clickCount");
const punchCount = document.getElementById("punchCount");
const appleCount = document.getElementById("appleCount");
const resetButton = document.getElementById("resetButton");
const img = document.getElementById("squishy");
const player = document.getElementById("player");
const comboMessage = document.getElementById("comboMessage");
const comboPopup = document.getElementById("comboMultiplierPopup");
const catchsound = document.getElementById("BeeCatch");
const allBees = [];

const gloves = [
  {
    id: 1,
    name: "Fist",
    cost: 0,
    punchesPerClick: 1,
    img: "Textures/player2.png",
  },
  {
    id: 2,
    name: "Sock",
    cost: 10000,
    punchesPerClick: 3,
    img: "Textures/sock_glove.png",
  },
  {
    id: 3,
    name: "Sticky Glove",
    cost: 35000,
    punchesPerClick: 7,
    img: "Textures/sticky_glove.png",
  },
  {
    id: 4,
    name: "Hirachy Glove",
    cost: 80000,
    punchesPerClick: 15,
    img: "Textures/red_thumb3.png",
  },
  {
    id: 5,
    name: "Boxing Glove",
    cost: 200000,
    punchesPerClick: 25,
    img: "Textures/glove1.png",
  },
  {
    id: 6,
    name: "Sponge Glove",
    cost: 450000,
    punchesPerClick: 40,
    img: "Textures/sponge_glove.png",
  },
  {
    id: 7,
    name: "Wood Glove",
    cost: 600000,
    punchesPerClick: 60,
    img: "Textures/wood_glove.png",
  },
  {
    id: 8,
    name: "Melone Glove",
    cost: 1200000,
    punchesPerClick: 80,
    img: "Textures/water_glove.png",
  },
  {
    id: 9,
    name: "Fries Glove",
    cost: 7000000,
    punchesPerClick: 100,
    img: "Textures/fries_glove.png",
  },
  {
    id: 10,
    name: "Wambo Glove",
    cost: 15000000,
    punchesPerClick: 120,
    img: "Textures/wambo_glove.png",
  },
  {
    id: 11,
    name: "Skeleton Glove",
    cost: 25000000,
    punchesPerClick: 200,
    img: "Textures/glow_glove.png",
    darkImg: "glow_glove2.png",
  },
  {
    id: 12,
    name: "Crystal Glove",
    cost: 50000000,
    punchesPerClick: 250,
    img: "Textures/crystal_glove.png",
  },
  {
    id: 13,
    name: "Lava Glove",
    cost: 120000000,
    punchesPerClick: 300,
    img: "Textures/lava_glove.png",
  },
  {
    id: 14,
    name: "Pickglove",
    cost: 300000000,
    punchesPerClick: 400,
    img: "Textures/pickglove.png",
  },
  {
    id: 15,
    name: "Duo Fists",
    cost: 700000000,
    punchesPerClick: 500,
    img: "Textures/fist2.png",
  },
  {
    id: 16,
    name: "Gaming Glove",
    cost: 1500000000,
    punchesPerClick: 600,
    img: "Textures/gaming_glove.png",
  },
  {
    id: 17,
    name: "Infinity Glove",
    cost: 5000000000,
    punchesPerClick: 700,
    img: "Textures/infinity_glove.png",
  },
  {
    id: 18,
    name: "The Cursor",
    cost: 999000000000,
    punchesPerClick: 9999,
    img: "Textures/glove3.gif",
  },
  {
    id: 99,
    name: "Bee Glove",
    cost: 0,
    punchesPerClick: 0,
    img: "Textures/bee_glove.png",
    special: "bee",
  },
  {
    id: 100,
    name: "Combo Glove",
    cost: 0,
    punchesPerClick: 0,
    img: "Textures/combo_glove.png",
    special: "combo",
  },
];

let currentGloveIndex = 0;
let punchesPerClick = gloves[currentGloveIndex].punchesPerClick;
updateComboBar();

document.addEventListener("mousemove", (e) => {
  player.style.left = e.clientX + "px";
  player.style.top = e.clientY + "px";
});

function getMultiplier(clicks) {
  const stepSize = getComboStep();
  return 1 + Math.floor(clicks / stepSize) * 0.5;
}

const page1 = document.getElementById("page1"); // Main
const page2 = document.getElementById("page2"); // Garden
const page3 = document.getElementById("page3"); // Cellar
const page4 = document.getElementById("page4"); // Office
const page5 = document.getElementById("page5"); // Elevator

// page1 → page2
document.getElementById("button-next").onclick = () => {
  page1.classList.add("shift-left");
  page2.classList.add("shift-left");
};

// page2 → page1
document.getElementById("button-back").onclick = () => {
  page1.classList.remove("shift-left");
  page2.classList.remove("shift-left");
};

// page1 → page3
document.getElementById("button-next2").onclick = () => {
  page1.classList.add("shift-up");
  page3.classList.add("shift-up");
};

// page3 → page1
document.getElementById("button-back3").onclick = () => {
  page1.classList.remove("shift-up");
  page3.classList.remove("shift-up");
};

// page3 → page4
document.getElementById("button-left3").onclick = () => {
  page3.classList.add("shift-right");
  page4.classList.add("shift-right");
};

// page4 → page3
document.getElementById("button-back4").onclick = () => {
  page3.classList.remove("shift-right");
  page4.classList.remove("shift-right");
};

// page3 → page5
document.getElementById("button-right3").onclick = () => {
  page3.classList.add("shift-left");
  page5.classList.add("shift-left");
};

// page5 → page3
document.getElementById("button-back5").onclick = () => {
  page3.classList.remove("shift-left");
  page5.classList.remove("shift-left");
};

const buttons = document.querySelectorAll(".button");

buttons.forEach((button) => {
  // Hover sound
  button.addEventListener("mouseenter", () => {
    playButtonHoverSound();
  });

  // Click sound
  button.addEventListener("click", () => {
    playButtonClickSound();
  });
});

const shopDiv = document.getElementById("shop");

// Hide player when cursor is over the shop
shopDiv.addEventListener("mouseenter", () => {
  player.style.display = "none";
});

// Show player when cursor leaves the shop
shopDiv.addEventListener("mouseleave", () => {
  player.style.display = "block";
});

const InfoDiv = document.getElementById("infoModal");

InfoDiv.addEventListener("mouseenter", () => {
  player.style.display = "none";
});

InfoDiv.addEventListener("mouseleave", () => {
  player.style.display = "block";
});

// --- Button Sounds --- //
function playButtonHoverSound() {
  const sound = document.getElementById("buttonHover");
  const clone = sound.cloneNode(true);
  clone.play();
}
function playButtonClickSound() {
  const sound = document.getElementById("buttonClick");
  const clone = sound.cloneNode(true);
  clone.play();
}

const appleGameButton = document.getElementById("appleGameButton");

appleGameButton.addEventListener("mouseenter", () => {
  playButtonHoverSound();
});

appleGameButton.addEventListener("click", () => {
  playButtonClickSound();
});

// --- Wambo Glove Reset --- //
function handleWamboScale(glove) {
  if (glove.id === 10) {
    // Wambo glove — start at normal scale
    wamboScale = 1;
    player.style.transform = `translate(-50%, -50%) scale(${wamboScale})`;
  } else {
    // Any other glove — force scale reset
    wamboScale = 1;
    player.style.transform = `translate(-50%, -50%) scale(1)`;
  }
}

// --- Punch Sound --- //
function playPunchSound() {
  const sound = document.getElementById("PunchSound");
  const clone = sound.cloneNode(true);
  clone.play();
}

// --- Glove Buy Animation --- //

function playBuyGloveAnimation(glove) {
  const animContainer = document.getElementById("buyGloveAnimation");
  const animImg = document.getElementById("buyGloveImg");
  const animMsg = document.getElementById("buyGloveMessage");
  const sound = document.getElementById("buyGloveSound");

  // Set image and text
  if (gloves[currentGloveIndex].special) {
    animImg.src = glove.img;
    animImg.style.filter =
      "drop-shadow(0 0 8px purple) drop-shadow(0 0 15px violet)";
  } else {
    animImg.src = glove.img;
    animImg.style.filter = "";
  }

  if (gloves[currentGloveIndex].special) {
    animMsg.textContent = `Claimed ${glove.name}!`;
    animMsg.style.color = "purple";
  } else {
    animMsg.textContent = `Bought ${glove.name}!`;
    animMsg.style.color = "";
  }

  // Make visible
  animContainer.style.opacity = "1";
  animContainer.style.transform = "translate(-50%, -50%) scale(1)";
  animContainer.style.animation = "none";
  animImg.style.animation = "none";

  // Restart animations
  void animContainer.offsetWidth; // reflow hack
  animImg.style.animation = "glowPop 0.8s ease-out forwards";
  animMsg.style.animation = "fadeInUp 0.8s ease-out forwards";

  // Play sound
  sound.currentTime = 0;
  sound.play();

  // Hide after 2.5s
  setTimeout(() => {
    animContainer.style.opacity = "0";
    animContainer.style.transform = "translate(-50%, -50%) scale(0)";
  }, 2500);
}

// --- Glove Eqiup Animation --- //

function playEquipGloveAnimation(glove) {
  const animContainer = document.getElementById("buyGloveAnimation");
  const animImg = document.getElementById("buyGloveImg");
  const animMsg = document.getElementById("buyGloveMessage");
  const sound = document.getElementById("equipGloveSound");

  // Set image and text
  animImg.src = glove.img;
  animImg.style.filter = "drop-shadow(3px 3px 5px black)";

  animMsg.textContent = `Equipped ${glove.name}`;
  if (darkMode) {
    // Dark mode
    animMsg.style.color = "white";
    animMsg.style.textShadow = "1px 1px 2px black, -1px -1px 2px black";
  } else {
    // Light mode
    animMsg.style.color = "black";
    animMsg.style.textShadow = "1px 1px 2px white, -1px -1px 2px white";
  }

  // Make visible
  animContainer.style.opacity = "1";
  animContainer.style.transform = "translate(-50%, -50%) scale(1)";
  animContainer.style.animation = "none";
  animImg.style.animation = "none";

  // Restart animations
  void animContainer.offsetWidth;
  animImg.style.animation = "glowPop 0.8s ease-out forwards";
  animMsg.style.animation = "fadeInUp 0.8s ease-out forwards";

  // Play sound
  sound.currentTime = 0;
  sound.play();

  // Hide after 2.5s
  setTimeout(() => {
    animContainer.style.opacity = "0";
    animContainer.style.transform = "translate(-50%, -50%) scale(0)";
  }, 2500);
}

// --- Feed Window --- //

appleCount.addEventListener("click", () => {
  document.getElementById("feedWindow").style.display = "block";
  document.getElementById("applesAvailable").textContent =
    abbreviateNumber(playerTotalApples);
});

function closeFeedWindow() {
  document.getElementById("feedWindow").style.display = "none";
}

// +/- buttons
document.getElementById("plusApple").addEventListener("click", () => {
  let input = document.getElementById("appleInput");
  input.value = Math.min(playerTotalApples, parseInt(input.value) + 1);
});
document.getElementById("minusApple").addEventListener("click", () => {
  let input = document.getElementById("appleInput");
  input.value = Math.max(1, parseInt(input.value) - 1);
});

const feedButtons = document.querySelectorAll("#feedWindow button");

// hover and click sounds
feedButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    playButtonHoverSound();
  });

  button.addEventListener("click", () => {
    playButtonClickSound();
  });
});

// Feed button
document.getElementById("feedBtn").addEventListener("click", () => {
  let input = document.getElementById("appleInput");
  let amount = parseInt(input.value);

  if (amount > 0 && amount <= playerTotalApples) {
    playerTotalApples -= amount;
    applesFeeding += amount;
    feedTimeLeft += amount * 5;

    if (!feedActive) {
      feedActive = true;
      startFeedEffect();
    }

    updateDisplay();
    document.getElementById("applesAvailable").textContent =
      abbreviateNumber(playerTotalApples);
  }
});

// Feeding Effect
function startFeedEffect() {
  document.getElementById("feedEffectTimer").style.display = "block";
  document.getElementById("feedTimeLeft").textContent = feedTimeLeft;

  feedInterval = setInterval(() => {
    if (feedTimeLeft > 0) {
      feedTimeLeft--;
      document.getElementById("feedTimeLeft").textContent = feedTimeLeft;
    } else {
      // Effect ends
      clearInterval(feedInterval);
      feedActive = false;
      applesFeeding = 0;
      document.getElementById("feedEffectTimer").style.display = "none";
    }
  }, 1000);
}

const feedWindow = document.getElementById("feedWindow");
const appleInput = document.getElementById("appleInput");

feedWindow.addEventListener("mouseenter", () => {
  player.style.display = "none";
  feedWindow.style.cursor = "default";
});
feedWindow.addEventListener("mouseleave", () => {
  player.style.display = "";
  feedWindow.style.cursor = "none";
});

function closeFeedWindow() {
  feedWindow.style.display = "none";
  appleInput.value = 1; // reset to 1 apple
}

function getComboStep() {
  return feedActive ? 7 : 10;
}

// --- Apple Tree --- //

const tree = document.getElementById("appletree");
const treeDark = document.getElementById("appletree-dark");
const appleSpawnArea = document.getElementById("applespawn");

// Function to spawn an apple on the tree
function spawnApple() {
  const currentApples = document.querySelectorAll(".apple-on-tree").length;

  if (currentApples >= 15) {
    return;
  }

  const apple = document.createElement("img");
  apple.src = "Textures/apple.png";
  apple.classList.add("apple-on-tree");
  apple.draggable = false;
  const spawnRect = appleSpawnArea.getBoundingClientRect();

  // Random position inside spawn area
  const x = Math.random() * (spawnRect.width - 60); // subtract apple width
  const y = Math.random() * (spawnRect.height - 60); // subtract apple height

  // Position relative to parent (#page2)
  apple.style.position = "absolute";
  apple.style.left = `${appleSpawnArea.offsetLeft + x}px`;
  apple.style.top = `${appleSpawnArea.offsetTop + y}px`;

  apple.addEventListener("click", (e) => {
    playerTotalApples++;
    playButtonClickSound();
    apple.remove();
    updateDisplay();
    const rect = apple.getBoundingClientRect();
    showPopup(
      `+1 <img src="Textures/appleico.png" alt="Apple" draggable="false" style="width:40px;height:40px;vertical-align:middle;">`,
      e.pageX,
      e.pageY
    );
    player.classList.remove("hide-cursor-player");
  });
  apple.addEventListener("mouseenter", () => {
    playButtonHoverSound();
    apple.style.transform = "scale(1.2)";
    player.classList.add("hide-cursor-player");
  });

  apple.addEventListener("mouseleave", () => {
    apple.style.transform = "scale(1)";
    player.classList.remove("hide-cursor-player");
  });
  page2.appendChild(apple);
}

setInterval(spawnApple, 20000);

// --- Apple Catch Game --- ///

const appleGame = document.getElementById("appleGame");
const catcher = document.getElementById("catcher");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("timeLeft");
const endScreen = document.getElementById("endScreen");
const finalScoreEl = document.getElementById("finalScore");
const goBackBtn = document.getElementById("goBackBtn");

// --- Music ---//
const bgMusic = new Audio("Sounds/applebackground-music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.8;

let keys = {};
let items = [];
let gameInterval;
let spawnInterval;
let timerInterval;
let score = 0;
let timeLeft = 60;

const GAME_DURATION = 60;
const COOLDOWN_DURATION = 180;

// --- Add "Press A,D to Move" text ---
const moveText = document.createElement("div");
moveText.textContent = "Press A, D to Move";
moveText.style.position = "absolute";
moveText.style.top = "50%";
moveText.style.left = "50%";
moveText.style.transform = "translate(-50%, -50%)";
moveText.style.fontSize = "28px";
moveText.style.fontWeight = "bold";
moveText.style.zIndex = "1000";
moveText.style.textAlign = "center";
moveText.style.fontFamily = "'Comic Sans MS', 'Comic Sans', cursive";
appleGame.appendChild(moveText);

let moveTextVisible = true;

function hideMoveText() {
  if (moveTextVisible) {
    moveText.remove();
    moveTextVisible = false;
  }
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  keys[key] = true;

  // Hide move text if A or D pressed
  if (key === "a" || key === "d" || e.code === "Space") {
    hideMoveText();
  }
});

document.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

function startGame() {
  appleGame.style.display = "block";
  appleGame.style.cursor = "none";
  endScreen.style.display = "none";

  // Ensure catcher has position and initial left
  catcher.style.position = "absolute";
  catcher.style.left =
    appleGame.clientWidth / 2 - catcher.offsetWidth / 2 + "px";
  catcher.style.bottom = "10px";

  score = 0;
  timeLeft = GAME_DURATION;
  scoreDisplay.textContent = "Score: 0";
  timeDisplay.textContent = "Time: " + timeLeft;
  bgMusic.currentTime = 0;
  bgMusic.play();

  spawnInterval = setInterval(spawnItem, 1000);
  gameInterval = requestAnimationFrame(updateGame);

  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = "Time: " + timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  cancelAnimationFrame(gameInterval);

  items.forEach((item) => item.remove());
  items = [];

  // Add score to total
  playerTotalApples += score;

  bgMusic.pause();

  // Show end screen
  endScreen.style.display = "flex";
  finalScoreEl.textContent = `You caught ${score} apples!`;

  // Restore cursor
  appleGame.style.cursor = "default";

  // Start cooldown
  startCooldown();
}

// --- Add "Press Space to Quit" text ---
const quitText = document.createElement("div");
quitText.textContent = "Press SPACE to Quit";
quitText.style.position = "absolute";
quitText.style.top = "950px";
quitText.style.right = "10px";
quitText.style.fontSize = "22px";
quitText.style.fontWeight = "bold";
quitText.style.zIndex = "1000";
appleGame.appendChild(quitText);

// --- Listen for SPACE key ---
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    endGame();
  }
});

function startCooldown() {
  let cooldown = COOLDOWN_DURATION;
  appleGameButton.disabled = true;
  updateCooldownText(cooldown);
  const cooldownInterval = setInterval(() => {
    cooldown--;
    updateCooldownText(cooldown);
    if (cooldown <= 0) {
      clearInterval(cooldownInterval);
      appleGameButton.disabled = false;
      appleGameButton.innerHTML = `
            <img src="Textures/basket.png" draggable="false" alt="Apple Game"/>
            `;
    }
  }, 1000);
}

function updateCooldownText(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  appleGameButton.textContent = `Cooldown: ${mins}:${
    secs < 10 ? "0" : ""
  }${secs}`;
}

// Go back button
goBackBtn.addEventListener("click", () => {
  endScreen.style.display = "none";
  appleGame.style.display = "none";
  updateDisplay();
});

appleGameButton.addEventListener("click", startGame);

// Key handling
document.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
document.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

function spawnItem() {
  const item = document.createElement("img");
  item.src = "Textures/apple.png";
  item.className = "falling-item";

  const margin = 60;
  const maxLeft = window.innerWidth - 50 - margin;
  const posX = Math.random() * (maxLeft - margin) + margin;

  item.style.left = posX + "px";
  item.style.top = "-50px";
  appleGame.appendChild(item);
  items.push(item);
}

function updateGame() {
  const speed = 7;
  let left = parseInt(catcher.style.left);

  const containerRect = appleGame.getBoundingClientRect();
  const catcherRect = catcher.getBoundingClientRect();

  if (keys["a"] && catcherRect.left > containerRect.left) left -= speed;
  if (keys["d"] && catcherRect.right < containerRect.right) left += speed;

  catcher.style.left = left + "px";

  catcher.style.left = left + "px";

  // Move apples
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    const itemTop = parseInt(item.style.top);
    item.style.top = itemTop + 5 + "px";

    const catcherRect = catcher.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    if (
      catcherRect.left < itemRect.left + itemRect.width &&
      catcherRect.left + catcherRect.width > itemRect.left &&
      catcherRect.top < itemRect.top + itemRect.height &&
      catcherRect.height + catcherRect.top > itemRect.top
    ) {
      item.remove();
      items.splice(i, 1);
      score++;
      scoreDisplay.textContent = "Score: " + score;
      catchsound.currentTime = 0;
      catchsound.volume = 0.2;
      catchsound.play();
    } else if (itemTop > window.innerHeight) {
      item.remove();
      items.splice(i, 1);
    }
  }

  gameInterval = requestAnimationFrame(updateGame);
}

// --- Cellar Game --- //

const whackGameButton = document.getElementById("whackGameButton");
const whackGame = document.getElementById("whackGame");
const whackScoreEl = document.getElementById("whackScore");
const whackTimeEl = document.getElementById("whackTime");
const whackEndScreen = document.getElementById("whackEndScreen");
const whackFinalScore = document.getElementById("whackFinalScore");
const whackTotalApples = document.getElementById("whackTotalApples");
const whackApples = document.getElementById("whackApples");
const whackGoBack = document.getElementById("whackGoBack");
const quitBtn = document.getElementById("quitBtn");

let whackScore = 0;
let whackTime = 60;
let whackTimerInterval, whackSpawnTimeout;
let whackCooldownActive = false;

// --- Music ---//
const wbgMusic = new Audio("Sounds/cellarbackground-music.mp3");
wbgMusic.loop = true;
wbgMusic.volume = 0.8;

const TARGETS = [
  { src: "Textures/peek1.png", x: 99, y: 310, size: 300 },
  { src: "Textures/peek2.png", x: 1225, y: 485, size: 90 },
  { src: "Textures/peek3.png", x: 1430, y: 485, size: 90 },
  { src: "Textures/peek4.png", x: 400, y: 450, size: 145 },
  { src: "Textures/peek5.png", x: 819, y: 450, size: 145 },
  { src: "Textures/rug.png", x: 1100, y: 740, size: 610 },
  { src: "Textures/ventopen.png", x: 1270, y: -21, size: 450 },
];

const buttonBack3 = document.getElementById("button-back3");
const buttonLeft3 = document.getElementById("button-left3");
const buttonRight3 = document.getElementById("button-right3");

function startWhackGame() {
  if (whackCooldownActive) return;

  whackGameButton.style.display = "none";
  whackGame.style.display = "block";
  whackEndScreen.style.display = "none";
  page3.classList.add("flashlight-active");
  player.classList.add("hidden");

  buttonBack3.classList.add("hidden");
  buttonLeft3.classList.add("hidden");
  buttonRight3.classList.add("hidden");

  whackScore = 0;
  whackTime = 60;
  whackScoreEl.textContent = "Score: 0";
  whackTimeEl.textContent = "Time: 60";

  wbgMusic.currentTime = 0;
  wbgMusic.play();

  whackTimerInterval = setInterval(() => {
    whackTime--;
    whackTimeEl.textContent = "Time: " + whackTime;
    if (whackTime <= 0) endWhackGame();
  }, 1000);

  setTimeout(spawnTarget, 3000);
}

function spawnTarget() {
  if (whackTime <= 0) return;

  const targetData = TARGETS[Math.floor(Math.random() * TARGETS.length)];
  const target = document.createElement("img");
  target.src = targetData.src;
  target.className = "target";
  target.style.left = targetData.x + "px";
  target.style.top = targetData.y + "px";
  target.style.width = targetData.size + "px";
  target.draggable = false;
  whackGame.appendChild(target);

  const removeTarget = () => {
    if (target.parentNode) target.remove();
    if (whackTime > 0) whackSpawnTimeout = setTimeout(spawnTarget, 3000);
  };

  const timeout = setTimeout(removeTarget, 1000);

  target.addEventListener("click", () => {
    whackScore++;
    whackScoreEl.textContent = "Score: " + whackScore;
    clearTimeout(timeout);
    removeTarget();
    const sound = document.getElementById("giraffiDeath");
    sound.currentTime = 0;
    sound.volume = 1;
    sound.play();
  });
}

function endWhackGame() {
  clearInterval(whackTimerInterval);
  clearTimeout(whackSpawnTimeout);
  whackGame.querySelectorAll(".target").forEach((t) => t.remove());

  playerTotalApples += whackScore * 3;

  wbgMusic.pause();

  whackGame.style.display = "none";
  whackEndScreen.style.display = "flex";
  page3.classList.remove("flashlight-active");

  whackFinalScore.textContent = `Score: ${whackScore}`;
  whackApples.textContent = `Apples gained: ${whackScore * 3}`;
  whackTotalApples.textContent = `Total Apples: ${playerTotalApples}`;
}

function startWhackCooldown() {
  whackCooldownActive = true;

  let cd = 180;
  const cdInterval = setInterval(() => {
    if (cd <= 0) {
      clearInterval(cdInterval);
      whackCooldownActive = false;
      whackGameButton.style.display = "block";
      whackGameButton.innerHTML = `<img src="Textures/flashlight.png" alt="Start Game"/>`;
    } else {
      const mins = Math.floor(cd / 60);
      const secs = cd % 60;
      whackGameButton.style.display = "block";
      whackGameButton.textContent = `Cooldown: ${mins}:${
        secs < 10 ? "0" : ""
      }${secs}`;
      whackGameButton.style.color = "white";
      cd--;
    }
  }, 1000);
}

// Quit instantly
quitBtn.addEventListener("click", endWhackGame);

// Go back
whackGoBack.addEventListener("click", () => {
  whackEndScreen.style.display = "none";
  startWhackCooldown();
  buttonBack3.classList.remove("hidden");
  buttonLeft3.classList.remove("hidden");
  buttonRight3.classList.remove("hidden");
  player.classList.remove("hidden");
  updateDisplay();
});

// Start button
whackGameButton.addEventListener("mouseenter", () => {
  playButtonHoverSound();
});

whackGameButton.addEventListener("click", () => {
  if (whackCooldownActive) return;

  const sound = document.getElementById("flashClick");
  sound.currentTime = 0;
  sound.volume = 1;
  sound.play();

  startWhackGame();
});

// Flashlight effect follow cursor
page3.addEventListener("mousemove", (e) => {
  page3.style.setProperty("--x", e.clientX + "px");
  page3.style.setProperty("--y", e.clientY + "px");
});

// --- Office Game --- //

let officeScore = 0;
let officeTime = 60;
let officeTimerInterval = null;
let officeFileTimeout = null;
let officeQTEActive = false;
let officeCooldownActive = false;
let fileCounter = 0;

const officeGameButton = document.getElementById("officeGameButton");
const officeGame = document.getElementById("officeGame");
const officeScoreEl = document.getElementById("officeScore");
const officeTimeEl = document.getElementById("officeTime");
const officeEndScreen = document.getElementById("officeEndScreen");
const officeFinalScore = document.getElementById("officeFinalScore");
const officeTotalApples = document.getElementById("officeTotalApples");
const officeApples = document.getElementById("officeApples");
const officeGoBack = document.getElementById("officeGoBack");
const officeQuitBtn = document.getElementById("officeQuitBtn");
const buttonBack4 = document.getElementById("button-back4");

const cloudTarget = document.getElementById("cloudUpload");
const trashTarget = document.getElementById("trashBin");

const safeZoneY = cloudTarget.getBoundingClientRect().top;
const safeZoneHeight = cloudTarget.getBoundingClientRect().height;

const obgMusic = new Audio("Sounds/officebackground-music.mp3");
obgMusic.loop = true;
obgMusic.volume = 0.8;

const successSound = document.getElementById("successSound");
const failSound = document.getElementById("failSound");

// --- Boot Countdown with Instructions  --- //
function showBootCountdown(callback) {
  const spawnArea = document.getElementById("officeSpawnArea");

  const bootImage = document.createElement("img");
  bootImage.src = "Textures/instructions.png";
  bootImage.style.cssText = `
        position: fixed; /* full screen */
        top: 60%;
        right: -100%; /* start fully off-screen to the right */
        transform: translateY(-50%);
        width: 40vw; /* large image */
        max-width: 1000px;
        height: auto;
        transition: right 1s ease;
        z-index: 13; /* below overlay */
      `;
  document.body.appendChild(bootImage);

  const rect = spawnArea.getBoundingClientRect();

  const bootOverlay = document.createElement("div");
  bootOverlay.style.position = "absolute";
  bootOverlay.style.top = rect.top + "px";
  bootOverlay.style.left = rect.left + "px";
  bootOverlay.style.width = rect.width + "px";
  bootOverlay.style.height = rect.height + "px";
  bootOverlay.style.background = "#001DC4";
  bootOverlay.style.display = "flex";
  bootOverlay.style.alignItems = "center";
  bootOverlay.style.justifyContent = "center";
  bootOverlay.style.flexDirection = "column";
  bootOverlay.style.fontFamily = "'Press Start 2P', monospace";
  bootOverlay.style.fontSize = "24px";
  bootOverlay.style.color = "white";
  bootOverlay.style.zIndex = 12;

  document.body.appendChild(bootOverlay);

  // Slide in
  setTimeout(() => {
    bootImage.style.right = "3%";
  }, 50);

  let counter = 10;
  const interval = setInterval(() => {
    bootOverlay.textContent = `Booting... ${counter}`;
    counter--;
    if (counter < 0) {
      clearInterval(interval);
      // Slide out
      bootImage.style.right = "-100%";
      setTimeout(() => {
        bootOverlay.remove();
        bootImage.remove();
        callback();
      }, 1000);
    }
  }, 1000);

  window.stopBootCountdown = function () {
    clearInterval(interval);
    if (bootOverlay && bootOverlay.parentNode) bootOverlay.remove();
    if (bootImage && bootImage.parentNode) bootImage.remove();
  };
}

// --- Start Game --- //
function startOfficeGame() {
  if (officeCooldownActive) return;

  officeGameButton.style.display = "none";
  officeGame.style.display = "block";
  officeEndScreen.style.display = "none";

  officeScore = 0;
  officeTime = 60;
  officeScoreEl.textContent = "Score: 0";
  officeTimeEl.textContent = "Time: 60";

  buttonBack4.classList.add("hidden");
  player.classList.add("hidden");

  obgMusic.currentTime = 0;
  obgMusic.play();

  showBootCountdown(() => {
    spawnFile();
    scheduleRandomQTE();
    startOfficeTimer();
  });
}

// --- Timer --- //
function startOfficeTimer() {
  if (officeTimerInterval) return;
  officeTimerInterval = setInterval(() => {
    officeTime--;
    officeTimeEl.textContent = "Time: " + officeTime;
    if (officeTime <= 0) endOfficeGame();
  }, 1000);
}

// --- Spawn Files --- //
function spawnFile() {
  if (officeTime <= 0 || officeQTEActive) return;

  const spawnArea = document.getElementById("officeSpawnArea");
  const areaRect = spawnArea.getBoundingClientRect();

  const file = document.createElement("img");
  const isCorrupted = Math.random() < 0.3;
  file.src = isCorrupted
    ? "Textures/corrupted-file.png"
    : "Textures/normal-file.png";
  file.className = "office-file";
  file.style.width = "60px";
  file.style.height = "60px";
  file.style.position = "absolute";
  file.dataset.type = isCorrupted ? "corrupted" : "normal";
  file.dataset.id = "file-" + fileCounter++;
  file.draggable = true;

  let x, y, absoluteY;

  const fileWidth = 60;
  const fileHeight = 60;

  const safeZoneY = cloudTarget.getBoundingClientRect().top;
  const safeZoneHeight = cloudTarget.getBoundingClientRect().height;

  do {
    x = Math.random() * (areaRect.width - fileWidth);
    y = Math.random() * (areaRect.height - fileHeight);
    absoluteY = y + areaRect.top;
  } while (absoluteY >= safeZoneY && absoluteY <= safeZoneY + safeZoneHeight);

  file.style.left = x + "px";
  file.style.top = y + "px";

  spawnArea.appendChild(file);

  // --- Drag & Drop --- //
  file.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", file.dataset.id);
    const dragIcon = document.createElement("canvas");
    dragIcon.width = 40;
    dragIcon.height = 40;
    const ctx = dragIcon.getContext("2d");
    const img = new Image();
    img.src = file.src;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 40, 40);
      e.dataTransfer.setDragImage(dragIcon, 20, 20);
    };
    e.dataTransfer.effectAllowed = "move";
  });

  officeFileTimeout = setTimeout(() => {
    if (file.parentNode) file.remove();
    if (officeTime > 0 && !officeQTEActive) spawnFile();
  }, 5000);
}

// --- Drag-and-Drop --- //
[cloudTarget, trashTarget].forEach((target) => {
  if (!target) return;
  target.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  });
  target.addEventListener("drop", handleDrop);
});

function handleDrop(e) {
  e.preventDefault();
  const fileId = e.dataTransfer.getData("text/plain");
  const draggedFile = document.querySelector(
    `.office-file[data-id="${fileId}"]`
  );
  if (!draggedFile) return;

  const type = draggedFile.dataset.type;
  const targetId = e.currentTarget.id;

  if (
    (type === "normal" && targetId === "cloudUpload") ||
    (type === "corrupted" && targetId === "trashBin")
  ) {
    officeScore++;
    successSound?.play();
  } else {
    officeScore = Math.max(0, officeScore - 1);
    failSound?.play();
  }
  officeScoreEl.textContent = "Score: " + officeScore;
  draggedFile.remove();
}

// --- Typing QTEs --- //
function scheduleRandomQTE() {
  if (officeTime <= 0) return;
  setTimeout(() => {
    if (officeTime > 0 && !officeQTEActive) triggerQTE();
    scheduleRandomQTE();
  }, Math.random() * 8000 + 5000);
}

function triggerQTE() {
  if (officeQTEActive || officeTime <= 0) return;
  officeQTEActive = true;

  const spawnArea = document.getElementById("officeSpawnArea");
  const qteOverlay = document.createElement("div");
  qteOverlay.className = "qte-overlay";
  qteOverlay.style.cssText = `
        font-family: 'Press Start 2P';
        font-size: 20px; color: white;
        text-align: center; background: rgba(0,0,0,0.85);
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      `;
  spawnArea.appendChild(qteOverlay);

  const words = [
    "DOWNLOAD",
    "APPLES",
    "MONITOR",
    "DISK",
    "GIRAFFI",
    "NETWORK",
    "UPLOAD",
    "BIOS",
    "STATIC",
    "SCRIPT",
    "BOOT",
  ];
  const word = words[Math.floor(Math.random() * words.length)];

  qteOverlay.innerHTML = `<p>Type: ${word}</p><p id="typedWord"></p>`;
  let currentIndex = 0;
  const typedWordEl = document.getElementById("typedWord");

  function handleTyping(e) {
    if (e.key.toUpperCase() === word[currentIndex]) {
      currentIndex++;
      typedWordEl.textContent = word.slice(0, currentIndex);
      if (currentIndex === word.length) cleanup(true);
    } else if (e.key.length === 1) {
      currentIndex = 0;
      typedWordEl.textContent = "";
    }
  }

  function cleanup(success) {
    document.removeEventListener("keydown", handleTyping);
    qteOverlay.remove();
    officeQTEActive = false;
    if (!success) officeScore = Math.max(0, officeScore - 5);
    if (officeTime > 0) spawnFile();
  }

  document.addEventListener("keydown", handleTyping);
}

// --- End Game --- //
function endOfficeGame() {
  clearInterval(officeTimerInterval);
  officeTimerInterval = null;
  clearTimeout(officeFileTimeout);

  officeGame.querySelectorAll(".office-file").forEach((f) => f.remove());
  officeGame.querySelectorAll(".qte-overlay").forEach((o) => o.remove());

  // Stop background music
  obgMusic.pause();
  obgMusic.currentTime = 0;

  // Stop computer click sound if still playing
  const clickSound = document.getElementById("compClick");
  if (clickSound) {
    clickSound.pause();
    clickSound.currentTime = 0;
  }

  // remove boot image + overlay if still running
  if (typeof stopBootCountdown === "function") {
    stopBootCountdown();
  }

  playerTotalApples += officeScore * 3;

  officeGame.style.display = "none";
  officeEndScreen.style.display = "flex";

  officeFinalScore.textContent = `Score: ${officeScore}`;
  officeApples.textContent = `Apples gained: ${officeScore * 3}`;
}

// --- Cooldown System --- //
function startOfficeCooldown() {
  officeCooldownActive = true;
  let cd = 180;
  const cdInterval = setInterval(() => {
    if (cd <= 0) {
      clearInterval(cdInterval);
      officeCooldownActive = false;
      officeGameButton.style.display = "block";
      officeGameButton.innerHTML = `<img src="Textures/computer.png" alt="Start Office Game"/>`;
    } else {
      const mins = Math.floor(cd / 60);
      const secs = cd % 60;
      officeGameButton.style.display = "block";
      officeGameButton.innerHTML = `Cooldown: ${mins}:${
        secs < 10 ? "0" : ""
      }${secs}`;
      officeGameButton.style.color = "white";
      cd--;
    }
  }, 1000);
}

// --- Quit & Go Back --- //
officeQuitBtn.addEventListener("click", endOfficeGame);
officeGoBack.addEventListener("click", () => {
  officeEndScreen.style.display = "none";
  buttonBack4.classList.remove("hidden");
  player.classList.remove("hidden");
  startOfficeCooldown();
  updateDisplay();
});

// --- Start Button --- //
officeGameButton.addEventListener("mouseenter", () => playButtonHoverSound());
officeGameButton.addEventListener("click", () => {
  if (officeCooldownActive) return;
  const sound = document.getElementById("compClick");
  if (sound) {
    sound.currentTime = 0;
    sound.volume = 1;
    sound.play();
  }
  startOfficeGame();
});

// --- Particles --- //

function spawnParticleBurst(x, y, imgSrc, count = 8) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("img");
    particle.src = imgSrc;
    particle.style.position = "absolute";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${Math.random() * 25 + 20}px`;
    particle.style.pointerEvents = "none";
    particle.style.opacity = "1";
    particle.style.zIndex = 99;
    particle.style.transition =
      "transform 0.8s ease-out, opacity 0.8s ease-out";

    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;

    setTimeout(() => {
      particle.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${
        Math.random() * 0.5 + 0.5
      })`;
      particle.style.opacity = "0";
    }, Math.random() * 100);

    setTimeout(() => particle.remove(), 800);
  }
}

function updateDisplay() {
  clickCount.textContent = `Points: ${abbreviateNumber(totalPoints)}`;
  punchCount.textContent = `Punches: ${abbreviateNumber(punches)}`;
  appleCount.innerHTML = `
      <img src="Textures/appleico.png" 
           alt="Apples" 
           draggable="false" 
           style="width:50px;height:50px;vertical-align:middle;"
           id="appleIcon"> 
      x ${abbreviateNumber(playerTotalApples)}
    `;

  const appleIcon = document.getElementById("appleIcon");

  appleIcon.addEventListener("mouseenter", () => {
    player.classList.add("hide-cursor-player");
    playButtonHoverSound();
  });

  appleIcon.addEventListener("mouseleave", () => {
    player.classList.remove("hide-cursor-player");
  });

  appleIcon.addEventListener("click", () => {
    playButtonClickSound();
    document.getElementById("feedWindow").style.display = "block";
    document.getElementById("applesAvailable").textContent =
      abbreviateNumber(playerTotalApples);
    appleInput.value = 1;
  });
}

function showPopup(text, x, y, color = "black") {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = text;
  popup.style.color = color;

  if (darkMode) {
    if (color === "black") popup.style.color = "white";
    if (color === "red") popup.style.color = "red";
  }

  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1000);
}

function getBestPunchValue() {
  return Math.max(
    ...gloves
      .filter((g) => ownedGloveIds.has(g.id))
      .map((g) => g.punchesPerClick)
  );
}

// --- Skeleton Glove dark mode
function isDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function updateGloveVisual() {
  const glove = gloves[currentGloveIndex];
  updatePlayerImage(glove);
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    updateGloveVisual();
  });

function showComboMessage(htmlText, duration = 2000) {
  const container = document.getElementById("combo-message-container");

  const message = document.createElement("div");
  message.innerHTML = htmlText;
  message.style.opacity = 1;
  message.style.transition = "opacity 0.5s";
  message.style.marginTop = "10px";
  message.style.background = "transparent";

  message.style.padding = "10px 20px";
  message.style.borderRadius = "5px";
  message.style.fontSize = "30px";
  message.style.textAlign = "center";

  container.prepend(message);

  setTimeout(() => {
    message.style.opacity = 0;
    setTimeout(() => {
      message.remove();
    }, 500);
  }, duration);
}

// --- Number Suffix --- ///
const SUFFIXES = [
  "",
  "K",
  "M",
  "B",
  "T",
  "Qa",
  "Qi",
  "Sx",
  "Sp",
  "Oc",
  "No",
  "De",
];

function abbreviateNumber(value) {
  if (value === null || value === undefined) return "";
  let num =
    typeof value === "number"
      ? value
      : parseFloat(String(value).replace(/,/g, ""));
  if (!isFinite(num)) return String(value);

  const sign = num < 0 ? "-" : "";
  num = Math.abs(num);

  if (num < 10000) {
    return sign + String(Math.round(num));
  }

  let tier = Math.floor(Math.log10(num) / 3);
  if (tier >= SUFFIXES.length) tier = SUFFIXES.length - 1;
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  let formatted;
  if (tier === 1) {
    formatted = Math.round(scaled).toString();
  } else if (scaled >= 100) {
    formatted = Math.round(scaled).toString();
  } else {
    formatted = scaled.toFixed(1).replace(/\.0$/, "");
  }

  return sign + formatted + SUFFIXES[tier];
}

const skyOrb = document.getElementById("skyOrb");
const bee = document.getElementById("bee");
const rareBee = document.getElementById("rareBee");

const orbRadiusX = window.innerWidth + 200;
const orbAmplitude = 100;

// Orb follows a semi-circular path
function moveOrb() {
  const duration = 20000;
  let startTime = null;

  function animateOrb(timestamp) {
    skyOrb.style.opacity = 1;
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = elapsed / duration;

    if (progress > 1) {
      setTimeout(() => {
        startTime = null;
        requestAnimationFrame(animateOrb);
      }, 500);
      return;
    }

    const startX = -100;
    const totalDistance = window.innerWidth + 200;
    const x = startX + totalDistance * progress;

    const baseY = 200;
    const amplitude = 120;
    const y = baseY - amplitude * Math.sin(progress * Math.PI);

    skyOrb.style.transform = `translate(${x}px, ${y}px)`;

    requestAnimationFrame(animateOrb);
  }

  requestAnimationFrame(animateOrb);
  skyOrb.style.opacity = 0;
}
moveOrb();

// --- Bees -- //

function flyBee(isRare = false) {
  const beeElem = document.createElement("img");
  setupHoverEffect(beeElem);
  beeElem.src = isRare
    ? darkMode
      ? "Textures/rare_bee-dark.png"
      : Textures / "rare_bee.png"
    : darkMode
    ? "Textures/bee-dark.png"
    : "Textures/bee.png";
  beeElem.style.position = "absolute";
  beeElem.style.width = isRare ? "60px" : "50px";
  beeElem.style.zIndex = isRare ? 2 : 1;
  beeElem.style.cursor = "pointer";
  beeElem.classList.add("hover-target");
  beeElem.style.pointerEvents = "auto";
  beeElem.draggable = false;
  beeElem.style.webkitUserDrag = "none";
  document.body.appendChild(beeElem);
  allBees.push({ elem: beeElem, isRare });

  const points = isRare ? 2500 : 500;
  const speed = isRare ? 22000 : 15000;

  const startTime = performance.now();

  function animateBee(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = elapsed / speed;

    if (progress >= 1) {
      beeElem.remove();
      return;
    }

    const startX = -100;
    const totalDistance = window.innerWidth + 200;
    const x = startX + totalDistance * progress;

    const baseY = 200;
    const amplitude = 120;
    const wobble = 10 * Math.sin(progress * Math.PI * 8);
    const y = baseY - amplitude * Math.sin(progress * Math.PI) + wobble;

    beeElem.style.left = `${x}px`;
    beeElem.style.top = `${y}px`;

    requestAnimationFrame(animateBee);
  }

  requestAnimationFrame(animateBee);

  beeElem.addEventListener("mouseenter", () => {
    playButtonHoverSound();
  });

  beeElem.addEventListener("click", (e) => {
    e.stopPropagation();
    let actualPoints = points;
    if (gloves[currentGloveIndex].special === "bee") {
      actualPoints *= 10;
    }
    totalPoints += actualPoints;
    beeCatches++;
    updateDisplay();

    const rect = beeElem.getBoundingClientRect();
    catchsound.currentTime = 0;
    catchsound.volume = 0.3;
    catchsound.play();
    showPopup(
      `+${actualPoints} ${isRare ? "Rare Bee!" : "Bee!"}`,
      rect.left,
      rect.top,
      isRare ? "purple" : "gold"
    );

    beeElem.remove();
    player.style.display = "block";
    document.body.classList.add("hide-cursor");
    const index = allBees.findIndex((b) => b.elem === beeElem);
    if (index !== -1) allBees.splice(index, 1);
  });
}

function updateAllBeesForDarkMode() {
  allBees.forEach(({ elem, isRare }) => {
    elem.src = isRare
      ? darkMode
        ? "Textures/rare_bee-dark.png"
        : "Textures/rare_bee.png"
      : darkMode
      ? "Textures/bee-dark.png"
      : "Textures/bee.png";
  });
}

// --- Bee Randomness -- //

function randomBeeSpawns() {
  setInterval(() => {
    const beeGloveActive = gloves[currentGloveIndex].special === "bee";
    const normalChance = beeGloveActive ? 0.8 : 0.3;
    const rareChance = beeGloveActive ? 0.08 : 0.03;
    if (Math.random() < normalChance) flyBee();
    if (Math.random() < rareChance) flyBee(true);
  }, 6000);
}

randomBeeSpawns();

function clearFastPunchTimer() {
  if (fastPunchTimer) {
    clearTimeout(fastPunchTimer);
    fastPunchTimer = null;
  }
}

function startFastPunchTimer() {
  clearFastPunchTimer();
  fastPunchTimer = setTimeout(() => {
    if (!isDead) {
      giraffiDies();
    }
  }, requiredFastPunchDuration);
}

function checkFastPunch() {
  const now = Date.now();
  punchTimes = punchTimes.filter((t) => now - t <= requiredFastPunchDuration);
  const cps = punchTimes.length / (requiredFastPunchDuration / 1000);

  if (cps >= cpsThreshold) {
    if (!fastPunchTimer && comboRedValue >= 1) {
      startFastPunchTimer();
    }

    if (!redBarInterval) {
      redBarInterval = setInterval(() => {
        comboRedValue += 0.025;
        if (comboRedValue >= 1) {
          comboRedValue = 1;
          clearInterval(redBarInterval);
          redBarInterval = null;
        }
        updateComboBar();
      }, 100);
    }

    // Stop decay if it was running
    if (redBarDecayInterval) {
      clearInterval(redBarDecayInterval);
      redBarDecayInterval = null;
    }
  } else {
    // STOP red bar fill
    if (redBarInterval) {
      clearInterval(redBarInterval);
      redBarInterval = null;
    }

    clearFastPunchTimer();

    // Start red bar decay if not already running
    if (!redBarDecayInterval) {
      redBarDecayInterval = setInterval(() => {
        comboRedValue -= 0.07;
        if (comboRedValue <= 0) {
          comboRedValue = 0;
          clearInterval(redBarDecayInterval);
          redBarDecayInterval = null;
        }
        updateComboBar();
      }, 100);
    }
  }
}

function resolveCombo() {
  if (isDead || comboBlackValue > 0) return;

  if (punches > 0) {
    const multiplier = getMultiplier(comboClicks);
    const earned = Math.floor(punches * multiplier);
    const sound = document.getElementById("resolveSound");
    totalPoints += earned;

    sound.currentTime = 0;
    sound.play();
    showComboMessage(
      `<span style="text-shadow: 2px 2px 5px black;">🔥 Combo over! <span style="color:red;">+${abbreviateNumber(
        earned
      )} points (x${multiplier.toFixed(1)})</span </span>`,
      3000
    );
  }
  punches = 0;
  comboClicks = 0;
  handleWamboScale(gloves[currentGloveIndex]);
  updateDisplay();
  comboPopup.style.opacity = "0"; // Hide combo popup on combo end
}

function giraffiDies() {
  if (gloves[currentGloveIndex].special === "combo") {
    return; // Giraffi cannot die
  }
  giraffiKills++;

  isDead = true;
  clearFastPunchTimer();

  if (punches === 0) {
    isDead = false;
    return;
  }

  comboRedValue = 0;
  comboBlackValue = 0;
  updateComboBar();

  clearInterval(comboDecayInterval);
  comboDecayInterval = null;

  clearInterval(redBarInterval);
  redBarInterval = null;

  const multiplier = getMultiplier(comboClicks);
  const earned = Math.floor(punches * multiplier);
  totalPoints += earned;

  punches = 0;
  comboClicks = 0;
  handleWamboScale(gloves[currentGloveIndex]);
  comboPopup.style.opacity = "0";
  updateDisplay();

  const sound = document.getElementById("giraffiDeath");
  sound.currentTime = 0;
  sound.play();

  const deathColor = darkMode ? "white" : "black";
  const deathMessage = `<span style="color:${deathColor};">💀 Giraffi died!</span> <span style="color:red;">+${abbreviateNumber(
    earned
  )} points (x${multiplier.toFixed(1)})</span>`;
  showComboMessage(deathMessage, 3000);

  img.classList.add("dead");
  img.style.transition = "transform 2s ease, filter 2s ease";
  img.style.transformOrigin = "center bottom";
  img.style.transform = "rotateZ(90deg) translateY(100px)";

  setTimeout(() => {
    img.style.transition = "opacity 1.5s ease";
    img.style.opacity = 0;

    setTimeout(() => {
      img.classList.remove("dead", "squished");
      void img.offsetWidth;
      img.style.transition = "none";
      img.style.transform = "scale(1)";
      img.offsetHeight;
      img.style.filter = "";
      img.style.transition = "opacity 0.8s ease";
      img.style.opacity = 1;
      img.style.transition = "";
      img.style.transform = "";

      setTimeout(() => {
        isDead = false;
        showComboMessage("Giraffi respawned! Ready to punch!", 3000);
      }, 200);
    }, 1500);
  }, 4000);
}

function handleClick(e) {
  if (isDead || img.style.opacity === "0") return;

  comboClicks++;
  punches += punchesPerClick;
  spawnParticleBurst(e.clientX, e.clientY, "Textures/cotton2.png", 10);
  playPunchSound();
  updateDisplay();

  img.classList.remove("squished");
  void img.offsetWidth;
  img.classList.add("squished");
  setTimeout(() => img.classList.remove("squished"), 100);

  showPopup(
    `+${abbreviateNumber(punchesPerClick)}`,
    e.clientX,
    e.clientY,
    "black"
  );

  const stepSize = getComboStep();

  if (comboClicks % stepSize === 0) {
    const multiplier = getMultiplier(comboClicks);
    showPopup(
      `x${multiplier.toFixed(1)}`,
      e.clientX + 30,
      e.clientY - 30,
      "red"
    );
  }

  comboBlackValue = Math.min(1, comboBlackValue + 0.3);
  updateComboBar();

  if (fastPunchTimer && !redBarInterval) {
    redBarInterval = setInterval(() => {
      comboRedValue += 0.025;
      if (comboRedValue >= 1) {
        comboRedValue = 1;
        clearInterval(redBarInterval);
        redBarInterval = null;

        if (!isDead) {
          giraffiDies();
        }
      }
      updateComboBar();
    }, 100);
  }

  if (comboClicks % stepSize === 0) {
    const multiplier = getMultiplier(comboClicks);
    if (multiplier > 1) {
      comboPopup.textContent = `x${multiplier.toFixed(1)}`;
      comboPopup.style.opacity = "1";
      comboPopup.style.transform = "scale(1.2)";
      setTimeout(() => {
        comboPopup.style.transform = "scale(1)";
      }, 150);
    } else {
      comboPopup.style.opacity = "0";
    }
  }
  punchTimes.push(Date.now());
  checkFastPunch();

  clearTimeout(comboTimer);
  comboTimer = setTimeout(resolveCombo, comboDelay);

  // Black bar decays
  clearInterval(comboDecayInterval);
  comboDecayInterval = setInterval(() => {
    comboBlackValue -= 0.02;
    if (comboBlackValue <= 0) {
      comboBlackValue = 0;
      clearInterval(comboDecayInterval);
      comboDecayInterval = null;

      if (!isDead && comboRedValue < 1) {
        resolveCombo();
      }
    }
    updateComboBar();
  }, 40);

  // Red bar decay starts after short delay if no more punches
  if (redBarDecayTimeout) clearTimeout(redBarDecayTimeout);
  redBarDecayTimeout = setTimeout(() => {
    if (!redBarDecayInterval) {
      redBarDecayInterval = setInterval(() => {
        comboRedValue -= 0.07;
        if (comboRedValue <= 0) {
          comboRedValue = 0;
          clearInterval(redBarDecayInterval);
          redBarDecayInterval = null;
        }
        updateComboBar();
      }, 100);
    }
  }, 400);

  // Cancel previous stop timeout
  if (clickStopTimeout) clearTimeout(clickStopTimeout);

  // Start new stop detection
  clickStopTimeout = setTimeout(() => {
    // Stop red bar fill if it’s still running
    if (redBarInterval) {
      clearInterval(redBarInterval);
      redBarInterval = null;
    }

    // Start red bar decay if not already running
    if (!redBarDecayInterval) {
      redBarDecayInterval = setInterval(() => {
        comboRedValue -= 0.07;
        if (comboRedValue <= 0) {
          comboRedValue = 0;
          clearInterval(redBarDecayInterval);
          redBarDecayInterval = null;
        }
        updateComboBar();
      }, 100);
    }
  }, 400); // decay starts 400ms after last click

  // --- Wambo Glove --- //

  if (gloves[currentGloveIndex].id === 10) {
    if (wamboScale < maxWamboScale) {
      wamboScale += wamboGrowStep;
      if (wamboScale > maxWamboScale) wamboScale = maxWamboScale;
      player.style.transform = `translate(-50%, -50%) scale(${wamboScale})`;
    }
  } else {
    // reset scale if switching to another glove
    wamboScale = 1;
    player.style.transform = `translate(-50%, -50%) scale(1)`;
  }
}

img.addEventListener("mousedown", handleClick);
img.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  handleClick(touch);
});

// Hover sound
resetButton.addEventListener("mouseenter", () => {
  playButtonHoverSound();
});

resetButton.addEventListener("click", () => {
  img.classList.remove("squished");
  void img.offsetWidth;
  totalPoints = 0;
  punches = 0;
  punchTimes = [];
  beeCatches = 0;
  giraffiKills = 0;
  clearTimeout(comboTimer);
  clearFastPunchTimer();
  img.style.transition = "opacity 1s ease";
  img.style.opacity = 1;
  img.classList.remove("dead");
  img.style.transform = "rotateZ(0deg) translateY(0)";
  img.style.filter = "";
  img.style.transition = "";
  img.style.transform = "";
  handleWamboScale(gloves[currentGloveIndex]);

  // Reset game buttons
  appleGameButton.disabled = false;
  appleGameButton.src = "Textures/appleButton.png";
  whackGameButton.disabled = false;
  whackGameButton.src = "Textures/whackButton.png";

  // Reset cooldown flags
  whackCooldownActive = false;
  appleCooldownActive = false;

  // --- reset Combo Bar
  omboRedValue = 0;
  comboBlackValue = 0;
  updateComboBar();

  clearInterval(comboDecayInterval);
  comboDecayInterval = null;

  clearInterval(redBarInterval);
  redBarInterval = null;

  // Reset gloves state:
  ownedGloveIds = new Set([1]); // Only fist owned
  currentGloveIndex = 0; // Reset to fist glove index
  punchesPerClick = gloves[currentGloveIndex].punchesPerClick;

  // Update player image to fist
  player.src = gloves[currentGloveIndex].img;

  updateDisplay();
  playButtonClickSound();
  showComboMessage("Game reset!", 6000);
  isDead = false;
});

const darkModeToggle = document.getElementById("darkModeToggle");
const darkModeIcon = document.getElementById("darkModeIcon");

let darkMode = document.body.classList.contains("dark-mode");

darkModeToggle.addEventListener("mouseenter", () => {
  playButtonHoverSound();
});

darkModeToggle.addEventListener("click", () => {
  darkMode = !darkMode;

  document.body.classList.toggle("dark-mode", darkMode);
  shop.classList.toggle("dark", darkMode);
  updatePlayerImage(gloves[currentGloveIndex]);
  skyOrb.src = darkMode ? "Textures/moon1.png" : "Textures/sun1.png";

  updateAllBeesForDarkMode();

  // Update image and alt text
  darkModeIcon.src = darkMode ? "Textures/sun-dark.png" : "Textures/moon.png";
  darkModeIcon.alt = darkMode ? "Switch to light mode" : "Switch to dark mode";

  // Change headline image based on dark mode
  headlineImg.src = darkMode ? "Textures/title-dark.png" : "Textures/title.png";
  playButtonClickSound();
});

const shopButton = document.getElementById("shopButton");
const shop = document.getElementById("shop");
const closeShopBtn = shop.querySelector(".closeShop");
const shopItemsContainer = document.getElementById("shopItems");

shopButton.addEventListener("mouseenter", () => {
  playButtonHoverSound();
});

shopButton.addEventListener("click", () => {
  shop.style.display = "flex";
  playButtonClickSound();
  updateShopItems();
});

closeShopBtn.addEventListener("click", () => {
  shop.style.display = "none";
  playButtonClickSound();
});

// resizing Player for "The Cursor"
function updatePlayerImage(glove) {
  const playerImg = document.getElementById("player");
  const useDark = darkMode && glove.darkImg;

  playerImg.src = useDark ? glove.darkImg : glove.img;

  if (glove.img === "glove3.gif") {
    playerImg.style.width = "35px";
    playerImg.style.height = "auto";
  } else {
    playerImg.style.width = "80px";
    playerImg.style.height = "auto";
  }
}

function updateComboBar() {
  comboBarBlack.style.width = `${comboBlackValue * 100}%`;
  comboBarRed.style.width = `${comboRedValue * 100}%`;
}

function setupHoverEffect(elem) {
  elem.addEventListener("mouseenter", () => {
    document.getElementById("player").style.display = "none";
    document.body.style.cursor = "auto";
    elem.style.transform = "scale(1.4)";
    elem.style.transition = "transform 0.3s ease";
    elem.style.zIndex = "3000";
  });

  elem.addEventListener("mouseleave", () => {
    document.getElementById("player").style.display = "block";
    document.body.style.cursor = "none";
    elem.style.transform = "scale(1)";
    elem.style.zIndex = "2";
  });
}

function updateShopItems() {
  shopItemsContainer.innerHTML = "";
  gloves
    .filter((g) => !g.special)
    .forEach((glove, idx) => {
      const item = document.createElement("div");
      item.className = "item";

      const owned = ownedGloveIds.has(glove.id);
      const equipped = currentGloveIndex === idx;
      const affordable = totalPoints >= glove.cost;

      // --- Glove image ---
      const gloveImg = document.createElement("img");
      gloveImg.src = glove.img;
      gloveImg.style.width = "40px";
      gloveImg.style.height = "40px";
      gloveImg.style.marginRight = "10px";
      gloveImg.style.borderRadius = "8px";
      gloveImg.style.objectFit = "contain";

      // --- resizing image for "The Cursor"
      if (glove.img === "Textures/glove3.gif") {
        gloveImg.style.width = "30px";
        gloveImg.style.height = "auto";
        gloveImg.style.marginRight = "10px";
        gloveImg.style.borderRadius = "8px";
      } else {
        gloveImg.style.width = "40px";
        gloveImg.style.height = "auto";
        gloveImg.style.marginRight = "10px";
        gloveImg.style.borderRadius = "8px";
      }

      // --- Description ---
      const desc = document.createElement("div");

      // Title (Glove name)
      const nameElem = document.createElement("div");
      nameElem.textContent = glove.name;
      nameElem.style.fontWeight = "bold";

      // Subtitle (Punches per click)
      const infoElem = document.createElement("div");
      infoElem.textContent = `x${glove.punchesPerClick} Punches/Click`;
      infoElem.style.fontSize = "0.85em";
      infoElem.style.marginTop = "2px";
      infoElem.style.color = "gray";
      desc.style.height = "50px";
      desc.style.display = "flex";
      desc.style.flexDirection = "column";
      desc.style.justifyContent = "center";

      desc.appendChild(nameElem);
      desc.appendChild(infoElem);

      const price = document.createElement("span");
      price.className = "price";
      price.textContent =
        glove.cost === 0 ? "Free" : `${abbreviateNumber(glove.cost)}`;

      // --- Buy/Equip Button ---
      const btn = document.createElement("button");
      btn.className = "buyButton";

      if (equipped) {
        btn.textContent = "Equipped";
        btn.disabled = true;
      } else if (owned) {
        btn.textContent = "Equip";
        btn.disabled = false;
        btn.onclick = () => {
          currentGloveIndex = gloves.indexOf(glove);
          handleWamboScale(gloves[currentGloveIndex]);

          // Special Gloves Punch Per Click Update
          if (glove.special === "bee" || glove.special === "combo") {
            punchesPerClick = getBestPunchValue();
          } else {
            punchesPerClick = glove.punchesPerClick;
          }

          updatePlayerImage(glove);
          playEquipGloveAnimation(glove);

          updateShopItems();
        };
      } else {
        btn.textContent = "Buy";
        btn.disabled = !affordable;
        btn.onclick = () => {
          if (totalPoints >= glove.cost) {
            totalPoints -= glove.cost;
            ownedGloveIds.add(glove.id);
            currentGloveIndex = idx;
            handleWamboScale(gloves[currentGloveIndex]);
            punchesPerClick = glove.punchesPerClick;
            document.getElementById("player").src = glove.img;
            updatePlayerImage(glove);
            updateDisplay();
            updateShopItems();
            playBuyGloveAnimation(glove);
          }
        };
      }

      const leftWrapper = document.createElement("div");
      leftWrapper.style.display = "flex";
      leftWrapper.style.alignItems = "center";
      leftWrapper.appendChild(gloveImg);
      leftWrapper.appendChild(desc);

      item.appendChild(leftWrapper);
      item.appendChild(price);
      item.appendChild(btn);
      shopItemsContainer.appendChild(item);
    });

  // --- Special Gloves --- ///
  const specialHeader = document.createElement("h3");
  specialHeader.textContent = "🔒 Special Gloves";
  specialHeader.style.marginTop = "20px";
  shopItemsContainer.appendChild(specialHeader);

  [
    {
      id: 99,
      name: "Bee Glove",
      required: beeCatches,
      requiredAmount: 100,
      conditionMet: beeCatches >= 100,
    },
    {
      id: 100,
      name: "Combo Glove",
      required: giraffiKills,
      requiredAmount: 100,
      conditionMet: giraffiKills >= 100,
    },
  ].forEach((gloveInfo) => {
    const item = document.createElement("div");
    item.className = "item";

    const glove = gloves.find((g) => g.id === gloveInfo.id);
    const owned = ownedGloveIds.has(glove.id);
    const equipped = currentGloveIndex === gloves.indexOf(glove);

    // 🧤 Set label based on glove
    let label;
    if (gloveInfo.name === "Bee Glove") {
      label = "Bees caught";
    } else if (gloveInfo.name === "Combo Glove") {
      label = "Giraffi killed";
    }
    const progressText = `${label}: ${gloveInfo.required}/${gloveInfo.requiredAmount}`;

    const gloveImg = document.createElement("img");
    gloveImg.src = glove.img;
    gloveImg.style.width = "40px";
    gloveImg.style.marginRight = "10px";

    const desc = document.createElement("div");
    const nameElem = document.createElement("div");
    nameElem.textContent = glove.name;
    nameElem.style.fontWeight = "bold";

    // --- Info button for special gloves ---
    const infoBtn = document.createElement("button");
    infoBtn.textContent = "i";
    infoBtn.style.backgroundColor = "#2196F3";
    infoBtn.style.color = "white";
    infoBtn.style.border = "none";
    infoBtn.style.borderRadius = "50%";
    infoBtn.style.width = "18px";
    infoBtn.style.height = "18px";
    infoBtn.style.fontSize = "12px";
    infoBtn.style.cursor = "pointer";
    infoBtn.style.marginLeft = "6px";
    infoBtn.style.lineHeight = "16px";

    const gloveDescriptions = {
      "Bee Glove":
        "🐝 Bees appear more frequently and give 10× as many points while this glove is equipped. Punches/Click matches with the best glove owned.",
      "Combo Glove":
        "💥 Giraffi can't die while this glove is equipped. Punches/Click matches with the best glove owned.",
    };

    infoBtn.onclick = () => {
      showInfoModal(
        glove.name,
        gloveDescriptions[glove.name] || "No description available."
      );
      playButtonClickSound();
    };

    const nameWrapper = document.createElement("div");
    nameWrapper.style.display = "flex";
    nameWrapper.style.alignItems = "center";
    nameWrapper.appendChild(nameElem);
    nameWrapper.appendChild(infoBtn);

    const infoElem = document.createElement("div");
    infoElem.textContent = progressText;
    infoElem.style.fontSize = "0.85em";
    infoElem.style.marginTop = "2px";
    infoElem.style.color = "gray";

    desc.appendChild(nameWrapper);
    desc.appendChild(infoElem);

    const btn = document.createElement("button");
    btn.className = "buyButton";

    if (equipped) {
      btn.textContent = "Equipped";
      btn.disabled = true;
    } else if (owned) {
      btn.textContent = "Equip";
      btn.onclick = () => {
        currentGloveIndex = gloves.indexOf(glove);
        handleWamboScale(gloves[currentGloveIndex]);
        punchesPerClick = getBestPunchValue();
        updatePlayerImage(glove);
        updateShopItems();
        playEquipGloveAnimation(glove);
      };
    } else {
      btn.textContent = "Claim";
      btn.disabled = !gloveInfo.conditionMet;
      btn.onclick = () => {
        if (gloveInfo.conditionMet) {
          ownedGloveIds.add(glove.id);
          currentGloveIndex = gloves.indexOf(glove);
          handleWamboScale(gloves[currentGloveIndex]);
          punchesPerClick = getBestPunchValue();
          updatePlayerImage(glove);
          updateShopItems();
          playBuyGloveAnimation(glove);
        }
      };
    }

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.appendChild(gloveImg);
    left.appendChild(desc);

    item.appendChild(left);
    item.appendChild(btn);
    shopItemsContainer.appendChild(item);
  });
}

function showInfoModal(title, description) {
  document.getElementById("infoTitle").textContent = title;
  document.getElementById("infoDescription").textContent = description;
  document.getElementById("infoModal").style.display = "flex";
}

document.getElementById("closeInfoModal").onclick = () => {
  playButtonClickSound();
  document.getElementById("infoModal").style.display = "none";
};

// Close modal when clicking outside the content
document.getElementById("infoModal").addEventListener("click", (e) => {
  if (e.target.id === "infoModal") {
    document.getElementById("infoModal").style.display = "none";
  }
});

// Hide cursor on buttons outside the modal
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("mouseenter", () => {
    // Only hide cursor if info modal is not visible
    if (document.getElementById("infoModal").style.display !== "flex") {
      player.classList.add("hide-cursor-player");
    }
  });
  button.addEventListener("mouseleave", () => {
    player.classList.remove("hide-cursor-player");
  });
});

// Show cursor whenever mouse enters the info modal (anywhere inside)
const infoModal = document.getElementById("infoModal");
infoModal.addEventListener("mouseenter", () => {
  player.classList.remove("hide-cursor-player");
});
updateDisplay();
