//Assign Position of Cells
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        let cell = document.getElementById(`c${i}${j}`);
        cell.style.gridArea = `c${i}${j}`;
    }
}

function $(id) {
    return document.getElementById(id);
}

const gameboard = (() => {
    let board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];

    //Cache DOM
    const [c00, c01, c02, c10, c11, c12, c20, c21, c22] = document.querySelectorAll(".cell");
    const domCells = [
        [c00, c01, c02],
        [c10, c11, c12],
        [c20, c21, c22],
    ];

    const render = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == 0) {
                    domCells[i][j].innerText = "";
                } else {
                    domCells[i][j].innerText = board[i][j];
                }
            }
        }
    };

    const editBoard = (y, x, value) => {
        board[y][x] = value;
    };

    const isValidMove = (y, x) => {
        if (board[y][x] == 0) {
            return true;
        } else {
            return false;
        }
    };

    const play = (y, x, move) => {
        if (isValidMove(y, x)) {
            editBoard(y, x, move);
            render();
            return true;
        } else {
            return false;
        }
    };

    const checkWin = () => {
        winRows =
            (board[0][0] != 0 && board[0][0] == board[0][1] && board[0][1] == board[0][2]) || //Row 1
            (board[1][0] != 0 && board[1][0] == board[1][1] && board[1][1] == board[1][2]) || //Row 2
            (board[2][0] != 0 && board[2][0] == board[2][1] && board[2][1] == board[2][2]); // Row 3
        winColumns =
            (board[0][0] != 0 && board[0][0] == board[1][0] && board[1][0] == board[2][0]) || //Col 1
            (board[0][1] != 0 && board[0][1] == board[1][1] && board[1][1] == board[2][1]) || //Col 2
            (board[0][2] != 0 && board[0][2] == board[1][2] && board[1][2] == board[2][2]); //Col 3
        winDiagonals =
            (board[0][0] != 0 && board[0][0] == board[1][1] && board[1][1] == board[2][2]) || //Diag 1
            (board[2][0] != 0 && board[2][0] == board[1][1] && board[1][1] == board[0][2]); //Diag 2
        return winRows || winColumns || winDiagonals;
    };

    const clearBoard = () => {
        board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        render();
    };

    render();

    return {
        board,
        domCells,
        play,
        checkWin,
        clearBoard,
    };
})();

const Player = (move, name) => {
    let score = 0;
    const getScore = () => score;
    const addWinPoint = () => {
        score++;
    };
    return {
        name,
        move,
        getScore,
        addWinPoint,
    };
};

const game = (() => {
    //Cache DOM

    let body = document.querySelector("body");
    let restartBtn = $("restartBtn");
    let playBtn = $("playBtn");
    let domGameboard = $("gameboard");
    let newGameBtn = $("newGameBtn");
    let newGameOptions = $("newGameOptions");
    let gameMessage = $("gameMessage");
    let player1Name = $("player1Name");
    let player2Name = $("player2Name");
    let playerNames = $("playerNames");
    let p1Display = $("p1NameDisplay");
    let p2Display = $("p2NameDisplay");

    let player1, player2, players, currentPlayer;
    let turn = 0;

    const renderPlayersInfo = () => {
        p1Display.innerHTML = `( ${player1.move} ) ${player1.name}: ${player1.getScore()}`;
        p2Display.innerText = `( ${player2.move} ) ${player2.name}: ${player2.getScore()}`;
    };

    const highlightPlayer = () => {
        if (currentPlayer == player1) {
            p1Display.classList.add("playerPlays");
            p2Display.classList.remove("playerPlays");
        } else {
            p2Display.classList.add("playerPlays");
            p1Display.classList.remove("playerPlays");
        }
    };

    const winOrTieMessage = (player, state) => {
        if (state == "win") {
            gameMessage.innerText = `${player.name} wins!`;
        } else {
            gameMessage.innerText = "It's a tie!";
        }
        body.appendChild(gameMessage);
    };

    const play = () => {
        if (player1Name.validity.valid && player2Name.validity.valid) {
            player1 = Player("X", player1Name.value);
            player2 = Player("O", player2Name.value);
            players = [player1, player2];
            currentPlayer = players[turn % 2];
            highlightPlayer();
            body.insertBefore(playerNames, domGameboard);
            renderPlayersInfo();
            body.removeChild(newGameOptions);
        }
    };

    const restartGame = () => {
        //Gets Players' Info
        turn = 0;
        currentPlayer = players[turn % 2];
        highlightPlayer();
        gameboard.clearBoard();
        addCellEvent();
    };

    const newGame = () => {
        //Gets Players' Info
        body.prepend(newGameOptions);
        players = [];
        turn = 0;
        gameboard.clearBoard();
        addCellEvent();
    };

    const endGame = () => {
        removeCellEvent();
    };

    const addCellEvent = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameboard.domCells[i][j].addEventListener("click", playerTurn);
            }
        }
    };

    const removeCellEvent = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameboard.domCells[i][j].removeEventListener("click", playerTurn);
            }
        }
    };

    const playerTurn = (event) => {
        let cellId = event.target.id;
        let [cellY, cellX] = cellId.slice(-2).split(""); //Gets Clicked Cell [Y,X] Position With Its Id
        if (gameboard.play(cellY, cellX, currentPlayer.move)) {
            if (gameboard.checkWin()) {
                currentPlayer.addWinPoint();
                renderPlayersInfo();
                endGame();
                winOrTieMessage(currentPlayer, "win");
            } else {
                turn++;
                //Tie Check
                if (turn == 9) {
                    endGame();
                    winOrTieMessage(currentPlayer, "tie");
                } else {
                    currentPlayer = players[turn % 2];
                    highlightPlayer();
                }
            }
        }
    };

    //Initial State
    body.removeChild(gameMessage);
    body.removeChild(playerNames);

    //Bind Events
    restartBtn.addEventListener("click", restartGame);
    playBtn.addEventListener("click", play);
    newGameBtn.addEventListener("click", newGame);
    gameMessage.addEventListener("animationend", function () {
        body.removeChild(gameMessage);
    });

    addCellEvent();
})();
