var colors = require('colors');

var board = [];
var game = {};

function Tile() {
	this.isUncovered = false;
	this.isBomb = false;
};

Tile.prototype.toString = function() {
	if(this.isUncovered) {

		if (this.isBomb) {
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
	var amount=game.numberOfBombs;
	for (var i = 0; i < amount; i++) {
		var x = Math.floor(Math.random() * game.x);
		var y = Math.floor(Math.random() * game.y);

		var tile = board[x][y];

		if(tile.isBomb) {
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

	for (var i = 0; i < y; i++) {

		for (var j = 0; j < x; j++) {

			str += board[j][i].toString();
		
		};

		str += "\n";

	};
	console.log(str);
};


//gameplay

newGame(9,9,50);

createBoard(game.x, game.y);

insertBombs();


printBoard();


var prompt = require('prompt');

  prompt.start();
 
  // 
  // Get two properties from the user: username and email 
  // 
  prompt.get(['xTile', 'yTile'], function (err, result) {
    // 
    // Log the results. 
    // 
    console.log('Command-line input received:');
    console.log('x: ' + result.xTile);
    console.log('y: ' + result.yTile);
    var tile = board[result.yTile][result.xTile];
    tile.isUncovered = true;

    printBoard();
  });