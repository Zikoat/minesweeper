class Minesweeper {
	
	constructor(probability){
		this.probability = probability;
		this.data = {};
		//this.data[1][1] = true;

	}
	cell(x, y){
		if(this.data[x]===undefined) this.data[x] = {};
		this.data[x][y] = true;
	}
}

var board = new Minesweeper(0.25);
board.cell(1,1);
console.log(board.data);