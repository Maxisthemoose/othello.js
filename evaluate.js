const boardPositionValues = [
  [10, -10, 1, 1, 1, 1, -10, 10],
  [-10, -10, -1, -1, -1, -1, -10, -10],
  [1, -1, 1, 1, 1, 1, -1, 1],
  [1, -1, 1, 1, 1, 1, -1, 1],
  [1, -1, 1, 1, 1, 1, -1, 1],
  [1, -1, 1, 1, 1, 1, -1, 1],
  [-10, -10, -1, -1, -1, -1, -10, -10],
  [10, -10, 1, 1, 1, 1, -10, 10],
];

function evaluate() {
  let blackSum = 0;
  let whiteSum = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === 1)
        whiteSum += boardPositionValues[i][j];
      else if (board[i][j] === -1)
        blackSum -= boardPositionValues[i][j];
    }
  }

  return whiteSum + blackSum;
}