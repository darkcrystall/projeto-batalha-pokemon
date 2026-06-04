/* elementos das telas */
const startBtn = document.getElementById("startBtn");
const battleBtn = document.getElementById("battle-start-btn")
/* inputs e botões */
const searchBtn = document.querySelectorAll(".search-btn");
const searchInput = document.querySelectorAll(".search-input");
/* tooltip (popup de ajuda) */
const tooltipSelec = document.querySelectorAll("#tooltip-selection");
const tooltipSText = document.querySelectorAll(".tooltip-text");
/* telas */
const startScreen = document.getElementById("start");
const selectionScreen = document.getElementById("selection-screen");
const battleScreen = document.getElementById("battle-screen");
/* áudio */
const audio = document.getElementById("battle-theme");
/* ao iniciar o jogo */
startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  audio.play().catch(() => {});
});
/* depois de escolher */
checkSelected(); // chama a função de checar (por causa dos ouvintes)
searchBtn.forEach((btn, index) => {
  btn.addEventListener("click", async () => {
    const input = searchInput[index];
    const tooltip = tooltipSelec[index];
    if (!input.value.trim()) {
      input.value = Math.floor(Math.random() * 1025) + 1;
      tooltip.textContent = "Escolhemos um para você!";
      tooltip.style.visibility = "visible";
      tooltip.style.opacity = 1;
      setTimeout(() => {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = 0;
      }, 2000);
    }
    await fetchPokemon(input.value);
    // dispara o evento manualmente para checar, porque o usuário não digitou
    input.dispatchEvent(new Event("input"));
  });
});
function checkSelected() {
  searchInput.forEach((el) => {
    el.addEventListener("input", () => {
      const filled = [...searchInput].every(inp => inp.value.trim() !== "");
      battleBtn.disabled = !filled;
    });
  });
}
battleBtn.addEventListener("click", () => {
  selectionScreen.classList.add("hidden");
  battleScreen.classList.remove("hidden");
  audio.currentTime = 0;
})