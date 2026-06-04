const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("start");
const audio = document.getElementById("battle-theme");

startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  audio.play().catch(() => {});
});