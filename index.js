const boardSize = 800;
const cellSize = boardSize / 8;

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("board");
canvas.width = 800;
canvas.height = 800;

/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext("2d");
ctx.fillStyle = "green";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.lineWidth = 4;

for (let i = 0; i < 9; i++) {
  ctx.beginPath();
  ctx.moveTo(i * cellSize, 0);
  ctx.lineTo(i * cellSize, canvas.height);

  ctx.moveTo(0, i * cellSize);
  ctx.lineTo(canvas.width, i * cellSize);
  ctx.closePath();

  ctx.stroke();
}

ctx.fillStyle = "black";
ctx.beginPath();
ctx.moveTo(200, 200);
ctx.arc(200, 200, 8, 0, Math.PI * 2, true);
ctx.moveTo(600, 200);
ctx.arc(600, 200, 8, 0, Math.PI * 2, true);
ctx.moveTo(600, 600);
ctx.arc(600, 600, 8, 0, Math.PI * 2, true);
ctx.moveTo(200, 600);
ctx.arc(200, 600, 8, 0, Math.PI * 2, true);

ctx.closePath();
ctx.fill();


let board = [
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, 1, -1, null, null, null],
  [null, null, null, -1, 1, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
];



function renderBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const y = row * cellSize + cellSize / 2;
      const x = col * cellSize + cellSize / 2;
      ctx.beginPath();
      if (board[row][col] === 1) {
        ctx.fillStyle = "white";
        ctx.arc(x, y, cellSize / 2.5, 0, Math.PI * 2, true);
      } else if (board[row][col] === -1) {
        ctx.fillStyle = "black";
        ctx.arc(x, y, cellSize / 2.5, 0, Math.PI * 2, true);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
}


renderBoard();
let turn = 1;

document.onclick = async (event) => {
  const cords = getMouseCords(canvas, event);
  const [boardX, boardY] = cords.map(v => floor(v) / 100);
  // console.log(endgame())
  if (turn === 1)
    ctx.fillStyle = "white";
  else ctx.fillStyle = "black";

  if (board[boardY][boardX] === null) {
    const legalMoves = getLegalMoves(turn);
    if (gameOver()) {
      document.onclick = () => { };
    } else if (legalMoves.length === 0) {
      turn = -turn;
      return;
    }

    const lmove = legalMoves.find(v => v[0] === boardY && v[1] === boardX);
    if (lmove) {
      make_move(lmove, board);
      renderBoard();
      const clone = cloneBoard(board);
      const [_, bestMoveBlack] = minimax(5, false, -Infinity, Infinity);
      board = clone;
      turn = -1;
      await sleep(1500);
      make_move(bestMoveBlack, board);
      renderBoard();

      // console.log(turn === 1 ? "white" : "black");
      // turn = -turn;


      while (getLegalMoves(1).length === 0) {
        // turn = -1;
        const cloned = cloneBoard(board);
        const [__, move] = minimax(5, false, -Infinity, Infinity);
        board = cloned;
        turn = -1;
        // turn = -turn;
        make_move(move, board);
        renderBoard();
        // turn = -turn;
      }

      turn = -turn;
    }
  }

}

function sleep(ms) {
  return new Promise((res, rej) => setTimeout(res, ms));
}

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {MouseEvent} event 
 */
function getMouseCords(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return [x, y];
}

/**
 * @param {number} number 
 * @returns {number}
 */
function floor(number) {
  return Math.floor(number / 100) * 100;
}

/**
 * @param {number} turn 
 * @returns 
 */
function getLegalMoves(turn) {
  const opponent = -turn;

  const around = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
  ]
  const moves = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {

      // console.log()
      if (board[row][col] === null) {

        for (const neighbor_cell of around) {

          const board_cell = board?.[row + neighbor_cell[0]]?.[col + neighbor_cell[1]];
          if (board_cell !== undefined && board_cell === opponent) {
            // const distToEdge = []
            let i = 2;
            let valid = false;
            while (true) {
              const next = board?.[row + neighbor_cell[0] * i]?.[col + neighbor_cell[1] * i];
              if (next !== undefined && next === opponent) {
                i++;
                continue;
              } else if (next !== undefined && next === turn) {
                valid = true;
                break;
              } else {
                break;
              }

            }

            if (valid) moves.push([row, col]);
          }

        }
      }
    }
  }
  return moves;

}
/**
 * @param {[number, number]} move 
 * @param {string[][]} board
 */
function make_move(move, board) {
  const around = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
  ];
  // console.log(move, "pos", turn);
  outer: for (const dirMulti of around) {
    // 1 | 0;
    let counter = 1;
    inner: while (true) {
      const newPosition = board?.[move[0] + dirMulti[0] * counter]?.[move[1] + dirMulti[1] * counter]
      // console.log(newPosition, "new pos", turn);
      if (newPosition !== undefined) {
        if (newPosition === turn) {
          break;
        } else if (newPosition === -turn) {
          counter++;
        } else if (newPosition === null) {
          continue outer;
        }
      } else continue outer;
    }

    for (let i = 0; i < counter; i++) {
      board[move[0] + dirMulti[0] * i][move[1] + dirMulti[1] * i] = turn;
    }

  }


}

/**
 * @param {(number | null)[][]} board 
 * @returns {(number | null)[][]}
 */
function cloneBoard(board) {
  const len = board.length;
  const arr = new Array(len)

  for (let i = 0; i < len; i++)
    arr[i] = board[i].slice(0);

  return arr;
}