"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const mazeElement = document.getElementById("maze");
  const engine = new MazeEngine(mazeElement);

  engine.initialize();

  setupUI(engine);
  setupDebugControls(engine);
});
