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

	this.falling = null;
};

Game.prototype.spawnBlock = function()
{
	var value = this.startValues[Math.floor(Math.random() * this.startValues.length)];
	var block = new Block(value);

	block.u = 0;
	block.v = Math.floor(this.w / 2);

	this.grid[block.u][block.v] = block;
	this.falling = block;

	// TODO: check if already full --> endgame
	// TODO: spawn DOM
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
	var f = this.falling;

	if(f == null)
		return;

	// bottom row or something below: no more falling
	if(f.u == this.h - 1 || this.getBlock(f.u + 1, f.v) != null)
	{
		this.falling = null;
		return;
	}

	// fall!
	this.moveBlock(f.u + 1, f.v, f);
};

Game.prototype.printGrid = function()
{
	for(var u = 0; u < this.h ; u++)
		console.log(this.grid[u]);
}

var game = new Game(5, 7);
game.spawnBlock();
game.stepFalling();
game.stepFalling();


game.spawnBlock();

game.stepFalling();
game.stepFalling();
game.stepFalling();
game.stepFalling();

game.stepFalling();
game.stepFalling();
game.stepFalling();

console.log(game);
game.printGrid();