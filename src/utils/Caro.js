export function isEmpty(board) {
    return board.every(row => row.every(cell => cell === ' '));
}

export function isIn(board, y, x) {
    return 0 <= y && y < board.length && 0 <= x && x < board.length;
}

export function possibleMoves(board) {
    const moves = new Set();
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [-1, 1], [1, -1]];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] !== ' ') {
                for (const [dy, dx] of directions) {
                    for (let length = 1; length <= 3; length++) {
                        const y = i + dy * length;
                        const x = j + dx * length;
                        if (isIn(board, y, x) && board[y][x] === ' ') {
                            moves.add(`${y},${x}`);
                        }
                    }
                }
            }
        }
    }
    return Array.from(moves).map(move => move.split(',').map(Number));
}

export function scoreOfList(lis, col) {
    const blank = lis.filter(cell => cell === ' ').length;
    const filled = lis.filter(cell => cell === col).length;
    if (blank + filled < 5) return -1;
    if (blank === 5) return 0;
    return filled;
}

export function scoreOfRow(board, [y, x], [dy, dx], [yf, xf], col) {
    const row = [];
    while (y !== yf + dy || x !== xf + dx) {
        row.push(board[y][x]);
        y += dy;
        x += dx;
    }
    const scores = [];
    for (let start = 0; start < row.length - 4; start++) {
        scores.push(scoreOfList(row.slice(start, start + 5), col));
    }
    return scores;
}

export function scoreReady(scorecol) {
    const sumcol = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, '-1': {} };
    for (const key in scorecol) {
        for (const score of scorecol[key]) {
        
            if (key in sumcol[score]) {
                sumcol[score][key] += 1;
            } else {
                sumcol[score][key] = 1;
            }
        }
    }
    return sumcol;
}

export function sumSumcolValues(sumcol) {
    for (const key in sumcol) {
        if (key === 5) {
            sumcol[5] = +(1 in Object.values(sumcol[5]));
        } else {
            sumcol[key] = Object.values(sumcol[key]).reduce((acc, val) => acc + val, 0);
        }
    }
}

export function scoreOfCol(board, col) {
    const f = board.length;
    const scores = { '0,1': [], '-1,1': [], '1,0': [], '1,1': [] };

    for (let start = 0; start < board.length; start++) {
        scores['0,1'].push(...scoreOfRow(board, [start, 0], [0, 1], [start, f - 1], col));
        scores['1,0'].push(...scoreOfRow(board, [0, start], [1, 0], [f - 1, start], col));
        scores['1,1'].push(...scoreOfRow(board, [start, 0], [1, 1], [f - 1, f - 1 - start], col));
        scores['-1,1'].push(...scoreOfRow(board, [start, 0], [-1, 1], [0, start], col));

        if (start + 1 < board.length) {
            scores['1,1'].push(...scoreOfRow(board, [0, start + 1], [1, 1], [f - 2 - start, f - 1], col));
            scores['-1,1'].push(...scoreOfRow(board, [f - 1, start + 1], [-1, 1], [start + 1, f - 1], col));
        }
    }
    return scoreReady(scores);
}

export function bestMove(board, col) {
    const anticol = col === 'x' ? 'o' : 'x';
    let movecol = [0, 0];
    let maxscorecol = '';

    if (isEmpty(board)) {
        movecol = [Math.floor(board.length * Math.random()), Math.floor(board[0].length * Math.random())];
    } else {
        const moves = possibleMoves(board);
        for (const move of moves) {
            const [y, x] = move;
            if (maxscorecol === '') {
                const scorecol = stupidScore(board, col, anticol, y, x);
                maxscorecol = scorecol;
                movecol = move;
            } else {
                const scorecol = stupidScore(board, col, anticol, y, x);
                if (scorecol > maxscorecol) {
                    maxscorecol = scorecol;
                    movecol = move;
                }
            }
        }
    }
    return movecol;
}

export function stupidScore(board, col, anticol, y, x) {
    const M = 1000;
    let res = 0, adv = 0, dis = 0;

    board[y][x] = col;
    const sumcol = scoreOfCol(board, col);
    const a = winningSituation(sumcol);
    adv += a * M;
    sumSumcolValues(sumcol);
    adv += sumcol[-1] + sumcol[1] + 4 * sumcol[2] + 8 * sumcol[3] + 16 * sumcol[4];

    board[y][x] = anticol;
    const sumanticol = scoreOfCol(board, anticol);
    const d = winningSituation(sumanticol);
    dis += d * (M - 100);
    sumSumcolValues(sumanticol);
    dis += sumanticol[-1] + sumanticol[1] + 4 * sumanticol[2] + 8 * sumanticol[3] + 16 * sumanticol[4];

    res = adv + dis;
    board[y][x] = ' ';
    return res;
}

export function winningSituation(sumcol) {
    if (Object.values(sumcol[5]).includes(1)) {
        return 5;
    } else if (Object.keys(sumcol[4]).length >= 2 || (Object.keys(sumcol[4]).length >= 1 && Math.max(...Object.values(sumcol[4])) >= 2)) {
        return 4;
    } else if (TF34score(sumcol[3], sumcol[4])) {
        return 4;
    } else {
        const score3 = Object.values(sumcol[3]).sort((a, b) => b - a);
        if (score3.length >= 2 && score3[0] >= score3[1] && score3[1] >= 2) {
            return 3;
        }
    }
    return 0;
}

export function TF34score(score3, score4) {
    for (const key4 in score4) {
        if (score4[key4] >= 1) {
            for (const key3 in score3) {
                if (key3 !== key4 && score3[key3] >= 2) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function isWin(board) {
    const black = scoreOfCol(board, 'o');
    const white = scoreOfCol(board, 'x');

    sumSumcolValues(black);
    sumSumcolValues(white);
    if (black[5] === 1) {
        return 'o won';
    } else if (white[5] === 1) {
        return 'x won';
    } else if (Object.values(black).reduce((a, b) => a + b, 0) === black[-1] && Object.values(white).reduce((a, b) => a + b, 0) === white[-1] || possibleMoves(board).length === 0) {
        return 'Draw';
    }
    return 'Continue playing';
}
export const findWinningSequences = (board) => {
    const size = 19;
    const winLength = 5;
    const winningSequences = [];
  
    // Hàm kiểm tra hướng nhất định
    const checkDirection = (x, y, dx, dy, player) => {
      const positions = [];
      for (let i = 0; i < winLength; i++) {
        const nx = x + i * dx;
        const ny = y + i * dy;
        if (nx >= 0 && ny >= 0 && nx < size && ny < size && board[ny][nx] === player) {
          positions.push([ny, nx]);
        } else {
          return null;
        }
      }
      return positions;
    };
  
    // Kiểm tra toàn bộ bàn cờ
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (board[y][x] !== ' ') {
          const player = board[y][x];
          // Kiểm tra các hướng: ngang, dọc, chéo phải, chéo trái
          const directions = [
            [1, 0], // Hàng ngang
            [0, 1], // Hàng dọc
            [1, 1], // Chéo phải
            [1, -1] // Chéo trái
          ];
          for (const [dx, dy] of directions) {
            const sequence = checkDirection(x, y, dx, dy, player);
            if (sequence) {
              winningSequences.push({ player, positions: sequence });
            }
          }
        }
      }
    }
  
    return winningSequences;
  };