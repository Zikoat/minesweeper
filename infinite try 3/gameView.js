/*jshint esversion: 6 */

class CellSprite extends PIXI.Container{ // class for creating and updating sprites
	constructor(cell, fieldRenderer){
		super();
		this.fieldRenderer = fieldRenderer;

		this.fieldRenderer.fieldContainer.addChild(this);
		let width = fieldRenderer.width;
		this.x = cell.x * width;
		this.y = cell.y * width;
		let textures = this.chooseTexture(cell);
		let back = new PIXI.Sprite(textures.back);
		let front = new PIXI.Sprite(textures.front);
		this.addChildAt(back, 0);
		this.addChildAt(front, 1);
	}

	update(cell){
		let back = this.getChildAt(0);
		let front = this.getChildAt(1);

		let textures = this.chooseTexture(cell);

		back.texture = textures.back;
		front.texture = textures.front;
	}

	chooseTexture(cell){
		var textures = {};
		let tex = this.fieldRenderer.tex;
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
}

class FieldRenderer {
	constructor(field){
		this.field = field;
		field.renderer = this;
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
			.load(this.setup.bind(this));
	}
	setup(loader, resources){

		this.app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
		document.body.appendChild(this.app.view);

		this.app.renderer.autoResize = true;
		this.app.renderer.resize(window.innerWidth, window.innerHeight);

		this.fieldContainer = new PIXI.Container();
		this.clickHandler = new PIXI.Container();
		this.clickHandler.interactive = true;
		this.app.stage.addChild(this.clickHandler);

		this.counter = 0;

		this.tex = {};
		this.tex.closed = resources.closed.texture;
		this.tex.flag = resources.flag.texture;
		this.tex.mine = resources.mine.texture;
		this.tex.mineWrong = resources.mineWrong.texture;
		this.tex.open = resources.open.texture;
		for(let i = 1; i <= 8; i++) this.tex[i] = resources[i.toString()].texture;
		this.cellWidth = this.tex.closed.width;
		this.background = new PIXI.extras.TilingSprite(
			this.tex.closed,
			this.app.renderer.width,
			this.app.renderer.height
		);
		this.background.tint = 0x4fe1ff;
		
		this.clickHandler.addChildAt(this.background, 0);
		this.clickHandler.addChildAt(this.fieldContainer, 1);
		this.clickHandler.fieldRenderer = this;
		this.clickHandler.cellWidth = this.cellWidth;
		// after resource loading
		this.clickHandler
			.on('pointerdown', this.onDragStart)
			.on('pointerup', this.onDragEnd)
			.on('pointerupoutside', this.onDragEnd)
			.on('pointermove', this.onDragMove);
		console.log("done loading");
	}

	updateCell(x, y){
		// debugging
		this.counter++;
		if(this.counter > 100){
			console.log("update counter is over 100, checking field");
			this.field.checkForErrors();
			this.counter -= 10000;
		}

		let cell = this.field.getCell(x, y);

		if(cell.sprite===undefined){
			cell.sprite = new CellSprite(cell, this);

		}
		else {
			// debugging
			//console.log("updating", x, y);
			cell.sprite.update(cell);
		}
	}

	onDragStart(event) {
		this.data = event.data;
		this.dragging = true;
		this.hasDragged = false;
		this.dragPoint = event.data.getLocalPosition(this.parent);
		console.log("dragpoint",this.dragPoint);
		console.log(this.cellWidth);	
	}

	onDragEnd() {
		if(this.hasDragged) {
			this.dragging = false;
			this.data = null;
		} else {
			console.log(this.dragPoint.x / this.cellWidth);
			this.dragging = false;
			this.data = null;
			let x = Math.floor(this.dragPoint.x / this.cellWidth);
			let y = Math.floor(this.dragPoint.y / this.cellWidth);
			//"this" is clickhandler
			this.fieldRenderer.field.open(x, y);
			// debugging
			console.log("clicked "+x+", "+y);
		}
	}

	onDragMove() {
		if (this.dragging) {
			//console.log("dragpoint",this.dragPoint);
			var newPosition = this.data.getLocalPosition(this.parent);
			let x = newPosition.x - this.dragPoint.x;
			let y = newPosition.y - this.dragPoint.y;
			//console.log("dragPoint",this.dragPoint);
			//console.log("localposition",this.data.getLocalPosition(this.fieldRenderer.fieldContainer));
			//	console.log("newPosition",newPosition);

			this.fieldRenderer.fieldContainer.position.set(x,y);
			this.fieldRenderer.background.tilePosition.set(x,y);
			this.hasDragged = true;
		}
	}

}


function openCellsSimple(field){
	field.getAll()
		.forEach(cell=>{
			if(
				cell.value()===
				cell.getNeighbors()
					.filter(cell2=>cell2.isFlagged)
					.length
			) cell.getNeighbors()
				.filter(cell=>!cell.isFlagged)
				.forEach(cell=>cell.open());
		});
}
function flagCellsSimple(field){
	field.getAll()
		.forEach(cell=>{
			let neighbors = cell.getNeighbors();
			let closedNeighbors = neighbors.filter(cell=>!cell.isOpen);
			if(cell.value() === closedNeighbors.length){
				closedNeighbors.forEach(cell=>cell.flag());
			}
	});
}
function runBotSimple(field){
	field.open(40,10);
	var steps = 0;
	prevOpened = -1;
	while(field.getAll().filter(cell=>cell.isOpen).length!==prevOpened){
		steps++;
		prevOpened = field.getAll().filter(cell=>cell.isOpen).length;
		flagCellsSimple();
		openCellsSimple();
	}
	var all = field.getAll();
	console.log("all:", all.length);
	console.log("flags:", all.filter(cell=>cell.isFlagged).length);
	let opened = all.filter(cell=>cell.isOpen);
	console.log("opened:", opened.length);
	if(all.length-opened.length!=all.filter(cell=>!cell.isOpen).length) console.warn("openDiff:", all.length-opened.length-all.filter(cell=>!cell.isOpen).length);
	console.log("closed:", all.length-opened.length);
	return {steps:steps};
}

var f = new Field(0.3);
var r = new FieldRenderer(f);
// f.open(10,10);
//console.info(runBotSimple(f));