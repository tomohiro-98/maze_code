"use strict";

/*
 * 8x8の座標
 *
 * 0 1 2 3 4 5 6 7
 *   外周の通路を含む
 *
 * 中央6x6のセル番号は以下の位置に配置。
 *
 *  1  2  3  4  5  6
 *  7  8  9 10 11 12
 * 13 14 15 16 17 18
 * 19 20 21 22 23 24
 * 25 26 27 28 29 30
 * 31 32 33 34 35 36
 */

const mazeSize = 8;
const centerOffset = 1;

// 4方向の移動方法例
// 方向  | dr | dc |移動内容| 回転角度
// up   | -1 |  0 |  1行上 |    0度
// right|  0 |  1 |  1列右 |   90度
// down |  1 |  0 |  1行下 |  180度
// left |  0 | -1 |  1列左 |  270度

const directions = [
  { name: "up", dr: -1, dc: 0, rotation: 0 },
  { name: "right", dr: 0, dc: 1, rotation: 90 },
  { name: "down", dr: 1, dc: 0, rotation: 180 },
  { name: "left", dr: 0, dc: -1, rotation: 270 }
];

const start = {row: 2, col: 0, direction: 1};

const goal = {row: 5, col: 7};

function key(row, col) {
  return `${row},${col}`;
}

function pairKey(row1, col1, row2, col2) {
  const a = key(row1, col1);
  const b = key(row2, col2);
  return [a, b].sort().join("|");
}

function cellNumberToPosition(cellNumber) {
  const index = cellNumber - 1;

  return {
    row: Math.floor(index / 6) + centerOffset,
    col: (index % 6) + centerOffset
  };
}

function cellNumberAt(row, col) {
  if (
    row < centerOffset ||
    row >= centerOffset + 6 ||
    col < centerOffset ||
    col >= centerOffset + 6
  ) {
    return null;
  }

  return (row - centerOffset) * 6 + (col - centerOffset) + 1;
}

const internalWalls = new Set();

/*
 * 左右方向の壁
 * 例：4-5間 は cell 4 と cell 5 の間
 */
const verticalWallPairs = [
  [4, 5],
  [9, 10],
  [15, 16],
  [19, 20],
  [20, 21],
  [23, 24],
  [26, 27],
  [27, 28],
  [29, 30],
  [34, 35]
];

verticalWallPairs.forEach(([leftCell, rightCell]) => {
  const left = cellNumberToPosition(leftCell);
  const right = cellNumberToPosition(rightCell);

  internalWalls.add(pairKey(left.row, left.col, right.row, right.col));
});

/*
 * 上下方向の壁
 * 例：1-7間 は cell 1 と cell 7 の間
 */
const horizontalWallPairs = [
  [1, 7],
  [3, 9],
  [6, 12],
  [7, 13],
  [8, 14],
  [10, 16],
  [11, 17],
  [13, 19],
  [15, 21],
  [17, 23],
  [18, 24],
  [22, 28],
  [26, 32],
  [28, 34]
];

horizontalWallPairs.forEach(([upperCell, lowerCell]) => {
  const upper = cellNumberToPosition(upperCell);
  const lower = cellNumberToPosition(lowerCell);

  internalWalls.add(pairKey(upper.row, upper.col, lower.row, lower.col));
});

/*
 * 外周の壁。
 * 8x8ボードの外側は壁。
 * ただし、中央迷路の入口と出口に該当する通路は開ける。
 */

// function isOuterBoundaryWall(row, col, nextRow, nextCol) {
//   if (nextRow < 0 || nextRow >= MAZE_SIZE) {
//     return true;
//   }

//   if (nextCol < 0 || nextCol >= MAZE_SIZE) {
//     return true;
//   }

//   return false;
// }

// function isEntranceOrExitOpening(row, col, nextRow, nextCol) {
//   return false;
// }

function isCentralCell(row, col) {
  return (
    row >= 1 &&
    row <= 6 &&
    col >= 1 &&
    col <= 6
  );
}

/*
 * 6x6迷路の外壁
 *
 * 上側：
 *   1〜6の上
 *
 * 下側：
 *   31〜36の下
 *
 * 左側：
 *   1および13〜31の左
 *   7の左側は入口なので開ける
 *
 * 右側：
 *   6〜34および36の右
 *   30の右側は出口なので開ける
 */

