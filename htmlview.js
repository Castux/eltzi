HTMLView = function(game)
{
	this.begin = document.querySelector("#begin");
	this.grid = document.querySelector("#grid");
	this.game = game;

	this.running = false;
	this.nextFall = null;

	this.setupInput();
	this.setupUpdate();
};

HTMLView.prototype.setupInput = function()
{
	var thiz = this;
	var game = this.game;

	this.begin.onclick = function()
	{
		thiz.running = true;
		thiz.begin.style.visibility = "hidden";

		thiz.game.startGame();
	};

	document.onkeydown = function(e)
	{
		switch(e.which)
		{
			case 37: game.slide(-1); break;
			case 39: game.slide(1); break;
			case 40: game.drop(); break;
		}
	};

	this.downPos = null;
	this.inputThreshold = 100;
	this.input = new Input(this.grid);

	this.input.start = function(x,y)
	{
		thiz.downPos = {x: x, y: y};
	};

	this.input.move = function(x,y)
	{
		if(thiz.downPos == null)
			return;

		var dx = x - thiz.downPos.x;
		var dy = y - thiz.downPos.y;

		if(Math.abs(dy) > Math.abs(dx))		// vertical
		{
			if(dy > thiz.inputThreshold)
			{
				game.drop();	
				thiz.input.end();			// stop input
			}			
		}
		else								// horizontal
		{
			if(dx > thiz.inputThreshold)
			{
				game.slide(1);
				thiz.input.start(x,y);		// reset for continuous input
			}
			else if(dx < -thiz.inputThreshold)
			{
				game.slide(-1);
				thiz.input.start(x,y);		// reset for continuous input
			}
		}
	};

	this.input.end = function()
	{
		thiz.downPos = null;
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

HTMLView.prototype.placeBlock = function(block, merge)
{
	var width = block.dom.offsetWidth;
	block.dom.style.left = block.v * width + "px";
	block.dom.style.top = block.u * width + "px";

	if(merge)
	{
		block.dom.classList.add("merging");
	}
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

	if(this.nextFall != null && ts >= this.nextFall)
	{
		this.nextFall = null;
		this.game.stepFalling();
	}
};

HTMLView.prototype.setNextFall = function(ms)
{
	this.nextFall = window.performance.now() + ms;
};

HTMLView.prototype.gameOver = function()
{
	this.running = false;
	this.begin.innerHTML = "Game over!";
	this.begin.style.visibility = "visible";
};