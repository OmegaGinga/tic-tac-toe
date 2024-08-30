const body = document.querySelector('body');
const resetButton = document.querySelector('.reset');
const playerOne = document.querySelector('.player1');
const playerTwo = document.querySelector('.player2');
const gridItems = document.querySelectorAll('.grid-item');
const container = document.querySelector('.container');
const startInterface = document.querySelector('.start-interface');

document.getElementById('start-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const player1Name = document.getElementById('player1-name').value;
    const player2Name = document.getElementById('player2-name').value;

    if (player1Name && player2Name) {
        playerOne.textContent = player1Name;
        playerTwo.textContent = player2Name;

        startInterface.style.display = 'none';
        container.style.display = 'flex';

        player1 = playerFactory(player1Name, 'X');
        player2 = playerFactory(player2Name, 'O');
    }
});

const turn = Math.floor(Math.random() * 2) + 1;
let player1Turn = (turn === 1);
let player2Turn = !player1Turn;

if (player1Turn) {
    playerOne.style.backgroundColor = '#00aaff';
    playerTwo.style.backgroundColor = '';
} else {
    playerTwo.style.backgroundColor = '#4caf50';
    playerOne.style.backgroundColor = '';
}

resetButton.addEventListener('click', () => {
    window.location.reload();
});

const gameBoardObj = (function() {
    let gameBoard = ['', '', '', '', '', '', '', '', ''];

    function getGameBoard() {
        let board = '';
        gameBoard.forEach((space, index) => {
            board += space === '' ? '_' : space;
            if ((index + 1) % 3 === 0 && index !== gameBoard.length - 1) {
                board += '\n';
            }
        });
        console.log(board);
    }

    function isFull() {
        return !gameBoard.includes('');
    }

    return {
        checkSpaces: function() {
            const combos = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];
            for (const combo of combos) {
                const [a, b, c] = combo;
                if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                    return 'win';
                }
            }
            if (isFull()) {
                return 'draw';
            }
            return 'continue';
        },
        setToken: function(token, space) {
            if (space < 9 && gameBoard[space] === '') {
                gameBoard[space] = token;
                return true;
            } else {
                console.log('Invalid move');
                return false;
            }
        }
    };
})();

const playerFactory = function(name, tokenType) {
    const { setToken, checkSpaces } = gameBoardObj;

    function checkGameStatus() {
        const status = checkSpaces();
        if (status === 'win') {
            const winner = document.createElement('h1');
            winner.textContent = `${name} Wins!`;
            body.appendChild(winner);
            container.style.display = 'none';
            resetButton.style.display = 'block';
            gridItems.forEach(item => item.removeEventListener('click', handleClick));
        } else if (status === 'draw') {
            const draw = document.createElement('h1');
            draw.textContent = 'It\'s a Draw!';
            body.appendChild(draw);
            container.style.display = 'none';
            resetButton.style.display = 'block';
            gridItems.forEach(item => item.removeEventListener('click', handleClick));
        }
    }

    return {
        getPlayerName: function() {
            console.log(name);
        },
        setToken: function(space) {
            if (setToken(tokenType, space)) {
                checkGameStatus();
            }
        }
    };
};

let player1;
let player2;

function addTokenToHtml(item, tokenType) {
    if (item.childElementCount === 0) {
        const token = document.createElement('div');
        token.classList.add('token');
        token.textContent = tokenType;
        item.appendChild(token);
    }
}

function handleClick(event) {
    const item = event.target;
    if (item.childElementCount > 0) {
        alert('Invalid move!');
        return;
    }

    const index = Array.from(gridItems).indexOf(item);

    if (player1Turn) {
        player1.setToken(index);
        addTokenToHtml(item, 'X');
        player1Turn = false;
        player2Turn = true;
    } else {
        player2.setToken(index);
        addTokenToHtml(item, 'O');
        player2Turn = false;
        player1Turn = true;
    }

    if (player1Turn) {
        playerOne.style.backgroundColor = '#00aaff';
        playerTwo.style.backgroundColor = '';
    } else {
        playerTwo.style.backgroundColor = '#4caf50';
        playerOne.style.backgroundColor = '';
    }
}

gridItems.forEach((item) => {
    item.addEventListener('click', handleClick);
});