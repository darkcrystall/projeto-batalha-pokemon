const API = 'https://pokeapi.co/api/v2'; // api
/* elementos das telas */
const startBtn = document.getElementById("startBtn");
const battleBtn = document.getElementById("battle-start-btn")
/* inputs e botões */
const searchBtn = document.querySelectorAll(".search-btn");
const searchInput = document.querySelectorAll(".search-input");
/* telas */
const startScreen = document.getElementById("start");
const selectionScreen = document.getElementById("selection-screen");
const battleScreen = document.getElementById("battle-screen");
/* áudio */
const audio = document.getElementById("battle-theme");
/* elementos especificos de cada jogador */
const playerSearchBtn = document.getElementById('player-search-btn');
const enemySearchBtn  = document.getElementById('enemy-search-btn');
const playerSearchInput = document.getElementById('player-search');
const enemySearchInput  = document.getElementById('enemy-search');
const playerPreview     = document.getElementById('player-preview');
const enemyPreview      = document.getElementById('enemy-preview');
/* menu e moves */
const dialogText   = document.getElementById('dialog-text');
const movesMenu    = document.getElementById('moves-menu');
const movesGrid    = document.getElementById('moves-grid');
const movePP       = document.getElementById('move-pp');
const moveType     = document.getElementById('move-type');
/* jogadores status */
const playerSprite  = document.getElementById('player-sprite');
const enemySprite   = document.getElementById('enemy-sprite');
const playerName    = document.getElementById('player-name');
const playerLevel   = document.getElementById('player-level');
const playerHpBar   = document.getElementById('player-hp-bar');
const playerHpNums  = document.getElementById('player-hp-numbers');
const enemyName     = document.getElementById('enemy-name');
const enemyLevel    = document.getElementById('enemy-level');
const enemyHpBar    = document.getElementById('enemy-hp-bar');
const enemyHpNums   = document.getElementById('enemy-hp-numbers');
/* estado dos jogadores */
let playerData = null;
let enemyData  = null;
let playerHP = 0, playerMaxHP = 0;
let enemyHP  = 0, enemyMaxHP  = 0;
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

    if (!input.value.trim()) {
      input.value = Math.floor(Math.random() * 1025) + 1;
    }

    if (index === 0) {
      await searchPokemon('player');
    } else {
      await searchPokemon('enemy');
    }
  });
});
function checkBattleReady() {
  battleBtn.disabled = !(playerData && enemyData);
}
/* seleção */
playerSearchBtn.addEventListener('click', () => searchPokemon('player'));
enemySearchBtn.addEventListener('click',  () => searchPokemon('enemy'));
playerSearchInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchPokemon('player'); });
enemySearchInput.addEventListener('keydown',  e => { if (e.key === 'Enter') searchPokemon('enemy'); });

battleBtn.addEventListener("click", () => {
  selectionScreen.classList.add('hidden');
  battleScreen.classList.remove('hidden');
  audio.play().catch(() => {});
  startBattle();
})
/* busca */
async function fetchPokemon(nameOrId) {
  const res = await fetch(`${API}/pokemon/${nameOrId}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}
async function searchPokemon(who) {
  const input  = who === 'player' ? playerSearchInput : enemySearchInput;
  const query  = input.value.trim().toLowerCase();
  if (!query) return;

  const preview = who === 'player' ? playerPreview : enemyPreview;
  preview.innerHTML = '<div class="preview-placeholder">⏳</div>';

  try {
    const data = await fetchPokemon(query);
    if (who === 'player') { 
      playerData = data; 
    } else { 
      enemyData  = data;
    }
    checkBattleReady();
    const sprites = data.sprites;
    const imgSrc  = sprites.front_default;
    preview.innerHTML = `<img src="${imgSrc}" alt="${data.name}" />`;
  } catch (err) {
    if (who === 'player') {
    playerData = null;
  } else {
    enemyData = null;
  }
  checkBattleReady();
    preview.innerHTML = '<div class="preview-placeholder" style="font-size:10px;color:#f88">404</div>';
  }
}
function startBattle() {
  const pSprites = playerData.sprites;
  const eSprites = enemyData.sprites;
  playerSprite.src = pSprites.back_default;
  enemySprite.src  = eSprites.front_default;

  playerName.textContent  = playerData.name;
  enemyName.textContent   = enemyData.name;
  playerLevel.textContent = pLevel;
  enemyLevel.textContent  = eLevel;
}