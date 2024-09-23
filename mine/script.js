let boardSize = 10;
let mineCount = 1;
let board = [];
let mineLocations = [];
let timer;
let seconds = 0;
let gameOver = false; // New variable to track game state

function createBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`; // Adjust grid columns based on difficulty
    board = [];
    mineLocations = [];
    gameOver = false; // Reset game state when creating a new board

    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => handleClick(i, j));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFlag(i, j);
            });
            boardElement.appendChild(cell);
            board[i][j] = { element: cell, isMine: false, isClicked: false, isFlagged: false };
        }
    }

    // Randomly place mines
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const x = Math.floor(Math.random() * boardSize);
        const y = Math.floor(Math.random() * boardSize);
        if (!board[x][y].isMine) {
            board[x][y].isMine = true;
            mineLocations.push({ x, y });
            minesPlaced++;
        }
    }
}

function handleClick(x, y) {
    if (gameOver || board[x][y].isClicked || board[x][y].isFlagged) return; // Prevent actions if game is over
    board[x][y].isClicked = true;
    board[x][y].element.classList.add('clicked');

    if (board[x][y].isMine) {
        board[x][y].element.classList.add('mine');
        alert('게임 종료!');
        revealMines();
        gameOver = true; // Set gameOver to true when the game is over
        clearInterval(timer); // Stop the timer
    } else {
        const adjacentMines = countAdjacentMines(x, y);
        if (adjacentMines > 0) {
            board[x][y].element.innerText = adjacentMines;
        } else {
            revealSafeCells(x, y);
        }
        checkWin();  // Check for win after each cell is clicked
    }
}

function toggleFlag(x, y) {
    if (gameOver || board[x][y].isClicked) return; // Prevent flagging after game over
    if (board[x][y].isFlagged) {
        board[x][y].isFlagged = false;
        board[x][y].element.classList.remove('flag');
        board[x][y].element.innerText = '';
    } else {
        board[x][y].isFlagged = true;
        board[x][y].element.classList.add('flag');
        board[x][y].element.innerText = '🚩';
    }
    setTimeout(() => {
        checkWin(); // Delay the win check to allow flag rendering
    }, 100); // 100 milliseconds delay
}

function countAdjacentMines(x, y) {
    let mineCount = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nx = x + i;
            const ny = y + j;
            if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize && board[nx][ny].isMine) {
                mineCount++;
            }
        }
    }
    return mineCount;
}

function revealSafeCells(x, y) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nx = x + i;
            const ny = y + j;
            if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize && !board[nx][ny].isClicked) {
                handleClick(nx, ny);
            }
        }
    }
}

function revealMines() {
    mineLocations.forEach(({ x, y }) => {
        const cell = board[x][y];
        if (cell.isFlagged && cell.isMine) {
            cell.element.classList.remove('flag');  // Remove the flag
            cell.element.classList.add('mine');    // Turn the cell red
        } else if (cell.isMine) {
            cell.element.classList.add('mine');     // Reveal unflagged mines
        }
    });
}

function checkWin() {
    let correctFlagCount = 0;
    let totalMines = 0;
    let revealedCells = 0;
    let totalCells = boardSize * boardSize;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            let cell = board[i][j];
            if (cell.isMine) {
                totalMines++;
                if (cell.isFlagged) {
                    correctFlagCount++;
                }
            }
            if (cell.isClicked) {
                revealedCells++;
            }
        }
    }

    // 승리 조건: 모든 지뢰에 깃발이 정확히 설치되고 모든 안전한 셀이 열렸을 때
    if (correctFlagCount === totalMines && revealedCells + totalMines === totalCells) {
        clearInterval(timer); // Stop the timer on win
        gameOver = true; // Set gameOver to true after win
        setTimeout(() => {
            alert("축하합니다! 게임에서 승리했습니다!");
        }, 100); // 100 milliseconds delay to ensure flag rendering
    }
}

function setDifficulty(level) {
    if (level === 'easy') {
        boardSize = 8;
        mineCount = 8;
    } else if (level === 'medium') {
        boardSize = 16;
        mineCount = 40;
    } else if (level === 'hard') {
        boardSize = 24;
        mineCount = 99;
    }
    resetGame(); // Reset the game with new difficulty
}

function startTimer() {
    clearInterval(timer); // Reset timer if already running
    seconds = 0;
    document.getElementById('timer').innerText = `Time: 0`;
    timer = setInterval(() => {
        seconds++;
        document.getElementById('timer').innerText = `Time: ${seconds}`;
    }, 1000);
}

function resetGame() {
    gameOver = false; // Reset gameOver status when a new game starts
    createBoard();
    startTimer(); // Start the timer on new game
}

createBoard();
startTimer(); // Start the timer for the first game