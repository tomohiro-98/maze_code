"use strict";

const EXAMPLES = {
  A: "FFFRFRFLFFRFLFLFFLFFRFFRFFLFLFRF",
  B: "FFLFRFFRFLFFRFRFFLFLFRFFLFLFRF",
  C: "LFFRFFFFFFFRFFFFF",
  D: "RFFFFFLFFFFFFFLFF"
};

const VALID_COMMANDS = new Set(["F", "R", "L"]);

function normalizeCommandText(text) {
  return text
    .toUpperCase()
    .replace(/[\s,、，]/g, "");
}

function parseCommands(text) {
  const normalized = normalizeCommandText(text);

  if (normalized.length === 0) {
    throw new Error("指示を1つ以上入力してください。");
  }

  const invalidCommand = [...normalized].find(
    (command) => !VALID_COMMANDS.has(command)
  );

  if (invalidCommand) {
    throw new Error(
      `使用できない指示「${invalidCommand}」があります。` +
      "F・R・Lのみ使用できます。"
    );
  }

  return [...normalized];
}

function directionFromDelta(rowDelta, colDelta) {
  if (rowDelta === -1 && colDelta === 0) {
    return 0;
  }

  if (rowDelta === 0 && colDelta === 1) {
    return 1;
  }

  if (rowDelta === 1 && colDelta === 0) {
    return 2;
  }

  if (rowDelta === 0 && colDelta === -1) {
    return 3;
  }

  throw new Error("隣接していないルートです。");
}

function routeToCommands(points, initialDirection = START.direction) {
  const commands = [];
  let currentDirection = initialDirection;

  for (let index = 1; index < points.length; index += 1) {
    const current = points[index - 1];
    const next = points[index];

    const nextDirection = directionFromDelta(
      next.row - current.row,
      next.col - current.col
    );

    const turn =
      (nextDirection - currentDirection + DIRECTIONS.length) %
      DIRECTIONS.length;

    if (turn === 1) {
      commands.push("R");
    } else if (turn === 2) {
      commands.push("R", "R");
    } else if (turn === 3) {
      commands.push("L");
    }

    commands.push("F");
    currentDirection = nextDirection;
  }

  return commands.join("");
}

function cellRouteToCommands(cellNumbers) {
  const points = [
    {
      row: START.row,
      col: START.col
    },
    ...cellNumbers.map(cellNumberToPosition)
  ];

  const lastPoint = points.at(-1);

  // 最後に出口へ移動する
  points.push({
    row: lastPoint.row,
    col: lastPoint.col + 1
  });

  return routeToCommands(points, START.direction);
}
