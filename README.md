# はじめてのプログラミング

F・R・Lの指示を使って、プレイヤーをゴールまで移動させる教材です。
プログラムを入力して実行することで、プログラミングの基本を体験的に学習できます。

---

## 目次

- [教材の概要](#教材の概要)
- [対象者](#対象者)
- [学習目標](#学習目標)
- [必要な環境](#必要な環境)
- [ファイル構成](#ファイル構成)
- [起動方法](#起動方法)
- [基本的な使い方](#基本的な使い方)
- [指示一覧](#指示一覧)
- [回答例](#回答例)
- [各ファイルの役割](#各ファイルの役割)
- [デバッグ機能](#デバッグ機能)
- [テストの実行方法](#テストの実行方法)
- [カスタマイズ方法](#カスタマイズ方法)
- [注意事項](#注意事項)

---
## 教材の概要

この教材では、プレイヤーは次の3種類の指示を使えます。

| 指示 | 意味 |
|---|---|
| `F` | 前に1マス進む |
| `R` | 右に90度回る |
| `L` | 左に90度回る |

例えば、次のプログラムを実行します。

FFFRFRFL
指示は左から右へ順番に実行されます。
F → F → F → R → F → R → F → R → F → L

## 対象者
主に以下のような学習者を想定しています。

プログラミング未経験者
プログラミングの基礎を学びたい人

## 学習目標
教材を通して、次の内容を学習します。

プログラミングの基本
プログラムは指示の集まりである
指示は記述した順番に実行される
指示の順番によって結果が変わる

伝えたいこと
    - プログラムでは、やって欲しいことを正確に伝える必要がある。
        - コンピュータはプログラムに書かれた通りに動く
        - プログラムは順番に処理されていく
        - プログラムが違っていれば、コンピュータはその通りに違う動きをする。
        - プログラムは順番に、正確に書く必要がある
    - プログラムには、正しい一つの正解はない。
        - 目的を達成するために、方策はいくつもある
        - どのように書くか、よりも、どのようにやるかを考えることが重要で、必要

## 必要な環境
Webブラウザ(Google Chrome推奨)

## ファイル構成

maze-code/
├── index.html
├── style.css
├── img/
│   ├── goal.png
│   └── player.png
└── js/
    ├── maze-data.js
    ├── maze-engine.js
    ├── command-utils.js
    ├── ui.js
    ├── tests.js
    ├── debug-controls.js
    └── app.js


## 起動方法
Visual Studio Code のエクスプローラーから
index.htmlをドラッグして、ブラウザのタブにドロップして開きます。

## 基本的な使い方

準備
1. プロジェクト一式をコピーする
2. index.htmlをブラウザで開く

使い方
3. 入力欄にプログラム(F R L)を入力する
4. 「スタート」ボタンを押す
5. 「リセット」ボタンを必要に応じて押す

その他
・ 「回答例」ボタンを必要に応じて押す
・ 変更時や意図しない挙動があった場合、適時 index.html?test=trueでテストを実行する

入力例：

FFFRFRFL
入力したコマンドは、入力欄の下にも1文字ずつ表示されます。
実行済みのコマンドは灰色で表示されます。

## 指示一覧

使用できる指示は、次の3種類だけです。
使用できない指示はエラーになります。

F：前進
プレイヤーが向いている方向へ1マス進みます。

R：右回転
プレイヤーが右へ90度回転します。
※位置は変わりません。

L：左回転
プレイヤーが左へ90度回転します。
※位置は変わりません。


コマンドの入力形式
次のような入力ができます。

FFRFLF
F F R F L F
F,R,F,L,F
F、F、R、F、L、F
空白やカンマは自動的に削除されます。


## 回答例

画面下には4つの回答例(A~D)ボタンがあります。
各ボタンを押すと、入力欄にプログラムが自動入力されます。

回答例は command-utils.js に定義されています。

const EXAMPLES = {
  A: "FFFRFRFLFFRFLFLFFLFFRFFRFFLFLFRF",
  B: "FFLFRFFRFLFFRFRFFLFLFRFFLFLFRF",
  C: "LFFRFFFFFFFRFFFFF",
  D: "RFFFFFLFFFFFFFLFF"
};


## 各ファイルの役割

ファイル一覧
ファイル	役割
index.html	画面のHTML構造
style.css	画面のデザイン
maze-data.js	迷路のサイズ、開始位置、ゴール、壁の情報
maze-engine.js	迷路の描画、プレイヤーの移動
command-utils.js	コマンドの解析、ルート変換
ui.js	入力欄、ボタン、ステータス表示
debug-controls.js	矢印ボタン、キーボード操作
tests.js	各関数のテスト
app.js	アプリケーションの起動
goal.png	ゴール画像
player.png	プレイヤー画像

# index.html
画面の構造を定義します。
主な要素は次のとおりです。

<textarea id="commands"></textarea>
コマンド入力欄です。

<div id="maze"></div>
JavaScriptで迷路が生成される場所です。

<button id="startButton">スタート</button>
プログラムを実行します。

<p id="status"></p>
実行状況やエラーメッセージを表示します。


# style.css
画面の見た目を定義します。

ページ全体のレイアウト
入力欄
ボタン
迷路のマス
壁
プレイヤー
衝突時のアニメーション

など、色やサイズをCSSで管理しています。


# maze-data.js
迷路のルールを管理します。

const MAZE_SIZE = 8;
迷路は8×8の盤面です。

開始位置とゴールは次のように定義されています。

const START = {
  row: 2,
  col: 0,
  direction: 1
};

const GOAL = {
  row: 5,
  col: 7
};
壁の判定は、次の関数で行います。

hasWallBetween(row, col, nextRow, nextCol)


# maze-engine.js
迷路の表示とプレイヤーの動きを担当します。

主な処理は次のとおりです。

関数	役割
renderMaze()	8×8の迷路を生成
createPlayer()	プレイヤーを生成
moveForward()	プレイヤーを1マス移動
rotate()	プレイヤーの向きを変更
execute()	コマンドを順番に実行
isGoal()	ゴール到着を判定
reset()	初期状態へ戻す

# command-utils.js
入力されたコマンドを解析します。

parseCommands(" f, r、l ")
実行結果：

["F", "R", "L"]

また、セル番号や座標のルートを、F・R・L形式のコマンドへ変換する処理も含まれています。

# ui.js
画面上の操作を管理します。

入力欄の監視
コマンドの表示
スタートボタン
リセットボタン
回答例ボタン
ステータスメッセージ


# debug-controls.js
デバッグ用の操作を管理します。

以下の操作に対応しています。

画面上の矢印ボタン
キーボードの矢印キー
プレイヤーの表示・非表示

キー	動作
↑	上を向いて前進
→	右を向いて前進
↓	下を向いて前進
←	左を向いて前進

# app.js
アプリケーションの起動処理を行います。


## デバッグ機能
通常のプログラム実行とは別に、矢印ボタンやキーボードでプレイヤーを直接操作できます。

使用目的
壁の位置を確認する
迷路データを確認する
ゴール位置を確認する
移動処理を確認する

使い方
index.html の下記コードのコメントアウトを解除してください

    <section
      id="debug-control-panel"
      class="debug-control-panel"
      aria-label="デバッグ操作"
    >
      <div id="debug-controls" class="debug-controls">
        <button type="button" data-direction="up" aria-label="上へ">↑</button>

        <div class="debug-middle-buttons">
          <button type="button" data-direction="left" aria-label="左へ">←</button>
          <button type="button" data-direction="down" aria-label="下へ">↓</button>
          <button type="button" data-direction="right" aria-label="右へ">→</button>
        </div>
      </div>

      <button
        type="button"
        id="toggle-player-button"
        aria-pressed="false"
      >
        🐭
      </button>
    </section>


  <script src="./js/debug-controls.js"></script>

※プログラム実行中は、デバッグ操作を受け付けません。

## テストの実行方法
tests.jsには、各関数を確認するためのテストが含まれています。

実行方法
URLの末尾に ?test=true を追記して開きます。

index.html?test=true

例：
http://localhost:8000/index.html?test=true
その後、ブラウザの開発者ツールを開き、Consoleタブから確認します。

テスト対象

迷路サイズ
開始位置とゴール位置
座標とセル番号の変換
中央セルと外周セルの判定
盤面外判定
壁判定
入口と出口
コマンド解析
不正コマンドの検出
方向変換
ルート変換
迷路のDOM生成
プレイヤー生成
リセット
回転
前進
衝突
ゴール判定
プレイヤーの表示切り替え

## カスタマイズ方法

・回答例を変更する
command-utils.jsのEXAMPLESを変更します。

const EXAMPLES = {
  A: "FFFRFRFL",
  B: "RFFLFF",
  C: "LFFRFF",
  D: "FFRFFLFF"
};
変更後は、実際にゴールへ到着できるか確認してください。

・プレイヤー画像を変更する
maze-engine.jsの画像パスを変更します。

image.src = "./img/player.png";

・ゴール画像を変更する
image.src = "./img/goal.png";
画像ファイルを同じ場所に置き換えるだけでも変更できます。

・色を変更する
style.cssの値を変更します。

:root {
  --accent-color: #1976d2;
  --wall-color: #222222;
  --background-color: #f5f7fa;
}
例えばアクセントカラーを緑にする場合：

:root {
  --accent-color: #2e7d32;
}

・迷路を変更する
迷路サイズを変更する場合は、以下の複数箇所を見直す必要があります。

const MAZE_SIZE = 8;
--maze-size: calc(var(--cell-size) * 8);
grid-template-columns: repeat(8, var(--cell-size));
grid-template-rows: repeat(8, var(--cell-size));
現在の壁データは8×8の迷路を前提にしているため、数値だけを変更すると動作しない場合があります。

・壁の追加、削除
迷路の壁は、中央6×6マスのセル番号を指定して設定します。

セル番号
中央迷路のセル番号は、左上を1番として左から右、上から下の順に採番されます。

 1   2   3   4   5   6
 7   8   9  10  11  12
13  14  15  16  17  18
19  20  21  22  23  24
25  26  27  28  29  30
31  32  33  34  35  36

左右方向の壁
左右に隣接するセルの間に壁を設定する場合は、VERTICAL_WALLS にセル番号のペアを追加します。

壁を削除する場合
既存のセル番号ペアを VERTICAL_WALLS から削除します。

上下方向の壁
上下に隣接するセルの間に壁を設定する場合は、HORIZONTAL_WALLS にセル番号のペアを追加します。

壁を削除する場合
既存のセル番号ペアを HORIZONTAL_WALLS から削除します。

壁を追加・削除するときの注意
指定できるセル番号は 1～36 です。
壁を設定するセルは、左右または上下に隣接している必要があります。
VERTICAL_WALLS と HORIZONTAL_WALLS の変更内容は、迷路生成時に INTERNAL_WALLS へ反映されます。

## 注意事項

画像の利用について
player.pngやgoal.pngを差し替える場合は、画像の著作権や利用許諾を確認してください。

