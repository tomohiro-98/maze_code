"use strict";

/*
 * テスト結果を記録する。
 */
const testState = {
  passed: 0,
  failed: 0,
  failures: []
};


/*
 * 値が期待値と一致することを確認する。
 */
function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(
      [
        message,
        `期待値: ${formatValue(expected)}`,
        `実効値: ${formatValue(actual)}`
      ].join("\n")
    );
  }
}


/*
 * trueであることを確認する。
 */
function assertTrue(value, message) {
  assertEqual(value, true, message);
}


/*
 * falseであることを確認する。
 */
function assertFalse(value, message) {
  assertEqual(value, false, message);
}


/*
 * オブジェクトや配列の内容を比較する。
 */
function assertDeepEqual(actual, expected, message) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);

  if (actualJson !== expectedJson) {
    throw new Error(
      [
        message,
        `期待値: ${expectedJson}`,
        `実効値: ${actualJson}`
      ].join("\n")
    );
  }
}


/*
 * 指定した関数がエラーを投げることを確認する。
 */
function assertThrows(callback, expectedMessage, message) {
  let thrownError = null;

  try {
    callback();
  } catch (error) {
    thrownError = error;
  }

  if (!thrownError) {
    throw new Error(
      `${message}\nエラーが発生することを期待しました。`
    );
  }

  if (
    expectedMessage &&
    !thrownError.message.includes(expectedMessage)
  ) {
    throw new Error(
      [
        message,
        `期待するエラー: ${expectedMessage}`,
        `実際のエラー: ${thrownError.message}`
      ].join("\n")
    );
  }
}


/*
 * 値をテスト結果に表示しやすい文字列へ変換する。
 */
function formatValue(value) {
  if (typeof value === "string") {
    return `"${value}"`;
  }

  return JSON.stringify(value);
}


/*
 * 同期テストを実行する。
 */
function runTest(name, callback) {
  try {
    callback();

    testState.passed += 1;
    console.log(`✅ ${name}`);
  } catch (error) {
    testState.failed += 1;
    testState.failures.push({
      name,
      error
    });

    console.error(`❌ ${name}`);
    console.error(error);
  }
}


/*
 * 非同期テストを実行する。
 */
async function runAsyncTest(name, callback) {
  try {
    await callback();

    testState.passed += 1;
    console.log(`✅ ${name}`);
  } catch (error) {
    testState.failed += 1;
    testState.failures.push({
      name,
      error
    });

    console.error(`❌ ${name}`);
    console.error(error);
  }
}


/*
 * テスト結果を表示する。
 */
function printTestSummary() {
  const total =
    testState.passed + testState.failed;

  console.log("");
  console.log("================================");
  console.log("テスト結果");
  console.log("================================");
  console.log(`総数: ${total}`);
  console.log(`成功: ${testState.passed}`);
  console.log(`失敗: ${testState.failed}`);

  if (testState.failed === 0) {
    console.log("🎉 すべてのテストに成功しました。");
    return;
  }

  console.error("");
  console.error("失敗したテスト:");

  testState.failures.forEach(({ name, error }) => {
    console.error(`- ${name}`);
    console.error(`  ${error.message}`);
  });
}


/*
 * 迷路データに関するテスト。
 */
