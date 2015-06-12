HTMLView = function(game)
{
	this.grid = document.querySelector("#grid");
	this.game = game;

	this.running = true;
	this.lastFall = 0;
	this.fallDelay = 1000;

	// input handling

	document.onkeydown = function(e)
	{
		switch(e.which)
		{
			case 37: game.slide(-1); break;
			case 39: game.slide(1); break;
			case 40: game.drop(); break;

			case 38: game.spawnBlock(); break;	// DEBUG
		}
	};

	// frame updates

	var self = this;
	var updateCB = function(timestamp)
	{
		self.update(timestamp);
		window.requestAnimationFrame(updateCB);
	};

	updateCB(0);
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

HTMLView.prototype.update = function(ts)
{
	if(!this.running)
		return;

	if(ts - this.lastFall > this.fallDelay)
	{
		this.game.stepFalling();
		this.lastFall = ts;
	}
};