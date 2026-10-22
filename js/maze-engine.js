"use strict";

class MazeEngine {
  constructor(mazeElement) {
    this.mazeElement = mazeElement;
    this.playerElement = null;

    this.position = {
      row: START.row,
      col: START.col
    };

    this.direction = START.direction;
    this.rotationAngle = DIRECTIONS[START.direction].rotation;
    this.isRunning = false;
  }

  initialize() {
    this.renderMaze();
    this.createPlayer();
    this.reset();
  }

  renderMaze() {
    this.mazeElement.replaceChildren();

    for (let row = 0; row < MAZE_SIZE; row += 1) {
      for (let col = 0; col < MAZE_SIZE; col += 1) {
        const tile = this.createTile(row, col);
        this.mazeElement.appendChild(tile);
      }
    }
  }

  createTile(row, col) {
    const tile = document.createElement("div");
    tile.classList.add("tile");

    const cellNumber = positionToCellNumber(row, col);

    tile.classList.add(
      cellNumber === null ? "outer-tile" : "center-tile"
    );

    if (row === START.row && col === START.col) {
      tile.classList.add("start-tile");
    }

    if (row === GOAL.row && col === GOAL.col) {
      tile.classList.add("goal-tile");
      tile.appendChild(this.createGoalImage());
    }

    this.addWallLines(tile, row, col);

    const label = document.createElement("span");
    label.className = "tile-label";
    label.textContent = getTileLabel(row, col);

    if (label.textContent) {
      tile.classList.add("label-bottom-tile");
    }

    tile.appendChild(label);

    return tile;
  }

  createGoalImage() {
    const image = document.createElement("img");

    image.className = "goal-image";
    image.src = "./img/goal.png";
    image.alt = "ゴール";

    return image;
  }

  // addWallLines(tile, row, col) {
  //   const wallDefinitions = [
  //     {
  //       className: "wall-line-top",
  //       canCheck: row > 0,
  //       nextRow: row - 1,
  //       nextCol: col
  //     },
  //     {
  //       className: "wall-line-right",
  //       canCheck: col < MAZE_SIZE - 1,
  //       nextRow: row,
  //       nextCol: col + 1
  //     },
  //     {
  //       className: "wall-line-bottom",
  //       canCheck: row < MAZE_SIZE - 1,
  //       nextRow: row + 1,
  //       nextCol: col
  //     },
  //     {
  //       className: "wall-line-left",
  //       canCheck: col > 0,
  //       nextRow: row,
  //       nextCol: col - 1
  //     }
  //   ];

  //   wallDefinitions.forEach((wall) => {
  //     if (
  //       wall.canCheck &&
  //       hasWallBetween(row, col, wall.nextRow, wall.nextCol)
  //     ) {
  //       const wallElement = document.createElement("span");
  //       wallElement.className = `wall-line ${wall.className}`;
  //       tile.appendChild(wallElement);
  //     }
  //   });
  // }

  addWallLines(tile, row, col) {
  /*
   * 壁線は中央6×6迷路のセルからだけ描画する。
   *
   * 外周通路のセルからも壁を描画すると、
   * 中央セルとの間に同じ壁が二重に作成され、
   * 迷路の四隅などに不要な壁が表示される。
   */
  if (!isCenterCell(row, col)) {
    return;
  }

  const wallDefinitions = [
    {
      className: "wall-line-top",
      canCheck: row > 0,
      nextRow: row - 1,
      nextCol: col
    },
    {
      className: "wall-line-right",
      canCheck: col < MAZE_SIZE - 1,
      nextRow: row,
      nextCol: col + 1
    },
    {
      className: "wall-line-bottom",
      canCheck: row < MAZE_SIZE - 1,
      nextRow: row + 1,
      nextCol: col
    },
    {
      className: "wall-line-left",
      canCheck: col > 0,
      nextRow: row,
      nextCol: col - 1
    }
  ];

  wallDefinitions.forEach((wall) => {
    if (
      wall.canCheck &&
      hasWallBetween(row, col, wall.nextRow, wall.nextCol)
    ) {
      const wallElement = document.createElement("span");
      wallElement.className = `wall-line ${wall.className}`;

      tile.appendChild(wallElement);
    }
  });
}

