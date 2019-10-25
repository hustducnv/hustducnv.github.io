let origBoard; //Map
let hasFinished;

const huPlayer = 'O';
const aiPlayer = 'X';

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

let cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	hasFinished = false;
	origBoard = Array.from(Array(9).keys()); //0 to 9
	// origBoard = ['O', 'O', 2,
	// 			 3, 4, 5,
	// 			 'O', 'X', 'X']; //for test
	// console.log(minimax(origBoard, aiPlayer));
	document.querySelector('.endgame').style.display = 'none';

	for (var i = cells.length - 1; i >= 0; i--) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', huClick, false);
	}

}

function huClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer);
		if (!hasFinished) {
			turn(bestSpot(), aiPlayer);
		}
	}

}
function turn(squareID, player) {
	origBoard[squareID] = player;
	document.getElementById(squareID).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon) {
		winGame(gameWon);
	} else if (checkTie()) {
		tieGame();
	}

}

function winGame(gameWon) {
	hasFinished = true;
	for(let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			(gameWon.player == huPlayer) ? "#7fb174" : "#fe7773";
	}
	for (var i = cells.length - 1; i >= 0; i--) {
		cells[i].removeEventListener('click', huClick, false)
	}
	declareWinner(gameWon.player == huPlayer ? "You Win!" : "You Lose!");

}

function tieGame() {
	hasFinished = true;
	for (let item of cells) {
		item.style.backgroundColor = '#1A6CA5';
		item.removeEventListener('click', huClick, false);
	}
	declareWinner('Tie Game!')
}

function declareWinner(who) {
	document.querySelector('.endgame').style.display = 'block';
	document.querySelector('.endgame .text').innerText = who;
}
function checkWin(board, player) {
	let playerMap = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for(let [index, win] of winCombos.entries()) {
		if (win.every(e => playerMap.indexOf(e) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function checkTie() {
	return emptySquare().length === 0;
}

function emptySquare() {
	return origBoard.filter(e => typeof e === 'number');
}

function bestSpot() {
	// return emptySquare()[0];
	// let x = minimax(origBoard, aiPlayer);
	// console.log(x);
	// return x.spot;

	let x = minimax(origBoard, aiPlayer).spot;
	return x;
}


function minimax(newBoard, player) {
	let availSpots = emptySquare();
	if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	}
	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	}
	if (availSpots.length === 0) {
		return {score: 0};
	}

	let moves = [];

	if (player === aiPlayer) {
		for (let i of availSpots) {
			let move = {};
			move.spot = i;
			newBoard[i] = player;
			move.score = minimax(newBoard, huPlayer).score;
			moves.push(move);
			newBoard[i] = i;
		}

		let max = {score: -1000};
		for (let i of moves) {
			if (i.score > max.score) {
				max = i;
			}
		}

		return max;
	}

	if (player === huPlayer) {
		for (let i of availSpots) {
	 		let move = {};
			move.spot = i;
			newBoard[i] = player;
			move.score = minimax(newBoard, aiPlayer).score;
			moves.push(move);
			newBoard[i] = i;
		}

		let min = {score: 1000};
		for (let i of moves) {
			if (i.score < min.score) {
				min = i;
			}
		}

		return min;
	}
}



/*function minimax(newBoard, player) {
	var availSpots = emptySquare();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}*/