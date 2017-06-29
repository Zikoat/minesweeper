/*jshint esversion: 6 */

class CellSprite extends PIXI.Container{ // helper class for creating sprites
	constructor(cell){
		super();
		this.x = cell.x * width;
		this.y = cell.y * width;
		var backTexture;
		var frontTexture;
		if(cell.isOpen) {
			backTexture = tex.open;
			if(cell.isMine) frontTexture = tex.mineWrong;
			else frontTexture = tex[cell.value()];
		} else {
			backTexture = tex.closed;
			frontTexture = cell.isFlagged ? tex.flag : null;
		}
		let back = new PIXI.Sprite(backTexture);
		let front = new PIXI.Sprite(frontTexture);
		this.addChild(back);
		this.addChild(front);
		fieldContainer.addChild(this);
	}
	update(){

	}
}
// global variables
var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
document.body.appendChild(app.view);

var fieldContainer = new PIXI.Container();

var f = new Field();
var tex = {};
var width;

PIXI.loader
	.add("closed", "assets/closed.png")
	.add("flag", "assets/flag.png")
	.add("mine","assets/mine.png")
	.add("mineWrong","assets/mineWrong.png")
	.add("open","assets/open.png")
	.add("1","assets/1.png")
	.add("2","assets/2.png")
	.add("3","assets/3.png")
	.add("4","assets/4.png")
	.add("5","assets/5.png")
	.add("6","assets/6.png")
	.add("7","assets/7.png")
	.add("8","assets/8.png")
	.load(setup);

function updateCell(x, y){
	let cell = f.getCell(x, y);
	if(cell.sprite===undefined) cell.sprite = new CellSprite(cell);
	else cell.sprite.update();
}

function setup(loader, resources){
	tex.closed = resources.closed.texture;
	tex.flag = resources.flag.texture;
	tex.mine = resources.mine.texture;
	tex.mineWrong = resources.mineWrong.texture;
	tex.open = resources.open.texture;
	for(let i = 1; i >= 8; i++) tex[i] = resources[i].texture;
	width = tex.closed.width;
	window.background = new PIXI.extras.TilingSprite(
		tex.closed,
	    app.renderer.width,
	    app.renderer.height
	);
	window.background.tint = 0xff55ff;
	app.stage.addChild(background);
	app.stage.addChild(fieldContainer);

	f.getCell(1,1);
	f.open(1,2);
	f.getCell(1,2);
	f.open(1,1);
	f.open(2,1);
	f.open(2,2);
}