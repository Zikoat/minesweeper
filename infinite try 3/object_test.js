/*jshint esversion: 6 */
class Cell {
	// the cell class only holds the information of the cell, and also mirrors
	// the functions in the field that take x/y arguments. this allows chaining,
	// like this:
	// f.getCell(10,10).open()
	constructor(x, y, parent=undefined, isFlagged=false, isMine=undefined){
		this.x = x;
		this.y = y;
		this.parent = parent;
		this.isOpen = false;
		this.isMine = isMine;
		this.isFlagged = isFlagged;
	}

	open(){// opens this cell
		if(this.parent===undefined) console.error("i don't know my parents", this);
		this.parent.open(this.x, this.y);
	}

	flag(){// flags this cell
		console.info("flagging is not ready yet");
		//this.parent.flag(this.x, this.y);
	}
	getNeighbors(){//returns an array of this cell's neighbors
		if(this.parent===undefined) console.error("i don't know my parents", this);
		return this.parent.getNeighbors(this.x, this.y);	
	}
	value(){}
}

class Field {
	// do not call any of the cell's functions in the field class, to prevent 
	// infinite loops
	constructor(probability=0.27){
		this.field = {};
		// this is the probability that a mine is a cell
		this.probability = probability;
		// the field is pristine if no cells are opened, set this to true again with 
		// Field.restart()
		this.pristine = true;
		// todo: implement safeRadius
		// makes the first click not press a mine
		this.safeRadius = 0;
		this.neighborPosition = [
			[-1,-1],
			[0,-1],
			[1,-1],
			[-1,0],
			[1,0],
			[-1,1],
			[0,1],
			[1,1]
		];

		// todo: more options: 
		// generate on get or open neighbor
		// count with itself
		// permadeath
		// opened mines counter
		// opened cells
		// wrongly flagged cells
		// dig up mines
	}
	getCell(x, y){
		// if the row is not created yet, return "default" cell
		if(!(x in this.field)) return new Cell(x, y, this);
		// if the cell is not created yet, return "default" cell
		if(!(y in this.field[x])) return new Cell(x, y, this);

		return this.field[x][y];
		// prefer using getCell instead of accessing the object, to avoid these problems
	}
	open(x, y){
		// we check if the cell is generated if we want to change the cell
		let cell = this.getCell(x,y);
		if(cell.isMine === undefined){

			cell = this.generateCell(x, y, cell.isFlagged);
			// we call the function with cell.isFlagged so that the flagged state 
			// gets carried over
		} 
		
		if(!cell.isFlagged){
			// debugging
			if(cell.isOpen) console.log(x, y, "is already open");
			cell.isOpen = true;
			this.pristine = false;
			if(cell.isMine) console.log("game over, you stepped on a mine: ("+x+", "+y+")");
				// todo: set game state to over
			if(cell.value() == 0){
				cell.getNeighbors()
				.filter(Field.filter.isClosed)
				.forEach(Field.filter.open);
			}
			// todo: generate neighboring cells
			// todo: floodfill
		} else {
			// debugging
			console.warn(x, y, "cant open because is flagged");
		}
		updateCell(x, y);
		this.checkForErrors();
	}
	flag(x, y){
		// todo
		// to make it work, can make the mine not undefined if it is flagged, 
		// and delete it if we unflag it
		// todo: update
	}
	getNeighbors(x, y){
		let neighbors = [];
		for (var i = 0; i <= this.neighborPosition.length - 1; i++) {
			let newX = x + this.neighborPosition[i][0];
			let newY = y + this.neighborPosition[i][1];
			neighbors.push(this.getCell(newX,newY));
		}
		return neighbors;
	}
	generateCell(x, y, isFlagged = false, isMine = undefined){

		// if the row is not created yet, create the row
		// if we didnt check this, we would get "cannot read property [column] of undefined"
		if(!(x in this.field)) this.field[x] = {};
		// if the cell is not created
		if(!(y in this.field[x])) {
			// determine if the cell is a mine
			if(isMine===undefined) isMine = Math.random() < this.probability;
			// and add it to the field
			let cell =  new Cell(x, y, this, isFlagged, isMine);
			this.field[x][y] = cell;
			return cell;
		}
	}
	restart(){// todo
		this.pristine = true;
		// todo: delete all of the rows, update all of the cells
	}
	getAll(){// returns all the cells, in a 1-D array
		let cells = [];
		let rows = Object.keys(this.field);
		for (var i = 0; i < rows.length; i++) {
			let columns = Object.keys(this.field[rows[i]]);
			for (var j = 0; j < columns.length; j++) {
				cells.push(this.getCell(rows[i],columns[j]));
			}
		}
		return cells;
	}
	value(x, y){// returns the amount of surrounding mines
		// the value of a cell is the amount of neighboring mines it has
		return this.getNeighbors(x, y) 
			.filter(Field.filter.isMine)
			.length;
	}
	checkForErrors(){
		// this is only for debugging
		let cells = this.getAll();
		let flags = cells.filter(Field.filter.isFlagged);
		let flagAndOpen = flags.filter(Field.filter.isOpen);
		if(flagAndOpen.length > 0){console.error("cell is flagged and open", flagAndOpen);}
		let undefinedCells = cells.filter((cell)=>{return cell.isMine===undefined;});
		if(undefinedCells.length > 1){console.error("undefined cells", undefinedCells);}
	}
}
// i don't know how to set things like this with the class initializer
Field.filter = {};
Field.filter.isMine = function (cell){
	return cell.isMine;
};
Field.filter.isOpen = function (cell){
	return cell.isOpen;
};
Field.filter.isClosed = function (cell){
	return !cell.isOpen;
}
Field.filter.isFlagged = function (cell){
	return cell.isFlagged;
};
Field.filter.hasOpenNeighbors = function (cell){
	let amount = cell.getNeighbors() // get the neigbhors of this cell
		.filter(Field.filter.isOpen) // filter its neighbors, so only the open ones are left
		.length; // see how many there are
	console.log(amount, "number of open neigbors of", cell.x, cell.y);
	return amount > 0;
};
Field.filter.perimeter = function(cell){
	// These cells are the closed cells on the edge of the field.
	// when playing the game, or creating a bot, these are the ones you should consider,
	// and here is a function to get them all,
	// one-lined, of course
	return (cell.getNeighbors()
			.some(Field.filter.isOpen)) && //has it any open neighbors?
		!cell.isOpen && 
		!cell.isFlagged;
	//cell.getNeighbors().filter(Field.filter.isOpen).length > 0
	// is the same as
	//cell.getNeighbors().some(Field.filter.isOpen)
};
Field.filter.open = function(cell){
	cell.open();
}