"use strict";

class MazeEngine {
  constructor(mazeElement) {
    this.mazeElement = mazeElement;
    this.playerElement = null;
    this.position = {
      row: start.row,
      col: start.col
    };

    this.direction = start.direction;
    this.rotationAngle = 0;
    this.isRunning = false;
  }

  initialize() {
    this.renderMaze();
    this.createPlayer();
    this.reset();
  }

  renderMaze() {
    this.mazeElement.innerHTML = "";

    for (let row = 0; row < mazeSize; row += 1) {
      for (let col = 0; col < mazeSize; col += 1) {
        const tile = document.createElement("div");
        tile.className = "tile";

        const number = cellNumberAt(row, col);

        if (number === null) {
          tile.classList.add("outer-tile");
        } else {
          tile.classList.add("center-tile");
        }

        if (row === start.row && col === start.col) {
          tile.classList.add("start-tile");
        }

        if (row === goal.row && col === goal.col) {
          tile.classList.add("goal-tile");

          // ゴール画像の追加
          const goalImage = document.createElement("img");
          goalImage.className = "goal-image";
          goalImage.src = "./img/goal.png";
          goalImage.alt = "ゴール";

          tile.appendChild(goalImage);
        }



        this.addWallClasses(tile, row, col);

        const label = document.createElement("span");
        label.className = "tile-label";
        label.textContent = getTileLabel(row, col);

        // 入口・出口のラベルをセル下側に配置
        if (label.textContent === "入口" || label.textContent === "出口") {
          tile.classList.add("label-bottom-tile");
        }

        tile.appendChild(label);
        this.mazeElement.appendChild(tile);
      }
    }
  }

  // addWallClasses(tile, row, col) {
  //   if (hasWallBetween(row, col, row - 1, col)) {
  //     tile.classList.add("wall-top");
  //   }

  //   if (hasWallBetween(row, col, row, col + 1)) {
  //     tile.classList.add("wall-right");
  //   }

  //   if (hasWallBetween(row, col, row + 1, col)) {
  //     tile.classList.add("wall-bottom");
  //   }

  //   if (hasWallBetween(row, col, row, col - 1)) {
  //     tile.classList.add("wall-left");
  //   }
  // }

  addWallClasses(tile, row, col) {
  // 8x8マスの外側の壁は描画しない。
  // ただし、6x6迷路本体の外壁は描画する。

  const addWallLine = (className) => {
    const line = document.createElement("span");
    line.className = `wall-line ${className}`;
    tile.appendChild(line);
  };

  // 上壁
  if (
    row > 0 &&
    hasWallBetween(row, col, row - 1, col)
  ) {
    addWallLine("wall-line-top");
  }

  // 右壁
  if (
    col < mazeSize - 1 &&
    hasWallBetween(row, col, row, col + 1)
  ) {
    addWallLine("wall-line-right");
  }

  // 下壁
  if (
    row < mazeSize - 1 &&
    hasWallBetween(row, col, row + 1, col)
  ) {
    addWallLine("wall-line-bottom");
  }

  // 左壁
  if (
    col > 0 &&
    hasWallBetween(row, col, row, col - 1)
  ) {
    addWallLine("wall-line-left");
  }

  // if (row > 0 && hasWallBetween(row, col, row - 1, col)) {
  //     tile.classList.add("wall-top");
  // }

  // if (col < mazeSize - 1 &&
  //     hasWallBetween(row, col, row, col + 1)) {
  //     tile.classList.add("wall-right");
  // }

  // if (row < mazeSize - 1 &&
  //     hasWallBetween(row, col, row + 1, col)) {
  //     tile.classList.add("wall-bottom");
  // }

  // if (col > 0 && hasWallBetween(row, col, row, col - 1)) {
  //     tile.classList.add("wall-left");
  // }

  }

  // createPlayer() {
  //   this.playerElement = document.createElement("div");
  //   this.playerElement.className = "player";
  //   this.playerElement.textContent = "➤";
  //   this.mazeElement.appendChild(this.playerElement);
  //   this.updatePlayerView(false);
  // }

  createPlayer() {
  this.playerElement = document.createElement("div");
  this.playerElement.className = "player";

  const playerImage = document.createElement("img");
  playerImage.className = "player-image";
  playerImage.src = "./img/player.png";
  playerImage.alt = "プレイヤー";

  this.playerElement.appendChild(playerImage);
  this.mazeElement.appendChild(this.playerElement);

  this.updatePlayerView(false);
}

