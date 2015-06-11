HTMLView = function(game)
{
	this.grid = document.querySelector("#grid");
	this.game = game;

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
};

HTMLView.prototype.makeBlock = function(block)
{
	var dom = document.createElement("div");

	dom.classList.add("block");
	dom.classList.add("block-" + block.value);

	dom.innerHTML = block.value;

	this.grid.appendChild(dom);
	
	block.dom = dom;

	this.placeBlock(block);
};

HTMLView.prototype.placeBlock = function(block)
{
	var width = block.dom.offsetWidth;
	block.dom.style.left = block.v * width + "px";
	block.dom.style.top = block.u * width + "px";
};