  createPlayer() {
    this.playerElement = document.createElement("div");
    this.playerElement.className = "player";

    const image = document.createElement("img");
    image.className = "player-image";
    image.src = "./img/player.png";
    image.alt = "プレイヤー";

    this.playerElement.appendChild(image);
    this.mazeElement.appendChild(this.playerElement);

    this.updatePlayerView(false);
  }

  reset() {
    this.position = {
      row: START.row,
      col: START.col
    };

    this.direction = START.direction;
    this.rotationAngle = DIRECTIONS[START.direction].rotation;
    this.isRunning = false;

    if (!this.playerElement) {
      return;
    }

    this.playerElement.classList.remove("collision");
    this.updatePlayerView(false);
  }

  updatePlayerView(animate = true) {
    if (!this.playerElement) {
      return;
    }

    this.playerElement.style.setProperty("--row", this.position.row);
    this.playerElement.style.setProperty("--col", this.position.col);
    this.playerElement.style.setProperty(
      "--rotation",
      `${this.rotationAngle}deg`
    );

    if (!animate) {
      this.playerElement.style.transition = "none";

      // CSSの再計算を発生させ、即座に位置を反映する
      void this.playerElement.offsetWidth;

      this.playerElement.style.transition = "";
    }
  }

  rotate(turn) {
    this.direction =
      (this.direction + turn + DIRECTIONS.length) %
      DIRECTIONS.length;

    this.rotationAngle += turn * 90;
    this.updatePlayerView();
  }

  async moveForward() {
    const direction = DIRECTIONS[this.direction];

    const nextRow = this.position.row + direction.row;
    const nextCol = this.position.col + direction.col;

    const cannotMove =
      !isInsideBoard(nextRow, nextCol) ||
      hasWallBetween(
        this.position.row,
        this.position.col,
        nextRow,
        nextCol
      );

    if (cannotMove) {
      this.showCollision();
      await wait(500);

      return {
        moved: false,
        reachedGoal: false
      };
    }

    this.position.row = nextRow;
    this.position.col = nextCol;
    this.updatePlayerView();

    await wait(500);

    return {
      moved: true,
      reachedGoal: this.isGoal()
    };
  }

  showCollision() {
    this.playerElement.classList.remove("collision");

    // 同じアニメーションを連続再生するための処理
    void this.playerElement.offsetWidth;

    this.playerElement.classList.add("collision");
  }

  isGoal() {
    return (
      this.position.row === GOAL.row &&
      this.position.col === GOAL.col
    );
  }

  async execute(commands, callbacks = {}) {
    if (this.isRunning) {
      return false;
    }

    this.isRunning = true;

    try {
      for (
        let index = 0;
        index < commands.length;
        index += 1
      ) {
        const command = commands[index];
        const instructionCount = index + 1;

        callbacks.onCommand?.(command, instructionCount);

        if (command === "F") {
          const result = await this.moveForward();

          if (result.reachedGoal) {
            callbacks.onGoal?.(instructionCount);
            return true;
          }
        }

        if (command === "R") {
          this.rotate(1);
          await wait(500);
        }

        if (command === "L") {
          this.rotate(-1);
          await wait(500);
        }
      }

      if (this.isGoal()) {
        callbacks.onGoal?.(commands.length);
        return true;
      }

      return false;
    } finally {
      this.isRunning = false;
    }
  }

  async debugMove(directionIndex) {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      this.direction = directionIndex;
      this.rotationAngle = DIRECTIONS[directionIndex].rotation;
      this.updatePlayerView();

      await wait(100);

      const result = await this.moveForward();

      if (result.reachedGoal) {
        this.onGoal?.();
      }
    } finally {
      this.isRunning = false;
    }
  }

  setPlayerVisible(isVisible) {
    this.playerElement?.classList.toggle(
      "player-hidden",
      !isVisible
    );
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