function testMazeData() {
  console.group("maze-data.jsのテスト");

  runTest(
    "迷路サイズは8×8である",
    () => {
      assertEqual(MAZE_SIZE, 8, "迷路サイズが8ではありません");
    }
  );

  runTest(
    "中央迷路のサイズは6×6である",
    () => {
      assertEqual(CENTER_SIZE, 6, "中央迷路のサイズが6ではありません");
    }
  );

  runTest(
    "方向データが4方向分存在する",
    () => {
      assertEqual(
        DIRECTIONS.length,
        4,
        "方向データが4方向ありません"
      );
    }
  );

  runTest(
    "上方向のデータが正しい",
    () => {
      assertDeepEqual(
        DIRECTIONS[0],
        {name: "up", row: -1, col: 0, rotation: 0},
        "上方向のデータが正しくありません"
      );
    }
  );

  runTest(
    "右方向のデータが正しい",
    () => {
      assertDeepEqual(
        DIRECTIONS[1],
        {name: "right", row: 0, col: 1, rotation: 90},
        "右方向のデータが正しくありません"
      );
    }
  );

  runTest(
    "下方向のデータが正しい",
    () => {
      assertDeepEqual(
        DIRECTIONS[2],
        {name: "down", row: 1, col: 0, rotation: 180},
        "下方向のデータが正しくありません"
      );
    }
  );

  runTest(
    "左方向のデータが正しい",
    () => {
      assertDeepEqual(
        DIRECTIONS[3],
        {name: "left", row: 0, col: -1, rotation: 270},
        "左方向のデータが正しくありません"
      );
    }
  );

  runTest(
    "開始位置が正しい",
    () => {
      assertDeepEqual(
        START,
        {row: 2, col: 0, direction: 1},
        "開始位置が正しくありません"
      );
    }
  );

  runTest(
    "ゴール位置が正しい",
    () => {
      assertDeepEqual(
        GOAL,
        {row: 5, col: 7},
        "ゴール位置が正しくありません"
      );
    }
  );

  runTest(
    "座標キーを作成できる",
    () => {
      assertEqual(
        createPositionKey(2, 3),
        "2,3",
        "座標キーが正しくありません"
      );
    }
  );

  runTest(
    "壁キーは座標の順番に依存しない",
    () => {
      const key1 = createWallKey(1, 2, 1, 3);
      const key2 = createWallKey(1, 3, 1, 2);

      assertEqual(
        key1,
        key2,
        "壁キーが左右反対で一致していません"
      );
    }
  );

  runTest(
    "セル番号1を座標へ変換できる",
    () => {
      assertDeepEqual(
        cellNumberToPosition(1),
        {row: 1, col: 1},
        "セル番号1の座標が正しくありません"
      );
    }
  );

  runTest(
    "セル番号6を座標へ変換できる",
    () => {
      assertDeepEqual(
        cellNumberToPosition(6),
        {row: 1, col: 6},
        "セル番号6の座標が正しくありません"
      );
    }
  );

  runTest(
    "セル番号7を座標へ変換できる",
    () => {
      assertDeepEqual(
        cellNumberToPosition(7),
        {row: 2, col: 1},
        "セル番号7の座標が正しくありません"
      );
    }
  );

  runTest(
    "セル番号36を座標へ変換できる",
    () => {
      assertDeepEqual(
        cellNumberToPosition(36),
        {row: 6, col: 6},
        "セル番号36の座標が正しくありません"
      );
    }
  );

  runTest(
    "中央迷路の左上をセル番号1へ変換できる",
    () => {
      assertEqual(
        positionToCellNumber(1, 1),
        1,
        "座標(1,1)がセル番号1ではありません"
      );
    }
  );

  runTest(
    "中央迷路の右上をセル番号6へ変換できる",
    () => {
      assertEqual(
        positionToCellNumber(1, 6),
        6,
        "座標(1,6)がセル番号6ではありません"
      );
    }
  );

  runTest(
    "中央迷路の左下をセル番号31へ変換できる",
    () => {
      assertEqual(
        positionToCellNumber(6, 1),
        31,
        "座標(6,1)がセル番号31ではありません"
      );
    }
  );

  runTest(
    "中央迷路の右下をセル番号36へ変換できる",
    () => {
      assertEqual(
        positionToCellNumber(6, 6),
        36,
        "座標(6,6)がセル番号36ではありません"
      );
    }
  );

  runTest(
    "上側の外周セルはセル番号を持たない",
    () => {
      assertEqual(
        positionToCellNumber(0, 1),
        null,
        "外周セルにセル番号があります"
      );
    }
  );

  runTest(
    "左側の外周セルはセル番号を持たない",
    () => {
      assertEqual(
        positionToCellNumber(2, 0),
        null,
        "外周セルにセル番号があります"
      );
    }
  );

  runTest(
    "中央セルを正しく判定できる",
    () => {
      assertTrue(
        isCenterCell(1, 1),
        "中央セル(1,1)を中央セルと判定できません"
      );

      assertTrue(
        isCenterCell(6, 6),
        "中央セル(6,6)を中央セルと判定できません"
      );
    }
  );

  runTest(
    "外周セルを中央セルではないと判定できる",
    () => {
      assertFalse(
        isCenterCell(0, 0),
        "外周セル(0,0)を中央セルと判定しています"
      );

      assertFalse(
        isCenterCell(2, 0),
        "外周セル(2,0)を中央セルと判定しています"
      );
    }
  );

  runTest(
    "盤面内の座標を判定できる",
    () => {
      assertTrue(
        isInsideBoard(0, 0),
        "盤面左上を盤面内と判定できません"
      );

      assertTrue(
        isInsideBoard(7, 7),
        "盤面右下を盤面内と判定できません"
      );
    }
  );

  runTest(
    "盤面外の座標を判定できる",
    () => {
      assertFalse(
        isInsideBoard(-1, 0),
        "上側の盤面外を盤面内と判定しています"
      );

      assertFalse(
        isInsideBoard(8, 0),
        "下側の盤面外を盤面内と判定しています"
      );

      assertFalse(
        isInsideBoard(0, -1),
        "左側の盤面外を盤面内と判定しています"
      );

      assertFalse(
        isInsideBoard(0, 8),
        "右側の盤面外を盤面内と判定しています"
      );
    }
  );

  console.groupEnd();
}


