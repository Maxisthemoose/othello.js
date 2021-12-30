/**
 * @param {number} depth
 * @param {boolean} isMaximizing
 * @param {number} alpha
 * @param {number} beta
 * @returns {[number, [number, number] | null]}
 */
function minimax(depth, isMaximizing, alpha, beta) {
  if (depth === 0 || gameOver()) return [evaluate(), null];

  let clonedBoard = cloneBoard(board);

  if (isMaximizing) {

    // white
    let bestEval = -Infinity;
    let bestMove = null;
    const whiteMoves = getLegalMoves(1);
    if (whiteMoves.length === 0) {
      minimax(depth - 1, false, alpha, beta);
    } else {
      for (const move of whiteMoves) {
        turn = 1;
        make_move(move, board);
        const [score, m] = minimax(depth - 1, false, alpha, beta);
        // if (score > alpha)
        //   alpha = score;

        alpha = Math.max(alpha, score);

        if (score >= beta) {
          bestEval = score;
          bestMove = move;
          break;
        }
        // if (alpha >= beta)
        //   break;

        if (score > bestEval) {
          bestEval = score;
          bestMove = move;
        }
        board = cloneBoard(clonedBoard);
      }
    }

    return [bestEval, bestMove];

  } else {
    // black
    let bestEval = Infinity;
    let bestMove = null;
    const blackMoves = getLegalMoves(-1);
    if (blackMoves.length === 0) {
      minimax(depth - 1, false, alpha, beta);
    } else {
      for (const move of blackMoves) {
        turn = -1;
        make_move(move, board);
        const [score, m] = minimax(depth - 1, true, alpha, beta);

        beta = Math.min(beta, score);

        if (score <= alpha) {
          bestEval = score;
          bestMove = move;
          break;
        }

        if (score < bestEval) {
          bestEval = score;
          bestMove = move;
        }
        board = cloneBoard(clonedBoard);
      }
    }
    return [bestEval, bestMove];
  }
}


// function minimax(depth, alpha, beta) {
//   let clonedBoard = cloneBoard(board);

//   if (depth === 0 || gameOver()) {
//     return [evaluate(), null];
//   }
//   let i = 0;;
//   const moves = getLegalMoves(turn);
//   for (i; i < moves.length; i++) {
//     let move = moves[i];
//     make_move(move, board);
//     turn = -turn;
//     const [val, m] = minimax(depth - 1, -beta, -alpha);
//     board = cloneBoard(clonedBoard);
//     if (val >= beta) {
//       return [beta, move];
//     }

//     alpha = Math.max(alpha, val);
//   }

//   return [alpha];
// }