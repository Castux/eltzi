// The MIT License (MIT)
// 
// Copyright (c) 2015 Noé Falzon
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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