/*
 * 壁判定に関するテスト。
 */
function testWalls() {
  console.group("壁判定のテスト");

  runTest(
    "盤面の外側には壁がある",
    () => {
      assertTrue(
        hasWallBetween(0, 0, -1, 0),
        "盤面外への移動が壁になっていません"
      );

      assertTrue(
        hasWallBetween(7, 7, 7, 8),
        "盤面外への移動が壁になっていません"
      );
    }
  );

  runTest(
    "中央迷路の上側に壁がある",
    () => {
      assertTrue(
        hasWallBetween(1, 1, 0, 1),
        "中央迷路上側の壁がありません"
      );
    }
  );

  runTest(
    "中央迷路の下側に壁がある",
    () => {
      assertTrue(
        hasWallBetween(6, 1, 7, 1),
        "中央迷路下側の壁がありません"
      );
    }
  );

  runTest(
    "入口は通行可能である",
    () => {
      assertFalse(
        hasWallBetween(2, 1, 2, 0),
        "入口が壁になっています"
      );

      assertFalse(
        hasWallBetween(2, 0, 2, 1),
        "入口の反対方向が壁になっています"
      );
    }
  );

  runTest(
    "入口以外の左側には壁がある",
    () => {
      assertTrue(
        hasWallBetween(1, 1, 1, 0),
        "入口以外の左壁がありません"
      );

      assertTrue(
        hasWallBetween(3, 1, 3, 0),
        "入口以外の左壁がありません"
      );
    }
  );

  runTest(
    "出口は通行可能である",
    () => {
      assertFalse(
        hasWallBetween(5, 6, 5, 7),
        "出口が壁になっています"
      );

      assertFalse(
        hasWallBetween(5, 7, 5, 6),
        "出口の反対方向が壁になっています"
      );
    }
  );

  runTest(
    "出口以外の右側には壁がある",
    () => {
      assertTrue(
        hasWallBetween(4, 6, 4, 7),
        "出口以外の右壁がありません"
      );

      assertTrue(
        hasWallBetween(6, 6, 6, 7),
        "出口以外の右壁がありません"
      );
    }
  );

  runTest(
    "中央迷路内部の壁を判定できる",
    () => {
      // セル4=(1,4)、セル5=(1,5)
      assertTrue(
        hasWallBetween(1, 4, 1, 5),
        "セル4とセル5の間の壁がありません"
      );

      assertTrue(
        hasWallBetween(1, 5, 1, 4),
        "セル5とセル4の間の壁がありません"
      );
    }
  );

  runTest(
    "中央迷路内部の壁がない場所は通行可能である",
    () => {
      // セル1=(1,1)、セル2=(1,2)
      assertFalse(
        hasWallBetween(1, 1, 1, 2),
        "セル1とセル2の間が壁になっています"
      );
    }
  );

  runTest(
    "中央迷路内部の上下方向の壁を判定できる",
    () => {
      // セル1=(1,1)、セル7=(2,1)
      assertTrue(
        hasWallBetween(1, 1, 2, 1),
        "セル1とセル7の間の壁がありません"
      );

      assertTrue(
        hasWallBetween(2, 1, 1, 1),
        "セル7とセル1の間の壁がありません"
      );
    }
  );

  runTest(
    "外周セルから中央セルへの判定方向を反転できる",
    () => {
      assertTrue(
        hasWallBetween(0, 1, 1, 1),
        "外周側から中央側への上壁判定が正しくありません"
      );
    }
  );

  console.groupEnd();
}


