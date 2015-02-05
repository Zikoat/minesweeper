var colors = require('colors');
var prompt = require('prompt');

var board = [];
var game = {};
game.over = false;

function Tile() {
	this.isUncovered = false;
	this.isBomb = false;
};

Tile.prototype.toString = function() {
	if(this.isUncovered) {

		if (this.isBomb) {
			game.over = true;
			return " ¤ ".bgRed;
		} else {
			return (" " + this.getNeighbouringBombs() + " ");
		};

	} else {
		//unknown
		return "[ ]";
	};
};

//returns amount of bomb neighbours, and sets
Tile.prototype.getNeighbouringBombs = function(){

	var bombNeighbours = 0;

	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {

			var x=this.x+i;
			var y=this.y+j;

			if (x>=0 && x<game.x && y>=0 && y<game.y) {
				var neighbour = board[this.x + i][this.y + j];

				if(this!==neighbour && neighbour.isBomb){
					bombNeighbours++;
				};
			};
		};
	};
	var str = bombNeighbours.toString();
	switch(bombNeighbours) {
		case 0:
			str = " ";
			break;

		case 1:
			str = str.bold.blue;
			break;

		case 2:
			str = str.green;
			break;

		case 3:
			str = str.red;
			break;

		case 4:
			str = str.blue;
			break;

		case 5:
			str = str.yellow;
			break;

		case 6:
			str = str.cyan;
			break;

		case 7:
			str = str.bgWhite.black;
			break;

		case 8:
			str = str.grey
	}
	return str;
};

//sets variables(saves), and prints title
var newGame=function(x,y,bombs){
	game.x = x;
	game.y = y;
	console.log("newGame " + x + "," + y + " ("+ bombs+")");
	game.numberOfBombs = bombs;
	if(x*y<=bombs){
		throw new Error('Not enough tiles!');
		//console.log("error not enough tiles");
	}
};

//creates arrays and constructs tiles
var createBoard=function(x,y){

	for (var i = 0; i < x; i++) {
		
		board[i]=new Array();

		for (var j = 0; j < y; j++) {

			var tile = new Tile();
			board[i][j] = tile;
			tile.x=i;
			tile.y=j;
		};
	};
};

//sets random tiles to isBomb=true (game.numberOfBombs)
var insertBombs=function(){
	bombsHaveBeenPlanted = true;
	var amount=game.numberOfBombs;

	for (var i = 0; i < amount; i++) {
		var x = Math.floor(Math.random() * game.x);
		var y = Math.floor(Math.random() * game.y);

		var tile = board[x][y];

		if(tile.isBomb || tile.isUncovered) {
			i--;

		} else {
			tile.isBomb = true;
		}
	};
};



//prints board, chooses printing format
var printBoard=function(){
	var str = "";

	var x = game.x;
	var y = game.y;

	var hiddenTiles = 0;
	for (var i = 0; i < y; i++) {

		for (var j = 0; j < x; j++) {

			var tile = board[j][i];
			
			str += tile.toString();
			
			if(!tile.isUncovered){ hiddenTiles++; };
		
		};

		str += "\n";

	};
	console.log(str);
	if (game.over){
		console.log("Game Over!".red);
		process.exit();
	}

	if(hiddenTiles==game.numberOfBombs){
		console.log("You Win!".green);
		process.exit();
	}
};


//gameplay

newGame(process.argv[2], process.argv[3], process.argv[4]);


createBoard(game.x, game.y);


printBoard();

var bombsHaveBeenPlanted = false;

var ask=function(){

prompt.get(['xTile', 'yTile'], function (err, result) {
	console.log('x: ' + result.xTile);
	console.log('y: ' + result.yTile);
	var tile = board[result.xTile][result.yTile];
	tile.isUncovered = true;
	if(!bombsHaveBeenPlanted) {
		insertBombs();
	}


    printBoard();
    ask();
});


prompt.start();
};

ask();