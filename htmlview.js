HTMLView = function(game)
{
	this.grid = document.querySelector("#grid");
	this.game = game;

	this.running = false;
	this.lastFall = 0;
	this.fallDelay = 1000;

	this.setupInput();
	this.setupUpdate();	
};

HTMLView.prototype.setupInput = function()
{
	var thiz = this;
	var game = this.game;

	document.onkeydown = function(e)
	{
		switch(e.which)
		{
			case 37: game.slide(-1); break;
			case 39: game.slide(1); break;
			case 40: game.drop(); break;

			case 38: thiz.running = true; break;	// DEBUG
		}
	};
};

HTMLView.prototype.makeBlock = function(block)
{
	var game = this.game;
	var dom = document.createElement("div");

	block.dom = dom;

	dom.addEventListener("transitionend", function()
	{
		game.blockMoved(block);
	});

	this.grid.appendChild(dom);

	this.updateValue(block);
	this.placeBlock(block);
};

HTMLView.prototype.placeBlock = function(block)
{
	var width = block.dom.offsetWidth;
	block.dom.style.left = block.v * width + "px";
	block.dom.style.top = block.u * width + "px";
};

HTMLView.prototype.removeBlock = function(block)
{
	this.grid.removeChild(block.dom);
};

HTMLView.prototype.updateValue = function(block)
{
	block.dom.className = "block block-" + block.value;
	block.dom.innerHTML = block.value;
};

HTMLView.prototype.setupUpdate = function()
{
	var thiz = this;

	var updateCB = function(timestamp)
	{
		thiz.update(timestamp);
		window.requestAnimationFrame(updateCB);
	};

	updateCB(0);
};

HTMLView.prototype.update = function(ts)
{
	if(!this.running)
		return;

	// no controllable falling block: make one

	if(this.game.lastSpawned == null)
	{
		this.game.spawnBlock();
		this.lastFall = ts;
	}

	// make blocks fall regularly

	if(ts - this.lastFall > this.fallDelay)
	{
		this.game.stepFalling();
		this.lastFall = ts;
	}
};