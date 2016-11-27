/*
	This work is licensed under the Creative Commons BY-SA 3.0 license. For more information, visit: http://creativecommons.org/licenses/by-sa/3.0/
	You may:
	- Share this
	- Reuse this (even for commerical works)
	You must:
	- Attribute me: put my nick and my website URL (Calmarius and http://calmarius.net) in your work if you reuse my work.
	- Share alike: Your work must be licensed under a similar or compatible license.
*/
var mainDiv=null;

var CELLSIZE=30;
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

function activateField(cell)
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
					activateField(cell.ms.neighbors[i]);
				}
			}
		}
		return;
	}
	if (cell.ms.isMine) 
	{
		if (cell.ms.marked) return;
		alert('BANG!\nYou found '+score+' mines!');
		var divs=document.getElementsByTagName('div');
		for(var i=0;i<divs.length;i++)
		{
			var div=divs[i];
			if (div.ms)
			{
				var ms=div.ms;
				if (ms.isMine && !ms.marked) div.innerHTML='<img class="stretch" src="mine.png">';
			}
		}
		gameOver=true;
		document.getElementById('gameover').style.display='block';
		return;
	}
	var minesAround=0;
	for(var i=0;i<8;i++)
	{
		if (!cell.ms.neighbors[i])
		{
			var isMine=(Math.random()<CHANCE) && (minesAround<cell.ms.maxMinesAround);
			var newCell=createField(cell.ms.position[0]+NeighborRelativeCoords[i][0]*CELLSIZE,cell.ms.position[1]+NeighborRelativeCoords[i][1]*CELLSIZE,8,isMine);
		}
		if (cell.ms.neighbors[i].ms.isMine) minesAround++;
	}
	cell.ms.activated=true;
	cell.ms.minesAround=minesAround;
	if (minesAround) 
	{
		cell.innerHTML=minesAround;
	}
	else
	{
		// open all neighbors if no mines around
		for(var i=0;i<8;i++)
		{
			if (!cell.ms.neighbors[i].ms.activated)
				activateField(cell.ms.neighbors[i]);
		}
	}
	cell.style.backgroundColor='green';
	
	
	
}

function createField(x,y,maxMinesAround,isMine)
{
	var div=document.createElement('div');
	div.style.position='absolute';
	div.style.left=x+'px';
	div.style.top=y+'px';
	div.style.width=CELLSIZE+'px';
	div.style.height=CELLSIZE+'px';
	div.style.backgroundColor='gray';//'rgb('+parseInt(Math.random()*256)+','+parseInt(Math.random()*256)+','+parseInt(Math.random()*256)+')';
	div.style.border='1px solid black';
	div.style.textAlign='center';
	div.style.fontSize=CELLSIZE-5+'px';
	div.style.cursor='pointer';
	div.ms=
	{
		'position':[x,y],
		'maxMinesAround':maxMinesAround,
		'isMine':isMine,
		'neighbors':[undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
		'activated':false
	};
	div.onclick=function(){activateField(div);};
	cellIndex[x+';'+y]=div;
	for(var i=0;i<8;i++)
	{
		var divInIndex=cellIndex[(x+NeighborRelativeCoords[i][0]*CELLSIZE)+';'+(y+NeighborRelativeCoords[i][1]*CELLSIZE)];
		if (divInIndex)
		{
			div.ms.neighbors[i]=divInIndex;
			divInIndex.ms.neighbors[(i+4)%8]=div;
		}
	}
	
	mainDiv.appendChild(div);
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

function initGame()
{
	mainDiv=document.getElementById('maindiv');
	var newField=createField(mainDiv.offsetWidth/2,mainDiv.offsetHeight/2,0,false);
	activateField(newField);
}
