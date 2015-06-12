Block = function(value)
{
	this.value = value;
	this.u = null;
	this.v = null;
};

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

	// internals

	this.lastSpawned = null;

	// view

	this.html = new HTMLView(this);
};

Game.prototype.reset = function()
{
	for(var u = 0; u < this.h ; u++)
	{
		for(var v = 0 ; v < this.w ; v++)
		{
			var block = this.getBlock(u,v);
			if(block != null)
				this.html.removeBlock(block);

			this.grid[u][v] = null;
		}
	}

	this.spawnBlock();
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
		this.html.gameOver();
		return;
	}

	block.u = 0;
	block.v = Math.floor(this.w / 2);

	this.grid[block.u][block.v] = block;
	this.lastSpawned = block;

	this.html.makeBlock(block);

	// pretend that it was falling, to check merging and other things

	this.blockMoved(block);

	// start falling

	this.html.setNextFall(1000);
};

Game.prototype.getBlock = function(u,v)
{
	if(u < 0 || u >= this.h || v < 0 || v >= this.w)
		return null;

	return this.grid[u][v];
};

Game.prototype.moveBlock = function(u,v, block, merge)
{
	this.grid[block.u][block.v] = null;
	block.u = u;
	block.v = v;

	if(!merge)
		this.grid[block.u][block.v] = block;

	this.html.placeBlock(block);
};

Game.prototype.getMergeableNeighbors = function(b)
{
	var res = [];
	var block;

	block = this.getBlock(b.u, b.v-1);
	if(block != null && block.value == b.value)
		res.push(block);

	block = this.getBlock(b.u, b.v+1);
	if(block != null && block.value == b.value)
		res.push(block);

	var block = this.getBlock(b.u+1, b.v);
	if(block != null && block.value == b.value)
		res.push(block);

	return res;
}

Game.prototype.canFall = function(block)
{
	if(block.u == this.h - 1)
		return false;

	var down = this.getBlock(block.u + 1, block.v);
	return down == null;
};

Game.prototype.stepFalling = function()
{
	var moved = false;
	var merged = false;

	for(var u = this.h - 1 ; u >= 0 ; u--)	// go bottom up for easier grid manipulation (hole propagation)
	{
		for(var v = 0 ; v < this.w ; v++)
		{
			var block = this.getBlock(u, v);
			if(block == null)
				continue;

			if(this.canFall(block))
			{
				this.moveBlock(u + 1, v, block);
				moved = true;
			}
			else
			{
				if(block == this.lastSpawned)
					this.lastSpawned = null;

				if(this.checkMerge(block))
					merged = true;
			}
		}
	}

	// if something merged, go to merge mode
	if(merged)
	{
		this.html.setNextFall(200);
	}

	// if something moved, fall again
	else if(moved)
	{
		this.html.setNextFall(1000);
	}
	
	// if nothing moved, spawn a new block!
	else
	{
		this.spawnBlock();
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
	}
};

Game.prototype.blockMoved = function(block)
{
	if(block.merging)
	{
		this.html.removeBlock(block);
	}
};

Game.prototype.checkMerge = function(block)
{
	var n = this.getMergeableNeighbors(block);
	for(var i = 0 ; i < n.length ; i++)
	{
		this.moveBlock(block.u, block.v, n[i], true);	// true for merge (don't replace destination)
		n[i].merging = true;

		block.value *= 2;
	}

	this.html.updateValue(block);

	return n.length > 0;
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