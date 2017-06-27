// jslint 'esversion: 6'

class Cell {
	constructor(x, y, isMine){

	}
	open(){
		open(this.x, this.y);
	}
}

var field = {};
const neighbourPosition = [
	[-1,-1],
	[0,-1],
	[1,-1],
	[-1,0],
	[1,0],
	[-1,1],
	[0,1],
	[1,1]
];
const probability = 0.5;

function open(x, y){
	if(!isGenerated(x,y)) {
		generateCell(x, y);
	}
	if(!field[x][y].isOpen){
		console.log("opened cell");
		field[x][y].isOpen = true;
		if(field[x][y].isMine) console.log("game over");
	}else{
		console.log("already opened")
	};
	//recursively open all nearby cells
}

function getCell(x, y){
	if(!isGenerated(x,y)) return dummyCell(x, y);
	else return field[x][y];
}

function getNeigbours(x, y){
	let neighbours = [];
	for (let i = 0; i <= neighbourPosition.length -1; i++) {
		let deltaX = x + neighbourPosition[i][0];
		let deltaY = y + neighbourPosition[i][1];
		neighbours.push(getCell(deltaX, deltaY));
	}
	return neighbours;
}

function dummyCell(x, y, isMine){
	return {x:x, y:y, isOpen:false, isMine:isMine, isFlagged:false};
}

function generateCell(x, y){
	let row = field[x];
	if(row==undefined) field[x] = {};
	if(!isGenerated(x,y)) {
		//we generate a new cell
		let isMine = Math.random() < probability;
		field[x][y] = dummyCell(x, y, isMine);
		return field[x][y];
	}
}

function isGenerated(x, y){
	let row = field[x];
	if(row==undefined) {
		return false;
	}

	let cell = field[x][y];
	if(cell==undefined) return false;
	return true;
}

function getField(){
	let cells = [];
	let rows = Object.keys(field);
	for (var i = 0; i < rows.length; i++) {
		let columns = Object.keys(field[rows[i]]);
		for (var j = 0; j < columns.length; j++) {
			cells.push(getCell(columns[j],rows[i]));
		}
	}
	return cells;
}

open(1,1);
open(1,2);
open(2,1);
open(2,2);

getCell(1,1);