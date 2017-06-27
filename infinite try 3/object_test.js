/*jshint esversion: 6 */
class Cell {
	constructor(x, y, isFlagged=false, isMine=undefined){
		this.x = x;
		this.y = y;
		this.isOpen = false;
		this.isMine = isMine;
		this.isFlagged = isFlagged;
	}

	open(){
		open(this.x, this.y);
		console.log("wow");
	}

	static createEmpty(x, y){
		return {x:x, y:y, isOpen:false, isMine:undefined, isFlagged:false};
	}
}

class Field {
	// do not call any of the cell's functions in the field class, to prevent 
	// infinite loops
	constructor(probability=0.25){
		this.probability = probability;
		this.pristine = true;
		// todo: implement safeRadius
		// makes the first click not press a mine
		this.safeRadius = 0;
	}
	getCell(x, y){
		// if the row is not created yet, return "default" cell
		if(!(x in this)) return new Cell(x, y);
		// if the cell is not created yet, return "default" cell
		if(!(y in this[x])) return new Cell(x, y);

		return this[x][y];
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
			// todo: update the cell
			cell.isOpen = true;
			this.pristine = false;
			if(cell.isMine) console.warn("game over, you stepped on a mine: ("+x+", "+y+")");
				// todo: set game state to over
			// todo: generate neigboring cells
			// todo: floodfill
		} else {
			// debugging
			console.warn(x, y, "cant open because is flagged");
		}
	}
	flag(x, y){
		// todo
		// to make it work, can make the mine not undefined if it is flagged, 
		// and delete it if we unflag it
		// todo: update
	}
	generateCell(x, y, isFlagged = false, isMine = undefined){

		// if the row is not created yet, create the row
		// if we didnt check this, we would get "cannot read property [column] of undefined"
		if(!(x in this)) this[x] = {};
		// if the cell is not created
		if(!(y in this[x])) {
			// determine if the cell is a mine
			if(isMine===undefined) isMine = Math.random() < this.probability;
			// and add it to the field
			let cell =  new Cell(x, y, isFlagged, isMine)
			this[x][y] = cell;
			return cell;
		}
	}
	restart(){
		this.pristine = true;
		// delete all of the rows, update all of the cells
		
	}
}

var field2 = new Field();
field2.getCell(1,1);
field2.open(1,2);
field2.getCell(1,2);
field2.open(1,1);
field2.open(2,1);
field2.open(2,2);