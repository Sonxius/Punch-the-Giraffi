let totalPoints = 0;
let punches = 0;
let playerTotalApples = 0;
let playerTotalTickets = 0;
let playerTotalCoins = 0;
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
let eternityFragments = 0;
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
const ticketCount = document.getElementById("ticketCount");
const coinCount = document.getElementById("coinCount");
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
    img: "Textures/gloves/player.png",
  },
  {
    id: 2,
    name: "Sock",
    cost: 10000,
    punchesPerClick: 3,
    img: "Textures/gloves/sock_glove.png",
  },
  {
    id: 3,
    name: "Sticky Glove",
    cost: 35000,
    punchesPerClick: 7,
    img: "Textures/gloves/sticky_glove.png",
  },
  {
    id: 4,
    name: "Hirachy Glove",
    cost: 80000,
    punchesPerClick: 15,
    img: "Textures/gloves/red_thumb.png",
  },
  {
    id: 5,
    name: "Boxing Glove",
    cost: 200000,
    punchesPerClick: 25,
    img: "Textures/gloves/boxing_glove.png",
  },
  {
    id: 6,
    name: "Sponge Glove",
    cost: 450000,
    punchesPerClick: 40,
    img: "Textures/gloves/sponge_glove.png",
  },
  {
    id: 7,
    name: "Wood Glove",
    cost: 600000,
    punchesPerClick: 60,
    img: "Textures/gloves/wood_glove.png",
  },
  {
    id: 8,
    name: "Melone Glove",
    cost: 1200000,
    punchesPerClick: 80,
    img: "Textures/gloves/water_glove.png",
  },
  {
    id: 9,
    name: "Fries Glove",
    cost: 7000000,
    punchesPerClick: 100,
    img: "Textures/gloves/fries_glove.png",
  },
  {
    id: 10,
    name: "Wambo Glove",
    cost: 15000000,
    punchesPerClick: 120,
    img: "Textures/gloves/wambo_glove.png",
  },
  {
    id: 11,
    name: "Skeleton Glove",
    cost: 25000000,
    punchesPerClick: 200,
    img: "Textures/gloves/glow_glove.png",
    darkImg: "Textures/gloves/glow_glove2.png",
  },
  {
    id: 12,
    name: "Crystal Glove",
    cost: 50000000,
    punchesPerClick: 250,
    img: "Textures/gloves/crystal_glove.png",
  },
  {
    id: 13,
    name: "Lava Glove",
    cost: 120000000,
    punchesPerClick: 300,
    img: "Textures/gloves/lava_glove.png",
  },
  {
    id: 14,
    name: "Pickglove",
    cost: 300000000,
    punchesPerClick: 400,
    img: "Textures/gloves/pickglove.png",
  },
  {
    id: 15,
    name: "Duo Fists",
    cost: 700000000,
    punchesPerClick: 500,
    img: "Textures/gloves/fist2.png",
  },
  {
    id: 16,
    name: "Gaming Glove",
    cost: 1500000000,
    punchesPerClick: 600,
    img: "Textures/gloves/gaming_glove.png",
  },
  {
    id: 17,
    name: "Infinity Glove",
    cost: 5000000000,
    punchesPerClick: 700,
    img: "Textures/gloves/infinity_glove.png",
  },
  {
    id: 18,
    name: "The Cursor",
    cost: 999000000000,
    punchesPerClick: 9999,
    img: "Textures/gloves/cursor_glove.gif",
  },
  {
    id: 99,
    name: "Bee Glove",
    cost: 0,
    punchesPerClick: 0,
    img: "Textures/gloves/bee_glove.png",
    special: "bee",
  },
  {
    id: 100,
    name: "Combo Glove",
    cost: 0,
    punchesPerClick: 99,
    img: "Textures/gloves/combo_glove.png",
    special: "combo",
  },
  {
    id: 999,
    name: "Eternity",
    cost: 0,
    punchesPerClick: 99,
    img: "Textures/gloves/eternity.png",
    special: "eternity",
  }
];

let currentGloveIndex = 0;
let punchesPerClick = gloves[currentGloveIndex].punchesPerClick;
updateComboBar();

document.addEventListener("mousemove", (e) => {
  player.style.left = e.clientX + "px";
  player.style.top = e.clientY + "px";
});

// ── Effective punchesPerClick (includes points sticker boost) ──
function getEffectivePunchesPerClick() {
  const base = punchesPerClick;
  const pointsBoost = getStickerBoost("points");
  if (pointsBoost) {
    return Math.floor(base * (1 + pointsBoost));
  }
  return base;
}

function getMultiplier(clicks) {
  const stepSize = getComboStep();
  const steps = Math.floor(clicks / stepSize);
  const comboBoost = getStickerBoost("combo");
  const stepValue = comboBoost ? comboBoost : 0.5;
  return 1 + steps * stepValue;
}

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const page3 = document.getElementById("page3");
const page4 = document.getElementById("page4");
const page5 = document.getElementById("page5");
const page6 = document.getElementById("page6");
const page7 = document.getElementById("tentEntrance");
const page8 = document.getElementById("mainTent");
const page9 = document.getElementById("casino");

document.getElementById("button-next").onclick = () => {
  page1.classList.add("shift-left");
  page2.classList.add("shift-left");
};

document.getElementById("button-back").onclick = () => {
  page1.classList.remove("shift-left");
  page2.classList.remove("shift-left");
};

document.getElementById("button-next3").onclick = () => {
  page1.classList.add("shift-right");
  page6.classList.add("shift-right");
};

document.getElementById("button-back6").onclick = () => {
  page1.classList.remove("shift-right");
  page6.classList.remove("shift-right");
};

document.getElementById("button-next2").onclick = () => {
  page1.classList.add("shift-up");
  page3.classList.add("shift-up");
};

document.getElementById("button-back3").onclick = () => {
  page1.classList.remove("shift-up");
  page3.classList.remove("shift-up");
};

document.getElementById("button-left3").onclick = () => {
  page3.classList.add("shift-right");
  page4.classList.add("shift-right");
};

document.getElementById("button-back4").onclick = () => {
  page3.classList.remove("shift-right");
  page4.classList.remove("shift-right");
};

document.getElementById("button-right3").onclick = () => {
  page3.classList.add("shift-left");
  page5.classList.add("shift-left");
};

document.getElementById("button-back5").onclick = () => {
  page3.classList.remove("shift-left");
  page5.classList.remove("shift-left");
};

document.getElementById("tent-left").onclick = () => {
  page7.classList.add("shift-right");
  page9.classList.add("shift-right");
};

document.getElementById("goBackTent2").onclick = () => {
  page7.classList.remove("shift-right");
  page9.classList.remove("shift-right");
};

const buttons = document.querySelectorAll(".button");

buttons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    playButtonHoverSound();
  });
  button.addEventListener("click", () => {
    playButtonClickSound();
  });
});

const shopDiv = document.getElementById("shop");

shopDiv.addEventListener("mouseenter", () => {
  player.style.display = "none";
});

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

function handleWamboScale(glove) {
  if (glove.id === 10) {
    wamboScale = 1;
    player.style.transform = `translate(-50%, -50%) scale(${wamboScale})`;
  } else {
    wamboScale = 1;
    player.style.transform = `translate(-50%, -50%) scale(1)`;
  }
}

function playPunchSound() {
  const sound = document.getElementById("PunchSound");
  const clone = sound.cloneNode(true);
  clone.play();
}

function playBuyGloveAnimation(glove, glowColor) {
  const animContainer = document.getElementById("buyGloveAnimation");
  const animImg = document.getElementById("buyGloveImg");
  const animMsg = document.getElementById("buyGloveMessage");
  const sound = document.getElementById("buyGloveSound");

  if (animContainer.parentNode !== document.body) {
    document.body.appendChild(animContainer);
  }
  animContainer.style.zIndex = "999999";
  animContainer.style.position = "fixed";

  if (glowColor) {
    animImg.src = glove.img;
    animImg.style.filter = `drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 20px ${glowColor})`;
    animMsg.textContent = `Bought ${glove.name || glove}!`;
    animMsg.style.color = glowColor;
  } else if (gloves[currentGloveIndex] && gloves[currentGloveIndex].special) {
    animImg.src = glove.img;
    animImg.style.filter =
      "drop-shadow(0 0 8px purple) drop-shadow(0 0 15px violet)";
    animMsg.textContent = `Claimed ${glove.name}!`;
    animMsg.style.color = "purple";
  } else {
    animImg.src = glove.img || glove;
    animImg.style.filter = "";
    animMsg.textContent = `Bought ${glove.name || glove}!`;
    animMsg.style.color = "";
  }

  animContainer.style.opacity = "1";
  animContainer.style.transform = "translate(-50%, -50%) scale(1)";
  animContainer.style.animation = "none";
  animImg.style.animation = "none";

  void animContainer.offsetWidth;
  animImg.style.animation = "glowPop 0.8s ease-out forwards";
  animMsg.style.animation = "fadeInUp 0.8s ease-out forwards";

  sound.currentTime = 0;
  sound.play();

  setTimeout(() => {
    animContainer.style.opacity = "0";
    animContainer.style.transform = "translate(-50%, -50%) scale(0)";
  }, 2500);
}

function playEquipGloveAnimation(glove) {
  const animContainer = document.getElementById("buyGloveAnimation");
  const animImg = document.getElementById("buyGloveImg");
  const animMsg = document.getElementById("buyGloveMessage");
  const sound = document.getElementById("equipGloveSound");

  animImg.src = glove.img;
  animImg.style.filter = "drop-shadow(3px 3px 5px black)";

  animMsg.textContent = `Equipped ${glove.name}`;
  if (darkMode) {
    animMsg.style.color = "white";
    animMsg.style.textShadow = "1px 1px 2px black, -1px -1px 2px black";
  } else {
    animMsg.style.color = "black";
    animMsg.style.textShadow = "1px 1px 2px white, -1px -1px 2px white";
  }

  animContainer.style.opacity = "1";
  animContainer.style.transform = "translate(-50%, -50%) scale(1)";
  animContainer.style.animation = "none";
  animImg.style.animation = "none";

  void animContainer.offsetWidth;
  animImg.style.animation = "glowPop 0.8s ease-out forwards";
  animMsg.style.animation = "fadeInUp 0.8s ease-out forwards";

  sound.currentTime = 0;
  sound.play();

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

document.getElementById("plusApple").addEventListener("click", () => {
  let input = document.getElementById("appleInput");
  input.value = Math.min(playerTotalApples, parseInt(input.value) + 1);
});
document.getElementById("minusApple").addEventListener("click", () => {
  let input = document.getElementById("appleInput");
  input.value = Math.max(1, parseInt(input.value) - 1);
});

const feedButtons = document.querySelectorAll("#feedWindow button");

feedButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    playButtonHoverSound();
  });
  button.addEventListener("click", () => {
    playButtonClickSound();
  });
});

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

function startFeedEffect() {
  document.getElementById("feedEffectTimer").style.display = "block";
  document.getElementById("feedTimeLeft").textContent = feedTimeLeft;

  feedInterval = setInterval(() => {
    if (feedTimeLeft > 0) {
      feedTimeLeft--;
      document.getElementById("feedTimeLeft").textContent = feedTimeLeft;
    } else {
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
  appleInput.value = 1;
}

function getComboStep() {
  return feedActive ? 7 : 10;
}

// --- Apple Tree --- //

const tree = document.getElementById("appletree");
const treeDark = document.getElementById("appletree-dark");
const appleSpawnArea = document.getElementById("applespawn");

function spawnApple() {
  const currentApples = document.querySelectorAll(".apple-on-tree").length;
  if (currentApples >= 15) return;

  const apple = document.createElement("img");
  apple.src = "Textures/apple.png";
  apple.classList.add("apple-on-tree");
  apple.draggable = false;

  const spawnRect = appleSpawnArea.getBoundingClientRect();
  const treeRect = document.getElementById("tree").getBoundingClientRect();

  const x = Math.random() * (spawnRect.width - 110);
  const y = Math.random() * (spawnRect.height - 110);

  apple.style.left = `${(spawnRect.left - treeRect.left) + x}px`;
  apple.style.top  = `${(spawnRect.top  - treeRect.top)  + y}px`;

  apple.addEventListener("click", (e) => {
    const appleBonus = getStickerBoost("apples");
    const gained = appleBonus ? Math.ceil(1 * (1 + appleBonus)) : 1;
    playerTotalApples += gained;
    playButtonClickSound();
    apple.remove();
    updateDisplay();
    const rect = apple.getBoundingClientRect();
    showPopup(
      `+${gained} <img src="Textures/appleico.png" alt="Apple" draggable="false" style="width:40px;height:40px;vertical-align:middle;">`,
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

  document.getElementById("tree").appendChild(apple);
}

setInterval(spawnApple, 70000);

// --- Van --- //
const exitYard = document.getElementById("exitYard");
let vanAnimating = false;

function goIntoYard() {
  if (vanAnimating) return;
  vanAnimating = true;

  const van = document.getElementById("van");
  const rect = van.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const plaza = document.getElementById("page6");
  plaza.style.transformOrigin = `${centerX}px ${centerY}px`;
  plaza.style.transition = "transform 2s ease-in, opacity 0.6s ease 1.4s";
  plaza.style.transform = "scale(4)";
  plaza.style.opacity = "0";

  yard.style.opacity = "0";
  yard.style.display = "block";
  yard.style.transition = "opacity 0.6s ease 1.4s";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      yard.style.opacity = "1";
    });
  });

  plaza.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "opacity") return;
    plaza.style.transition = "";
    plaza.style.transform = "";
    plaza.style.opacity = "";
    vanAnimating = false;
  }, { once: true });

  yard.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "opacity") return;
    yard.style.transition = "";
    yard.style.opacity = "";
  }, { once: true });
}

function getOutOfYard() {
  vanAnimating = false;

  const plaza = document.getElementById("page6");

  yard.style.transition = "none";
  yard.style.opacity = "0";
  yard.style.display = "none";

  plaza.style.transition = "";
  plaza.style.transform = "";
  plaza.style.opacity = "";
  plaza.style.transformOrigin = "";
}

exitYard.addEventListener("click", getOutOfYard);
van.addEventListener("click", goIntoYard);


// --- Suspicious Shop Manual --- //
const suspiciousManual = document.getElementById("suspiciousManual");
suspiciousManual.addEventListener("click", openSuspiciousManual);

function openSuspiciousManual() {
  const overlay = document.createElement('div');
  overlay.id = 'suspiciousManualOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.65);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
  `;

  const img = document.createElement('img');
  img.src = 'Textures/suspicious_manual_page.png';
  img.style.cssText = `
    max-width: 90%;
    max-height: 90vh;
    border-radius: 8px;
    cursor: default;
    pointer-events: none;
  `;

  function closeManual() {
    document.body.removeChild(overlay);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeManual();
  });

  img.addEventListener('click', (e) => e.stopPropagation());

  overlay.appendChild(img);
  document.body.appendChild(overlay);
}

function suspiciousShop() {
  player.style.display = "none";
  updateVendingUI();

  const overlay = document.createElement('div');
  overlay.id = 'vendingMachineOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.65);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
  `;

  suspiciousShopGui.style.display = "block";
  overlay.appendChild(suspiciousShopGui);

  function closeSuspiciousShop() {
    document.body.appendChild(suspiciousShopGui);
    suspiciousShopGui.style.display = "none";
    document.body.removeChild(overlay);
    player.style.display = "block";
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSuspiciousShop();
  });

  document.body.appendChild(overlay);
}

// Elefanti
const elefanti = document.getElementById("elefanti");

function showElefantiPopUp() {
  const existing = document.getElementById('elefant-popup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.id = 'elefant-popup';
  popup.textContent = 'Talk to Elefanti';

  Object.assign(popup.style, {
    position: 'fixed',
    pointerEvents: 'none',
    fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    textShadow: '-2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black, 2px 2px 0 black',
    whiteSpace: 'nowrap',
    zIndex: '999999',
    transform: 'translate(16px, -50%)',
    transition: 'opacity 0.1s ease',
  });

  document.body.appendChild(popup);

  function onMouseMove(e) {
    popup.style.left = e.clientX + 'px';
    popup.style.top = e.clientY + 'px';
  }

  document.addEventListener('mousemove', onMouseMove);

  elefanti.addEventListener("mouseleave", () => {
    popup.remove();
  });
}

elefanti.addEventListener("mouseenter", () => {
  showElefantiPopUp();
});

elefanti.addEventListener("click", openElefantiShop);


// --- Tent --- //
const exitTent = document.getElementById("exitTent");
let tentAnimating = false;

function goIntoTent() {
  if (tentAnimating) return;
  tentAnimating = true;

  const tent = document.getElementById("tent");
  const rect = tent.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const plaza = document.getElementById("page6");
  plaza.style.transformOrigin = `${centerX}px ${centerY}px`;
  plaza.style.transition = "transform 2s ease-in, opacity 0.6s ease 1.4s";
  plaza.style.transform = "scale(4)";
  plaza.style.opacity = "0";

  tentEntrance.style.opacity = "0";
  tentEntrance.style.display = "block";
  tentEntrance.style.transition = "opacity 0.6s ease 1.4s";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      tentEntrance.style.opacity = "1";
    });
  });

  plaza.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "opacity") return;
    plaza.style.transition = "";
    plaza.style.transform = "";
    plaza.style.opacity = "";
    tentAnimating = false;
  }, { once: true });

  tentEntrance.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "opacity") return;
    tentEntrance.style.transition = "";
    tentEntrance.style.opacity = "";
  }, { once: true });
}

