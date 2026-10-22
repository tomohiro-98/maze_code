"use strict";

function setupDebugControls(engine) {
  const directionIndexes = {
    up: 0,
    right: 1,
    down: 2,
    left: 3
  };

  const keyboardDirectionIndexes = {
    ArrowUp: 0,
    ArrowRight: 1,
    ArrowDown: 2,
    ArrowLeft: 3
  };

  const directionButtons = document.querySelectorAll(
    "#debug-controls button[data-direction]"
  );

  directionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const directionName = button.dataset.direction;
      const directionIndex = directionIndexes[directionName];

      engine.debugMove(directionIndex);
    });
  });

  document.addEventListener("keydown", (event) => {
    const directionIndex =
      keyboardDirectionIndexes[event.key];

    if (directionIndex === undefined) {
      return;
    }

    event.preventDefault();
    engine.debugMove(directionIndex);
  });

  const toggleButton = document.getElementById(
    "toggle-player-button"
  );

  let isPlayerVisible = true;

  toggleButton.addEventListener("click", () => {
    isPlayerVisible = !isPlayerVisible;

    engine.setPlayerVisible(isPlayerVisible);

    toggleButton.textContent = isPlayerVisible
      ? "🫥"
      : "😶";

    toggleButton.setAttribute(
      "aria-pressed",
      String(!isPlayerVisible)
    );
  });
}
