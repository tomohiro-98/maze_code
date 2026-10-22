"use strict";

function setupUI(engine) {
  const elements = {
    input: document.getElementById("commands"),
    commandDisplay: document.getElementById("command-display"),
    startButton: document.getElementById("startButton"),
    resetButton: document.getElementById("resetButton"),
    status: document.getElementById("status"),
    exampleButtons: document.querySelectorAll("[data-example]")
  };

  function setStatus(message, type = "") {
    elements.status.textContent = message;
    elements.status.className = `status ${type}`;
  }

  function renderCommandDisplay(commands, executedCount = 0) {
    elements.commandDisplay.replaceChildren();

    commands.forEach((command, index) => {
      const commandElement = document.createElement("span");

      commandElement.className = "command-character";
      commandElement.textContent = command;

      if (index < executedCount) {
        commandElement.classList.add("executed");
      }

      elements.commandDisplay.appendChild(commandElement);
    });
  }

  // ↑変更前ーーー
  // ↓変更後ーーー

    function selectExample(exampleName) {
    const exampleCommand = examples[exampleName];

    if (!exampleCommand) {
      setStatus(
        `回答例${exampleName}が見つかりません。`,
        "error"
      );
      return;
    }

    // テキストボックスに回答例を入力
    commandsInput.value = exampleCommand;

    // コマンド表示を更新
    renderCommandDisplay([...exampleCommand]);

    setStatus(
      `回答例${exampleName}を入力しました。スタートを押してください。`
    );
  }

  // ーーー変更後ーーー

  //   function renderCommandDisplay(commands, executedCount = 0) {
  //   commandDisplay.innerHTML = "";

  //   commands.forEach((command, index) => {
  //     const commandElement = document.createElement("span");

  //     commandElement.className = "command-character";
  //     commandElement.textContent = command;

  //     if (index < executedCount) {
  //       commandElement.classList.add("executed");
  //     }

  //     commandDisplay.appendChild(commandElement);
  //   });
  // }

  // function selectExample(exampleName) {
  //   const exampleCommand = examples[exampleName];

  //   if (!exampleCommand) {
  //     setStatus(
  //       `回答例${exampleName}が見つかりません。`,
  //       "error"
  //     );
  //     return;
  //   }

  //   commandsInput.value = exampleCommand;
  //   renderCommandDisplay([...exampleCommand]);

  //   setStatus(
  //     `回答例${exampleName}を入力しました。スタートを押してください。`
  //   );
  // }

  // commandsInput.addEventListener("input", () => {
  //   const commands = commandsInput.value
  //     .toUpperCase()
  //     .replace(/[\s,、，]/g, "");

  //   if (commands.length === 0) {
  //     commandDisplay.innerHTML = "";
  //     return;
  //   }

  //   renderCommandDisplay([...commands]);
  // });

  // exampleButtons.forEach((button) => {
  //   button.addEventListener("click", () => {
  //     selectExample(button.dataset.example);
  //   });
  // });

  // document.addEventListener("keydown", (event) => {
  //   if (event.ctrlKey || event.altKey || event.metaKey) {
  //     return;
  //   }

  //   const exampleName = event.key.toUpperCase();

  //   if (!["A", "B", "C", "D"].includes(exampleName)) {
  //     return;
  //   }

  //   event.preventDefault();
  //   selectExample(exampleName);
  // });

  // ーーー変更後ーーー





  function updateCommandDisplayFromInput() {
    const normalized = normalizeCommandText(elements.input.value);
    renderCommandDisplay([...normalized]);
  }

  elements.input.addEventListener(
    "input",
    updateCommandDisplayFromInput
  );

  elements.exampleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const exampleName = button.dataset.example;
      const exampleCommand = EXAMPLES[exampleName];

      if (!exampleCommand) {
        setStatus(
          `回答例${exampleName}が見つかりません。`,
          "error"
        );
        return;
      }

      elements.input.value = exampleCommand;
      renderCommandDisplay([...exampleCommand]);

      setStatus(
        `回答例${exampleName}を入力しました。スタートを押してください。`
      );
    });
  });

  elements.resetButton.addEventListener("click", () => {
    engine.reset();

    elements.input.value = "";
    elements.commandDisplay.replaceChildren();

    elements.startButton.disabled = false;
    elements.resetButton.disabled = false;

    setStatus(
      "リセットしました。プログラムを入力してスタートしてください。"
    );
  });

  elements.startButton.addEventListener("click", async () => {
    let commands;

    try {
      commands = parseCommands(elements.input.value);
    } catch (error) {
      setStatus(error.message, "error");
      return;
    }

    engine.reset();

    elements.startButton.disabled = true;
    elements.resetButton.disabled = true;

    try {
      renderCommandDisplay(commands);

      setStatus(`実行中：${commands.join(" ")}`);

      const reachedGoal = await engine.execute(commands, {
        onCommand(command, instructionCount) {
          renderCommandDisplay(commands, instructionCount);
          setStatus(`実行中：${command}`);
        },

        onGoal(instructionCount) {
          renderCommandDisplay(commands, instructionCount);

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
      elements.startButton.disabled = false;
      elements.resetButton.disabled = false;
    }
  });
}