function getOutOfTent() {
  tentAnimating = false;
  const plaza = document.getElementById("page6");

  tentEntrance.style.transition = "none";
  tentEntrance.style.opacity = "0";
  tentEntrance.style.display = "none";

  plaza.style.transition = "";
  plaza.style.transform = "";
  plaza.style.opacity = "";
  plaza.style.transformOrigin = "";
}

exitTent.addEventListener("click", getOutOfTent);
tent.addEventListener("click", goIntoTent);


// Go in Main Tent
const goBackEntrance = document.getElementById("goBackTent");
const tentAhead = document.getElementById("tent-ahead");

function goIntoMainTent() {
  document.getElementById("tentEntrance").style.display = "none";
  mainTent.style.display = "block";
}

function getOutOfMainTent() {
  mainTent.style.display = "none";
  document.getElementById("tentEntrance").style.display = "block";
}

goBackEntrance.addEventListener("click", getOutOfMainTent);
tentAhead.addEventListener("click", goIntoMainTent);


// --- Apple Catch Game --- ///

const appleGame = document.getElementById("appleGame");
const catcher = document.getElementById("catcher");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("timeLeft");
const endScreen = document.getElementById("endScreen");
const finalScoreEl = document.getElementById("finalScore");
const goBackBtn = document.getElementById("goBackBtn");

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

  if (key === "a" || key === "d" || e.code === "Space") {
    hideMoveText();
  }
});

document.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

function startGame() {
  appleGame.style.display = "block";
  appleGame.style.cursor = "none";
  endScreen.style.display = "none";

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

  const appleBonus = getStickerBoost("apples");
  const applesGained = appleBonus ? Math.ceil(score * (1 + appleBonus)) : score;
  playerTotalApples += applesGained;

  bgMusic.pause();

  endScreen.style.display = "flex";
  finalScoreEl.textContent = `You caught ${score} apples! (+${applesGained} apples)`;

  appleGame.style.cursor = "default";

  startCooldown();
}

const quitText = document.createElement("div");
quitText.textContent = "Press SPACE to Quit";
quitText.style.position = "absolute";
quitText.style.top = "950px";
quitText.style.right = "10px";
quitText.style.fontSize = "22px";
quitText.style.fontWeight = "bold";
quitText.style.zIndex = "1000";
appleGame.appendChild(quitText);

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

goBackBtn.addEventListener("click", () => {
  endScreen.style.display = "none";
  appleGame.style.display = "none";
  updateDisplay();
});

appleGameButton.addEventListener("click", startGame);

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

  const appleBonus = getStickerBoost("apples");
  const baseApples = whackScore * 3;
  const applesGained = appleBonus ? Math.ceil(baseApples * (1 + appleBonus)) : baseApples;
  playerTotalApples += applesGained;

  wbgMusic.pause();

  whackGame.style.display = "none";
  whackEndScreen.style.display = "flex";
  page3.classList.remove("flashlight-active");

  whackFinalScore.textContent = `Score: ${whackScore}`;
  whackApples.textContent = `Apples gained: ${applesGained}`;
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

quitBtn.addEventListener("click", endWhackGame);

whackGoBack.addEventListener("click", () => {
  whackEndScreen.style.display = "none";
  startWhackCooldown();
  buttonBack3.classList.remove("hidden");
  buttonLeft3.classList.remove("hidden");
  buttonRight3.classList.remove("hidden");
  player.classList.remove("hidden");
  updateDisplay();
});

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

function showBootCountdown(callback) {
  const spawnArea = document.getElementById("officeSpawnArea");

  const bootImage = document.createElement("img");
  bootImage.src = "Textures/instructions.png";
  bootImage.style.cssText = `
        position: fixed;
        top: 60%;
        right: -100%;
        transform: translateY(-50%);
        width: 40vw;
        max-width: 1000px;
        height: auto;
        transition: right 1s ease;
        z-index: 13;
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

  setTimeout(() => {
    bootImage.style.right = "3%";
  }, 50);

  let counter = 10;
  const interval = setInterval(() => {
    bootOverlay.textContent = `Booting... ${counter}`;
    counter--;
    if (counter < 0) {
      clearInterval(interval);
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

function startOfficeTimer() {
  if (officeTimerInterval) return;
  officeTimerInterval = setInterval(() => {
    officeTime--;
    officeTimeEl.textContent = "Time: " + officeTime;
    if (officeTime <= 0) endOfficeGame();
  }, 1000);
}

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

function endOfficeGame() {
  clearInterval(officeTimerInterval);
  officeTimerInterval = null;
  clearTimeout(officeFileTimeout);

  officeGame.querySelectorAll(".office-file").forEach((f) => f.remove());
  officeGame.querySelectorAll(".qte-overlay").forEach((o) => o.remove());

  obgMusic.pause();
  obgMusic.currentTime = 0;

  const clickSound = document.getElementById("compClick");
  if (clickSound) {
    clickSound.pause();
    clickSound.currentTime = 0;
  }

  if (typeof stopBootCountdown === "function") {
    stopBootCountdown();
  }

  const appleBonus = getStickerBoost("apples");
  const baseApples = officeScore * 3;
  const applesGained = appleBonus ? Math.ceil(baseApples * (1 + appleBonus)) : baseApples;
  playerTotalApples += applesGained;

  officeGame.style.display = "none";
  officeEndScreen.style.display = "flex";

  officeFinalScore.textContent = `Score: ${officeScore}`;
  officeApples.textContent = `Apples gained: ${applesGained}`;
}

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

officeQuitBtn.addEventListener("click", endOfficeGame);
officeGoBack.addEventListener("click", () => {
  officeEndScreen.style.display = "none";
  buttonBack4.classList.remove("hidden");
  player.classList.remove("hidden");
  startOfficeCooldown();
  updateDisplay();
});

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

// --- Pie Game --- //

const pieShop = document.getElementById("pieShop");
const pieGame = document.getElementById("pieGame");
const pieQuitBtn = document.getElementById("pieQuitBtn");
const pieGameButton = document.getElementById("pieGameButton");
const exitBakery = document.getElementById("exitBakery");
const pieButtonImage = pieGameButton.querySelector("img");
const machines = document.getElementById("machines");
const machineElems = document.querySelectorAll("#machines .machine");
const pieManual = document.getElementById("pieManual");

const colorButtons = [
  document.getElementById("green"),
  document.getElementById("yellow"),
  document.getElementById("pink")
];

pieShop.addEventListener("click", goIntoBakery);
pieGameButton.addEventListener("click", startPieGame);
exitBakery.addEventListener("click", getOutOfBakery);
pieManual.addEventListener("click", openPieManual);

let pieGameActive = false;

const pieBgMusic = new Audio("Sounds/bakery_theme.mp3");
pieBgMusic.loop = true;
pieBgMusic.volume = 0.8;

function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    const clone = sound.cloneNode(true);
    clone.play();
  }
}

const playMachineSound     = () => playSound("pieMachineSound");
const playInstructionSound = () => playSound("pieInstructionSound");
const playDeploySound      = () => playSound("pieDeploySound");
const playMoveSound        = () => playSound("pieMoveSound");
const playDoughSound       = () => playSound("pieDoughSound");
const playIcingSound       = () => playSound("pieIcingSound");
const playSprinklesSound   = () => playSound("pieSprinklesSound");
const playPieSuccess       = () => playSound("buyGloveSound");
const playPieBurned        = () => playSound("pieBurnedSound");

function stopBgMusic() {
  pieBgMusic.pause();
  pieBgMusic.currentTime = 0;
}

function openPieManual() {
  player.style.display = "none";

  const overlay = document.createElement('div');
  overlay.id = 'pieManualOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.75);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
  `;

  const img = document.createElement('img');
  img.src = 'Textures/pie_manual_page.png';
  img.style.cssText = `
    max-width: 90%;
    max-height: 90vh;
    border-radius: 8px;
    cursor: default;
    pointer-events: none;
  `;

  function closeManual() {
    document.body.removeChild(overlay);
    player.style.display = "block";
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeManual();
  });

  img.addEventListener('click', (e) => e.stopPropagation());

  overlay.appendChild(img);
  document.body.appendChild(overlay);
}

function updatePieButtonState() {
  if (pieGameButton.disabled) {
    pieButtonImage.style.filter = "grayscale(100%)";
  } else {
    pieButtonImage.style.filter = "none";
  }
}

function setColorButtonsEnabled(enabled) {
  colorButtons.forEach(btn => {
    btn.disabled = !enabled;
    btn.style.opacity = enabled ? "1" : "0.4";
    btn.style.pointerEvents = enabled ? "auto" : "none";
  });
}

let bakeryAnimating = false;

function goIntoBakery() {
  if (bakeryAnimating) return;
  bakeryAnimating = true;

  const pieShop = document.getElementById("pieShop");
  const rect = pieShop.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const plaza = document.getElementById("page6");
  plaza.style.transformOrigin = `${centerX}px ${centerY}px`;
  plaza.style.transition = "transform 2s ease-in, opacity 0.6s ease 1.4s";
  plaza.style.transform = "scale(4)";
  plaza.style.opacity = "0";

  bakery.style.opacity = "0";
  bakery.style.display = "block";
  bakery.style.transition = "opacity 0.6s ease 1.4s";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bakery.style.opacity = "1";
    });
  });

  plaza.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "opacity") return;
    plaza.style.transition = "";
    plaza.style.transform = "";
    plaza.style.opacity = "";
    bakeryAnimating = false;
  }, { once: true });

  bakery.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "opacity") return;
    bakery.style.transition = "";
    bakery.style.opacity = "";
  }, { once: true });
}

function getOutOfBakery() {
  bakeryAnimating = false;
  const plaza = document.getElementById("page6");

  bakery.style.transition = "none";
  bakery.style.opacity = "0";
  bakery.style.display = "none";

  plaza.style.transition = "";
  plaza.style.transform = "";
  plaza.style.opacity = "";
  plaza.style.transformOrigin = "";
}

let timerPaused = false;

function showPieInstruction(callback) {
  if (!pieGameActive) return;

  playInstructionSound();

  function randomVariant(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  const doughVariant = randomVariant(3);
  const icingVariant = randomVariant(3);
  const sprinklesVariant = randomVariant(3);

  targetPie = { dough: doughVariant, icing: icingVariant, sprinkles: sprinklesVariant };
  timerPaused = true;

  const pieinstruction = document.createElement("div");
  pieinstruction.style.cssText = `
    position: fixed;
    top: 65%;
    right: -100%;
    transform: translateY(-50%);
    width: 35vw;
    max-width: 1000px;
    transition: right 1s ease;
    z-index: 1001;
    pointer-events: none;
    filter: drop-shadow(0px 3px 6px black);
  `;

  const instructionImg = document.createElement("img");
  instructionImg.src = `Textures/girafficook.png`;
  instructionImg.style.cssText = `width:100%;height:auto;display:block;`;

  const pie = document.createElement("div");
  pie.style.cssText = `
    position:absolute;
    bottom:67%;
    right:40%;
    width:45%;
    height:auto;
  `;

  const dough = document.createElement("img");
  dough.src = `Textures/pie/dough_${doughVariant}.png`;
  const icing = document.createElement("img");
  icing.src = `Textures/pie/icing_${icingVariant}.png`;
  const sprinkles = document.createElement("img");
  sprinkles.src = `Textures/pie/sprinkles_${sprinklesVariant}.png`;

  [dough, icing, sprinkles].forEach(layer => {
    layer.style.cssText = `position:absolute;width:100%;left:0;top:0;`;
    pie.appendChild(layer);
  });

  pieinstruction.appendChild(instructionImg);
  pieinstruction.appendChild(pie);
  document.body.appendChild(pieinstruction);

  setTimeout(() => { pieinstruction.style.right = "-2%"; }, 50);

  const timeout = setTimeout(() => {
    pieinstruction.style.right = "-100%";
    setTimeout(() => {
      pieinstruction.remove();
      timerPaused = false;
      if (callback) callback();
    }, 1000);
  }, 3000);

  window.stopPieInstruction = function () {
    clearTimeout(timeout);
    timerPaused = false;
    if (pieinstruction && pieinstruction.parentNode) pieinstruction.remove();
  };
}

let currentPie = null;
let currentStage = "dough";
let targetPie = null;
let pieTimerInterval = null;

function spawnMachineParticles(machineId, color, type) {
  const machine = document.getElementById(machineId);
  if (!machine) return;

  const rect = machine.getBoundingClientRect();
  const gameRect = document.getElementById("pieGame").getBoundingClientRect();

  const originX = rect.left - gameRect.left + rect.width / 2;
  const originY = rect.top - gameRect.top + rect.height / 1;

  const colorMap = {
    1: { dough: "#729767", icing: "#A8F39F", sprinkles: "#65EA4C" },
    2: { dough: "#FEFFA1", icing: "#FFB54E", sprinkles: "#FFF33F" },
    3: { dough: "#FF59AB", icing: "#B37BAE", sprinkles: "#FF2D8A" }
  };

  const col = colorMap[color][type];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");

    const angle = (360 / count) * i + Math.random() * 20 - 10;
    const dist = 60 + Math.random() * 60;
    const rad = (angle * Math.PI) / 180;
    const px = Math.cos(rad) * dist;
    const py = Math.sin(rad) * dist;
    const duration = 0.5 + Math.random() * 0.4;
    const delay = Math.random() * 0.15;
    const size = 14 + Math.random() * 10;

    particle.style.cssText = `
      position: absolute;
      left: ${originX}px;
      top: ${originY}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
      z-index: 1010;
      --px: ${px}px;
      --py: ${py}px;
      animation: particleFly ${duration}s ease-out ${delay}s forwards;
    `;

    if (type === "dough") {
      particle.style.background = col;
      particle.style.borderRadius = "60% 40% 55% 45% / 50% 60% 40% 50%";
      particle.style.boxShadow = `0 0 4px ${col}`;
    } else if (type === "icing") {
      particle.style.background = col;
      particle.style.borderRadius = "50% 50% 50% 0% / 50% 50% 0% 50%";
      particle.style.transform = `rotate(${angle}deg)`;
      particle.style.boxShadow = `0 0 6px ${col}, 0 0 10px white`;
      const shine = document.createElement("div");
      shine.style.cssText = `
        position: absolute;
        top: 20%;
        left: 20%;
        width: 35%;
        height: 35%;
        background: rgba(255,255,255,0.7);
        border-radius: 50%;
      `;
      particle.appendChild(shine);
    } else if (type === "sprinkles") {
      particle.style.width = `${size * 0.5}px`;
      particle.style.height = `${size * 1.6}px`;
      particle.style.background = col;
      particle.style.borderRadius = "3px";
      particle.style.transform = `rotate(${Math.random() * 360}deg)`;
      particle.style.boxShadow = `0 0 3px rgba(0,0,0,0.3)`;
    }

    document.getElementById("pieGame").appendChild(particle);

    setTimeout(() => { particle.remove(); }, (duration + delay + 0.1) * 1000);
  }
}

function chooseColor(color) {
  if (!currentPie) return;

  const pie = document.getElementById("pie");

  if (currentStage === "dough") {
    currentPie.dough = color;
    const base = document.getElementById("pieBase");
    if (base) base.remove();
    const img = document.createElement("img");
    img.src = `Textures/pie/dough_${color}.png`;
    img.style.cssText = `position:absolute;width:100%;left:0;top:0;`;
    pie.insertBefore(img, pie.firstChild);
    spawnMachineParticles("doughmachine", color, "dough");
    playDoughSound();
    setColorButtonsEnabled(false);
    moveToIcingMachine();
    setTimeout(() => setColorButtonsEnabled(true), 1000);
  }
  else if (currentStage === "icing") {
    currentPie.icing = color;
    const img = document.createElement("img");
    img.src = `Textures/pie/icing_${color}.png`;
    img.style.cssText = `position:absolute;width:100%;left:0;top:0;`;
    pie.appendChild(img);
    spawnMachineParticles("icingmachine", color, "icing");
    playIcingSound();
    setColorButtonsEnabled(false);
    moveToSprinkleMachine();
    setTimeout(() => setColorButtonsEnabled(true), 1000);
  }
  else if (currentStage === "sprinkles") {
    currentPie.sprinkles = color;
    const img = document.createElement("img");
    img.src = `Textures/pie/sprinkles_${color}.png`;
    img.style.cssText = `position:absolute;width:100%;left:0;top:0;`;
    pie.appendChild(img);
    spawnMachineParticles("sprinklesmachine", color, "sprinkles");
    playSprinklesSound();
    moveToOven();
  }
}

