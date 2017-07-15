/*jshint esversion: 6 */

class CellSprite extends PIXI.Container{ // class for creating and updating sprites
	constructor(cell){
		super();
		this.x = cell.x * width;
		this.y = cell.y * width;
		let textures = chooseTexture(cell);
		let back = new PIXI.Sprite(textures.back);
		let front = new PIXI.Sprite(textures.front);
		this.addChildAt(back, 0);
		this.addChildAt(front, 1);
		fieldContainer.addChild(this);
	}
	update(cell){
		let back = this.getChildAt(0);
		let front = this.getChildAt(1);

		let textures = chooseTexture(cell);

		back.texture = textures.back;
		front.texture = textures.front;
	}
}

function chooseTexture(cell){ // helper function to get textures
	var textures = {};

	if(cell.isOpen) {
		textures.back = tex.open;
		if(cell.isMine) textures.front = tex.mineWrong;
		else textures.front = tex[cell.value()];
	} else {
		textures.back = tex.closed;
		textures.front = cell.isFlagged ? tex.flag : null;
	}
	return textures;
}

// global variables
var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
document.body.appendChild(app.view);

app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

var fieldContainer = new PIXI.Container();

var f;
var tex = {};
var width;
var counter = 0;

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
	/*if(cell.sprite===undefined)*/ cell.sprite = new CellSprite(cell);
	/*else {
		console.log("updating", x, y);
		cell.sprite.update(cell);

	}*/
}

function setup(loader, resources){
	tex.closed = resources.closed.texture;
	tex.flag = resources.flag.texture;
	tex.mine = resources.mine.texture;
	tex.mineWrong = resources.mineWrong.texture;
	tex.open = resources.open.texture;
	for(let i = 1; i <= 8; i++) tex[i] = resources[i.toString()].texture;
	width = tex.closed.width;
	window.background = new PIXI.extras.TilingSprite(
		tex.closed,
	    app.renderer.width,
	    app.renderer.height
	);
	window.background.tint = 0xff0088;
	app.stage.addChild(background);
	app.stage.addChild(fieldContainer);


	// gameplay
	f = new Field(0.20);

	f.getCell(1,1);
	f.open(20,10);
	f.getCell(1,2);
}