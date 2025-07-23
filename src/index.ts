// export { createApp } from "./app";
// export { h, hFrag, hText } from "./hyperscript";

import { createApp } from "./app";
import { State, ViewFn } from "./app";
import { h, hFrag, hText } from "./hyperscript";

type Player = "X" | "O";
type PlayableBound = 0 | 1 | 2;
type Position = [PlayableBound, PlayableBound];
type Board = string[][];
type GameStatus = "won" | "tie" | "ongoing";
type Winner = Player | "";
export interface TTTState extends State {
  board: Board;
  activePlayer: Player;
  gameStatus: GameStatus;
  winner: Winner;
}

const state: TTTState = {
  board: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  activePlayer: "X",
  gameStatus: "ongoing",
  winner: "",
  test: [0],
  strTest: 0,
};

const root = document.getElementById("app");

const moveValid = (
  row: PlayableBound,
  col: PlayableBound,
  board: Board
): boolean => {
  return board[row][col] !== "X" && board[row][col] !== "O";
};

const checkGame = (
  board: Board
): { newGameStatus: GameStatus; updatedWinner: Winner } => {
  const rowChecks = [
    // ROWS
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    // COLUMNS
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    // DIAGONALS
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];
  let newGameStatus: GameStatus = "ongoing";
  let updatedWinner: Winner = "";

  rowChecks.forEach(([pos1, pos2, pos3]) => {
    if (board[pos1[0]][pos1[1]] !== "") {
      if (
        board[pos1[0]][pos1[1]] === board[pos2[0]][pos2[1]] &&
        board[pos2[0]][pos2[1]] === board[pos3[0]][pos3[1]]
      ) {
        newGameStatus = "won";
        updatedWinner = board[pos1[0]][pos1[1]] as Player;
      }
    }
  });
  return { newGameStatus, updatedWinner };
};

const switchPlayer = (activePlayer: Player): Player => {
  console.log({ activePlayer });
  return activePlayer === "X" ? "O" : "X";
};

export const placeMove = (state: TTTState, payload: Position): TTTState => {
  let { board, activePlayer, gameStatus, test, strTest } = state;
  const row = payload[0];
  const col = payload[1];

  if (moveValid(row, col, board) && gameStatus === "ongoing") {
    let updatedBoard = board;
    updatedBoard[row][col] = activePlayer;
    const { newGameStatus, updatedWinner } = checkGame(updatedBoard);
    if (newGameStatus === "ongoing") {
      activePlayer = switchPlayer(activePlayer);
    }
    return {
      board: updatedBoard,
      activePlayer: activePlayer,
      gameStatus: newGameStatus,
      winner: updatedWinner,
    };
  }
  return state;
};

const reducers = {
  placeMove: placeMove,
};

export const view: ViewFn<TTTState> = (state, emit) => {
  const { activePlayer, board, winner } = state;
  const title = h("h1", {}, [hText("Tic-Tac-Toe")]);
  const playerLabel = h("h3", {}, [
    hText(winner ? `winner: ${winner}` : `it is ${activePlayer}'s turn`),
  ]);
  const boardView = h(
    "div",
    { class: "board" },
    board.map((row, r) => {
      return h(
        "div",
        { class: `row-${r}`, style: { display: "flex" } },
        row.map((cell, c) =>
          h(
            "div",
            {
              class: `${r}${c}`,
              style: {
                width: "20px",
                height: "20px",
                border: "1px solid",
              },
              on: {
                click: () => {
                  emit("placeMove", [r as PlayableBound, c as PlayableBound]);
                },
              },
            },
            [hText(cell)]
          )
        )
      );
    })
  );

  return hFrag([title, playerLabel, boardView]);
};

const app = createApp<TTTState>({ state, view, reducers });

if (root) {
  app.mount(root);
}