function spawnPie() {
  if (!pieGameActive) return;
  currentPie = { dough: 0, icing: 0, sprinkles: 0 };
  setColorButtonsEnabled(false);

  playDeploySound();

  const pie = document.createElement("div");
  pie.id = "pie";
  pie.style.cssText = `
    position: absolute;
    top: 25%;
    left: 0%;
    width: 260px;
    transition: top 1s linear, left 1s linear;
    z-index: 1002;
    pointer-events: none;
  `;

  const base = document.createElement("img");
  base.id = "pieBase";
  base.src = `Textures/pie/stage0.png`;
  base.style.cssText = `position:absolute;width:100%;left:0;top:0;`;
  pie.appendChild(base);

  document.getElementById("pieGame").appendChild(pie);

  setTimeout(() => { pie.style.top = "58%"; }, 50);
  setTimeout(() => {
    moveToDoughMachine();
    setTimeout(() => { setColorButtonsEnabled(true); }, 1000);
  }, 1050);
}

function moveToDoughMachine() {
  const pie = document.getElementById("pie");
  pie.style.left = "20%";
  currentStage = "dough";
  playMoveSound();
}

function moveToIcingMachine() {
  const pie = document.getElementById("pie");
  pie.style.left = "38%";
  currentStage = "icing";
  playMoveSound();
}

function moveToSprinkleMachine() {
  const pie = document.getElementById("pie");
  pie.style.left = "58%";
  currentStage = "sprinkles";
  playMoveSound();
}

function moveToOven() {
  const pie = document.getElementById("pie");
  setColorButtonsEnabled(false);
  pie.style.left = "75%";
  playMoveSound();

  setTimeout(() => {
    pie.style.visibility = "hidden";
    checkPie();
  }, 810);
}

colorButtons[0].onclick = () => chooseColor(1);
colorButtons[1].onclick = () => chooseColor(2);
colorButtons[2].onclick = () => chooseColor(3);

function showResultPie(correct) {
  const existing = document.getElementById("pieResult");
  if (existing) existing.remove();

  const result = document.createElement("div");
  result.id = "pieResult";
  result.style.cssText = `
    position: absolute;
    bottom: 0%;
    right: -1%;
    width: 380px;
    height: 380px;
    z-index: 1003;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  `;

  if (correct) {
    result.classList.add("pie-correct-glow");
    const layers = [
      `Textures/pie/dough_${currentPie.dough}.png`,
      `Textures/pie/icing_${currentPie.icing}.png`,
      `Textures/pie/sprinkles_${currentPie.sprinkles}.png`
    ];
    layers.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.style.cssText = `position:absolute;width:100%;left:0;top:0;`;
      result.appendChild(img);
    });
    playPieSuccess();
  } else {
    const burned = document.createElement("img");
    burned.src = "Textures/pie/burned.png";
    burned.style.cssText = `position:absolute;width:100%;left:0;top:0;`;
    result.appendChild(burned);
    playPieBurned();
  }

  document.getElementById("pieGame").appendChild(result);
  setTimeout(() => { result.style.opacity = "1"; }, 50);

  setTimeout(() => {
    result.style.opacity = "0";
    setTimeout(() => {
      result.remove();
      const pie = document.getElementById("pie");
      if (pie) pie.remove();
      showPieInstruction(() => { spawnPie(); });
    }, 400);
  }, 1500);
}

function checkPie() {
  const correct =
    currentPie.dough === targetPie.dough &&
    currentPie.icing === targetPie.icing &&
    currentPie.sprinkles === targetPie.sprinkles;

  if (correct) {
    score++;
    document.getElementById("pieScore").innerText = "Score: " + score;
  }

  showResultPie(correct);
}

function startTimer() {
  timeLeft = 60;
  document.getElementById("pieTime").innerText = "Time: " + timeLeft;

  pieTimerInterval = setInterval(() => {
    if (timerPaused) return;
    timeLeft--;
    document.getElementById("pieTime").innerText = "Time: " + timeLeft;

    if (timeLeft <= 0) {
      clearInterval(pieTimerInterval);
      pieTimerInterval = null;
      const coinBonus = getStickerBoost("coins");
      const coinsEarned = coinBonus ? Math.ceil(score * (1 + coinBonus)) : score;
      playerTotalCoins += coinsEarned;
      updateDisplay();
      endPieGame(true);
    }
  }, 1000);
}

function showPieEndScreen() {
  const leftoverPie = document.getElementById("pie");
  if (leftoverPie) leftoverPie.remove();

  const coinBonus = getStickerBoost("coins");
  const coinsEarned = coinBonus ? Math.ceil(score * (1 + coinBonus)) : score;

  document.getElementById("pieFinalScore").textContent = `Score: ${score}`;
  document.getElementById("pieCoinsEarned").textContent = `🪙 Coins earned: ${coinsEarned}`;
  document.getElementById("pieTotalCoins").textContent = `Total Coins: ${playerTotalCoins}`;

  const endScreen = document.getElementById("pieEndScreen");
  endScreen.style.display = "flex";

  document.getElementById("pieEndCloseBtn").addEventListener("click", () => {
    endScreen.style.display = "none";
    pieGame.style.display = "none";
    machineElems.forEach(machine => machine.classList.remove("show"));
  }, { once: true });
}

function startPieGame() {
  playerTotalTickets--;
  updateDisplay();
  pieGameActive = true;

  score = 0;
  document.getElementById("pieScore").innerText = "Score: 0";
  document.getElementById("pieTime").innerText = "Time: 60";

  pieGame.style.display = "block";
  setColorButtonsEnabled(false);

  playMachineSound();
  pieBgMusic.play();

  setTimeout(() => {
    machineElems.forEach(machine => machine.classList.add("show"));
  }, 50);

  setTimeout(() => {
    showPieInstruction(() => { spawnPie(); });
  }, 900);

  startTimer();
}

function endPieGame(showEndScreen = false) {
  pieGameActive = false;

  if (pieTimerInterval) {
    clearInterval(pieTimerInterval);
    pieTimerInterval = null;
  }

  timerPaused = false;

  stopBgMusic();
  const soundIds = [
    "pieInstructionSound", "pieDeploySound", "pieMoveSound",
    "pieDoughSound", "pieIcingSound", "pieSprinklesSound",
    "buyGloveSound", "pieBurnedSound"
  ];
  soundIds.forEach(id => {
    const sound = document.getElementById(id);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  });

  if (typeof window.stopPieInstruction === "function") window.stopPieInstruction();

  const manualOverlay = document.getElementById("pieManualOverlay");
  if (manualOverlay) manualOverlay.remove();

  const leftoverPie = document.getElementById("pie");
  if (leftoverPie) leftoverPie.remove();

  const leftoverResult = document.getElementById("pieResult");
  if (leftoverResult) leftoverResult.remove();

  document.querySelectorAll("#pieGame div[style*='particleFly']").forEach(p => p.remove());

  currentPie = null;
  currentStage = "dough";
  setColorButtonsEnabled(false);

  if (showEndScreen) {
    showPieEndScreen();
  } else {
    machineElems.forEach(machine => machine.classList.remove("show"));
    setTimeout(() => { pieGame.style.display = "none"; }, 500);
  }
}

pieQuitBtn.addEventListener("click", () => {
  const coinBonus = getStickerBoost("coins");
  const coinsEarned = coinBonus ? Math.ceil(score * (1 + coinBonus)) : score;
  playerTotalCoins += coinsEarned;
  updateDisplay();
  endPieGame(true);
});


// --- Vending Machine --- //
const vendingMachine = document.getElementById("vendingMachine");
const vendingMachineGui = document.getElementById("vendingMachineGui");
const stickerManual = document.getElementById("stickerManual");

const PACK_COSTS = { stickerPack1: 20, stickerPack2: 50, stickerPack3: 100 };

stickerManual.addEventListener("click", openStickerManual);

let coinsInMachine = 0;
let coinInsertAmount = 1;

const coinCursorStyle = document.createElement('style');
coinCursorStyle.textContent = `
  #coinInsert, #coinInsert * {
    cursor: none !important;
  }
`;
document.head.appendChild(coinCursorStyle);

const coinFollower = document.createElement('img');
coinFollower.src = 'Textures/coin.png';
coinFollower.style.cssText = `
  position: fixed;
  width: 65px;
  height: 65px;
  pointer-events: none;
  z-index: 99999;
  display: none;
  transform: translate(-50%, -50%);
`;
document.body.appendChild(coinFollower);

const coinTooltip = document.createElement('div');
coinTooltip.id = 'coinInsertTooltip';
coinTooltip.style.cssText = `
  position: fixed;
  display: none;
  background: rgba(0,0,0,0.8);
  color: #FFD700;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 99999;
  white-space: nowrap;
`;
document.body.appendChild(coinTooltip);

const machineCoinsDisplay = document.createElement('div');
machineCoinsDisplay.id = 'machineCoinsDisplay';
machineCoinsDisplay.style.cssText = `
  position: absolute;
  left: 50%;
  top: 3%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.7);
  color: #FFD700;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  z-index: 10;
  pointer-events: none;
`;
vendingMachineGui.appendChild(machineCoinsDisplay);

function openStickerManual() {
  const overlay = document.createElement('div');
  overlay.id = 'stickerManualOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.75);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
  `;

  const img = document.createElement('img');
  img.src = 'Textures/sticker_manual_page.png';
  img.style.cssText = `
    max-width: 90%;
    max-height: 90vh;
    border-radius: 8px;
    cursor: default;
    pointer-events: none;
  `;

  function closeManual() {
    document.body.removeChild(overlay);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeManual();
  });

  img.addEventListener('click', (e) => e.stopPropagation());

  overlay.appendChild(img);
  document.body.appendChild(overlay);
}

function updateCoinTooltip(e) {
  coinTooltip.textContent = `Insert: ${coinInsertAmount} coin${coinInsertAmount !== 1 ? 's' : ''}`;
  coinTooltip.style.left = (e.clientX + 24) + 'px';
  coinTooltip.style.top = (e.clientY - 8) + 'px';
}

function updateVendingUI() {
  machineCoinsDisplay.textContent = `Machine: ${coinsInMachine} 🪙 | Wallet: ${playerTotalCoins} 🪙`;

  for (const [packId, baseCost] of Object.entries(PACK_COSTS)) {
    const btn = document.getElementById(packId);
    if (!btn) continue;
    const img = btn.querySelector('img');
    const discounted = applyDiscount(baseCost);
    const canAfford = coinsInMachine >= discounted;

    img.style.filter = canAfford ? 'none' : 'grayscale(100%) brightness(0.6)';
    img.style.transition = 'filter 0.2s ease';
    btn.disabled = !canAfford;
    btn.style.cursor = canAfford ? 'pointer' : 'not-allowed';
    btn.style.pointerEvents = canAfford ? 'auto' : 'none';

    let label = btn.querySelector('.pack-cost-label');
    if (!label) {
      label = document.createElement('span');
      label.className = 'pack-cost-label';
      label.style.cssText = `
        position: absolute;
        bottom: -18px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.75);
        color: #FFD700;
        font-size: 10px;
        padding: 2px 5px;
        border-radius: 4px;
        white-space: nowrap;
        pointer-events: none;
      `;
      btn.appendChild(label);
    }
    const disc = getDiscount();
    label.textContent = disc > 0 ? `${discounted} 🪙 (−20%)` : `${baseCost} 🪙`;
    label.style.color = disc > 0 ? "#ffd740" : "#FFD700";
  }
}

function addRetrieveCoinsButton() {
  if (document.getElementById('retrieveCoinsBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'retrieveCoinsBtn';
  btn.textContent = '↩ Retrieve Coins';
  btn.style.cssText = `
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: #222;
    color: #FFD700;
    border: 1px solid #FFD700;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    z-index: 10;
    white-space: nowrap;
  `;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    playerTotalCoins += coinsInMachine;
    coinsInMachine = 0;
    updateVendingUI();
    updateDisplay();
  });
  vendingMachineGui.appendChild(btn);
}

function playCoinInsertSound() {
  const audio = new Audio("Sounds/coin_insert.mp3");
  audio.volume = 0.7;
  audio.play().catch(() => {});
}

function setupCoinInsert() {
  const coinInsert = document.getElementById('coinInsert');

  coinInsert.addEventListener('mouseenter', (e) => {
    coinFollower.style.display = 'block';
    updateCoinTooltip(e);
    coinTooltip.style.display = 'block';
  });

  coinInsert.addEventListener('mouseleave', () => {
    coinFollower.style.display = 'none';
    coinTooltip.style.display = 'none';
  });

  coinInsert.addEventListener('mousemove', (e) => {
    coinFollower.style.left = e.clientX + 'px';
    coinFollower.style.top = e.clientY + 'px';
    updateCoinTooltip(e);
  });

  coinInsert.addEventListener('wheel', (e) => {
    e.preventDefault();
    const steps = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100];
    let idx = steps.indexOf(coinInsertAmount);
    if (idx === -1) idx = 0;
    if (e.deltaY < 0) {
      idx = Math.min(idx + 1, steps.length - 1);
    } else {
      idx = Math.max(idx - 1, 0);
    }
    coinInsertAmount = steps[idx];
    updateCoinTooltip(e);
  }, { passive: false });

  coinInsert.addEventListener('click', (e) => {
    e.stopPropagation();
    const toInsert = Math.min(coinInsertAmount, playerTotalCoins);
    if (toInsert <= 0) return;
    playerTotalCoins -= toInsert;
    coinsInMachine += toInsert;
    playCoinInsertSound();
    updateVendingUI();
    updateDisplay();
  });
}

function setupPackButtons() {
  ["stickerPack1", "stickerPack2", "stickerPack3"].forEach(packId => {
    const btn = document.getElementById(packId);
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const cost = applyDiscount(PACK_COSTS[packId]);
      if (coinsInMachine < cost) {
        showComboMessage("Not enough coins in machine!", 1500);
        return;
      }
      openPack(packId);
    });
  });
}

function VendingMachine() {
  player.style.display = "none";
  updateVendingUI();

  const overlay = document.createElement('div');
  overlay.id = 'vendingMachineOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.75);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
  `;

  coinsInMachine = 0;
  coinInsertAmount = 1;

  vendingMachineGui.style.display = "block";
  overlay.appendChild(vendingMachineGui);

  updateVendingUI();
  addRetrieveCoinsButton();

  function closeVending() {
    coinFollower.style.display = 'none';
    coinTooltip.style.display = 'none';
    document.body.appendChild(vendingMachineGui);
    vendingMachineGui.style.display = "none";
    document.body.removeChild(overlay);
    player.style.display = "block";
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      playerTotalCoins += coinsInMachine;
      coinsInMachine = 0;
      updateVendingUI();
      updateDisplay();
      closeVending();
    }
  });

  document.body.appendChild(overlay);
}

setupCoinInsert();
setupPackButtons();

vendingMachine.addEventListener('click', VendingMachine);


// --- Slot Machine --- //

const slotMachineGui = document.getElementById("slotMachineGui");
const slotMachine = document.getElementById("slotMachine");
const slotResultMsg = document.createElement('div');
slotResultMsg.id = 'slotResultMessage';
document.body.appendChild(slotResultMsg);

const SLOT_SYMBOLS = [
  "bear", "burger", "cactus", "cd", "chicken", "cookie",
  "donut", "gum", "ice", "key", "moonhead", "mushroom", 
  "nugget", "peanut", "rubber"
];

let slotCoinsInMachine = 0;
let slotCoinInsertAmount = 10;
let slotSpinning = false;

function showSlotResult(html, duration = 2800) {
  slotResultMsg.innerHTML = html;
  slotResultMsg.classList.add('show');
  clearTimeout(slotResultMsg._hideTimer);
  slotResultMsg._hideTimer = setTimeout(() => {
    slotResultMsg.classList.remove('show');
  }, duration);
}

// Inject slot cursor-none style
(function() {
  const style = document.createElement('style');
  style.textContent = `#slotCoinInsert, #slotCoinInsert * { cursor: none !important; }`;
  document.head.appendChild(style);
})();

// Coin follower for slot machine
const slotCoinFollower = document.createElement('img');
slotCoinFollower.id = 'slotCoinFollower';
slotCoinFollower.src = 'Textures/coin.png';
slotCoinFollower.style.cssText = `
  position: fixed; width: 65px; height: 65px;
  pointer-events: none; z-index: 99999; display: none;
  transform: translate(-50%, -50%);
`;
document.body.appendChild(slotCoinFollower);

// Tooltip for slot machine
const slotCoinTooltip = document.createElement('div');
slotCoinTooltip.id = 'slotCoinTooltip';
slotCoinTooltip.style.cssText = `
  position: fixed; display: none;
  background: rgba(0,0,0,0.8); color: #FFD700;
  padding: 4px 8px; border-radius: 4px; font-size: 12px;
  pointer-events: none; z-index: 99999; white-space: nowrap;
`;
document.body.appendChild(slotCoinTooltip);

