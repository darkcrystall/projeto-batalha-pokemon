const API = "https://pokeapi.co/api/v2"; // api
/* elementos das telas */
const startBtn = document.getElementById("start-btn");
const battleBtn = document.getElementById("battle-start-btn");
/* inputs e botões */
const searchBtn = document.querySelectorAll(".search-btn");
const searchInput = document.querySelectorAll(".search-input");
/* telas */
const startScreen = document.getElementById("start");
const selectionScreen = document.getElementById("selection-screen");
const battleScreen = document.getElementById("battle-screen");
/* áudio */
const audio = document.getElementById("battle-theme");
/* tooltip (popup de ajuda) */
const tooltipSelec = document.querySelectorAll("#tooltip-selection");
const tooltipSText = document.querySelectorAll("#tooltip-text");
/* elementos especificos de cada jogador */
const playerSearchBtn = document.getElementById("player-search-btn");
const enemySearchBtn = document.getElementById("enemy-search-btn");
const playerSearchInput = document.getElementById("player-search");
const enemySearchInput = document.getElementById("enemy-search");
const playerPreview = document.getElementById("player-preview");
const enemyPreview = document.getElementById("enemy-preview");
/* menu e moves */
const dialogText = document.getElementById("dialog-text");
const movesMenu = document.getElementById("moves-menu");
const movesGrid = document.getElementById("moves-grid");
const movePP = document.getElementById("move-pp");
const moveType = document.getElementById("move-type");
/* jogadores status */
const playerSprite = document.getElementById("player-sprite");
const enemySprite = document.getElementById("enemy-sprite");
const playerNameStatus = document.getElementById("player-name");
const playerLevel = document.getElementById("player-level");
const playerHpBar = document.getElementById("player-hp-bar");
const playerHpNums = document.getElementById("player-hp-numbers");
const enemyNameStatus = document.getElementById("enemy-name");
const enemyLevel = document.getElementById("enemy-level");
const enemyHpBar = document.getElementById("enemy-hp-bar");
const enemyHpNums = document.getElementById("enemy-hp-numbers");
/* estado dos jogadores */
let playerData = null;
let enemyData = null;
let pLevel = null;
let eLevel = null;
let playerHP = 0,
  playerMaxHP = 0;
let enemyHP = 0,
  enemyMaxHP = 0;
