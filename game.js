Block = function(value)
{
	this.value = value;
	this.u = null;
	this.v = null;

	this.lastFall = 0;
};

Game = function(w, h)
{
	// some info

	this.startValues = [2, 4, 8, 16, 32, 64];
	this.fallDelay = 800;
	this.fastDelay = 300;

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

	this.lastSpawned = null;
	this.fastMode = false;
	this.fallCount = 0;

	this.score = 0;
	this.html.updateScore();

	this.makeNextBlock();
};

Game.prototype.startGame = function()
{
	this.reset();
	this.spawnBlock();
}

Game.prototype.makeNextBlock = function()
{
	this.nextValue = this.startValues[Math.floor(Math.random() * this.startValues.length)];
	this.html.updateNextBlock();
}

Game.prototype.spawnBlock = function()
{
	var value = this.nextValue;
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

	// start falling

	this.html.setNextFall(this.fallDelay);

	// prepare next

	this.makeNextBlock();
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

	this.html.placeBlock(block, merge);
};

Game.prototype.getMergeableNeighbors = function(b)
{
	var res = [];
	var block;

	block = this.getBlock(b.u, b.v-1);
	if(block != null && block.value == b.value && block.lastFall <= b.lastFall)
		res.push(block);

	block = this.getBlock(b.u, b.v+1);
	if(block != null && block.value == b.value && block.lastFall <= b.lastFall)
		res.push(block);

	var block = this.getBlock(b.u+1, b.v);
	if(block != null && block.value == b.value && block.lastFall <= b.lastFall)
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

	this.fallCount++;

	// check merges first

	for(var u = this.h - 1 ; u >= 0 ; u--)
	{
		for(var v = 0 ; v < this.w ; v++)
		{
			var block = this.getBlock(u, v);
			if(block == null)
				continue;

			if(!this.canFall(block))
			{
				if(block == this.lastSpawned)
					this.lastSpawned = null;

				if(this.checkMerge(block))
					merged = true;
			}
		}
	}

	if(merged)
	{
		this.fastMode = true;
		this.html.setNextFall(this.fastDelay);

		return;
	}

	// if there was no merges, check moves

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
				block.lastFall = this.fallCount;
				moved = true;
			}
		}
	}

	// if something moved, fall again
	if(moved)
	{
		this.html.setNextFall(this.fastMode ? this.fastDelay : this.fallDelay);
	}
	
	// if nothing moved, spawn a new block!
	else
	{
		this.fastMode = false;
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
	var block = this.lastSpawned;
	if(block == null)
		return;

	this.fallCount++;

	var lastFree = -1;
	for(var u = block.u + 1 ; u < this.h ; u++)
	{
		if(this.getBlock(u, block.v) == null)
			lastFree = u;
		else
			break;
	}

	if(lastFree > 0)
	{
		this.moveBlock(lastFree, block.v, block);
		block.lastFall = this.fallCount;
		this.html.setNextFall(this.fastDelay);
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

	if(n.length == 0)
		return false;

	for(var i = 0 ; i < n.length ; i++)
	{
		this.moveBlock(block.u, block.v, n[i], true);	// true for merge (don't replace destination)
		n[i].merging = true;

		block.value *= 2;
	}

	this.score += block.value;
	this.html.updateValue(block);
	this.html.updateScore();

	return true;
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

var game = new Game(5, 7);