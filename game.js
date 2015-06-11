function Game(w, h)
{
	this.grid = [];

	for (var row = 0; row < h; row++)
	{
		this.grid[row] = [];

		for (var col = 0; col < w; col++)
		{
			this.grid[row].push(null);
		}
	}
}

var game = new Game(5, 7);

console.log(game);