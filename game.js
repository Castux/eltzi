Game = function(w, h)
{
	// some info

	this.startValues = [2, 4, 8, 16, 32, 64];

	// grid

	this.w = w;
	this.h = h;
	this.grid = [];		// [row][col]

	for (var row = 0; row < h; row++)
	{
		this.grid[row] = [];

		for (var col = 0; col < w; col++)
		{
			this.grid[row].push(null);
		}
	}

	// shortcut

	this.lastSpawned = null;

	// view

	this.html = new HTMLView(this);
};

Game.prototype.spawnBlock = function()
{
	var value = this.startValues[Math.floor(Math.random() * this.startValues.length)];
	var block = new Block(value);

	var su = 0;
	var sv = Math.floor(this.w / 2);

	var existing = this.getBlock(su, sv);
	if(existing != null)
	{
		// TODO: endgame
		return;
	}

	block.u = 0;
	block.v = Math.floor(this.w / 2);

	this.grid[block.u][block.v] = block;
	this.lastSpawned = block;

	this.html.makeBlock(block);
};

Game.prototype.getBlock = function(u,v)
{
	if(u < 0 || u >= this.h || v < 0 || v >= this.w)
		return null;

	return this.grid[u][v];
};

Game.prototype.moveBlock = function(u,v, block)
{
	this.grid[block.u][block.v] = null;
	block.u = u;
	block.v = v;
	this.grid[block.u][block.v] = block;

	this.html.placeBlock(block);
};


Game.prototype.getNeighbors = function(u,v)
{
	var res = [];
	var block;

	block = this.getBlock(u, v-1);
	if(block != null)
		res.push(block);

	block = this.getBlock(u, v+1);
	if(block != null)
		res.push(block);

	var block = this.getBlock(u+1, v);
	if(block != null)
		res.push(block);

	return res;
}

Game.prototype.stepFalling = function()
{
	for(var u = this.h - 2 ; u >= 0 ; u--)	// go bottom up for easier grid manipulation
											// (hole propagation), and skip last row
	{
		for(var v = 0 ; v < this.w ; v++)
		{
			var block = this.getBlock(u, v);
			if(block == null)
				continue;

			var down = this.getBlock(u + 1, v);
			if(down != null)
			{
				if(block == this.lastSpawned)
					this.lastSpawned = null;

				continue;
			}

			this.moveBlock(u + 1, v, block);
			block.state = "falling";
		}
	}
};

Game.prototype.slide = function(dir)	// -1, +1 (left, right)
{
	if(this.lastSpawned == null)
		return;

	var u = this.lastSpawned.u;
	var v = this.lastSpawned.v;

	if(v + dir < 0 || v + dir >= this.w)
		return;

	var side = this.getBlock(u, v + dir);
	if(side == null)
	{
		this.moveBlock(u, v + dir, this.lastSpawned);
		this.lastSpawned.state = "sliding";
	}
};

Game.prototype.drop = function()
{
	if(this.lastSpawned == null)
		return;

	var lastFree = -1;
	for(var u = this.lastSpawned.u + 1 ; u < this.h ; u++)
	{
		if(this.getBlock(u, this.lastSpawned.v) == null)
			lastFree = u;
		else
			break;
	}

	if(lastFree > 0)
	{
		this.moveBlock(lastFree, this.lastSpawned.v, this.lastSpawned);
		this.lastSpawned.state = "falling";
		this.lastSpawned = null;
	}
};

Game.prototype.blockMoved = function(block)
{
	// TODO: check merging!
	console.log("Block moved: " + block.value);
	block.state = "idle";
};

Game.prototype.printGrid = function()
{
	var res = "";
	for(var u = 0; u < this.h ; u++)
	{
		for(var v = 0 ; v < this.w ; v++)
		{
			var block = this.getBlock(u,v);
			res += (block != null ? block.value : ".") + " ";
		}
		res += "\n";
	}

	console.log(res);
};

function DoFullScreen()
{

    var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !==     null) ||    // alternative standard method  
            (document.mozFullScreen || document.webkitIsFullScreen);

    var docElm = document.documentElement;
    if (!isInFullScreen) {

        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
    }
}

var game = new Game(5, 7);