function hasOuterMazeWall(row, col, nextRow, nextCol) {
  /*
   * 外周セルから中央セルへ入る場合は、
   * 判定方向を逆にして再利用する。
   *
   * 例：
   * 外周セル (2, 0) → 中央セル (2, 1)
   * 中央セル (2, 1) → 外周セル (2, 0)
   * として判定する。
   */
  if (
    !isCentralCell(row, col) &&
    isCentralCell(nextRow, nextCol)
  ) {
    return hasOuterMazeWall(
      nextRow,
      nextCol,
      row,
      col
    );
  }

  // 上壁：1〜6の上
  if (row === 1 && nextRow === 0 && col >= 1 && col <= 6) {
    return true;
  }

  // 下壁：31〜36の下
  if (row === 6 && nextRow === 7 && col >= 1 && col <= 6) {
    return true;
  }

  // 左壁：中央迷路の左側
  // row === 2 は入口なので開ける
  if (
    col === 1 &&
    nextCol === 0 &&
    row >= 1 &&
    row <= 6
  ) {
    return row !== 2;
  }

  // 右壁：中央迷路の右側
  // row === 5 は出口なので開ける
  if (
    col === 6 &&
    nextCol === 7 &&
    row >= 1 &&
    row <= 6
  ) {
    return row !== 5;
  }

  return false;
}

// function hasOuterMazeWall(row, col, nextRow, nextCol) {
//   // 上壁：1〜6の上
//   if (
//     row === 1 &&
//     nextRow === 0 &&
//     col >= 1 &&
//     col <= 6
//   ) {
//     return true;
//   }

//   // 下壁：31〜36の下
//   if (
//     row === 6 &&
//     nextRow === 7 &&
//     col >= 1 &&
//     col <= 6
//   ) {
//     return true;
//   }

//   // 左壁：1および13〜31の左
//   // 7の左側は入口
//   if (
//     col === 1 &&
//     nextCol === 0 &&
//     row >= 1 &&
//     row <= 6
//   ) {
//     return row !== 2;
//   }

//   // 右壁：6〜34および36の右
//   // 30の右側は出口
//   if (
//     col === 6 &&
//     nextCol === 7 &&
//     row >= 1 &&
//     row <= 6
//   ) {
//     return row !== 5;
//   }

//   return false;
// }

function isBoardOutside(row, col) {
  return (
    row < 0 ||
    row >= mazeSize ||
    col < 0 ||
    col >= mazeSize
  );
}

function isEntranceOrExitOpening(row, col, nextRow, nextCol) {
  // 今回は8x8の外周通路上を移動するため、
  // 中央6x6と外周1列の間は基本的に開放する。
  return false;
}




// function hasWallBetween(row, col, nextRow, nextCol) {
//   if (isEntranceOrExitOpening(row, col, nextRow, nextCol)) {
//     return false;
//   }

//   if (isOuterBoundaryWall(row, col, nextRow, nextCol)) {
//     return true;
//   }

//   return internalWalls.has(pairKey(row, col, nextRow, nextCol));
// }

function hasWallBetween(row, col, nextRow, nextCol) {
  // 8x8マスのさらに外側には移動できない。
  // ただし、ここには壁線を描画しない。
  if (isBoardOutside(nextRow, nextCol)) {
    return true;
  }

  // 6x6迷路の外壁
  if (hasOuterMazeWall(row, col, nextRow, nextCol)) {
    return true;
  }

  // 6x6迷路内部の壁
  return internalWalls.has(
    pairKey(row, col, nextRow, nextCol)
  );
}


function isInsideBoard(row, col) {
  return (
    row >= 0 &&
    row < mazeSize &&
    col >= 0 &&
    col < mazeSize
  );
}

function getTileLabel(row, col) {
  const number = cellNumberAt(row, col);
  
// セル番号（1〜36）表示
//   if (number !== null) {
//     return String(number);
//   }

  if (row === start.row - 1 && col === 0) {
    return "入口";
  }

  if (row === goal.row - 1 && col === goal.col) {
    return "出口";
  }

  return "";
}