/*
 * タイルラベルに関するテスト。
 */
function testTileLabels() {
  console.group("タイルラベルのテスト");

  runTest(
    "入口ラベルを取得できる",
    () => {
      assertEqual(
        getTileLabel(START.row - 1, 0),
        "入口",
        "入口ラベルが正しくありません"
      );
    }
  );

  runTest(
    "出口ラベルを取得できる",
    () => {
      assertEqual(
        getTileLabel(GOAL.row - 1, GOAL.col),
        "出口",
        "出口ラベルが正しくありません"
      );
    }
  );

  runTest(
    "通常のセルにはラベルがない",
    () => {
      assertEqual(
        getTileLabel(3, 3),
        "",
        "通常のセルにラベルがあります"
      );
    }
  );

  console.groupEnd();
}


/*
 * コマンド解析に関するテスト。
 */
function testCommandUtils() {
  console.group("command-utils.jsのテスト");

  runTest(
    "小文字を大文字へ変換できる",
    () => {
      assertEqual(
        normalizeCommandText("frl"),
        "FRL",
        "小文字が大文字に変換されていません"
      );
    }
  );

  runTest(
    "半角スペースを削除できる",
    () => {
      assertEqual(
        normalizeCommandText(" F R L "),
        "FRL",
        "半角スペースが削除されていません"
      );
    }
  );

  runTest(
    "改行とタブを削除できる",
    () => {
      assertEqual(
        normalizeCommandText("F\nR\tL"),
        "FRL",
        "改行やタブが削除されていません"
      );
    }
  );

  runTest(
    "カンマを削除できる",
    () => {
      assertEqual(
        normalizeCommandText("F,R、L，F"),
        "FRLF",
        "カンマが削除されていません"
      );
    }
  );

  runTest(
    "正しいコマンドを解析できる",
    () => {
      assertDeepEqual(
        parseCommands("FRL"),
        ["F", "R", "L"],
        "コマンドの解析結果が正しくありません"
      );
    }
  );

  runTest(
    "区切り文字付きコマンドを解析できる",
    () => {
      assertDeepEqual(
        parseCommands(" f, r、l "),
        ["F", "R", "L"],
        "区切り文字付きコマンドを解析できません"
      );
    }
  );

  runTest(
    "空文字列を拒否する",
    () => {
      assertThrows(
        () => parseCommands(""),
        "指示を1つ以上入力してください",
        "空文字列を受け付けています"
      );
    }
  );

  runTest(
    "空白だけの文字列を拒否する",
    () => {
      assertThrows(
        () => parseCommands(" \n\t "),
        "指示を1つ以上入力してください",
        "空白だけの文字列を受け付けています"
      );
    }
  );

  runTest(
    "不正な指示を拒否する",
    () => {
      assertThrows(
        () => parseCommands("FRX"),
        "使用できない指示",
        "不正な指示を受け付けています"
      );
    }
  );

  runTest(
    "数字を拒否する",
    () => {
      assertThrows(
        () => parseCommands("F2R"),
        "使用できない指示",
        "数字を指示として受け付けています"
      );
    }
  );

  runTest(
    "日本語を拒否する",
    () => {
      assertThrows(
        () => parseCommands("前進"),
        "使用できない指示",
        "日本語を指示として受け付けています"
      );
    }
  );

  runTest(
    "方向差分から上方向を取得できる",
    () => {
      assertEqual(
        directionFromDelta(-1, 0),
        0,
        "上方向の番号が正しくありません"
      );
    }
  );

  runTest(
    "方向差分から右方向を取得できる",
    () => {
      assertEqual(
        directionFromDelta(0, 1),
        1,
        "右方向の番号が正しくありません"
      );
    }
  );

  runTest(
    "方向差分から下方向を取得できる",
    () => {
      assertEqual(
        directionFromDelta(1, 0),
        2,
        "下方向の番号が正しくありません"
      );
    }
  );

  runTest(
    "方向差分から左方向を取得できる",
    () => {
      assertEqual(
        directionFromDelta(0, -1),
        3,
        "左方向の番号が正しくありません"
      );
    }
  );

  runTest(
    "斜め方向を拒否する",
    () => {
      assertThrows(
        () => directionFromDelta(1, 1),
        "隣接していないルート",
        "斜め方向を受け付けています"
      );
    }
  );

  runTest(
    "隣接していない移動を拒否する",
    () => {
      assertThrows(
        () => directionFromDelta(0, 2),
        "隣接していないルート",
        "2マス先への移動を受け付けています"
      );
    }
  );

  runTest(
    "右方向を向いた状態で前進するルートを変換できる",
    () => {
      assertEqual(
        routeToCommands(
          [
            { row: 2, col: 0 },
            { row: 2, col: 1 }
          ],
          START.direction
        ),
        "F",
        "右方向への前進がFになっていません"
      );
    }
  );

  runTest(
    "右方向から下方向へ曲がるルートを変換できる",
    () => {
      assertEqual(
        routeToCommands(
          [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 3, col: 1 }
          ],
          START.direction
        ),
        "FRF",
        "右折して下へ進むルートが正しくありません"
      );
    }
  );

  runTest(
    "右方向から左方向へ向く場合は右回転2回になる",
    () => {
      assertEqual(
        routeToCommands(
          [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 0 }
          ],
          START.direction
        ),
        "FRRF",
        "反対方向への旋回が正しくありません"
      );
    }
  );

  runTest(
    "右方向から上方向へ向く場合は左回転になる",
    () => {
      assertEqual(
        routeToCommands(
          [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 1, col: 1 }
          ],
          START.direction
        ),
        "FLF",
        "左折して上へ進むルートが正しくありません"
      );
    }
  );

  runTest(
    "セル番号のルートをコマンドへ変換できる",
    () => {
      assertEqual(
        cellRouteToCommands([7]),
        "FF",
        "セル番号7へのルートが正しくありません"
      );
    }
  );

  runTest(
    "複数セルのルートをコマンドへ変換できる",
    () => {
      assertEqual(
        cellRouteToCommands([7, 13]),
        "FRFLF",
        "複数セルのルートが正しくありません"
      );
    }
  );

  runTest(
    "回答例Aが存在する",
    () => {
      assertTrue(
        typeof EXAMPLES.A === "string",
        "回答例Aが存在しません"
      );
    }
  );

  runTest(
    "回答例Aだけで構成されている",
    () => {
      const commands = parseCommands(EXAMPLES.A);

      commands.forEach((command) => {
        assertTrue(
          VALID_COMMANDS.has(command),
          `回答例Aに不正な指示${command}があります`
        );
      });
    }
  );

  runTest(
    "回答例Bだけで構成されている",
    () => {
      const commands = parseCommands(EXAMPLES.B);

      commands.forEach((command) => {
        assertTrue(
          VALID_COMMANDS.has(command),
          `回答例Bに不正な指示${command}があります`
        );
      });
    }
  );

  runTest(
    "回答例Cだけで構成されている",
    () => {
      const commands = parseCommands(EXAMPLES.C);

      commands.forEach((command) => {
        assertTrue(
          VALID_COMMANDS.has(command),
          `回答例Cに不正な指示${command}があります`
        );
      });
    }
  );

  runTest(
    "回答例Dだけで構成されている",
    () => {
      const commands = parseCommands(EXAMPLES.D);

      commands.forEach((command) => {
        assertTrue(
          VALID_COMMANDS.has(command),
          `回答例Dに不正な指示${command}があります`
        );
      });
    }
  );

  console.groupEnd();
}


