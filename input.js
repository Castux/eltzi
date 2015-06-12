var nop = function() {};

Input = function(dom)
{
	this.start = nop;
	this.move = nop;
	this.end = nop;

	var thiz = this;

	dom.addEventListener("mousedown", function(e)
	{
		e.preventDefault();
		thiz.start(e.clientX, e.clientY);
	});

	dom.addEventListener("mousemove", function(e)
	{
		e.preventDefault();
		thiz.move(e.clientX, e.clientY);
	});

	dom.addEventListener("mouseup", function(e)
	{
		e.preventDefault();
		thiz.end(e.clientX, e.clientY);
	});

	dom.addEventListener("touchstart", function(e)
	{
		e.preventDefault();
		thiz.start(e.touches[0].clientX, e.touches[0].clientY);
	});

	dom.addEventListener("touchmove", function(e)
	{
		e.preventDefault();
		thiz.move(e.touches[0].clientX, e.touches[0].clientY);
	});

	dom.addEventListener("touchend", function(e)
	{
		e.preventDefault();
		thiz.end();
	});

	dom.addEventListener("touchcancel", function(e)
	{
		e.preventDefault();
		thiz.end();
	});
};