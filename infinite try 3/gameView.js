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

class FieldRenderer {
	constructor(field){

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
var clickHandler = new PIXI.Container();
clickHandler.interactive = true;
app.stage.addChild(clickHandler);

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
	// debugging
	counter++;
	if(counter > 100){
		console.log("update counter is over 100, checking field");
		f.checkForErrors();
		counter -= 1000;
	}

	let cell = f.getCell(x, y);

	if(cell.sprite===undefined){
		cell.sprite = new CellSprite(cell);
	}
	else {
		// debugging
		//console.log("updating", x, y);
		cell.sprite.update(cell);
	}
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
	window.background.tint = 0x4fe1ff;
	
	clickHandler.addChildAt(background, 0);
	clickHandler.addChildAt(fieldContainer, 1);

	clickHandler
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

	// gameplay
	f = new Field(0.25);
	f.open(20,10);
}

function onDragStart(event) {
    this.data = event.data;
    this.dragging = true;
    this.hasDragged = false;
    this.dragPoint = event.data.getLocalPosition(fieldContainer);
}

function onDragEnd() {
	if(this.hasDragged) {
	    this.dragging = false;
	    this.data = null;
	} else {
	    this.dragging = false;
	    this.data = null;
		let x = Math.floor(this.dragPoint.x / width);
		let y = Math.floor(this.dragPoint.y / width);
		f.open(x, y);
		console.log("clicked "+x+", "+y);
	}
}

function onDragMove() {
    if (this.dragging) {
    	var newPosition = this.data.getLocalPosition(this.parent);
        let x = newPosition.x - this.dragPoint.x;
        let y = newPosition.y - this.dragPoint.y;

        fieldContainer.position.set(x,y);
        background.tilePosition.set(x,y);
        this.hasDragged = true;
    }
}