/*
 * MazeEngineの同期処理をテストする。
 */
function testMazeEngine() {
  console.group("maze-engine.jsのテスト");

  runTest(
    "迷路要素を受け取って生成できる",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      assertEqual(
        engine.mazeElement,
        mazeElement,
        "迷路要素が保持されていません"
      );
    }
  );

  runTest(
    "初期位置が開始位置になる",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      assertDeepEqual(
        engine.position,
        {
          row: START.row,
          col: START.col
        },
        "初期位置が開始位置ではありません"
      );
    }
  );

  runTest(
    "初期方向が開始方向になる",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      assertEqual(
        engine.direction,
        START.direction,
        "初期方向が開始方向ではありません"
      );
    }
  );

  runTest(
    "初期状態では実行中ではない",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      assertFalse(
        engine.isRunning,
        "初期状態で実行中になっています"
      );
    }
  );

  runTest(
    "迷路を8×8の64マス生成できる",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.renderMaze();

      assertEqual(
        mazeElement.children.length,
        64,
        "迷路のマス数が64ではありません"
      );
    }
  );

  runTest(
    "中央迷路のセル数が36である",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.renderMaze();

      const centerTiles =
        mazeElement.querySelectorAll(".center-tile");

      assertEqual(
        centerTiles.length,
        36,
        "中央迷路のセル数が36ではありません"
      );
    }
  );

  runTest(
    "外周タイルには壁線を生成しない",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.renderMaze();

      const outerTiles =
        mazeElement.querySelectorAll(".outer-tile");

      outerTiles.forEach((tile) => {
        const wallLines =
          tile.querySelectorAll(".wall-line");

        assertEqual(
          wallLines.length,
          0,
          "外周タイルに不要な壁線があります"
        );
      });
    }
  );

  runTest(
    "中央迷路の壁線を生成できる",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.renderMaze();

      const wallLines =
        mazeElement.querySelectorAll(".center-tile .wall-line");

      assertTrue(
        wallLines.length > 0,
        "中央迷路の壁線が1本もありません"
      );
    }
  );

  runTest(
    "ゴールタイルにゴール画像がある",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.renderMaze();

      const goalImage =
        mazeElement.querySelector(".goal-image");

      assertTrue(
        goalImage !== null,
        "ゴール画像がありません"
      );

      assertEqual(
        goalImage.alt,
        "ゴール",
        "ゴール画像のalt属性が正しくありません"
      );
    }
  );

  runTest(
    "プレイヤーを生成できる",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.renderMaze();
      engine.createPlayer();

      const player =
        mazeElement.querySelector(".player");

      assertTrue(
        player !== null,
        "プレイヤー要素がありません"
      );
    }
  );

  runTest(
    "プレイヤー画像を生成できる",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.renderMaze();
      engine.createPlayer();

      const playerImage =
        mazeElement.querySelector(".player-image");

      assertTrue(
        playerImage !== null,
        "プレイヤー画像がありません"
      );

      assertEqual(
        playerImage.alt,
        "プレイヤー",
        "プレイヤー画像のalt属性が正しくありません"
      );
    }
  );

  runTest(
    "resetで開始位置へ戻る",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.position = {
        row: 4,
        col: 4
      };

      engine.direction = 3;
      engine.reset();

      assertDeepEqual(
        engine.position,
        {
          row: START.row,
          col: START.col
        },
        "reset後の位置が開始位置ではありません"
      );

      assertEqual(
        engine.direction,
        START.direction,
        "reset後の方向が開始方向ではありません"
      );
    }
  );

  runTest(
    "右回転で方向が変わる",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.rotate(1);

      assertEqual(
        engine.direction,
        2,
        "右回転後の方向が正しくありません"
      );
    }
  );

  runTest(
    "左回転で方向が変わる",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.rotate(-1);

      assertEqual(
        engine.direction,
        0,
        "左回転後の方向が正しくありません"
      );
    }
  );

  runTest(
    "右回転を4回行うと元の方向に戻る",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.rotate(1);
      engine.rotate(1);
      engine.rotate(1);
      engine.rotate(1);

      assertEqual(
        engine.direction,
        START.direction,
        "4回転後に元の方向へ戻っていません"
      );
    }
  );

  runTest(
    "開始位置ではゴールではない",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      assertFalse(
        engine.isGoal(),
        "開始位置をゴールと判定しています"
      );
    }
  );

  runTest(
    "ゴール位置をゴールと判定できる",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.position = {
        row: GOAL.row,
        col: GOAL.col
      };

      assertTrue(
        engine.isGoal(),
        "ゴール位置をゴールと判定できません"
      );
    }
  );

  runTest(
    "プレイヤー表示を非表示にできる",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.renderMaze();
      engine.createPlayer();
      engine.setPlayerVisible(false);

      assertTrue(
        engine.playerElement.classList.contains(
          "player-hidden"
        ),
        "プレイヤーが非表示になっていません"
      );
    }
  );

  runTest(
    "プレイヤー表示を再表示できる",
    () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.renderMaze();
      engine.createPlayer();

      engine.setPlayerVisible(false);
      engine.setPlayerVisible(true);

      assertFalse(
        engine.playerElement.classList.contains(
          "player-hidden"
        ),
        "プレイヤーが再表示されていません"
      );
    }
  );

  console.groupEnd();
}


