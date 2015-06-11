HTMLView = function()
{
	this.grid = document.querySelector("#grid");
};

HTMLView.prototype.makeBlock = function(block)
{
	var dom = document.createElement("div");
	dom.classList.add("block");

	this.grid.appendChild(dom);
	
	block.dom = dom;
	this.placeBlock(block);
};

HTMLView.prototype.placeBlock = function(block)
{
	var width = Number(window.getComputedStyle(block.dom).width);
	var str = "translate(" + block.v * width + "px," + block.u * width + "px)";

	block.dom.style.transform = str;
};