  reset() {
    this.position = {
      row: start.row,
      col: start.col
    };
    this.direction = start.direction;
    this.rotationAngle = 0;
    this.isRunning = false;

    if (this.playerElement) {
      this.playerElement.classList.remove("collision");
      this.updatePlayerView(false);
    }
  }

  updatePlayerView(animate = true) {
    if (!this.playerElement) {
      return;
    }

    this.playerElement.style.setProperty("--row", this.position.row);
    this.playerElement.style.setProperty("--col", this.position.col);
    this.playerElement.style.setProperty("--rotation",`${directions[this.direction].rotation}deg`);
    // this.playerElement.style.setProperty("--rotation",`${this.rotationAngle}deg`);

    if (!animate) {
      this.playerElement.style.transition = "none";

      // ブラウザに即時反映させる
      void this.playerElement.offsetWidth;

      this.playerElement.style.transition = "";
    }
  }

  rotate(turn) {
    this.direction =
      (this.direction + turn + directions.length) % directions.length;

    this.updatePlayerView(true);
  }

  // リファクタリング
  // DIRECTIONSのrotationプロパティは、今回の表示処理では使用しなくなる

//   async rotate(turn) {
//   this.playerElement.classList.add("turning");

//   // directionは移動方向の判定に使用
//   this.direction =
//     (this.direction + turn + DIRECTIONS.length) % DIRECTIONS.length;

//   // 表示角度は折り返さず、累積させる
//   // R: +90度、L: -90度
//   this.rotationAngle += turn * 90;

//   this.updatePlayerView(true);

//   await wait(TURN_DURATION);

//   this.playerElement.classList.remove("turning");
// }


  async moveForward() {
    const direction = directions[this.direction];
    const nextRow = this.position.row + direction.dr;
    const nextCol = this.position.col + direction.dc;

    if (
      !isInsideBoard(nextRow, nextCol) ||
      hasWallBetween(
        this.position.row,
        this.position.col,
        nextRow,
        nextCol
      )
    ) {
      this.showCollision();
      await wait(500);
      return {
        moved: false,
        reachedGoal: false
      };
    }

    this.position.row = nextRow;
    this.position.col = nextCol;
    this.updatePlayerView(true);

    await wait(500);

    return {
      moved: true,
      reachedGoal: this.isGoal()
    };
  }

  showCollision() {
    this.playerElement.classList.remove("collision");

    // 同じアニメーションを連続実行可能にする
    void this.playerElement.offsetWidth;

    this.playerElement.classList.add("collision");
  }

  isGoal() {
    return (
      this.position.row === goal.row &&
      this.position.col === goal.col
    );
  }

  async execute(commands, callbacks = {}) {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    let instructionCount = 0;

    try {
      for (const command of commands) {
        instructionCount += 1;

        if (callbacks.onCommand) {
          // callbacks.onCommand(command);
          callbacks.onCommand(command, instructionCount);
        }

        if (command === "F") {
          const result = await this.moveForward();

          if (result.reachedGoal) {
            if (callbacks.onGoal) {
              callbacks.onGoal(instructionCount);
            }
            return true;
          }
        } else if (command === "R") {
          this.rotate(1);
          await wait(500);
        } else if (command === "L") {
          this.rotate(-1);
          await wait(500);
        }
      }

      // 最後の指示でゴールした場合にも表示する
      if (this.isGoal()) {
        if (callbacks.onGoal) {
          callbacks.onGoal(instructionCount);
        }

        return true;
      }

      return false;
    } finally {
      this.isRunning = false;
    }
  }

  // デバッグ用コントローラ
  async debugMove(directionIndex) {
    // コマンド実行中はデバッグ操作を受け付けない
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      // 押した方向へプレイヤーの向きを変更
      this.direction = directionIndex;
      this.updatePlayerView(true);

      // 少しだけ向き変更を表示してから移動
      await wait(100);

      const result = await this.moveForward();

      if (result.reachedGoal) {
        console.log("ゴールしました");

        if (this.onGoal) {
          this.onGoal();
        }
      }
    } finally {
      this.isRunning = false;
    }
  }

  setPlayerVisible(isVisible) {
    if (!this.playerElement) {
      return;
    }

    this.playerElement.classList.toggle(
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




