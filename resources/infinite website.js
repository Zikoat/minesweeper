/*
	This work is licensed under the Creative Commons BY-SA 3.0 license. For more information, visit: http://creativecommons.org/licenses/by-sa/3.0/
	You may:
	- Share this
	- Reuse this (even for commerical works)
	You must:
	- Attribute me: put my nick and my website URL (Calmarius and http://calmarius.net) in your work if you reuse my work.
	- Share alike: Your work must be licensed under a similar or compatible license.
*/
// class cell blueprint
class Cell {
	constructor(x,y,maxMinesAround,isMine){
		/*
	for(var i=0;i<8;i++)// for all neighbors
	{
		var divInIndex=cellIndex[
			(x+NeighborRelativeCoords[i][0]*CELLSIZE)
			+';'+
			(y+NeighborRelativeCoords[i][1]*CELLSIZE)];
		if (divInIndex) // if the neighbor is in the cellIndex, add it to cell.ms.neighbors
		{
			div.ms.neighbors[i]=divInIndex;
			divInIndex.ms.neighbors[(i+4)%8]=div;
		}
	}
	*/

		this.position = [x,y];
		this.maxMinesAround = maxMinesAround;
		this.isMine = isMine;
		this.neighbors = [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
		this.activated = false;
	
		cellIndex[x+';'+y]=this; // add the cell to the index
		
		for(var i=0;i<8;i++) // populate neighbour array
		{// for all neighbors
			var neighbor = this.neighbor(i);
			if (neighbor) // if the neighbor is in the cellIndex, add it to cell.neighbors
			{
				this.neighbors[i]=neighbor;
				neighbor.neighbors[(i+4)%8]=this; // and add this cell to the other cell's neighbor array
			}
		}
		

	}
	render(){
		// part of render
		var div=document.createElement('div');
		div.style.position='absolute';
		div.style.left=x+'px';
		div.style.top=y+'px';
		div.style.width=CELLSIZE+'px';
		div.style.height=CELLSIZE+'px';
		div.style.backgroundColor='gray';
		div.style.border='1px solid black';
		div.style.textAlign='center';
		div.style.fontSize=CELLSIZE-5+'px';
		div.style.cursor='pointer';
		div.onclick=function(){activateCell(div);}; // technically not a part of renderer, but should be there
		// div.onclick=function(){activateCell(div);};

	}
	neighbor(i){
		return cellIndex[
				(this.x+NeighborRelativeCoords[i][0]*CELLSIZE)
				+';'+
				(this.y+NeighborRelativeCoords[i][1]*CELLSIZE)];
		//return this.neighbors[] // we have to dive into the cellindex to get the cell, store neighbors as indexes in this array
	}
	index(){
		return this.x +';'+ this.y;
	}
}

var mainDiv=null;

var CELLSIZE=28;
var score=0;
var gameOver=false;

cellIndex={};

Neighbor=
{
	LEFTTOP:0,
	TOP:1,
	RIGHTTOP:2,
	RIGHT:3,
	RIGHTBOTTOM:4,
	BOTTOM:5,
	LEFTBOTTOM:6,
	LEFT:7
};

NeighborRelativeCoords=
[
	[-1,-1],
	[0,-1],
	[1,-1],
	[1,0],
	[1,1],
	[0,1],
	[-1,1],
	[-1,0],
];

function activateCell(cell)
{
	if (gameOver) return;
	if (cell.ms.activated)
	{
		var activatedNeighbors=0;
		var markedNeighbors=0;
		for(var i=0;i<8;i++)
		{
			if (cell.ms.neighbors[i].ms.activated) activatedNeighbors++;
			if (cell.ms.neighbors[i].ms.marked) markedNeighbors++;
		}
		// mark sure cells
		if (8-activatedNeighbors==cell.ms.minesAround)
		{
			for(var i=0;i<8;i++)
			{
				if (!cell.ms.neighbors[i].ms.activated && !cell.ms.neighbors[i].ms.marked)
				{
					cell.ms.neighbors[i].innerHTML='<img class="stretch" src="flag.png">';
					cell.ms.neighbors[i].ms.marked=true;
					score++;
					document.getElementById('scorespan').innerHTML=score;
				}
			}
		}
		// open every cell around if enough cell marked around
		if (markedNeighbors==cell.ms.minesAround)
		{
			for(var i=0;i<8;i++)
			{
				if (!cell.ms.neighbors[i].ms.activated && !cell.ms.neighbors[i].ms.marked)
				{
					activateCell(cell.ms.neighbors[i]);
				}
			}
		}
		return;
	}
	if (cell.ms.isMine) // game over
	{
		if (cell.ms.marked) return;
		cell.style.backgroundColor='red';
		cell.innerHTML='<img class="stretch" src="mine.png">'
		/*var divs=document.getElementsByTagName('div');
		for(var i=0;i<divs.length;i++) // show all not flagged mines
		{
			var div=divs[i];
			if (div.ms)
			{
				var ms=div.ms;
				if (ms.isMine && !ms.marked) div.innerHTML='<img class="stretch" src="mine.png">';
			}
		}
		gameOver=true;
		document.getElementById('gameover').style.display='block';*/
		return;
	}
	var minesAround=0;
	 // find how many minesAround
	for(var i=0;i<8;i++) // for all the cells
	{
		if (!cell.ms.neighbors[i]) // if one of the cells around, is not inthe neighbor array
		{
			var posX = cell.ms.position[0]+NeighborRelativeCoords[i][0]*CELLSIZE;
			var posY = cell.ms.position[1]+NeighborRelativeCoords[i][1]*CELLSIZE;

			var rand = Math.random();
			// noise.simplex2(posX/100,posY/100) < 0 ? 1 : 0; // i need another noise function, this has way too high frequency 
			var determineBomb = rand;// rand * simplex;

			var isMine=(determineBomb<CHANCE) && (minesAround<cell.ms.maxMinesAround); // determine if it is a mine
			var newCell=createCell( // and create the cell
				posX,
				posY,
				8,
				isMine);
		}
		if (cell.ms.neighbors[i].ms.isMine) minesAround++; // if it is a mine, add it to minesAround
	}
	cell.ms.activated=true;
	cell.ms.minesAround=minesAround;
	if (minesAround) // add colors
	{
		cell.innerHTML = minesAround;
		switch(minesAround){
			case 1:
				cell.style.color= "#0000FF"
			break;
			case 2:
				cell.style.color= "#008000"
			break;
			case 3:
				cell.style.color= "#ff0000"
			break;
			case 4:
				cell.style.color= "#000080"
			break;
			case 5:
				cell.style.color= "#800000"
			break;
			case 6:
				cell.style.color= "#008080"
			break;
			case 7:
				cell.style.color= "#000000"
			break;
			case 8:
				cell.style.color= "#808080"
			break;
		}

	}
	else // means if there are 0 minesAround
	{
		// open all neighbors if no mines around
		for(var i=0;i<8;i++)
		{
			if (!cell.ms.neighbors[i].ms.activated)
				activateCell(cell.ms.neighbors[i]);
		}
	}

	cell.style.backgroundColor='#bbbbbb'; // part of render
}

function createCell(x,y,maxMinesAround,isMine)
{
	// part of render
	var div=document.createElement('div');
	div.style.position='absolute';
	div.style.left=x+'px';
	div.style.top=y+'px';
	div.style.width=CELLSIZE+'px';
	div.style.height=CELLSIZE+'px';
	div.style.backgroundColor='gray';
	div.style.border='1px solid black';
	div.style.textAlign='center';
	div.style.fontSize=CELLSIZE-5+'px';
	div.style.cursor='pointer';

	div.ms= //initiator
	{
		'position':[x,y],
		'maxMinesAround':maxMinesAround,
		'isMine':isMine,
		'neighbors':[undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
		'activated':false
	};
	div.onclick=function(){activateCell(div);}; // technically not a part of renderer, but should be there
	cellIndex[x+';'+y]=div; // add the cell to the index

	for(var i=0;i<8;i++)// for all neighbors
	{
		var divInIndex=cellIndex[
			(x+NeighborRelativeCoords[i][0]*CELLSIZE)
			+';'+
			(y+NeighborRelativeCoords[i][1]*CELLSIZE)];
		if (divInIndex) // if the neighbor is in the cellIndex, add it to cell.ms.neighbors
		{
			div.ms.neighbors[i]=divInIndex;
			divInIndex.ms.neighbors[(i+4)%8]=div;
		}
	}
	
	mainDiv.appendChild(div); // render
	return div;
}

function viewInstructions()
{
	alert
	(
		"Minesweeper infinity\n\n"+
		"This is the infinite version of the classic minesweeper\n\n"+
		"Each number in the cells denote how many mines around under the 8 neighbor cells. Use these numbers wisely and avoid the cells that have mines.\n\n"+
		"If you choose a cell where a mine is, you die and game over.\n"+
		"If you click on an open cell whose closed neighbor cells are mines, these cells will be flagged.\n"+
		"If you click on an open cell whose all neightbors can be safely opened, it will open it.\n"+
		"Cells with no mines around them are opened automatically\n\n"+
		"All flagged cells worth one point.\n\n"+
		"Good luck!"
	);
}

function saveGame() {
	localStorage.setItem("mainDiv", JSON.stringify(mainDiv));
	localStorage.setItem("cellIndex", JSON.stringify(cellIndex));
}

function loadGame() {
	mainDiv = localStorage.getItem("mainDiv");
	// document.getElementById('maindiv') = mainDiv; 
	cellIndex = localStorage.getItem("cellIndex");
	render(cellIndex);
}

function render(cellIndex){
	for(cell in cellIndex){
		cell.render();
	}
}

function initGame()
{
	mainDiv=document.getElementById('maindiv');
	var newField=createCell(mainDiv.offsetWidth/2,mainDiv.offsetHeight/2,0,false);
	activateCell(newField);
	localStorage.setItem("mainDiv", JSON.stringify(mainDiv));
	localStorage.setItem("cellIndex", JSON.stringify(cellIndex));	
}