/* seleção de movimento */
let selectedMove = 0;
/* ao iniciar o jogo */
startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  selectionScreen.classList.remove("hidden");
  audio.play().catch(() => {});
});
/* depois de escolher */
searchBtn.forEach((btn, index) => {
  btn.addEventListener("click", async () => {
    const input = searchInput[index];
    const tooltip = tooltipSelec[index];
    const tooltipTxt = tooltipSText[index];
    if (!input.value.trim()) {
      input.value = Math.floor(Math.random() * 1025) + 1;
      tooltipTxt.textContent = "Escolhemos um para você!";
      tooltip.style.visibility = "visible";
      tooltip.style.opacity = 1;
      setTimeout(() => {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = 0;
      }, 2000);
    }

    if (index === 0) {
      await searchPokemon("player");
    } else {
      await searchPokemon("enemy");
    }
  });
});
function checkBattleReady() {
  battleBtn.disabled = !(playerData && enemyData);
}
/* seleção */
playerSearchBtn.addEventListener("click", () => searchPokemon("player"));
enemySearchBtn.addEventListener("click", () => searchPokemon("enemy"));
playerSearchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchPokemon("player");
});
enemySearchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchPokemon("enemy");
});
/* começo da batalha */
battleBtn.addEventListener("click", () => {
  selectionScreen.classList.add("hidden");
  battleScreen.classList.remove("hidden");
  audio.play().catch(() => {});
  startBattle();
});
/* busca */
async function fetchPokemon(nameOrId) {
  const res = await fetch(`${API}/pokemon/${nameOrId}`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}
async function searchPokemon(who) {
  const input = who === "player" ? playerSearchInput : enemySearchInput;
  const query = input.value.trim().toLowerCase();
  if (!query) return;

  const preview = who === "player" ? playerPreview : enemyPreview;
  preview.innerHTML = '<div class="preview-placeholder">⏳</div>';

  try {
    const data = await fetchPokemon(query);
    if (who === "player") {
      playerData = data;
    } else {
      enemyData = data;
    }
    checkBattleReady();
    const sprites = data.sprites;
    const imgSrc = sprites.front_default;
    preview.innerHTML = `<img src="${imgSrc}" alt="${data.name}" />`;
  } catch (err) {
    if (who === "player") {
      playerData = null;
    } else {
      enemyData = null;
    }
    checkBattleReady();
    preview.innerHTML =
      '<div class="preview-placeholder" style="font-size:10px;color:#f88">404</div>';
  }
}
async function startBattle() {
  const pSprites = playerData.sprites;
  const eSprites = enemyData.sprites;

  playerSprite.src = pSprites.back_default
    ? pSprites.back_default
    : pSprites.front_default;
  enemySprite.src = eSprites.front_default;

  const playerName = playerData.name;
  const enemyName = enemyData.name;

  playerNameStatus.textContent = playerName;
  enemyNameStatus.textContent = enemyName;

  getLevel();
  playerLevel.textContent = pLevel;
  enemyLevel.textContent = eLevel;

  getMoves();

  playerHP = playerMaxHP = getHP(playerData);
  enemyHP = enemyMaxHP = getHP(enemyData);
  updateHPBar("player");
  updateHPBar("enemy");

  showDialog(playerName);
}
function expToLevel(exp) {
  return Math.max(1, Math.min(100, Math.floor(exp / 3)));
}
function getLevel() {
  pLevel = expToLevel(playerData.base_experience);
  eLevel = expToLevel(enemyData.base_experience);
}
async function getMoves() {
  // sorteia aleatoriamente e pega 4
  const moves = [...playerData.moves]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  moves.forEach(async (object, i) => {
    const div = document.createElement("div");
    const btn = document.createElement("button");
    btn.className = "move-btn";
    btn.textContent = object.move.name;

    const res = await fetch(object.move.url);
    const data = await res.json();
    const type = data.type.name;
    const pp = data.pp;

    btn.classList.add(`type-${type}`);
    btn.dataset.type = type;
    btn.dataset.pp = pp;
    btn.dataset.maxPp = pp;

    div.appendChild(btn);
    movesGrid.appendChild(div);
  });

  const btns = movesGrid.querySelectorAll(".move-btn");
  updateSelector(btns);
}
async function showDialog(name) {
  dialog = `What ${name} would do?`; 
  for (let i = 0; i <= dialog.length; i++) {
    dialogText.textContent = dialog.slice(0, i);
    await new Promise((r) => setTimeout(r, 30));
  }
}
function updateMoveInfo(btn) {
  movePP.textContent = `PP ${btn.dataset.pp}/${btn.dataset.maxPp}`;
  moveType.textContent = `TIPO: ${btn.dataset.type.toUpperCase()}`;
}
function getHP(data) {
  const hpStat = data.stats.find((s) => s.stat.name === "hp");
  return hpStat.base_stat * 2;
}
function updateHPBar(who) {
  const hp = who === "player" ? playerHP : enemyHP;
  const maxHP = who === "player" ? playerMaxHP : enemyMaxHP;
  const bar = who === "player" ? playerHpBar : enemyHpBar;
  const hpNumbers = who === "player" ? playerHpNums : enemyHpNums;

  const pct = (hp / maxHP) * 100;
  bar.style.width = `${pct}%`;

  if (pct < 30) {
    bar.classList.add("red");
  } else if (pct < 60) {
    bar.classList.add("yellow");
  } else {
    bar.classList.remove("yellow", "red");
  }

  hpNumbers.textContent = `${hp} / ${maxHP}`;
}
document.addEventListener("keydown", (e) => {
  const btns = movesGrid.querySelectorAll(".move-btn");
  if (!btns.length) return;

  if (e.key === "ArrowRight") selectedMove = (selectedMove + 1) % btns.length;
  if (e.key === "ArrowLeft")
    selectedMove = (selectedMove - 1 + btns.length) % btns.length;
  if (e.key === "ArrowDown") selectedMove = (selectedMove + 2) % btns.length;
  if (e.key === "ArrowUp")
    selectedMove = (selectedMove - 2 + btns.length) % btns.length;

  updateSelector(btns);
});
function updateSelector(btns) {
  btns.forEach((btn, i) => {
    btn.classList.toggle("selected", i === selectedMove);
    if (i === selectedMove) updateMoveInfo(btn);
  });
}