function updateSlotTooltip(e) {
  slotCoinTooltip.textContent = `Insert: ${slotCoinInsertAmount} coin${slotCoinInsertAmount !== 1 ? 's' : ''}`;
  slotCoinTooltip.style.left = (e.clientX + 24) + 'px';
  slotCoinTooltip.style.top = (e.clientY - 8) + 'px';
}

function formatSlotDisplay(coins) {
  return String(Math.min(Math.max(coins, 0), 100)).padStart(3, '0');
}

function updateSlotDisplay() {
  const display = document.getElementById("slotCoinNumber");
  if (!display) return;
  const text = formatSlotDisplay(slotCoinsInMachine);

  // Inject Press Start 2P font if not already present
  if (!document.getElementById('pressStart2PFont')) {
    const link = document.createElement('link');
    link.id = 'pressStart2PFont';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    document.head.appendChild(link);
  }

  display.innerHTML = '';
  display.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 4px;
    box-sizing: border-box;
    top: 3%;
    left: 2.3%;
  `;
  text.split('').forEach(d => {
    const span = document.createElement('span');
    span.textContent = d;
    span.style.cssText = `
      font-family: 'Press Start 2P', monospace;
      font-size: 28px;
      color: #ff2200;
      text-shadow: 0 0 8px #ff4400, 0 0 2px #ff0000, 0 0 18px #ff220077;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 100%;
      text-align: center;
      line-height: 1;
      image-rendering: pixelated;
    `;
    display.appendChild(span);
  });
}

function updateSlotLeverState() {
  const lever = document.getElementById("slotLever");
  if (!lever) return;
  const canPull = !slotSpinning && slotCoinsInMachine > 0;
  lever.disabled = !canPull;
  lever.style.pointerEvents = canPull ? 'auto' : 'none';
}

function setupSlotCoinInsert() {
  const coinInsertBtn = document.getElementById("slotCoinInsert");
  if (!coinInsertBtn) return;

  coinInsertBtn.addEventListener('mouseenter', (e) => {
    if (slotSpinning) return;
    slotCoinFollower.style.display = 'block';
    updateSlotTooltip(e);
    slotCoinTooltip.style.display = 'block';
  });

  coinInsertBtn.addEventListener('mouseleave', () => {
    slotCoinFollower.style.display = 'none';
    slotCoinTooltip.style.display = 'none';
  });

  coinInsertBtn.addEventListener('mousemove', (e) => {
    slotCoinFollower.style.left = e.clientX + 'px';
    slotCoinFollower.style.top = e.clientY + 'px';
    updateSlotTooltip(e);
  });

  coinInsertBtn.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (slotSpinning) return;
    const steps = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    let idx = steps.indexOf(slotCoinInsertAmount);
    if (idx === -1) idx = 0;
    if (e.deltaY < 0) idx = Math.min(idx + 1, steps.length - 1);
    else idx = Math.max(idx - 1, 0);
    slotCoinInsertAmount = steps[idx];
    updateSlotTooltip(e);
  }, { passive: false });

  coinInsertBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (slotSpinning) return;
    const maxInsert = 100 - slotCoinsInMachine;
    const toInsert = Math.min(slotCoinInsertAmount, playerTotalCoins, maxInsert);
    if (toInsert <= 0) return;
    playerTotalCoins -= toInsert;
    slotCoinsInMachine += toInsert;
    const audio = new Audio("Sounds/slotmachine_coin_insert.mp3");
    audio.volume = 0.7;
    audio.play().catch(() => {});
    updateSlotDisplay();
    updateSlotLeverState();
    updateDisplay();
  });
}

function setupSlotLever() {
  const lever = document.getElementById("slotLever");
  if (!lever) return;
  const offImg = lever.querySelector('img.off');
  const onImg = lever.querySelector('img.on');

  // Set initial state
  if (offImg) offImg.style.display = 'block';
  if (onImg) onImg.style.display = 'none';

  lever.addEventListener('click', (e) => {
    e.stopPropagation();
    if (slotSpinning || slotCoinsInMachine <= 0) return;

    // Switch to ON image
    if (offImg) offImg.style.display = 'none';
    if (onImg) onImg.style.display = 'block';

    const leverSound = new Audio("Sounds/slot_lever.mp3");
    leverSound.volume = 0.8;
    leverSound.play().catch(() => {});

    slotSpinning = true;
    updateSlotLeverState();

    // Disable coin insert during spin
    const coinInsertBtn = document.getElementById("slotCoinInsert");
    if (coinInsertBtn) {
      coinInsertBtn.style.opacity = '0.4'
      coinInsertBtn.style.pointerEvents = 'none';
    }
    // Hide coin follower
    slotCoinFollower.style.display = 'none';
    slotCoinTooltip.style.display = 'none';

    startSlotSpin((winType) => {
      // Re-enable
      slotSpinning = false;
      if (offImg) offImg.style.display = 'block';
      if (onImg) onImg.style.display = 'none';
      if (coinInsertBtn) {
        coinInsertBtn.style.pointerEvents = 'auto';
        coinInsertBtn.style.opacity = '1';
      }

      // Handle win/lose payout
      if (winType === 'jackpot') {
        const winAmount = slotCoinsInMachine * 5;
        playerTotalCoins += winAmount;
        slotCoinsInMachine = 0;
        showSlotResult(`JACKPOT! You won <span style="color:gold;">${winAmount} 🪙</span>!`, 3000);
      } else if (winType === 'two') {
        const winAmount = Math.ceil(slotCoinsInMachine * 2);
        playerTotalCoins += winAmount;
        slotCoinsInMachine = 0;
        showSlotResult(`You won <span style="color:gold;">${winAmount} 🪙</span>!`, 3000);
      } else {
        slotCoinsInMachine = 0;
        showSlotResult(`Lost it all! Better luck next time.`, 2500);
      }

      updateSlotDisplay();
      updateSlotLeverState();
      updateDisplay();
    });
  });
}

function buildSlotReels() {
  const colIds = ["column1", "column2", "column3"];
  colIds.forEach(id => {
    const col = document.getElementById(id);
    if (!col) return;
    col.style.cssText = `
      flex: 1;
      height: 100%;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    `;
    // Show a placeholder symbol
    col.innerHTML = '';
    const placeholder = document.createElement('img');
    placeholder.src = `Textures/slot_machine_symbols/${SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]}.png`;
    placeholder.draggable = false;
    placeholder.style.cssText = 'width:90px;height:90px;object-fit:contain;opacity:0.5;';
    col.appendChild(placeholder);
  });
}

function startSlotSpin(onDone) {
  const colIds = ["column1", "column2", "column3"];
  const ITEM_H = 110; // symbol height
  const VISIBLE = 3;  // visible rows in window
  const SPIN_EXTRA = 22; // extra symbols before the result

  // Determine results
  const results = [
    SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
    SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
    SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
  ];

  // ~15% jackpot chance (all three match)
  if (Math.random() < 0.15) {
    results[1] = results[0];
    results[2] = results[0];
  }

  const isJackpot = results[0] === results[1] && results[1] === results[2];
  const isTwoMatch = !isJackpot && (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]);
  const isAnyWin = isJackpot || isTwoMatch;

  // Play spinning sound
  const spinSound = new Audio("Sounds/slot_machine.mp3");
  spinSound.loop = true;
  spinSound.volume = 0.6;
  spinSound.play().catch(() => {});

  const stopDelays = [4500, 5000, 5400]; // ms each column stops
  let stoppedCount = 0;

  colIds.forEach((id, colIdx) => {
    const col = document.getElementById(id);
    if (!col) return;

    col.innerHTML = '';
    col.style.overflow = 'hidden';
    col.style.height = (ITEM_H * VISIBLE) + 'px';
    col.style.position = 'relative';

    // Build symbol list for this reel
    const totalSymbols = SPIN_EXTRA + VISIBLE + 2;
    const symbolList = [];
    for (let i = 0; i < totalSymbols; i++) {
      symbolList.push(SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
    }
    // Place result in the middle of the visible window after stopping
    // When translateY = -(SPIN_EXTRA * ITEM_H), item at index SPIN_EXTRA+1 is in center
    symbolList[SPIN_EXTRA + 1] = results[colIdx];

    // Build strip
    const strip = document.createElement('div');
    strip.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      will-change: transform;
      transform: translateY(0);
    `;

    symbolList.forEach(sym => {
      const img = document.createElement('img');
      img.src = `Textures/slot_machine_symbols/${sym}.png`;
      img.draggable = false;
      img.style.cssText = `
        width: 90px;
        height: ${ITEM_H}px;
        object-fit: contain;
        flex-shrink: 0;
        display: block;
        pointer-events: none;
        user-select: none;
      `;
      img.onerror = () => {
        img.style.background = '#444';
        img.style.borderRadius = '8px';
      };
      strip.appendChild(img);
    });

    col.appendChild(strip);

    const targetY = -(SPIN_EXTRA * ITEM_H);
    const duration = stopDelays[colIdx];
    const startTime = performance.now();

    function easeOutQuint(t) { return 1 - Math.pow(1 - t, 5); }

    function animate(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutQuint(t);
      strip.style.transform = `translateY(${targetY * eased}px)`;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        strip.style.transform = `translateY(${targetY}px)`;
        stoppedCount++;

        if (stoppedCount === 3) {
          // All reels stopped
          spinSound.pause();
          spinSound.currentTime = 0;

          const resultSoundSrc = isJackpot ? "Sounds/slot_jackpot.mp3" : isAnyWin ? "Sounds/slot_win.mp3" : "Sounds/slot_lose.mp3";
          const resultSound = new Audio(resultSoundSrc);
          resultSound.volume = 0.8;
          resultSound.play().catch(() => {});

          // Highlight winning symbols
          if (isAnyWin) {
            colIds.forEach((cid, i) => {
              const c = document.getElementById(cid);
              if (!c) return;
              // For two-match, only highlight the matching columns
              const isMatchingCol = isJackpot ||
                (results[0] === results[1] && i < 2) ||
                (results[1] === results[2] && i > 0) ||
                (results[0] === results[2] && i !== 1);
              if (isMatchingCol) {
                c.style.boxShadow = isJackpot
                  ? 'inset 0 0 30px gold, 0 0 20px gold'
                  : 'inset 0 0 20px silver, 0 0 12px silver';
                c.style.transition = 'box-shadow 0.3s';
              }
            });
          }

          setTimeout(() => {
            // Remove highlights
            colIds.forEach(cid => {
              const c = document.getElementById(cid);
              if (c) c.style.boxShadow = '';
            });
            const winType = isJackpot ? 'jackpot' : isTwoMatch ? 'two' : 'none';
            onDone(winType);
          }, 800);
        }
      }
    }
    requestAnimationFrame(animate);
  });
}

