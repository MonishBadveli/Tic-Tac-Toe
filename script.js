const Gameboard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    return {
        getBoard: () => [...board],
        updateBoard: (index, marker) => {
            if (index >= 0 && index < 9 && board[index] === '') {
                board[index] = marker;
                return true;
            }
            return false;
        },
        resetBoard: () => {
            board = ['', '', '', '', '', '', '', '', ''];
        }
    };
})();

const Player = (name, marker) => ({
    getName: () => name,
    getMarker: () => marker,
});

const GameController = (() => {
    let player1, player2, currentPlayer, gameOver, gameMode;

    const initializeGame = (name1, name2, mode) => {
        player1 = Player(name1, 'X');
        player2 = mode === 'pvc' ? Player('Computer', 'O') : Player(name2, 'O');
        currentPlayer = player1;
        gameOver = false;
        gameMode = mode;
        Gameboard.resetBoard();
        updateUI();
    };

    const playTurn = (index) => {
        if (gameOver || !Gameboard.updateBoard(index, currentPlayer.getMarker())) {
            return;
        }

        updateUI();

        if (checkWinner()) {
            gameOver = true;
            document.getElementById('gameStatus').textContent = `${currentPlayer.getName()} wins!`;
            document.getElementById('gameStatus').style.color = currentPlayer.getMarker() === 'X' ? '#e74c3c' : '#2ecc71';
            return;
        }

        if (checkTie()) {
            gameOver = true;
            document.getElementById('gameStatus').textContent = "It's a tie!";
            document.getElementById('gameStatus').style.color = '#3498db';
            return;
        }

        switchTurn();

        if (gameMode === 'pvc' && currentPlayer.getName() === 'Computer') {
            setTimeout(computerPlay, 500);
        }
    };

    const computerPlay = () => {
        const availableMoves = Gameboard.getBoard()
            .map((cell, index) => cell === '' ? index : null)
            .filter(cell => cell !== null);

        if (availableMoves.length > 0) {
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            playTurn(randomMove);
        }
    };

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winningCombos.some(combo =>
            board[combo[0]] &&
            board[combo[0]] === board[combo[1]] &&
            board[combo[0]] === board[combo[2]]
        );
    };

    const checkTie = () => Gameboard.getBoard().every(cell => cell !== '');

    const updateUI = () => {
        const cells = document.querySelectorAll('.cell');
        const board = Gameboard.getBoard();

        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            cell.classList.remove('x', 'o');
            if (board[index] === 'X') {
                cell.classList.add('x');
            } else if (board[index] === 'O') {
                cell.classList.add('o');
            }
        });
    };

    return { initializeGame, playTurn, checkGameOver: () => gameOver };
})();

function startGame() {
    const player1Name = document.getElementById('player1Name').value || 'Player 1';
    const player2Name = document.getElementById('player2Name').value || 'Player 2';
    const gameMode = document.querySelector('input[name="gameMode"]:checked').value;

    GameController.initializeGame(player1Name, player2Name, gameMode);

    document.getElementById('gameStatus').textContent = '';
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

function resetGame() {
    startGame();
}

document.getElementById('gameBoard').addEventListener('click', (event) => {
    if (event.target.classList.contains('cell') && !GameController.checkGameOver()) {
        const index = event.target.getAttribute('data-index');
        GameController.playTurn(parseInt(index));
    }
});