/*
 * moveForwardやexecuteを含む非同期テスト。
 *
 * 実際のアニメーション待ち時間を含むため、
 * 通常のテストとは分けて実行する。
 */
async function testMazeEngineAsync() {
  console.group("maze-engine.js のテスト");

  await runAsyncTest(
    "開始地点から右へ前進できる",
    async () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.initialize();

      const result = await engine.moveForward();

      assertTrue(
        result.moved,
        "開始地点から右へ移動できません"
      );

      assertDeepEqual(
        engine.position,
        {
          row: START.row,
          col: START.col + 1
        },
        "移動後の位置が正しくありません"
      );
    }
  );

  await runAsyncTest(
    "壁にぶつかると移動しない",
    async () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.initialize();

      // 開始方向は右。
      // 右側の次のセルへは移動できるため、
      // まず中央迷路上側へ移動して壁に向かう。
      engine.position = {
        row: 1,
        col: 1
      };

      engine.direction = 0;

      const result = await engine.moveForward();

      assertFalse(
        result.moved,
        "壁にぶつかったのに移動しています"
      );

      assertDeepEqual(
        engine.position,
        {
          row: 1,
          col: 1
        },
        "衝突後に位置が変わっています"
      );
    }
  );

  await runAsyncTest(
    "コマンドFを実行できる",
    async () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.initialize();

      const executedCommands = [];

      await engine.execute(["F"], {
        onCommand(command) {
          executedCommands.push(command);
        }
      });

      assertDeepEqual(
        executedCommands,
        ["F"],
        "onCommandが正しく呼ばれていません"
      );

      assertDeepEqual(
        engine.position,
        {
          row: START.row,
          col: START.col + 1
        },
        "F実行後の位置が正しくありません"
      );
    }
  );

  await runAsyncTest(
    "Rコマンドで右回転できる",
    async () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.initialize();

      await engine.execute(["R"]);

      assertEqual(
        engine.direction,
        2,
        "R実行後の方向が正しくありません"
      );
    }
  );

  await runAsyncTest(
    "Lコマンドで左回転できる",
    async () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.initialize();

      await engine.execute(["L"]);

      assertEqual(
        engine.direction,
        0,
        "L実行後の方向が正しくありません"
      );
    }
  );

  await runAsyncTest(
    "ゴール到着時にonGoalが呼ばれる",
    async () => {
      const mazeElement = document.createElement("div");
      const engine = new MazeEngine(mazeElement);

      engine.initialize();

      /*
       * テスト時間を短くするため、
       * ゴールの直前にプレイヤーを配置する。
       */
      engine.position = {
        row: GOAL.row,
        col: GOAL.col - 1
      };

      engine.direction = 1;

      let goalInstructionCount = null;

      const reachedGoal = await engine.execute(["F"], {
        onGoal(instructionCount) {
          goalInstructionCount = instructionCount;
        }
      });

      assertTrue(
        reachedGoal,
        "ゴール到着をtrueで返していません"
      );

      assertEqual(
        goalInstructionCount,
        1,
        "ゴール時の指示数が正しくありません"
      );
    }
  );

  console.groupEnd();
}


/*
 * すべてのテストを実行する。
 */
async function runAllTests() {
  testState.passed = 0;
  testState.failed = 0;
  testState.failures = [];

  console.clear();
  console.log("================================");
  console.log("maze-code テスト開始");
  console.log("================================");

  testMazeData();
  testWalls();
  testTileLabels();
  testCommandUtils();
  testMazeEngine();
  await testMazeEngineAsync();

  printTestSummary();
}


/*
 * URLに?test=trueが付いている場合だけ自動実行。
 *
 * 例:
 * index.html?test=true
 */

if (
  new URLSearchParams(window.location.search).get("test") === "true"
) {
  window.addEventListener("load", () => {
    runAllTests();
  });
}

