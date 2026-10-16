"use strict";

/*
 * テスト関数
 */
function test(actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log("Yay! Test PASSED.");
  } else {
    console.error("Test FAILED. Keep trying!");
    console.log("    actual: ", actual);
    console.log("  expected: ", expected);
    console.trace();
  }
}

function runTests() {
  console.group("Maze application tests");

  test(cellNumberToPosition(1), {row: 1, col: 1});

  test(cellNumberToPosition(36), {row: 6, col: 6});

  test(cellNumberAt(1, 1), 1);
  test(cellNumberAt(6, 6), 36);
  test(cellNumberAt(0, 0), null);

  // 4-5間には壁がある
  const cell4 = cellNumberToPosition(4);
  const cell5 = cellNumberToPosition(5);

  test(
    hasWallBetween(
      cell4.row,
      cell4.col,
      cell5.row,
      cell5.col
    ),
    true
  );

  // 1-2間には壁がない
  const cell1 = cellNumberToPosition(1);
  const cell2 = cellNumberToPosition(2);

  test(
    hasWallBetween(
      cell1.row,
      cell1.col,
      cell2.row,
      cell2.col
    ),
    false
  );

  // 入口方向は通過できる
  test(
    hasWallBetween(
      start.row,
      1,
      start.row,
      0
    ),
    false
  );

  // 外周ボードの外側には移動できない
  test(
    hasWallBetween(0, 0, -1, 0),
    true
  );

  test(parseCommands("F F R L"), ["F", "F", "R", "L"]);
  test(parseCommands("f,r,l"), ["F", "R", "L"]);

  console.groupEnd();
}

runTests();

function runOuterWallTests() {
  console.group("Outer wall tests");

  // スタート地点は入口
  test(start, {
    row: 2,
    col: 0,
    direction: 1
  });

  // 7の左側は入口なので壁なし
  test(
    hasWallBetween(2, 1, 2, 0),
    false
  );

  // 1の左側は壁あり
  test(
    hasWallBetween(1, 1, 1, 0),
    true
  );

  // 13の左側は壁あり
  test(
    hasWallBetween(3, 1, 3, 0),
    true
  );

  // 1〜6の上側は壁あり
  test(
    hasWallBetween(1, 1, 0, 1),
    true
  );

  // 31〜36の下側は壁あり
  test(
    hasWallBetween(6, 1, 7, 1),
    true
  );

  // 30の右側は出口なので壁なし
  test(
    hasWallBetween(5, 6, 5, 7),
    false
  );

  // 24の右側は壁あり
  test(
    hasWallBetween(4, 6, 4, 7),
    true
  );

  // 8×8のさらに外側は移動不可
  test(
    hasWallBetween(0, 0, -1, 0),
    true
  );

  console.groupEnd();
}

runOuterWallTests();
