class Minesweeper {
	
	constructor(probability){
		this.probability = probability;
		this.data = {};
		//this.data[1][1] = true;
		this.selected = [0,0];
	}

	getCell(x, y){
		if(typeof this.data[x] === "undefined") this.data[x] = {};
		if(typeof this.data[x][y] === "undefined") this.data[x][y] = new Cell(x, y, this.probability);
		return this.data[x][y];
		// i should create a dummy cell if it has not been generated
		// i can set isMine to undefined
	}

	//getneigbours returns an 1-dimensional list of all the neighbours
	getNeigbours(x, y){
		let neighbours = [];
		for(let i=-1; i<1; i++){
			for(let j=-1; j<1; j++){
				neighbours.push(this.getCell(x+i, y+j));
			}
		}
	}

	open(x, y){
		this.data[x][y].isOpen = true;
		//todo: update the surrounding tiles, and floodfill
		//todo: return all the opened tiles
	}

	flag(x, y){
		//toggles the flag
		this.data[x][y].isFlagged = !this.data[x][y].isFlagged;
		//todo: return the updated flag
	}

	render(size, optn){
		// size is the "radius" of the displayed area and selected is in the middle, so the size will be size*2+1
		// optn says which part of the cell to render, for example isOpen or isMine.
		let string = "";
		for(let i=-size; i<size+1; i++){
			for(let j=-size; j<size+1; j++){
				let currentCell=this.getCell(this.selected[0]+i, this.selected[1]+j);
				string += currentCell[optn] ? "o " : "x ";
			}
			if(i<size) string+="\n"; // add a new line if this isnt the last
		}
		console.log(string);
	}

	select(x,y){
		//the selected cell is used to render the board (todo: and to open cells)
		this.selected = [x, y]
	}
}

class Cell {
	constructor(x, y, probability){
		this.x=x;
		this.y=y;
		this.isMine = Math.random() > probability;
		this.isOpen = false;

	}
	getNeigbours(){ return Minesweeper.getNeigbours(this.x, this.y); }

}

var board = new Minesweeper(0.5);
board.open(0,0);
board.render(3, "isOpen");
console.log("----");
board.render(3, "isMine");

//console.log(board.data);