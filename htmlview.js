HTMLView = function()
{
	this.grid = document.querySelector("#grid");
};

HTMLView.prototype.makeBlock = function(block)
{
	var dom = document.createElement("div");
	dom.classList.add("block");
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