"use strict";

function parseCommands(text) {
  const normalized = text
    .toUpperCase()
    .replace(/[\s,、，]/g, "");

  const commands = [...normalized];

  const invalidCommand = commands.find(
    (command) => !["F", "R", "L"].includes(command)
  );

  if (invalidCommand) {
    throw new Error(
      `使用できない命令「${invalidCommand}」があります。F・R・Lのみ使用できます。`
    );
  }

  if (commands.length === 0) {
    throw new Error("命令を1つ以上入力してください。");
  }

  return commands;
}

function positionForCell(cellNumber) {
  return cellNumberToPosition(cellNumber);
}

function directionFromDelta(dr, dc) {
  if (dr === -1 && dc === 0) {
    return 0;
  }

  if (dr === 0 && dc === 1) {
    return 1;
  }

  if (dr === 1 && dc === 0) {
    return 2;
  }

  if (dr === 0 && dc === -1) {
    return 3;
  }

  throw new Error("隣接していないルートです。");
}

function routeToCommands(points, initialDirection = 1) {
  const commands = [];
  let direction = initialDirection;

  for (let i = 1; i < points.length; i += 1) {
    const current = points[i - 1];
    const next = points[i];

    const targetDirection = directionFromDelta(
      next.row - current.row,
      next.col - current.col
    );

    const diff = (targetDirection - direction + 4) % 4;

    if (diff === 1) {
      commands.push("R");
    } else if (diff === 2) {
      commands.push("R", "R");
    } else if (diff === 3) {
      commands.push("L");
    }

    commands.push("F");
    direction = targetDirection;
  }

  return commands.join("");
}

// function cellRouteToCommands(cellNumbers) {
//   const points = cellNumbers.map(positionForCell);

//   // 最後に30番マスから出口へ移動する
//   const last = points[points.length - 1];

//   points.push({
//     row: last.row,
//     col: last.col + 1
//   });

//   return routeToCommands(points, START.direction);
// }

function cellRouteToCommands(cellNumbers) {
  const points = [
    {
      row: start.row,
      col: start.col
    },
    ...cellNumbers.map(positionForCell)
  ];

  // 最後に30番マスから出口へ移動する
  const last = points[points.length - 1];

  points.push({
    row: last.row,
    col: last.col + 1
  });

  return routeToCommands(points, start.direction);
}



function outerRouteToCommands(side) {
//   const points = [
//     { row: START.row, col: START.col },
//     { row: START.row, col: 0 }
//   ];
const points = [
  {
    row: start.row,
    col: start.col
  }
];

  if (side === "upper") {
    points.push(
      { row: 1, col: 0 },
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 0, col: 4 },
      { row: 0, col: 5 },
      { row: 0, col: 6 },
      { row: 0, col: 7 },
      { row: 1, col: 7 },
      { row: 2, col: 7 },
      { row: 3, col: 7 },
      { row: 4, col: 7 },
      { row: 4, col: 6 },
      { row: 4, col: 7 }
    );
  } else {
    points.push(
      { row: 2, col: 0 },
      { row: 3, col: 0 },
      { row: 4, col: 0 },
      { row: 5, col: 0 },
      { row: 6, col: 0 },
      { row: 7, col: 0 },
      { row: 7, col: 1 },
      { row: 7, col: 2 },
      { row: 7, col: 3 },
      { row: 7, col: 4 },
      { row: 7, col: 5 },
      { row: 7, col: 6 },
      { row: 7, col: 7 },
      { row: 6, col: 7 },
      { row: 5, col: 7 },
      { row: 4, col: 7 },
      { row: 4, col: 6 },
      { row: 4, col: 7 }
    );
  }

  return routeToCommands(points, start.direction);
}

const examples = {
  A: "FFFRFRFLFFRFLFLFFLFFRFFRFFLFLFRF",
  B: "FFLFRFFRFLFFRFRFFLFLFRFFLFLFRF",
  C: "LFFRFFFFFFFRFFFFF",
  D: "RFFFFFLFFFFFFFLFF"
};

// const EXAMPLES = {
//   A: cellRouteToCommands([
//     7, 8, 9, 15, 14, 20, 26, 25, 31, 32, 33,
//     27, 21, 22, 23, 29, 35, 36, 30
//   ]),

//   B: cellRouteToCommands([
//     7, 8, 2, 3, 4, 10, 11, 12, 18, 17, 16,
//     22, 23, 29, 35, 36, 30
//   ]),

//   C: outerRouteToCommands("upper"),
//   D: outerRouteToCommands("lower")
// };

function setupUI(engine) {
  const commandsInput = document.getElementById("commands");
  const startButton = document.getElementById("startButton");
  const resetButton = document.getElementById("resetButton");
  const status = document.getElementById("status");
  const exampleButtons = document.querySelectorAll("[data-example]");

  function setStatus(message, type = "") {
    status.textContent = message;
    status.className = `status ${type}`;
  }

  exampleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const exampleName = button.dataset.example;
    const exampleCommand = examples[exampleName];

    if (!exampleCommand) {
      setStatus(
        `回答例${exampleName}が見つかりません。`,
        "error"
      );
      return;
    }

    // 回答例をテキストボックスに入力
    commandsInput.value = exampleCommand;

    setStatus(
      `回答例${exampleName}を入力しました。スタートを押してください。`
    );
  });
});

resetButton.addEventListener("click", () => {
  engine.reset();

  // テキストボックスの入力内容を消去
  commandsInput.value = "";

  startButton.disabled = false;
  resetButton.disabled = false;

  setStatus(
    "リセットしました。プログラムを入力してスタートしてください。"
  );
});

  startButton.addEventListener("click", async () => {
    let commands;

    try {
      commands = parseCommands(commandsInput.value);
    } catch (error) {
      setStatus(error.message, "error");
      return;
    }

    engine.reset();
    startButton.disabled = true;
    resetButton.disabled = true;

    try {
      setStatus(`実行中：${commands.join(" ")}`);

      const reachedGoal = await engine.execute(commands, {
        onCommand(command) {
          setStatus(`実行中：${command}`);
        },

        onGoal(instructionCount) {
          setStatus(
            `${instructionCount}回の指示でゴールしました！`,
            "success"
          );
        }
      });

      if (!reachedGoal) {
        setStatus(
          "プログラムが終了しました。ゴールには到着していません。",
          "error"
        );
      }
    } catch (error) {
      setStatus(
        `実行中にエラーが発生しました：${error.message}`,
        "error"
      );
    } finally {
      startButton.disabled = false;
      resetButton.disabled = false;
    }
  });

}

