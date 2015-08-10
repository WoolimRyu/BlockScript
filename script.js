var shape= {};

shape.SqaureList = [];

shape.Square = 	function () {
		this.element = document.createElement('div');
		this.element.classList.add('square');

		this._onMouseMove = this._onMouseMove.bind(this);
		this._onMouseUp = this._onMouseUp.bind(this);
	}

shape.Square.prototype.setPosition = function (x, y) {
	this.element.style.top = y + 'px';
	this.element.style.left = x + 'px';
	return this;
};

shape.Square.prototype.startDragging = function (event) {
	this._startX = event.pageX;
	this._startY = event.pageY;
	this._startTop = parseInt(this.element.style.top);
	this._startLeft = parseInt(this.element.style.left);
	this.element.classList.add('dragging');

	document.addEventListener('mousemove', this._onMouseMove);
	document.addEventListener('mouseup', this._onMouseUp);

	return this;

}

shape.Square.prototype.setContainer = function (elContainer) {
	this.container = elContainer;
	this.containerTop = elContainer.offsetTop;
	this.containerLeft = elContainer.offsetLeft;
	this.containerBottom = this.containerTop + elContainer.offsetHeight;
	this.containerRight = this.containerLeft + elContainer.offsetWidth;
	
	return this;
};

shape.Square.prototype.setParent = function(parent) {
	this.parent = parent;
	parent.appendChild(this.element);
	this.element.style.position = 'absolute';
};

shape.Square.prototype._onMouseMove = function(event) {
	var diffX = event.pageX - this._startX, diffY = event.pageY - this._startY;
	this.element.style.top = this._startTop + diffY + 'px';
	this.element.style.left = this._startLeft + diffX + 'px';
};

shape.Square.prototype._onMouseUp = function(event) {
	document.removeEventListener('mousemove', this._onMouseMove);
	document.removeEventListener('mouseup', this._onMouseUp);
	
	var top = parseInt(this.element.style.top);
	var left = parseInt(this.element.style.left);
	var size = this.element.offsetWidth;
	var bottom = top + size;
	var right = left + size;
	
	if(top < this.containerTop || left < this.containerLeft || bottom > this.containerBottom || right > this.containerRight) {
		this.parent.removeChild(this.element);
		return;
	}
	
	this.element.innerText = document.body.childNodes.length - 7;
	this.fall();

	shape.SqaureList.push(this.element);
};

shape.Square.prototype.fall = function () {
	var step = 200/1000
	var self = this, start;
	var firstTop = this.element.style.top;

	function tick(timestamp){
		if (!start) start = timestamp;
		var elapsed = timestamp - start;
		var min = self.containerBottom - self.element.offsetHeight;
		self.element.style.top = Math.round(Math.min(parseInt(firstTop) +  (elapsed * step) , min)) + 'px';
		
		var conflictIndex = indexOfConflictSqure(self.element);
		if(conflictIndex !== -1) {
			self.element.style.top = (shape.SqaureList[conflictIndex].offsetTop - self.element.offsetHeight) + 'px';
			return;
		}

		var bottom = self.element.offsetTop + self.element.offsetHeight;
		if (bottom < self.containerBottom) {
			window.requestAnimationFrame(tick);
		}		
	};

	window.requestAnimationFrame(tick);
}

function indexOfConflictSqure(elSquare) {
	for(var i = 0; i< shape.SqaureList.length - 1; i++){
		var square = shape.SqaureList[i];
		if(isConflict(elSquare, square)){
			return i;
		}
	}
	return -1;
}

function isConflict(newSquare, oldSquare) {
	var left = newSquare.offsetLeft;
	var right = left + newSquare.offsetWidth;
	var top = newSquare.offsetTop;
	var bottom = top + newSquare.offsetHeight;

	var oldTop = oldSquare.offsetTop;
	var oldBottom = oldTop + oldSquare.offsetHeight;
	var oldLeft = oldSquare.offsetLeft;
	var oldRight = oldLeft + oldSquare.offsetWidth;
	return (isBetween(bottom, oldTop, oldBottom) || isBetween(top, oldTop, oldBottom)) && (isBetween(left, oldLeft, oldRight) || isBetween(right, oldLeft, oldRight));
}

function isBetween(value, min, max) {
	return (value >= min) && (value <= max);
}