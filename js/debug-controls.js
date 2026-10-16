function setupDebugControls(engine) {
  const directionIndexes = {up: 0, right: 1, down: 2, left: 3};

  const buttons = document.querySelectorAll(
    "#debug-controls button[data-direction]"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const directionName = button.dataset.direction;
      const directionIndex = directionIndexes[directionName];

      engine.debugMove(directionIndex);
    });
  });

  document.addEventListener("keydown", (event) => {
    const keyDirectionIndexes = {ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3};

    const directionIndex = keyDirectionIndexes[event.key];

    if (directionIndex === undefined) {
      return;
    }

    event.preventDefault();
    engine.debugMove(directionIndex);
  });

  // 矢印表示・非表示切り替え
  const togglePlayerButton = document.getElementById(
    "toggle-player-button"
  );

  let isPlayerVisible = true;

  togglePlayerButton.addEventListener("click", () => {
    isPlayerVisible = !isPlayerVisible;

    engine.setPlayerVisible(isPlayerVisible);

    togglePlayerButton.textContent = isPlayerVisible
      ? "消"
      : "表";

    togglePlayerButton.setAttribute(
      "aria-pressed",
      String(!isPlayerVisible)
    );
  });
}