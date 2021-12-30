function gameOver() {
  const blackMoves = getLegalMoves(-1);
  const whiteMoves = getLegalMoves(1);

  if (blackMoves.length === 0 && whiteMoves.length === 0)
    return true;
  else return false;
}