HTMLView = function(game)
{
	this.container = document.querySelector("#container");
	this.overlay = document.querySelector("#overlay");
	this.grid = document.querySelector("#grid");
	this.score = document.querySelector("#score");
	this.nextBlock = document.querySelector("#next-block");
	this.toprightButton = document.querySelector("#topright-button");
	this.fsButton = document.querySelector("#fs");

	this.game = game;

	this.running = false;
	this.pause = false;
	this.nextFall = null;

	this.setupInput();
	this.setupUpdate();
};

HTMLView.prototype.setupInput = function()
{
	var thiz = this;
	var game = this.game;

	this.toprightButton.onclick = function()
	{
		if(!thiz.running)
		{
			thiz.running = true;
			thiz.game.startGame();

			thiz.toprightButton.innerHTML = "Pause";
			thiz.overlay.style.left = "110%";
		}
		else
		{
			thiz.togglePause();
		}
	}

	document.onkeydown = function(e)
	{
		if(!thiz.running || thiz.pause)
			return;

		switch(e.which)
		{
			case 37: game.slide(-1); break;
			case 39: game.slide(1); break;
			case 40: game.drop(); break;
		}
	};

	this.downPos = null;
	this.inputThreshold = this.grid.offsetWidth / 5 * 0.7;

	this.input = new Input(this.grid);

	this.input.start = function(x,y)
	{
		if(!thiz.running || thiz.pause)
			return;

		thiz.downPos = {x: x, y: y};
	};

	this.input.move = function(x,y)
	{
		if(!thiz.running || thiz.pause)
			return;

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

	window.onload = 
	window.onresize = function()
	{
		var height = window.innerHeight;
		var margin = (height - thiz.container.offsetHeight) / 2;
		if(margin < 0)
			margin = 0;

		thiz.container.style.marginTop = margin + "px";

		if(!isFullScreen())
			thiz.fsButton.style.visibility = "visible";
	};

	this.fsButton.onclick = function()
	{
		thiz.fsButton.style.visibility = "hidden";
		goFullScreen();
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

	dom.addEventListener("animationend", function(e)
	{
		if(e.animationName == "bounce")
			dom.classList.remove("bouncing");
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
	block.dom.className = "block block-" + (block.value <= 2048 ? block.value : "over");
	block.dom.innerHTML = block.value;
};

HTMLView.prototype.bounce = function(block)
{
	block.dom.classList.add("bouncing");
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
	if(!this.running || this.pause)
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

HTMLView.prototype.updateScore = function()
{
	this.score.innerHTML = this.game.score;
};

HTMLView.prototype.updateNextBlock = function()
{
	this.nextBlock.innerHTML = this.game.nextValue;
	this.nextBlock.className = "block-" + this.game.nextValue;
	this.nextBlock.style.visibility = "visible";
};

HTMLView.prototype.togglePause = function()
{
	if(!this.pause)
	{
		this.pause = true;
		this.overlay.innerHTML = "Paused...";
		this.overlay.style.left = "0px";
		this.toprightButton.innerHTML = "Resume";
	}
	else
	{
		this.pause = false;
		this.overlay.style.left = "110%";
		this.toprightButton.innerHTML = "Pause";
	}
}

HTMLView.prototype.gameOver = function()
{
	this.running = false;
	this.overlay.innerHTML = "Game over!";
	this.overlay.style.left = "0px";

	this.toprightButton.innerHTML = "Restart";
};

function isFullScreen()
{
	return document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
};

function goFullScreen()
{
	var doc = document.documentElement;

	if (doc.requestFullscreen)
		doc.requestFullscreen();
	else if (doc.mozRequestFullScreen)
		doc.mozRequestFullScreen();
	else if (doc.webkitRequestFullScreen)
		doc.webkitRequestFullScreen();
	else if (doc.msRequestFullScreen)
		doc.msRequestFullScreen();
};