function SlotMachine() {
  updateSlotDisplay();
  updateSlotLeverState();
  player.style.display = "none";

  slotCoinsInMachine = 0;
  slotCoinInsertAmount = 10;
  slotSpinning = false;

  const overlay = document.createElement('div');
  overlay.id = 'slotMachineOverlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.75);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    cursor: default;
  `;

  slotMachineGui.style.display = "block";
  overlay.appendChild(slotMachineGui);

  // Reset lever visual to OFF
  const offImg = document.querySelector('#slotLever img.off');
  const onImg = document.querySelector('#slotLever img.on');
  if (offImg) offImg.style.display = 'block';
  if (onImg) onImg.style.display = 'none';

  // Init display and lever
  updateSlotDisplay();
  updateSlotLeverState();
  buildSlotReels();

  function closeSlotMachine() {
    if (slotSpinning) return; // don't close while spinning
    // Return unused coins
    if (slotCoinsInMachine > 0) {
      playerTotalCoins += slotCoinsInMachine;
      slotCoinsInMachine = 0;
      updateDisplay();
    }
    slotCoinFollower.style.display = 'none';
    slotCoinTooltip.style.display = 'none';

    document.body.appendChild(slotMachineGui);
    slotMachineGui.style.display = "none";
    if (overlay.parentNode) document.body.removeChild(overlay);
    player.style.display = "block";

    // Clear reels
    ["column1","column2","column3"].forEach(id => {
      const col = document.getElementById(id);
      if (col) col.innerHTML = '';
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSlotMachine();
  });

  document.body.appendChild(overlay);
}

// Initialize slot machine
setupSlotCoinInsert();
setupSlotLever();
slotMachine.addEventListener('click', SlotMachine);


// --- Particles --- //

function spawnParticleBurst(x, y, imgSrc, count = 5) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("img");
    particle.src = imgSrc;
    particle.style.position = "absolute";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${Math.random() * 30 + 25}px`;
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

const appleText = document.getElementById("appleText");
const ticketText = document.getElementById("ticketText");
const coinText = document.getElementById("coinText");

const appleIcon = document.querySelector("#appleCount img");

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

function updateDisplay() {
  clickCount.textContent = `Points: ${abbreviateNumber(totalPoints)}`;
  punchCount.textContent = `Punches: ${abbreviateNumber(punches)}`;

  appleText.textContent = abbreviateNumber(playerTotalApples);
  ticketText.textContent = abbreviateNumber(playerTotalTickets);
  coinText.textContent = abbreviateNumber(playerTotalCoins);

  pieGameButton.disabled = playerTotalTickets < 1;
  updatePieButtonState();
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
  message.style.textShadow = "2px 2px 6px black";
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
      : "Textures/rare_bee.png"
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

    if (redBarDecayInterval) {
      clearInterval(redBarDecayInterval);
      redBarDecayInterval = null;
    }
  } else {
    if (redBarInterval) {
      clearInterval(redBarInterval);
      redBarInterval = null;
    }

    clearFastPunchTimer();

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
  comboPopup.style.opacity = "0";
}

function giraffiDies() {
  if (gloves[currentGloveIndex].special === "combo") {
    return;
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
  const effectivePPC = getEffectivePunchesPerClick();
  punches += effectivePPC;
  spawnParticleBurst(e.clientX, e.clientY, "Textures/cotton.png", 10);
  playPunchSound();

  updateDisplay();

  img.classList.remove("squished");
  void img.offsetWidth;
  img.classList.add("squished");
  setTimeout(() => img.classList.remove("squished"), 100);

  showPopup(
    `+${abbreviateNumber(effectivePPC)}`,
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

  if (clickStopTimeout) clearTimeout(clickStopTimeout);

  clickStopTimeout = setTimeout(() => {
    if (redBarInterval) {
      clearInterval(redBarInterval);
      redBarInterval = null;
    }

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

  // --- Wambo Glove --- //
  if (gloves[currentGloveIndex].id === 10) {
    if (wamboScale < maxWamboScale) {
      wamboScale += wamboGrowStep;
      if (wamboScale > maxWamboScale) wamboScale = maxWamboScale;
      player.style.transform = `translate(-50%, -50%) scale(${wamboScale})`;
    }
  } else {
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

resetButton.addEventListener("mouseenter", () => {
  playButtonHoverSound();
});

resetButton.addEventListener("click", () => {
  openRebirthWindow();
});

function openRebirthWindow() {
  const existing = document.getElementById("rebirthModal");
  if (existing) return;

  const REBIRTH_COST = 1_000_000_000_000; // Required points to rebirth
  const normalGloves = gloves.filter(g => !g.special);
  const allNormalOwned = normalGloves.every(g => ownedGloveIds.has(g.id));
  const hasEnoughPoints = totalPoints >= REBIRTH_COST;
  const canRebirth = allNormalOwned && hasEnoughPoints;

  const modal = document.createElement("div");
  modal.id = "rebirthModal";
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${darkMode ? "#222" : "white"};
    border-radius: 12px;
    border: 2px solid ${darkMode ? "white" : "#000"};
    padding: 20px;
    box-shadow: ${darkMode ? "0 0 20px rgba(255,255,255,0.2)" : "0 0 15px rgba(0,0,0,0.3)"};
    display: flex;
    flex-direction: column;
    width: 360px;
    max-width: 90vw;
    z-index: 4001;
    user-select: none;
    color: ${darkMode ? "#eee" : "black"};
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    cursor: auto;
  `;

  const overlay = document.createElement("div");
  overlay.id = "rebirthOverlay";
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.4); z-index: 4000; cursor: default;
  `;
  overlay.addEventListener("click", () => { modal.remove(); overlay.remove(); player.style.display = "block"; });

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.style.cssText = `
    align-self: flex-end;
    background: #888; color: white; border: none;
    border-radius: 8px; padding: 5px 10px;
    cursor: pointer; margin-bottom: 10px; font-weight: 600;
    font-family: inherit;
  `;
  closeBtn.onmouseenter = () => playButtonHoverSound();
  closeBtn.onclick = () => { modal.remove(); overlay.remove(); player.style.display = "block"; };

  const title = document.createElement("h2");
  title.textContent = "Rebirth";
  title.style.cssText = "margin: 0 0 6px 0; text-align: center; font-size: 1.4em;";

  const subtitle = document.createElement("p");
  subtitle.textContent = "Reset your points and gloves. Keep your Apples, Tickets, Coins, Stickers and Fragments. Receive 3 Tickets upon rebirth.";
  subtitle.style.cssText = `font-size: 0.78em; color: ${darkMode ? "#aaa" : "#555"}; text-align: center; margin: 0 0 14px 0;`;

  const reqTitle = document.createElement("div");
  reqTitle.textContent = "Requirements:";
  reqTitle.style.cssText = "font-weight: 700; margin-bottom: 8px; font-size: 0.9em;";

  // Condition rows
  function condRow(label, met) {
    const row = document.createElement("div");
    row.style.cssText = `
      display: flex; align-items: center; gap: 8px;
      padding: 7px 10px; border-radius: 8px; margin-bottom: 6px;
      background: ${met ? (darkMode ? "#1a3a1a" : "#e8f5e9") : (darkMode ? "#3a1a1a" : "#fdecea")};
      border: 1px solid ${met ? "#4caf50" : "#f44336"};
      font-size: 0.82em;
    `;
    const icon = document.createElement("span");
    icon.textContent = met ? "✅" : "❌";
    icon.style.fontSize = "1.1em";
    const text = document.createElement("span");
    text.innerHTML = label;
    text.style.color = darkMode ? "#eee" : "#333";
    row.appendChild(icon);
    row.appendChild(text);
    return row;
  }

  // Points condition
  const pointsRow = condRow(
    `Have <b>${abbreviateNumber(REBIRTH_COST)}</b> Points &nbsp;<span style="color:${darkMode?"#aaa":"#666"}">(you have ${abbreviateNumber(totalPoints)})</span>`,
    hasEnoughPoints
  );

  // All gloves condition — show which are missing
  const missingGloves = normalGloves.filter(g => !ownedGloveIds.has(g.id));
  let glovesLabel = `Own all regular gloves`;
  if (!allNormalOwned && missingGloves.length > 0) {
    const missing = missingGloves.slice(0, 3).map(g => g.name).join(", ");
    const extra = missingGloves.length > 3 ? ` +${missingGloves.length - 3} more` : "";
    glovesLabel += ` <span style="color:${darkMode?"#aaa":"#777"};font-size:0.9em;">(missing: ${missing}${extra})</span>`;
  }
  const glovesRow = condRow(glovesLabel, allNormalOwned);

  const rebirthBtn = document.createElement("button");
  rebirthBtn.textContent = canRebirth ? "Rebirth!" : "Requirements not met";
  rebirthBtn.style.cssText = `
    margin-top: 14px;
    padding: 10px;
    border: none; border-radius: 8px;
    font-size: 1em; font-weight: 700; font-family: inherit;
    cursor: ${canRebirth ? "pointer" : "not-allowed"};
    background: ${canRebirth ? "linear-gradient(135deg, #ff9800, #ffd740)" : (darkMode ? "#333" : "#ccc")};
    color: ${canRebirth ? "#111" : (darkMode ? "#555" : "#888")};
    opacity: ${canRebirth ? "1" : "0.7"};
    transition: transform 0.1s, opacity 0.2s;
    box-shadow: ${canRebirth ? "0 0 16px #ffd74088" : "none"};
  `;
  if (canRebirth) {
    rebirthBtn.onmouseenter = () => { rebirthBtn.style.transform = "scale(1.04)"; playButtonHoverSound(); };
    rebirthBtn.onmouseleave = () => { rebirthBtn.style.transform = "scale(1)"; };
  }

  rebirthBtn.onclick = () => {
    if (!canRebirth) return;
    modal.remove();
    overlay.remove();
    player.style.display = "block";
    doRebirth();
  };

  modal.appendChild(closeBtn);
  modal.appendChild(title);
  modal.appendChild(subtitle);
  modal.appendChild(reqTitle);
  modal.appendChild(pointsRow);
  modal.appendChild(glovesRow);
  modal.appendChild(rebirthBtn);

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Hide cursor while modal open
  player.style.display = "none";

  modal.addEventListener("mouseenter", () => { player.style.display = "none"; });
  modal.addEventListener("mouseleave", () => { player.style.display = "block"; });
}

function doRebirth() {
  // Reset points, punches, gloves
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
  img.style.transform = "";
  img.style.filter = "";
  img.style.transition = "";
  handleWamboScale(gloves[0]);

  if (currentGloveIndex === gloves.findIndex(g => g.id === 999)) {
    ownedGloveIds = new Set([1, 999]);
    currentGloveIndex = gloves.findIndex(g => g.id === 999);
  } else {
    ownedGloveIds = new Set([1]);
    currentGloveIndex = 0;
  }
  punchesPerClick = gloves[currentGloveIndex].punchesPerClick;
  player.src = gloves[currentGloveIndex].img;
  updatePlayerImage(gloves[currentGloveIndex]);

  isDead = false;

  comboRedValue = 0;
  comboBlackValue = 0;
  updateComboBar();
  clearInterval(comboDecayInterval); comboDecayInterval = null;
  clearInterval(redBarInterval); redBarInterval = null;

  const ticketBoost = getStickerBoost("tickets");
  const ticketsToAdd = ticketBoost ?? 3;
  playerTotalTickets += ticketsToAdd;

  whackCooldownActive = false;
  officeCooldownActive = false;

  playButtonClickSound();
  showComboMessage(`✨ Reborn! <span style="color: #58caff;">+${ticketsToAdd} Tickets</span>`, 2500);
  updateDisplay();
}

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

  darkModeIcon.src = darkMode ? "Textures/buttons/sun-dark.png" : "Textures/buttons/moon.png";
  darkModeIcon.alt = darkMode ? "Switch to light mode" : "Switch to dark mode";

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

function updatePlayerImage(glove) {
  const playerImg = document.getElementById("player");
  const useDark = darkMode && glove.darkImg;

  playerImg.src = useDark ? glove.darkImg : glove.img;

  if (glove.img === "Textures/gloves/cursor_glove.gif") {
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
      const discountedCost = applyDiscount(glove.cost);
      const affordable = totalPoints >= discountedCost;

      const gloveImg = document.createElement("img");
      gloveImg.src = glove.img;

      if (glove.img === "Textures/gloves/cursor_glove.gif") {
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

      const desc = document.createElement("div");

      const nameElem = document.createElement("div");
      nameElem.textContent = glove.name;
      nameElem.style.fontWeight = "bold";

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
      const disc = getDiscount();
      if (glove.cost === 0) {
        price.textContent = "Free";
      } else if (disc > 0) {
        price.innerHTML = `<span style="text-decoration:line-through;color:#888;">${abbreviateNumber(glove.cost)}</span> <span style="color:#ffd740;">${abbreviateNumber(discountedCost)}</span>`;
      } else {
        price.textContent = abbreviateNumber(glove.cost);
      }

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
          if (totalPoints >= discountedCost) {
            totalPoints -= discountedCost;
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
    {
      id: 999,
      name: "Eternity",
      required: eternityFragments,
      requiredAmount: 9,
      conditionMet: eternityFragments >= 9,
    },
  ].forEach((gloveInfo) => {
    const item = document.createElement("div");
    item.className = "item";

    const glove = gloves.find((g) => g.id === gloveInfo.id);
    const owned = ownedGloveIds.has(glove.id);
    const equipped = currentGloveIndex === gloves.indexOf(glove);

    let label;
    if (gloveInfo.name === "Bee Glove") {
      label = "Bees caught";
    } else if (gloveInfo.name === "Combo Glove") {
      label = "Giraffi killed";
    } else if (gloveInfo.name === "Eternity") {
      label = `${glove.punchesPerClick} Punches/Click\nFragments collected`;
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
      "Eternity":
        "💫 It might not be the most powerful, but it will stay with you when you reset.",
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

document.getElementById("infoModal").addEventListener("click", (e) => {
  if (e.target.id === "infoModal") {
    document.getElementById("infoModal").style.display = "none";
  }
});

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("mouseenter", () => {
    if (document.getElementById("infoModal").style.display !== "flex") {
      player.classList.add("hide-cursor-player");
    }
  });
  button.addEventListener("mouseleave", () => {
    player.classList.remove("hide-cursor-player");
  });
});

const infoModal = document.getElementById("infoModal");
infoModal.addEventListener("mouseenter", () => {
  player.classList.remove("hide-cursor-player");
});


// ============================================================
// STICKER SYSTEM
// ============================================================

// ── Data ────────────────────────────────────────────────────

const STICKER_TYPES    = ["apples", "coins", "combo", "points", "tickets"];
const STICKER_RARITIES = ["common", "rare", "epic", "legendary"];

const RARITY_COLOR = {
  common:    "#4caf50",
  rare:      "#2196f3",
  epic:      "#9c27b0",
  legendary: "#ff9800",
};

const RARITY_GLOW = {
  common:    "0 0 12px #4caf50aa",
  rare:      "0 0 16px #2196f3cc",
  epic:      "0 0 20px #9c27b0cc",
  legendary: "0 0 28px #ff9800ee, 0 0 6px #fff5",
};

const STICKER_SELL_PRICE = { common: 5,   rare: 10,  epic: 30,  legendary: 50  };
const STICKER_BUY_PRICE  = { common: 60,  rare: 120, epic: 300, legendary: 600 };

const PACK_TABLES = {
  stickerPack1: [
    { rarity: "common",    weight: 60 },
    { rarity: "rare",      weight: 35 },
    { rarity: "epic",      weight: 5  },
  ],
  stickerPack2: [
    { rarity: "rare",      weight: 55 },
    { rarity: "epic",      weight: 34 },
    { rarity: "legendary", weight: 10 },
    { rarity: "fragment",  weight: 1  },
  ],
  stickerPack3: [
    { rarity: "epic",      weight: 60 },
    { rarity: "legendary", weight: 35  },
    { rarity: "fragment",  weight: 5 },
  ],
};

// ── State ────────────────────────────────────────────────────

let stickerInventory = [];

let equippedStickers = {
  apples:  null,
  coins:   null,
  combo:   null,
  points:  null,
  tickets: null,
};

// ── Boost Getters ────────────────────────────────────────────

function getStickerBoost(type) {
  const rarity = equippedStickers[type];
  if (!rarity) return null;
  const boosts = {
    apples:  { common: 0.30, rare: 0.50, epic: 1.00, legendary: 2.00 },
    coins:   { common: 0.30, rare: 0.50, epic: 1.00, legendary: 2.00 },
    combo:   { common: 1,    rare: 1.5,  epic: 3,    legendary: 4    },
    points:  { common: 0.30, rare: 0.50, epic: 1.00, legendary: 2.00 },
    tickets: { common: 4,    rare: 5,    epic: 7,    legendary: 10   },
  };
  return boosts[type][rarity];
}

// ── "All collected" discount ─────────────────────────────────

function hasCollectedAll() {
  for (const type of STICKER_TYPES) {
    for (const rarity of STICKER_RARITIES) {
      const has = stickerInventory.some(s => s.type === type && s.rarity === rarity && s.count > 0);
      const isEquipped = equippedStickers[type] === rarity;
      if (!has && !isEquipped) return false;
    }
  }
  return true;
}

function getDiscount() {
  return hasCollectedAll() ? 0.20 : 0;
}

function applyDiscount(price) {
  return Math.floor(price * (1 - getDiscount()));
}

// ── Rarity helpers ───────────────────────────────────────────

const RARITY_RANK = { common: 0, rare: 1, epic: 2, legendary: 3 };

function isBetterRarity(a, b) {
  return (RARITY_RANK[a] ?? -1) > (RARITY_RANK[b] ?? -1);
}

// ── Award sticker ────────────────────────────────────────────

function awardSticker(type, rarity) {
  const current = equippedStickers[type];
  if (!current || isBetterRarity(rarity, current)) {
    if (current) addToInventory(type, current);
    equippedStickers[type] = rarity;
  } else {
    addToInventory(type, rarity);
  }
  refreshStickerDisplay();
}

function addToInventory(type, rarity) {
  const existing = stickerInventory.find(s => s.type === type && s.rarity === rarity);
  if (existing) existing.count++;
  else stickerInventory.push({ type, rarity, count: 1 });
}

// ── Weighted random ──────────────────────────────────────────

function weightedRoll(table) {
  const filtered = table.filter(e => e.weight > 0);
  const total = filtered.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const entry of filtered) {
    r -= entry.weight;
    if (r <= 0) return entry.rarity;
  }
  return filtered[filtered.length - 1].rarity;
}

function rollPack(packId) {
  const table = PACK_TABLES[packId];
  const result = weightedRoll(table);
  if (result === "fragment") return { isFragment: true, rarity: "fragment", type: null };
  const type = STICKER_TYPES[Math.floor(Math.random() * STICKER_TYPES.length)];
  return { type, rarity: result, isFragment: false };
}

// ── Sound helpers ─────────────────────────────────────────────

function playPackOpeningSound() {
  const audio = new Audio("Sounds/pack_opening.mp3");
  audio.volume = 0.8;
  audio.play().catch(() => {});
}

function playPackRouletteSound() {
  const audio = new Audio("Sounds/pack_roulette.mp3");
  audio.volume = 0.9;
  audio.play().catch(() => {});
  return audio;
}

function playStickerSellSound() {
  const audio = new Audio("Sounds/sticker_sell.mp3");
  audio.volume = 0.7;
  audio.play().catch(() => {});
}

// ── Case-opening animation ────────────────────────────────────

let caseAnimationRunning = false;

function buildCaseBar(packId, wonRarity, wonType) {
  const table = PACK_TABLES[packId].filter(e => e.rarity !== "fragment");
  const totalItems = 60;
  const winSlot    = 48;

  const pool = [];
  const totalW = table.reduce((s,e) => s+e.weight, 0);
  table.forEach(entry => {
    const count = Math.round((entry.weight / totalW) * 20);
    for (let i = 0; i < count; i++) {
      STICKER_TYPES.forEach(t => pool.push({ type: t, rarity: entry.rarity }));
    }
  });

  const packHasFragments = PACK_TABLES[packId].some(e => e.rarity === "fragment");
  if (packHasFragments) {
    for (let i = 0; i < 3; i++) {
      pool.push({ type: null, rarity: "fragment" });
    }
  }

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const items = [];
  for (let i = 0; i < totalItems; i++) {
    if (i === winSlot) {
      items.push({ type: wonType, rarity: wonRarity });
    } else {
      items.push(pool[i % pool.length]);
    }
  }

  const ITEM_W = 112;
  const strip = document.createElement("div");
  strip.style.cssText = `
    display: flex;
    align-items: center;
    height: 130px;
    width: ${totalItems * ITEM_W}px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    will-change: transform;
  `;

  items.forEach((item) => {
    const seg = document.createElement("div");
    seg.style.cssText = `
      width: ${ITEM_W}px;
      height: 110px;
      box-sizing: border-box;
      padding: 0 3px;
      flex-shrink: 0;
      position: relative;
    `;

    const isFragment = item.rarity === "fragment";
    const rc = isFragment ? "#c084fc" : RARITY_COLOR[item.rarity];

    const inner = document.createElement("div");
    inner.style.cssText = `
      width: 100%;
      height: 100%;
      border-radius: 10px;
      background: ${rc}22;
      border: 2px solid ${rc};
      box-shadow: ${isFragment ? "0 0 20px #c084fccc" : RARITY_GLOW[item.rarity]};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    `;

    if (isFragment) {
      const fragImg = document.createElement("img");
      fragImg.src = "Textures/eternity_fragment.png";
      fragImg.style.cssText = "width:54px;height:54px;object-fit:contain;pointer-events:none;";
      const label = document.createElement("span");
      label.textContent = "FRAGMENT";
      label.style.cssText = `font-size:8px;color:#c084fc;font-weight:700;margin-top:4px;font-family:'Comic Sans MS','Comic Sans';letter-spacing:1px;`;
      inner.appendChild(fragImg);
      inner.appendChild(label);
    } else {
      const stickerImg = document.createElement("img");
      stickerImg.src = `Textures/stickers/sticker_${item.type}_${item.rarity}.png`;
      stickerImg.style.cssText = "width:64px;height:64px;object-fit:contain;pointer-events:none;";
      stickerImg.onerror = () => { stickerImg.src = ""; stickerImg.style.background = rc; stickerImg.style.borderRadius="50%"; };
      const label = document.createElement("span");
      label.textContent = item.rarity.toUpperCase();
      label.style.cssText = `font-size:9px;color:${rc};font-weight:700;margin-top:4px;font-family:'Comic Sans MS','Comic Sans';letter-spacing:1px;`;
      inner.appendChild(stickerImg);
      inner.appendChild(label);
    }

    seg.appendChild(inner);
    strip.appendChild(seg);
  });

  return { strip, winSlot, ITEM_W };
}

function playCaseAnimation(packId, wonItem, callback) {
  if (caseAnimationRunning) return;
  caseAnimationRunning = true;

  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,0.88);z-index:99998;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    cursor:default;
  `;

  const title = document.createElement("div");
  title.textContent = "Opening Pack…";
  title.style.cssText = `color:white;font-size:26px;font-weight:700;
    font-family:'Comic Sans MS','Comic Sans';margin-bottom:24px;
    text-shadow:0 0 16px gold;`;
  overlay.appendChild(title);

  const reelWrap = document.createElement("div");
  reelWrap.style.cssText = `
    position:relative;width:660px;height:140px;
    overflow:hidden;border-radius:12px;
    border:2px solid #444;background:#111;
    box-shadow:0 0 30px #0008;
  `;

  const marker = document.createElement("div");
  marker.style.cssText = `
    position:absolute;left:50%;top:0;transform:translateX(-50%);
    width:3px;height:100%;background:rgba(255,220,50,0.85);
    z-index:10;box-shadow:0 0 10px gold;pointer-events:none;
  `;
  reelWrap.appendChild(marker);

  const spinRarity = wonItem.isFragment ? "fragment" : wonItem.rarity;
  const spinType   = wonItem.isFragment ? null : wonItem.type;

  const { strip, winSlot, ITEM_W } = buildCaseBar(packId, spinRarity, spinType);
  reelWrap.appendChild(strip);
  overlay.appendChild(reelWrap);

  document.body.appendChild(overlay);

  const rouletteAudio = playPackRouletteSound();

  const CONTAINER_W = 660;
  const markerX = CONTAINER_W / 2;
  const jitter = (Math.random() - 0.5) * 56;
  const targetLeft = markerX - (winSlot * ITEM_W + ITEM_W / 2) + jitter;

  const duration = 4200;
  const startTime = performance.now();
  const totalDelta = targetLeft;

  function easeOutQuint(t) { return 1 - Math.pow(1 - t, 5); }

  function animStep(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = easeOutQuint(t);
    strip.style.transform = `translateY(-50%) translateX(${totalDelta * eased}px)`;
    if (t < 1) {
      requestAnimationFrame(animStep);
    } else {
      if (rouletteAudio) {
        rouletteAudio.pause();
        rouletteAudio.currentTime = 0;
      }

      const revealAudio = new Audio("Sounds/sticker_reveal.mp3");
      revealAudio.volume = 0.8;
      revealAudio.play().catch(() => {});

      const winSeg = strip.children[winSlot];
      if (winSeg) {
        const inner = winSeg.firstChild;
        const winColor = wonItem.isFragment ? "#c084fc" : RARITY_COLOR[wonItem.rarity];
        inner.style.boxShadow = `0 0 40px ${winColor}, inset 0 0 20px ${winColor}55`;
        inner.style.transform = "scale(1.08)";
        inner.style.transition = "transform .2s, box-shadow .2s";
      }

      const resultDiv = document.createElement("div");
      resultDiv.style.cssText = `
        margin-top:20px;text-align:center;
        font-family:'Comic Sans MS','Comic Sans';
        animation:popIn .35s ease forwards;
      `;

      if (wonItem.isFragment) {
        resultDiv.innerHTML = `
          <img src="Textures/eternity_fragment.png" style="width:80px;height:80px;object-fit:contain;margin-bottom:8px;filter:drop-shadow(0 0 16px #c084fc);" />
          <div style="font-size:22px;color:#c084fc;text-shadow:0 0 20px #c084fccc;font-weight:700;">
            ETERNITY FRAGMENT
          </div>
          <div style="font-size:13px;color:#aaa;margin-top:6px;">
            Collect 9 to unlock the Eternity Glove!
          </div>
        `;
      } else {
        resultDiv.innerHTML = `
          <div style="font-size:22px;color:${RARITY_COLOR[wonItem.rarity]};text-shadow:${RARITY_GLOW[wonItem.rarity]};font-weight:700;">
            ${wonItem.rarity.toUpperCase()} ${wonItem.type.toUpperCase()} STICKER
          </div>
          <div style="font-size:13px;color:#aaa;margin-top:6px;">
            ${stickerBoostDescription(wonItem.type, wonItem.rarity)}
          </div>
        `;
      }

      overlay.appendChild(resultDiv);

      const closeBtn = buildCloseBtn(() => { document.body.removeChild(overlay); caseAnimationRunning = false; callback(); });
      closeBtn.style.marginTop = "18px";
      overlay.appendChild(closeBtn);
    }
  }
  requestAnimationFrame(animStep);
}

function buildCloseBtn(onClick) {
  const btn = document.createElement("button");
  btn.textContent = "Continue";
  btn.style.cssText = `
    padding:10px 28px;font-size:16px;font-weight:700;border-radius:10px;
    border:2px solid #fff5;background:#222;color:#fff;cursor:pointer;
    font-family:'Comic Sans MS','Comic Sans';
    transition:background .15s,transform .1s;
    outline:none;
  `;
  btn.onmouseenter = () => btn.style.background = "#444";
  btn.onmouseleave = () => btn.style.background = "#222";
  btn.onclick = onClick;
  return btn;
}

function stickerBoostDescription(type, rarity) {
  if (!type || !rarity) return "";
  const boost = {
    apples:  { common:"30% more Apples", rare:"50% more Apples", epic:"100% more Apples", legendary:"200% more Apples" },
    coins:   { common:"30% more Coins",  rare:"50% more Coins",  epic:"100% more Coins",  legendary:"200% more Coins"  },
    combo:   { common:"Combo-Multiplier increases by 1", rare:"Combo-Multiplier increases by 1.5", epic:"Combo-Multiplier increases by 3", legendary:"Combo-Multiplier increases by 4" },
    points:  { common:"30% more Punches/Click", rare:"50% more Punches/Click", epic:"100% more Punches/Click", legendary:"200% more Punches/Click" },
    tickets: { common:"Reset gives 4 Tickets", rare:"Reset gives 5 Tickets", epic:"Reset gives 7 Tickets", legendary:"Reset gives 10 Tickets" },
  };
  return boost[type]?.[rarity] ?? "";
}

// ── Pack-opening entry point ─────────────────────────────────

function openPack(packId) {
  const cost = applyDiscount(PACK_COSTS[packId]);
  if (coinsInMachine < cost) return;

  coinsInMachine -= cost;
  updateVendingUI();

  const won = rollPack(packId);

  playPackOpeningSound();

  playPackRipAnimation(packId, () => {
    playCaseAnimation(packId, won, () => {
      if (won.isFragment) {
        eternityFragments++;
        showComboMessage("🔮 Eternity Fragment obtained!", 2500);
      } else {
        awardSticker(won.type, won.rarity);
        showComboMessage(
          `✨ Got a <span style="color:${RARITY_COLOR[won.rarity]}">${won.rarity} ${won.type}</span> sticker!`,
          2500
        );
      }
      updateDisplay();
      refreshStickerDisplay();
      updateVendingUI();
    });
  });
}

// ── Pack-rip animation ───────────────────────────────────────

const PACK_IMG = {
  stickerPack1: "Textures/stickerpack1.png",
  stickerPack2: "Textures/stickerpack2.png",
  stickerPack3: "Textures/stickerpack3.png",
};

function playPackRipAnimation(packId, callback) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,0.75);z-index:99997;
    display:flex;align-items:center;justify-content:center;
    pointer-events:all;
  `;

  const packImg = document.createElement("img");
  packImg.src = PACK_IMG[packId];
  packImg.style.cssText = `
    width:220px;height:auto;
    animation: packSlideIn 0.6s cubic-bezier(.17,.67,.3,1.4) forwards;
    filter: drop-shadow(0 0 30px gold);
    transform-origin: center bottom;
  `;
  overlay.appendChild(packImg);
  document.body.appendChild(overlay);

  setTimeout(() => {
    packImg.style.animation = "packShake 0.3s ease forwards";
    setTimeout(() => {
      packImg.style.display = "none";
      const top = packImg.cloneNode();
      top.style.display = "block";
      top.style.clipPath = "polygon(0 0, 100% 0, 100% 48%, 0 52%)";
      top.style.animation = "ripTop 0.35s ease forwards";

      const bot = packImg.cloneNode();
      bot.style.display = "block";
      bot.style.clipPath = "polygon(0 52%, 100% 48%, 100% 100%, 0 100%)";
      bot.style.animation = "ripBot 0.35s ease forwards";
      bot.style.position = "absolute";
      bot.style.top = top.style.top;
      bot.style.left = top.style.left;

      overlay.style.position = "fixed";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.appendChild(top);
      overlay.appendChild(bot);

      setTimeout(() => {
        document.body.removeChild(overlay);
        callback();
      }, 400);
    }, 320);
  }, 650);
}

// ── Inject keyframes ─────────────────────────────────────────

(function injectKeyframes() {
  const style = document.createElement("style");
  style.textContent = `
@keyframes packSlideIn {
  0%   { transform: translateX(120vw) rotate(18deg) scale(0.6); opacity:0; }
  60%  { transform: translateX(-20px) rotate(-3deg) scale(1.05); opacity:1; }
  100% { transform: translateX(0) rotate(0deg) scale(1); opacity:1; }
}
@keyframes packShake {
  0%   { transform: rotate(0deg); }
  20%  { transform: rotate(-6deg) scale(1.04); }
  40%  { transform: rotate(6deg)  scale(1.06); }
  60%  { transform: rotate(-4deg) scale(1.03); }
  80%  { transform: rotate(3deg)  scale(1.01); }
  100% { transform: rotate(0deg)  scale(1);    }
}
@keyframes ripTop {
  0%   { transform: translateY(0)    rotate(0deg);  opacity:1; }
  100% { transform: translateY(-80px) rotate(-8deg); opacity:0; }
}
@keyframes ripBot {
  0%   { transform: translateY(0)    rotate(0deg); opacity:1; }
  100% { transform: translateY(80px)  rotate(6deg); opacity:0; }
}
@keyframes popIn {
  0%   { transform: scale(0.4); opacity:0; }
  70%  { transform: scale(1.15); opacity:1; }
  100% { transform: scale(1);    opacity:1; }
}
@keyframes stickerBadgePulse {
  0%,100% { filter: drop-shadow(0 0 6px var(--rc)); }
  50%      { filter: drop-shadow(0 0 18px var(--rc)) drop-shadow(0 0 4px #fff6); }
}
  `;
  document.head.appendChild(style);
})();

// ── Sticker display on main page ─────────────────────────────

function createStickerPanel() {
  const existing = document.getElementById("stickerPanel");
  if (existing) return;

  const panel = document.createElement("div");
  panel.id = "stickerPanel";
  panel.style.cssText = `
    position:fixed;bottom:70px;left:10px;
    display:flex;flex-direction:column;gap:8px;
    z-index:500;
    font-family:'Comic Sans MS','Comic Sans';
  `;

  STICKER_TYPES.forEach(type => {
    const badge = document.createElement("div");
    badge.id = `stickerBadge_${type}`;
    badge.style.cssText = `
      display:none;
      width:48px;height:48px;
      position:relative;
      cursor:pointer;
      pointer-events:all;
    `;
    panel.appendChild(badge);
  });

  document.body.appendChild(panel);
}

function showStickerTooltip(type, rarity, anchorElem) {
  const existing = document.getElementById("stickerTooltip");
  if (existing) existing.remove();

  const rc = RARITY_COLOR[rarity];
  const tooltip = document.createElement("div");
  tooltip.id = "stickerTooltip";

  const boostText = stickerBoostDescription(type, rarity);

  tooltip.style.cssText = `
    position:fixed;
    background:rgba(0,0,0,0.92);
    border:2px solid ${rc};
    border-radius:10px;
    padding:10px 14px;
    font-family:'Comic Sans MS','Comic Sans';
    font-size:12px;
    color:#fff;
    z-index:9999;
    pointer-events:none;
    box-shadow:0 0 16px ${rc}88;
    white-space:nowrap;
    min-width:160px;
  `;

  tooltip.innerHTML = `
    <div style="color:${rc};font-weight:700;font-size:13px;margin-bottom:4px;">
      ${rarity.toUpperCase()} ${type.toUpperCase()}
    </div>
    <div style="color:#ddd;font-size:11px;">${boostText}</div>
  `;

  document.body.appendChild(tooltip);

  const rect = anchorElem.getBoundingClientRect();
  tooltip.style.left = (rect.right + 10) + "px";
  tooltip.style.top = (rect.top + rect.height / 2 - tooltip.offsetHeight / 2) + "px";

  const dismiss = () => { tooltip.remove(); document.removeEventListener("click", dismiss); };
  setTimeout(() => tooltip.remove(), 3000);
  setTimeout(() => document.addEventListener("click", dismiss), 50);
}

function refreshStickerDisplay() {
  createStickerPanel();
  STICKER_TYPES.forEach(type => {
    const rarity = equippedStickers[type];
    const badge = document.getElementById(`stickerBadge_${type}`);
    if (!badge) return;

    badge.innerHTML = "";

    if (!rarity) {
      badge.style.display = "none";
      return;
    }

    const rc = RARITY_COLOR[rarity];
    badge.style.display = "block";
    badge.style.setProperty("--rc", rc);

    const img = document.createElement("img");
    img.src = `Textures/stickers/sticker_${type}_${rarity}.png`;
    img.draggable = false;
    img.style.cssText = `
      width:48px;height:48px;object-fit:contain;
      display:block;
      border-radius:8px;
      filter: drop-shadow(0 0 6px ${rc});
      transition:transform 0.15s;
    `;
    img.onerror = () => {
      img.style.background = rc;
      img.style.borderRadius = "50%";
    };

    badge.onclick = (e) => {
      e.stopPropagation();
      playButtonClickSound();
      showStickerTooltip(type, rarity, badge);
    };

    badge.onmouseenter = () => {
      img.style.transform = "scale(1.2)";
      player.classList.add("hide-cursor-player");
    };
    badge.onmouseleave = () => {
      img.style.transform = "scale(1)";
      player.classList.remove("hide-cursor-player");
    };

    badge.appendChild(img);
  });

  let allBadge = document.getElementById("stickerAllBadge");
  if (hasCollectedAll()) {
    if (!allBadge) {
      allBadge = document.createElement("div");
      allBadge.id = "stickerAllBadge";
      allBadge.style.cssText = `
        background:linear-gradient(135deg,#ff9800,#ffd740);
        border-radius:8px;padding:4px 8px;
        font-size:10px;font-weight:700;color:#111;
        box-shadow:0 0 18px #ff980088;
        font-family:'Comic Sans MS','Comic Sans';
        max-width:54px;text-align:center;
        line-height:1.2;
      `;
      allBadge.textContent = "★ 20% OFF";
      document.getElementById("stickerPanel").appendChild(allBadge);
    }
  } else if (allBadge) allBadge.remove();
}

// ── Sticker Inventory UI (used inside Elefanti) ───────────────

function buildStickerInventoryPanel(onUpdate) {
  const panel = document.createElement("div");
  panel.style.cssText = `
    width:340px;background:#111;border-radius:12px;padding:16px;
    border:2px solid #333;color:#fff;font-family:'Comic Sans MS','Comic Sans';
    overflow-y:auto;max-height:600px;
    scrollbar-width:thin;scrollbar-color:#444 #111;
  `;

  const h = document.createElement("h3");
  h.textContent = "📦 Your Sticker Inventory";
  h.style.cssText = "margin:0 0 12px;font-size:14px;color:#ffd740;text-align:center;";
  panel.appendChild(h);

  const equSection = document.createElement("div");
  equSection.innerHTML = `<div style="font-size:11px;color:#aaa;margin-bottom:8px;">⭐ EQUIPPED</div>`;
  const equGrid = document.createElement("div");
  equGrid.style.cssText = "display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:14px;";
  equSection.appendChild(equGrid);
  panel.appendChild(equSection);

  const divider = document.createElement("div");
  divider.style.cssText = "border-top:1px solid #333;margin:8px 0;";
  panel.appendChild(divider);

  const invSection = document.createElement("div");
  invSection.innerHTML = `<div style="font-size:11px;color:#aaa;margin-bottom:8px;">💰 SELL STICKERS</div>`;
  const invGrid = document.createElement("div");
  invGrid.id = "elefInvGrid";
  invGrid.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;";
  invSection.appendChild(invGrid);
  panel.appendChild(invSection);

  function render() {
    equGrid.innerHTML = "";
    STICKER_TYPES.forEach(type => {
      const rarity = equippedStickers[type];
      const cell = buildStickerCardCompact(type, rarity ?? null, true, render, null, false);
      equGrid.appendChild(cell);
    });

    invGrid.innerHTML = "";
    const dupes = stickerInventory.filter(s => s.count > 0);
    if (dupes.length === 0) {
      invGrid.innerHTML = `<span style="color:#666;font-size:12px;">No stickers to sell.</span>`;
    } else {
      dupes.forEach(s => {
        const card = buildStickerCardCompact(s.type, s.rarity, false, render, s.count, true);
        invGrid.appendChild(card);
      });
    }
    if (onUpdate) onUpdate();
  }

  render();
  panel._render = render;
  return panel;
}

function buildStickerCardCompact(type, rarity, isEquipped, onUpdate, count, canSell) {
  const card = document.createElement("div");
  const rc = rarity ? RARITY_COLOR[rarity] : "#444";
  card.style.cssText = `
    background:${rc}18;border:2px solid ${rc};border-radius:8px;
    padding:6px;display:flex;flex-direction:column;align-items:center;
    position:relative;font-family:'Comic Sans MS','Comic Sans';
    min-width:80px;
    box-shadow:${rarity && rarity !== "fragment" ? RARITY_GLOW[rarity] : "none"};
  `;

  const typeLabel = document.createElement("div");
  typeLabel.textContent = type ? type.toUpperCase() : "—";
  typeLabel.style.cssText = `font-size:8px;color:#aaa;letter-spacing:1px;margin-bottom:2px;`;

  const stickerImg = document.createElement("img");
  if (rarity && type) {
    stickerImg.src = `Textures/stickers/sticker_${type}_${rarity}.png`;
    stickerImg.onerror = () => { stickerImg.style.opacity="0.3"; };
  }
  stickerImg.style.cssText = "width:40px;height:40px;object-fit:contain;";

  const rarLabel = document.createElement("div");
  rarLabel.textContent = rarity ? rarity.toUpperCase() : "EMPTY";
  rarLabel.style.cssText = `font-size:8px;color:${rc};font-weight:700;margin-top:2px;`;

  card.appendChild(typeLabel);
  card.appendChild(stickerImg);
  card.appendChild(rarLabel);

  if (!rarity) {
    card.style.opacity = "0.3";
    return card;
  }

  if (!isEquipped && count !== undefined && canSell) {
    const countBadge = document.createElement("div");
    countBadge.textContent = `×${count}`;
    countBadge.style.cssText = `position:absolute;top:2px;right:4px;font-size:9px;color:${rc};font-weight:700;`;
    card.appendChild(countBadge);

    const sellPrice = STICKER_SELL_PRICE[rarity];
    const sellBtn = document.createElement("button");
    sellBtn.textContent = `Sell ${sellPrice}🪙`;
    sellBtn.style.cssText = `margin-top:4px;background:#1a1a1a;border:1px solid ${rc};
      border-radius:5px;color:${rc};font-size:8px;padding:2px 5px;cursor:pointer;
      font-family:'Comic Sans MS','Comic Sans';font-weight:700;`;
    sellBtn.onclick = (e) => {
      e.stopPropagation();
      const inv = stickerInventory.find(s => s.type === type && s.rarity === rarity);
      if (!inv || inv.count <= 0) return;
      inv.count--;
      playerTotalCoins += sellPrice;
      playStickerSellSound();
      updateDisplay();
      refreshStickerDisplay();
      onUpdate();
    };
    card.appendChild(sellBtn);

    const equipped = equippedStickers[type];
    if (!equipped || isBetterRarity(rarity, equipped)) {
      const equipBtn = document.createElement("button");
      equipBtn.textContent = "Equip";
      equipBtn.style.cssText = `margin-top:2px;background:#222;border:1px solid #fff4;
        border-radius:5px;color:#fff;font-size:8px;padding:2px 5px;cursor:pointer;
        font-family:'Comic Sans MS','Comic Sans';`;
      equipBtn.onclick = (e) => {
        e.stopPropagation();
        const inv = stickerInventory.find(s => s.type === type && s.rarity === rarity);
        if (!inv || inv.count <= 0) return;
        inv.count--;
        if (equipped) addToInventory(type, equipped);
        equippedStickers[type] = rarity;
        refreshStickerDisplay();
        onUpdate();
      };
      card.appendChild(equipBtn);
    }
  }
  return card;
}

// ── Standalone Sticker Inventory (view-only, no sell) ────────

function openStickerInventory() {
  const existing = document.getElementById("stickerInventoryOverlay");
  if (existing) return;

  player.style.display = "none";

  const overlay = document.createElement("div");
  overlay.id = "stickerInventoryOverlay";
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,0.82);z-index:10000;
    display:flex;align-items:center;justify-content:center;
    cursor:default;font-family:'Comic Sans MS','Comic Sans';
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    background:#1a1a2e;border-radius:16px;padding:24px;
    width:740px;max-width:95vw;max-height:88vh;overflow-y:auto;
    border:2px solid #444;box-shadow:0 0 40px #0009;
    color:#fff;position:relative;
  `;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✖";
  closeBtn.style.cssText = `position:absolute;top:12px;right:14px;background:none;border:none;
    color:#aaa;font-size:22px;cursor:pointer;font-family:inherit;`;
  closeBtn.onclick = () => { overlay.remove(); player.style.display="block"; };

  const h = document.createElement("h2");
  h.textContent = "Sticker Collection";
  h.style.cssText = "margin:0 0 10px 0;font-size:22px;text-align:center;";

  modal.appendChild(closeBtn);
  modal.appendChild(h);

  // ── Progress Bar ──────────────────────────────────────────
  const TOTAL_STICKERS = STICKER_TYPES.length * STICKER_RARITIES.length; // 20

  function countCollected() {
    let count = 0;
    STICKER_TYPES.forEach(type => {
      STICKER_RARITIES.forEach(rarity => {
        const inInv = stickerInventory.some(s => s.type === type && s.rarity === rarity && s.count > 0);
        const isEquipped = equippedStickers[type] === rarity;
        if (inInv || isEquipped) count++;
      });
    });
    return count;
  }

  const progressWrap = document.createElement("div");
  progressWrap.style.cssText = "margin-bottom:14px;";

  const progressLabel = document.createElement("div");
  progressLabel.style.cssText = "display:flex;justify-content:space-between;font-size:12px;color:#aaa;margin-bottom:5px;";

  const progressText = document.createElement("span");
  progressText.textContent = "Collection Progress";

  const progressCount = document.createElement("span");
  const collected = countCollected();
  progressCount.id = "stickerProgressCount";
  progressCount.style.cssText = "color:#ffd740;font-weight:700;";
  progressCount.textContent = `${collected} / ${TOTAL_STICKERS}`;

  progressLabel.appendChild(progressText);
  progressLabel.appendChild(progressCount);

  const progressBarBg = document.createElement("div");
  progressBarBg.style.cssText = `
    width:100%;height:14px;background:#222;border-radius:8px;
    border:1px solid #444;overflow:hidden;
  `;
  const progressBarFill = document.createElement("div");
  progressBarFill.id = "stickerProgressFill";
  const pct = Math.round((collected / TOTAL_STICKERS) * 100);
  progressBarFill.style.cssText = `
    height:100%;width:${pct}%;
    background:linear-gradient(90deg,#ffd740,#ff9800);
    border-radius:8px;
    transition:width 0.4s ease;
    box-shadow:0 0 8px #ffd74088;
  `;

  progressBarBg.appendChild(progressBarFill);
  progressWrap.appendChild(progressLabel);
  progressWrap.appendChild(progressBarBg);

  if (collected === TOTAL_STICKERS) {
    const discountBanner = document.createElement("div");
    discountBanner.style.cssText = `
      margin-top:8px;text-align:center;font-size:12px;font-weight:700;
      color:#ffd740;text-shadow:0 0 12px #ffd74099;
      background:rgba(255,215,64,0.08);border-radius:6px;padding:4px 0;
      border:1px solid #ffd74033;
    `;
    discountBanner.textContent = "★ All stickers collected! 20% discount active on everything!";
    progressWrap.appendChild(discountBanner);
  }

  modal.appendChild(progressWrap);

  const noteDiv = document.createElement("div");
  noteDiv.style.cssText = "font-size:11px;color:#666;text-align:center;margin-bottom:14px;";
  noteDiv.textContent = "Collect all 20 stickers to unlock a 20% discount on everything in the game.";
  modal.appendChild(noteDiv);

  const equSection = document.createElement("div");
  equSection.innerHTML = `<h3 style="color:#ffd740;font-size:14px;margin:0 0 10px;">Equipped Stickers</h3>`;
  const equGrid = document.createElement("div");
  equGrid.id = "stickerEquGrid";
  equGrid.style.cssText = "display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:20px;";
  equSection.appendChild(equGrid);
  modal.appendChild(equSection);

  const invSection = document.createElement("div");
  invSection.innerHTML = `<h3 style="color:#aaa;font-size:14px;margin:0 0 10px;">BULK</h3>`;
  const invGrid = document.createElement("div");
  invGrid.id = "stickerInvGrid";
  invGrid.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;";
  invSection.appendChild(invGrid);
  modal.appendChild(invSection);

  // ── Missing section ───────────────────────────────────────
  const missingSection = document.createElement("div");
  missingSection.id = "stickerMissingSection";
  missingSection.style.cssText = "margin-top:16px;";
  const missingHeader = document.createElement("h3");
  missingHeader.style.cssText = "color:#555;font-size:14px;margin:0 0 10px;";
  missingHeader.textContent = "MISSING";
  const missingGrid = document.createElement("div");
  missingGrid.id = "stickerMissingGrid";
  missingGrid.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;";
  missingSection.appendChild(missingHeader);
  missingSection.appendChild(missingGrid);
  modal.appendChild(missingSection);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  function renderModal() {
    // Update progress
    const c = countCollected();
    const progressCountEl = document.getElementById("stickerProgressCount");
    const progressFillEl = document.getElementById("stickerProgressFill");
    if (progressCountEl) progressCountEl.textContent = `${c} / ${TOTAL_STICKERS}`;
    if (progressFillEl) progressFillEl.style.width = `${Math.round((c / TOTAL_STICKERS) * 100)}%`;

    // Equipped
    equGrid.innerHTML = "";
    STICKER_TYPES.forEach(type => {
      const rarity = equippedStickers[type];
      const cell = buildViewOnlyStickerCard(type, rarity ?? null, true, renderModal);
      equGrid.appendChild(cell);
    });

    // Bulk inventory
    invGrid.innerHTML = "";
    const dupes = stickerInventory.filter(s => s.count > 0);
    if (dupes.length === 0) {
      invGrid.innerHTML = `<span style="color:#555;font-size:13px;">No duplicates in inventory.</span>`;
    } else {
      dupes.forEach(s => {
        const card = buildViewOnlyStickerCard(s.type, s.rarity, false, renderModal, s.count);
        invGrid.appendChild(card);
      });
    }

    // Missing stickers
    missingGrid.innerHTML = "";
    const missingItems = [];
    STICKER_TYPES.forEach(type => {
      STICKER_RARITIES.forEach(rarity => {
        const inInv = stickerInventory.some(s => s.type === type && s.rarity === rarity && s.count > 0);
        const isEquipped = equippedStickers[type] === rarity;
        if (!inInv && !isEquipped) missingItems.push({ type, rarity });
      });
    });

    if (missingItems.length === 0) {
      missingGrid.innerHTML = `<span style="color:#ffd740;font-size:13px;">🎉 You've collected every sticker!</span>`;
      missingHeader.textContent = "MISSING — None!";
      missingHeader.style.color = "#ffd740";
    } else {
      missingHeader.textContent = `MISSING (${missingItems.length})`;
      missingHeader.style.color = "#555";
      missingItems.forEach(({ type, rarity }) => {
        const rc = RARITY_COLOR[rarity];
        const card = document.createElement("div");
        card.style.cssText = `
          background:#111;border:2px solid #2a2a2a;border-radius:10px;
          padding:8px;display:flex;flex-direction:column;align-items:center;
          min-width:90px;position:relative;opacity:0.38;
          font-family:'Comic Sans MS','Comic Sans';
          filter:grayscale(80%);
        `;

        const typeLabel = document.createElement("div");
        typeLabel.textContent = type.toUpperCase();
        typeLabel.style.cssText = `font-size:9px;color:#555;letter-spacing:1px;margin-bottom:4px;`;

        const stickerImg = document.createElement("img");
        stickerImg.src = `Textures/stickers/sticker_${type}_${rarity}.png`;
        stickerImg.style.cssText = "width:52px;height:52px;object-fit:contain;";
        stickerImg.onerror = () => { stickerImg.style.opacity="0.1"; };

        const rarLabel = document.createElement("div");
        rarLabel.textContent = rarity.toUpperCase();
        rarLabel.style.cssText = `font-size:9px;color:#444;font-weight:700;margin-top:4px;`;

        const lockIcon = document.createElement("div");
        lockIcon.textContent = "🔒";
        lockIcon.style.cssText = `position:absolute;top:4px;right:6px;font-size:11px;`;

        card.appendChild(typeLabel);
        card.appendChild(stickerImg);
        card.appendChild(rarLabel);
        card.appendChild(lockIcon);
        missingGrid.appendChild(card);
      });
    }
  }

  renderModal();
}

function buildViewOnlyStickerCard(type, rarity, isEquipped, onUpdate, count) {
  const card = document.createElement("div");
  const rc = rarity ? RARITY_COLOR[rarity] : "#444";
  card.style.cssText = `
    background:${rc}18;border:2px solid ${rc};border-radius:10px;
    padding:8px;display:flex;flex-direction:column;align-items:center;
    min-width:90px;position:relative;cursor:default;
    box-shadow:${rarity ? RARITY_GLOW[rarity] : "none"};
    font-family:'Comic Sans MS','Comic Sans';
  `;

  const typeLabel = document.createElement("div");
  typeLabel.textContent = type ? type.toUpperCase() : "—";
  typeLabel.style.cssText = `font-size:9px;color:#aaa;letter-spacing:1px;margin-bottom:4px;`;

  const stickerImg = document.createElement("img");
  if (rarity && type) {
    stickerImg.src = `Textures/stickers/sticker_${type}_${rarity}.png`;
    stickerImg.onerror = () => { stickerImg.style.opacity="0.3"; };
  }
  stickerImg.style.cssText = "width:52px;height:52px;object-fit:contain;";

  const rarLabel = document.createElement("div");
  rarLabel.textContent = rarity ? rarity.toUpperCase() : "EMPTY";
  rarLabel.style.cssText = `font-size:9px;color:${rc};font-weight:700;margin-top:4px;`;

  card.appendChild(typeLabel);
  card.appendChild(stickerImg);
  card.appendChild(rarLabel);

  if (!rarity) {
    card.style.opacity = "0.35";
    return card;
  }

  if (!isEquipped && count !== undefined) {
    const countBadge = document.createElement("div");
    countBadge.textContent = `×${count}`;
    countBadge.style.cssText = `position:absolute;top:4px;right:6px;font-size:10px;color:${rc};font-weight:700;`;
    card.appendChild(countBadge);

    const equipped = equippedStickers[type];
    if (!equipped || isBetterRarity(rarity, equipped)) {
      const equipBtn = document.createElement("button");
      equipBtn.textContent = "Equip";
      equipBtn.style.cssText = `margin-top:6px;background:#333;border:1px solid #fff4;
        border-radius:6px;color:#fff;font-size:9px;padding:3px 6px;cursor:pointer;
        font-family:'Comic Sans MS','Comic Sans';`;
      equipBtn.onclick = () => {
        const inv = stickerInventory.find(s => s.type === type && s.rarity === rarity);
        if (!inv || inv.count <= 0) return;
        inv.count--;
        if (equipped) addToInventory(type, equipped);
        equippedStickers[type] = rarity;
        refreshStickerDisplay();
        onUpdate();
      };
      card.appendChild(equipBtn);
    }
  }
  return card;
}

// ── Elefanti shop ────────────────────────────────────────────

let elefantiStock  = [];
let elefantiTimer  = 30 * 60;
let elefantiInterval = null;

function generateElefantiStock() {
  const pool = [];
  STICKER_TYPES.forEach(type => {
    STICKER_RARITIES.forEach(rarity => pool.push({ type, rarity }));
  });
  const shuffled = pool.sort(() => Math.random() - 0.5);
  elefantiStock = shuffled.slice(0, 3);
}

function startElefantiTimer() {
  if (elefantiInterval) return;
  generateElefantiStock();
  elefantiInterval = setInterval(() => {
    elefantiTimer--;
    if (elefantiTimer <= 0) {
      generateElefantiStock();
      elefantiTimer = 30 * 60;
    }
  }, 1000);
}

function openElefantiShop() {
  const existing = document.getElementById("elefantiShopOverlay");
  if (existing) return;
  player.style.display = "none";

  const overlay = document.createElement("div");
  overlay.id = "elefantiShopOverlay";
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,0.82);z-index:10001;
    display:flex;align-items:center;justify-content:center;
    cursor:default;font-family:'Comic Sans MS','Comic Sans';
  `;

  const mainWrap = document.createElement("div");
  mainWrap.style.cssText = `display:flex;gap:20px;align-items:flex-start;max-width:1300px;width:100%;padding:0 20px;`;

  const guiWrap = document.createElement("div");
  guiWrap.style.cssText = `position:relative;width:900px;max-width:60vw;height:850px;flex-shrink:0;`;

  const suitcaseImg = document.createElement("img");
  suitcaseImg.src = "Textures/suitcase.png";
  suitcaseImg.draggable = false;
  suitcaseImg.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;pointer-events:none;";
  guiWrap.appendChild(suitcaseImg);

  const mins = Math.floor(elefantiTimer / 60);
  const secs = elefantiTimer % 60;
  const timerBadge = document.createElement("div");
  timerBadge.id = "elefantiShopTimer";
  timerBadge.style.cssText = `
    position:absolute;top:8%;left:50%;transform:translateX(-50%);
    background:rgba(0,0,0,0.65);color:#ffd740;
    padding:4px 14px;border-radius:8px;font-size:13px;font-weight:700;
    white-space:nowrap;pointer-events:none;z-index:5;
  `;
  timerBadge.textContent = `Refreshes in ${mins}:${String(secs).padStart(2,"0")}`;
  guiWrap.appendChild(timerBadge);

  const timerTick = setInterval(() => {
    const m = Math.floor(elefantiTimer / 60);
    const s = elefantiTimer % 60;
    if (timerBadge.isConnected)
      timerBadge.textContent = `Refreshes in ${m}:${String(s).padStart(2,"0")}`;
    else clearInterval(timerTick);
  }, 1000);

  const cardArea = document.createElement("div");
  cardArea.id = "elefantiCardArea";
  cardArea.style.cssText = `
    position:absolute;
    top:28%;left:15%;width:70%;height:50%;
    display:flex;gap:4%;align-items:center;justify-content:center;
    z-index:4;
  `;

  function renderShopCards() {
    cardArea.innerHTML = "";
    elefantiStock.forEach(item => {
      const rc = RARITY_COLOR[item.rarity];
      const basePrice = STICKER_BUY_PRICE[item.rarity];
      const price = applyDiscount(basePrice);

      const card = document.createElement("div");
      card.style.cssText = `
        background:${rc}18;border:2px solid ${rc};border-radius:12px;
        padding:12px 8px;display:flex;flex-direction:column;align-items:center;
        flex:1;max-width:170px;box-shadow:${RARITY_GLOW[item.rarity]};
        font-family:'Comic Sans MS','Comic Sans';
      `;

      const stickerImg = document.createElement("img");
      stickerImg.src = `Textures/stickers/sticker_${item.type}_${item.rarity}.png`;
      stickerImg.style.cssText = "width:58px;height:58px;object-fit:contain;margin-bottom:6px;";
      stickerImg.onerror = () => { stickerImg.style.opacity="0.3"; };

      const nameDiv = document.createElement("div");
      nameDiv.style.cssText = `font-size:10px;color:${rc};font-weight:700;margin-bottom:2px;text-align:center;`;
      nameDiv.textContent = `${item.rarity.toUpperCase()} ${item.type.toUpperCase()}`;

      const descDiv = document.createElement("div");
      descDiv.style.cssText = "font-size:8px;color:#ccc;text-align:center;margin-bottom:10px;";
      descDiv.textContent = stickerBoostDescription(item.type, item.rarity);

      const buyBtn = document.createElement("button");
      buyBtn.innerHTML = `Buy — ${price} 🪙`;
      buyBtn.style.cssText = `background:${rc};border:none;border-radius:8px;
        color:#111;font-size:10px;font-weight:700;padding:6px 10px;cursor:pointer;
        font-family:'Comic Sans MS','Comic Sans';white-space:nowrap;`;

      buyBtn.onclick = () => {
        if (playerTotalCoins < price) {
          showComboMessage("Not enough 🪙 Coins!", 1500);
          return;
        }
        playerTotalCoins -= price;
        awardSticker(item.type, item.rarity);
        updateDisplay();
        refreshStickerDisplay();
        showComboMessage(
          `Bought <span style="color:${rc}">${item.rarity} ${item.type}</span> sticker!`, 2000
        );
        playBuyGloveAnimation(
          { img: `Textures/stickers/sticker_${item.type}_${item.rarity}.png`, name: `${item.rarity} ${item.type} Sticker` },
          rc
        );
        if (invPanel && invPanel._render) invPanel._render();
      };

      card.appendChild(stickerImg);
      card.appendChild(nameDiv);
      card.appendChild(descDiv);
      card.appendChild(buyBtn);
      cardArea.appendChild(card);
    });
  }

  renderShopCards();
  guiWrap.appendChild(cardArea);

  // Grab the existing reroll button from the DOM
  const rerollBtn = document.getElementById("rerollBtn");
  const rerollBtnWrapper = document.getElementById("rerollBtnWrapper");

  function updateRerollBtn() {
    rerollBtn.disabled = playerTotalTickets < 1;
    rerollBtn.style.opacity = playerTotalTickets >= 1 ? "1" : "0.5";
    rerollBtn.style.cursor = playerTotalTickets >= 1 ? "pointer" : "not-allowed";
  }
  updateRerollBtn();

  rerollBtn.onclick = () => {
    playerTotalTickets--;
    generateElefantiStock();
    renderShopCards();
    updateRerollBtn();
    updateDisplay();
  };

  guiWrap.appendChild(rerollBtnWrapper);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✖";
  closeBtn.style.cssText = `
    position:absolute;top:3%;right:3%;background:none;border:none;
    color:#fff;font-size:24px;cursor:pointer;font-family:inherit;z-index:6;
    text-shadow:1px 1px 3px black;
  `;
  closeBtn.onclick = () => { 
    // Return rerollBtn to its original parent before closing
    document.getElementById("suspiciousShopGui").appendChild(rerollBtnWrapper);
    overlay.remove(); 
    clearInterval(timerTick); 
    player.style.display="block"; 
  };
  guiWrap.appendChild(closeBtn);

  mainWrap.appendChild(guiWrap);

  const invPanel = buildStickerInventoryPanel(() => {
    updateRerollBtn();
  });
  invPanel.style.cssText += `flex-shrink:0;`;
  mainWrap.appendChild(invPanel);

  overlay.appendChild(mainWrap);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      // Return rerollBtn to its original parent before closing
      document.getElementById("suspiciousShopGui").appendChild(rerollBtnWrapper);
      overlay.remove();
      clearInterval(timerTick);
      player.style.display = "block";
    }
  });

  document.body.appendChild(overlay);
}

// ── Inventory button on main page ───────────────────────────
const stickerInventoryBtn = document.getElementById("stickerInventoryBtn")
stickerInventoryBtn.onclick = () => { openStickerInventory(); };


// ============================================================
// KONAMI CODE CHEAT  ↑ ↑ ↓ ↓ ← → ← → B A
// Unlocks: all gloves, all stickers, unlimited resources
// ============================================================

(function () {
  const KONAMI = [
    "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
    "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
    "b","a"
  ];
  let konamiProgress = 0;

  // ── Inject styles ──────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    /* Rainbow shimmer overlay */
    #konamiRainbowOverlay {
      position: fixed;
      inset: 0;
      z-index: 999999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.4s ease;
      background: linear-gradient(
        135deg,
        #ff0000, #ff7700, #ffff00,
        #00ff00, #00ffff, #0077ff,
        #8800ff, #ff00ff, #ff0000
      );
      background-size: 400% 400%;
      animation: konamiRainbowShift 1.2s linear infinite;
      mix-blend-mode: color;
    }
    #konamiRainbowOverlay.active {
      opacity: 0.55;
    }

    /* Scanline pulse on top of rainbow */
    #konamiRainbowOverlay::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        rgba(0,0,0,0.18) 3px,
        rgba(0,0,0,0.18) 4px
      );
      animation: konamiScanlines 0.08s linear infinite;
    }

    @keyframes konamiRainbowShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes konamiScanlines {
      0%   { background-position: 0 0; }
      100% { background-position: 0 8px; }
    }

    /* Central cheat banner */
    #konamiBanner {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.4) rotate(-6deg);
      z-index: 9999999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.25s ease, transform 0.45s cubic-bezier(.17,.67,.3,1.5);
      font-family: 'Comic Sans MS', 'Comic Sans', cursive;
      text-align: center;
      filter: drop-shadow(0 0 40px rgba(255,255,255,0.9));
    }
    #konamiBanner.active {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1) rotate(0deg);
    }
    #konamiBanner .cheat-title {
      font-size: clamp(36px, 6vw, 80px);
      font-weight: 900;
      letter-spacing: 3px;
      background: linear-gradient(90deg,
        #ff0000 0%, #ff8800 14%, #ffff00 28%,
        #00ff00 42%, #00ccff 57%, #0055ff 71%,
        #aa00ff 85%, #ff00cc 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      background-size: 200% auto;
      animation: konamiTextFlow 1s linear infinite;
      text-shadow: none;
      line-height: 1.1;
    }
    #konamiBanner .cheat-sub {
      font-size: clamp(14px, 2.2vw, 26px);
      color: white;
      text-shadow:
        0 0 10px #ff00ff,
        0 0 20px #00ffff,
        2px 2px 0 rgba(0,0,0,0.6);
      margin-top: 10px;
      animation: konamiSubPulse 0.6s ease-in-out infinite alternate;
    }
    #konamiBanner .cheat-emoji {
      font-size: clamp(28px, 5vw, 64px);
      filter: drop-shadow(0 0 16px gold);
      animation: konamiSpin 2s linear infinite;
      display: inline-block;
      margin: 0 8px;
      -webkit-text-fill-color: initial;
    }

    @keyframes konamiTextFlow {
      0%   { background-position: 0% center; }
      100% { background-position: 200% center; }
    }
    @keyframes konamiSubPulse {
      from { text-shadow: 0 0 10px #ff00ff, 0 0 20px #00ffff, 2px 2px 0 rgba(0,0,0,0.6); }
      to   { text-shadow: 0 0 25px #ffff00, 0 0 40px #ff00ff, 2px 2px 0 rgba(0,0,0,0.6); }
    }
    @keyframes konamiSpin {
      0%   { transform: rotate(0deg)   scale(1); }
      50%  { transform: rotate(180deg) scale(1.3); }
      100% { transform: rotate(360deg) scale(1); }
    }

    /* Edge-burst particles */
    .konami-spark {
      position: fixed;
      pointer-events: none;
      z-index: 9999998;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      animation: konamiSparkFly var(--dur) ease-out forwards;
    }
    @keyframes konamiSparkFly {
      0%   { transform: translate(0,0) scale(1); opacity: 1; }
      100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
    }

    /* Corner glow pulses */
    .konami-corner-glow {
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999990;
      animation: konamiCornerPulse 0.8s ease-in-out infinite alternate;
      opacity: 0.7;
    }
    #konamiCornerTL { top: -80px; left: -80px;  background: radial-gradient(circle, #ff00aa88, transparent 70%); }
    #konamiCornerTR { top: -80px; right: -80px; background: radial-gradient(circle, #00ffff88, transparent 70%); }
    #konamiCornerBL { bottom: -80px; left: -80px;  background: radial-gradient(circle, #ffff0088, transparent 70%); }
    #konamiCornerBR { bottom: -80px; right: -80px; background: radial-gradient(circle, #00ff8888, transparent 70%); }
    @keyframes konamiCornerPulse {
      from { transform: scale(1); opacity: 0.5; }
      to   { transform: scale(1.6); opacity: 0.9; }
    }

    /* HUD flash on resource icons */
    @keyframes konamiHudFlash {
      0%,100% { filter: none; }
      25%  { filter: drop-shadow(0 0 12px gold) brightness(1.5); }
      50%  { filter: drop-shadow(0 0 24px #ff00ff) brightness(1.8); }
      75%  { filter: drop-shadow(0 0 12px #00ffff) brightness(1.5); }
    }
    .konami-hud-flash {
      animation: konamiHudFlash 0.4s ease 3;
    }
  `;
  document.head.appendChild(style);

  // ── Build DOM elements ─────────────────────────────────────
  const rainbowOverlay = document.createElement("div");
  rainbowOverlay.id = "konamiRainbowOverlay";
  document.body.appendChild(rainbowOverlay);

  const banner = document.createElement("div");
  banner.id = "konamiBanner";
  banner.innerHTML = `
    <div class="cheat-title">✦ CHEAT ACTIVATED ✦</div>
    <div class="cheat-sub">
      <span class="cheat-emoji">🧤</span> All Gloves Unlocked
      <span class="cheat-emoji">⭐</span><br>
      <span class="cheat-emoji">🍎</span> Unlimited Apples &amp; Coins &amp; Tickets
      <span class="cheat-emoji">🪙</span>
    </div>
  `;
  document.body.appendChild(banner);

  // Corner glows
  ["TL","TR","BL","BR"].forEach(pos => {
    const div = document.createElement("div");
    div.id = `konamiCorner${pos}`;
    div.className = "konami-corner-glow";
    div.style.display = "none";
    document.body.appendChild(div);
  });

  // ── Spark burst ────────────────────────────────────────────
  const SPARK_COLORS = [
    "#ff0055","#ff8800","#ffff00","#00ff88",
    "#00ccff","#aa00ff","#ff00cc","#ffffff"
  ];

  function burstSparks(count = 80) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement("div");
      spark.className = "konami-spark";
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist  = 200 + Math.random() * 400;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const dur = 0.6 + Math.random() * 0.8;
      const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
      spark.style.cssText = `
        left:${cx}px; top:${cy}px;
        background:${color};
        box-shadow: 0 0 6px ${color};
        --tx:${tx}px; --ty:${ty}px; --dur:${dur}s;
      `;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), (dur + 0.1) * 1000);
    }
  }

  // ── HUD flash ──────────────────────────────────────────────
  function flashHUD() {
    ["appleCount","ticketCount","coinCount","clickCount","punchCount"].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove("konami-hud-flash");
      void el.offsetWidth;
      el.classList.add("konami-hud-flash");
      setTimeout(() => el.classList.remove("konami-hud-flash"), 1400);
    });
  }

  // ── Activate cheat ─────────────────────────────────────────
  function activateKonami() {
    // 1. Unlock ALL gloves
    gloves.forEach(g => ownedGloveIds.add(g.id));

    // 2. Give all stickers (legendary tier for every type)
    STICKER_TYPES.forEach(type => {
      STICKER_RARITIES.forEach(rarity => {
        const entry = stickerInventory.find(s => s.type === type && s.rarity === rarity);
        if (!entry) stickerInventory.push({ type, rarity, count: 1 });
        else entry.count = Math.max(entry.count, 1);
      });
      // Equip the best rarity automatically
      if (!equippedStickers[type] || RARITY_RANK[equippedStickers[type]] < RARITY_RANK["legendary"]) {
        const existing = equippedStickers[type];
        if (existing) addToInventory(type, existing);
        equippedStickers[type] = "legendary";
      }
    });

    // 3. Unlimited resources — set to a huge number
    const BIG = 999_999_999_999_999;
    playerTotalApples  = BIG;
    playerTotalCoins   = BIG;
    playerTotalTickets = BIG;

    // 4. Also give a ton of points for good measure
    totalPoints = BIG;
    eternityFragments = 9;

    // 5. Unlock Eternity glove
    ownedGloveIds.add(999);

    // 6. Refresh all UI
    updateDisplay();
    refreshStickerDisplay();
    if (typeof updateShopItems === "function") updateShopItems();
    if (typeof updateVendingUI === "function") updateVendingUI();

    flashHUD();

    // 7. Show rainbow animation
    rainbowOverlay.classList.add("active");
    banner.classList.add("active");
    document.querySelectorAll(".konami-corner-glow").forEach(el => el.style.display = "block");

    burstSparks(100);

    // Repeat sparks a couple more times
    setTimeout(() => burstSparks(60), 400);
    setTimeout(() => burstSparks(40), 900);

    // Play a sound if available
    try {
      const snd = document.getElementById("buyGloveSound");
      if (snd) { const c = snd.cloneNode(true); c.play(); }
    } catch(_) {}

    // Show combo message
    if (typeof showComboMessage === "function") {
      showComboMessage(
        `<span style="background:linear-gradient(90deg,#ff0080,#ffff00,#00ffff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:1.1em;">
          🎮 KONAMI CODE — CHEAT ACTIVATED! 🎮
        </span>`, 5000
      );
    }

    // Hide after 4 seconds
    setTimeout(() => {
      rainbowOverlay.classList.remove("active");
      banner.classList.remove("active");
      document.querySelectorAll(".konami-corner-glow").forEach(el => el.style.display = "none");
    }, 4000);
  }

  // ── Key listener ───────────────────────────────────────────
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    const expected = KONAMI[konamiProgress].toLowerCase();

    if (key === expected) {
      konamiProgress++;
      if (konamiProgress === KONAMI.length) {
        konamiProgress = 0;
        activateKonami();
      }
    } else {
      konamiProgress = (key === KONAMI[0].toLowerCase()) ? 1 : 0;
    }
  });

})();


// ── Start Elefanti timer & init display ──────────────────────
startElefantiTimer();
createStickerPanel();
refreshStickerDisplay();

updateDisplay();