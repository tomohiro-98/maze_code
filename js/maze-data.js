"use strict";

const MAZE_SIZE = 8;
const CENTER_SIZE = 6;
const CENTER_OFFSET = 1;

const DIRECTIONS = [
  { name: "up", row: -1, col: 0, rotation: 0 },
  { name: "right", row: 0, col: 1, rotation: 90 },
  { name: "down", row: 1, col: 0, rotation: 180 },
  { name: "left", row: 0, col: -1, rotation: 270 }
];

const START = {row: 2, col: 0, direction: 1};

const GOAL = {row: 5, col: 7};

function createPositionKey(row, col) {
  return `${row},${col}`;
}

function createWallKey(row1, col1, row2, col2) {
  return [
    createPositionKey(row1, col1),
    createPositionKey(row2, col2)
  ].sort().join("|");
}

function cellNumberToPosition(cellNumber) {
  const index = cellNumber - 1;

  return {
    row: Math.floor(index / CENTER_SIZE) + CENTER_OFFSET,
    col: (index % CENTER_SIZE) + CENTER_OFFSET
  };
}

function positionToCellNumber(row, col) {
  const isCenterCell =
    row >= CENTER_OFFSET && row < CENTER_OFFSET + CENTER_SIZE &&
    col >= CENTER_OFFSET && col < CENTER_OFFSET + CENTER_SIZE;

  if (!isCenterCell) {
    return null;
  }

  return ((row - CENTER_OFFSET) * CENTER_SIZE + (col - CENTER_OFFSET) + 1);
}

function isCenterCell(row, col) {
  return (
    row >= CENTER_OFFSET && row < CENTER_OFFSET + CENTER_SIZE &&
    col >= CENTER_OFFSET && col < CENTER_OFFSET + CENTER_SIZE
  );
}

function isInsideBoard(row, col) {
  return (
    row >= 0 && row < MAZE_SIZE &&
    col >= 0 && col < MAZE_SIZE
  );
}

/*
 * 中央6×6迷路内部の壁
 *
 * 横方向の壁：
 * 例 [4, 5] は4番セルと5番セルの間
 */
const INTERNAL_WALLS = new Set();

const VERTICAL_WALLS = [
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

VERTICAL_WALLS.forEach(([leftCell, rightCell]) => {
  const left = cellNumberToPosition(leftCell);
  const right = cellNumberToPosition(rightCell);

  INTERNAL_WALLS.add(
    createWallKey(left.row, left.col, right.row, right.col)
  );
});

/*
 * 縦方向の壁
 * 例 [1, 7] は1番セルと7番セルの間
 */
const HORIZONTAL_WALLS = [
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

HORIZONTAL_WALLS.forEach(([upperCell, lowerCell]) => {
  const upper = cellNumberToPosition(upperCell);
  const lower = cellNumberToPosition(lowerCell);

  INTERNAL_WALLS.add(
    createWallKey(upper.row, upper.col, lower.row, lower.col)
  );
});

/*
 * 中央6×6迷路の外壁を判定する
 *
 * 入口：
 *   (2, 0) と (2, 1) の間は通行可能
 *
 * 出口：
 *   (5, 6) と (5, 7) の間は通行可能
 */

// function hasOuterMazeWall(row, col, nextRow, nextCol) {
//   // 外周側から中央側へ調べる場合は、判定方向を反転する
//   if (
//     !isCenterCell(row, col) &&
//     isCenterCell(nextRow, nextCol)
//   ) {
//     return hasOuterMazeWall(nextRow, nextCol, row, col);
//   }

//   // 上側の壁
//   if (row === 1 && nextRow === 0) {
//     return col >= 1 && col <= 6;
//   }

//   // 下側の壁
//   if (row === 6 && nextRow === 7) {
//     return col >= 1 && col <= 6;
//   }

//   // 左側の壁。row=2だけ入口
//   if (col === 1 && nextCol === 0) {
//     return row !== START.row;
//   }

//   // 右側の壁。row=5だけ出口
//   if (col === 6 && nextCol === 7) {
//     return row !== GOAL.row;
//   }

//   return false;
// }

function hasOuterMazeWall(row, col, nextRow, nextCol) {
  // 外周側から中央側へ調べる場合は、
  // 中央側を現在位置として判定する。
  if (
    !isCenterCell(row, col) &&
    isCenterCell(nextRow, nextCol)
  ) {
    return hasOuterMazeWall(nextRow, nextCol, row, col);
  }

  // 上側の外壁
  if (
    row === 1 &&
    nextRow === 0 &&
    col >= 1 &&
    col <= 6
  ) {
    return true;
  }

  // 下側の外壁
  if (
    row === 6 &&
    nextRow === 7 &&
    col >= 1 &&
    col <= 6
  ) {
    return true;
  }

  // 左側の外壁
  // row=2は入口なので壁を作らない
  if (
    col === 1 &&
    nextCol === 0 &&
    row >= 1 &&
    row <= 6
  ) {
    return row !== START.row;
  }

  // 右側の外壁
  // row=5は出口なので壁を作らない
  if (
    col === 6 &&
    nextCol === 7 &&
    row >= 1 &&
    row <= 6
  ) {
    return row !== GOAL.row;
  }

  return false;
}

function hasWallBetween(row, col, nextRow, nextCol) {
  // 8×8ボードの外側には移動できない
  if (!isInsideBoard(nextRow, nextCol)) {
    return true;
  }

  // 中央迷路の外壁
  if (hasOuterMazeWall(row, col, nextRow, nextCol)) {
    return true;
  }

  // 中央迷路内部の壁
  return INTERNAL_WALLS.has(
    createWallKey(row, col, nextRow, nextCol)
  );
}

function getTileLabel(row, col) {
  if (row === START.row - 1 && col === 0) {
    return "入口";
  }

  if (row === GOAL.row - 1 && col === GOAL.col) {
    return "出口";
  }

  return "";
}
