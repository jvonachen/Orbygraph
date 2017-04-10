Orbygraph.prototype.Change = function() {
	var changeDiv,
	    newBr,
	    newTable,
	    newButton,
	// static scope
	    ss,
	    i,
	    that = this;

	ss = Orbygraph.prototype.Change;

	// initialize a variable attached to the contructor function and not this
	if (ss.nextId === undefined) {
		ss.nextId = 0;
	}

	// unique identifier for this change
	this.id = ss.nextId++;

	changeDiv = document.getElementById('changeDiv');
	this.toggleButton = document.createElement('button');
	changeDiv.appendChild(this.toggleButton);
	this.toggleButton.innerHTML = '&nbsp;';
	this.toggleButton.id = 'changeToggleButton' + this.id;

	this.controlDiv = document.createElement('div');
	this.controlDiv.id = 'changeContDiv' + this.id;
	this.controlDiv.style.display = 'inline';
	this.controlDiv.style.visible = 'visible';
	this.toggleButton.onclick = function() {
		return orbygraph.toggleButton(that);
	};
	changeDiv.appendChild(this.controlDiv);
	this.makeSelectControl();

	// Delete button
	newButton = document.createElement('button');
	this.controlDiv.appendChild(newButton);
	newButton.innerHTML = 'X';
	newButton.style.backgroundColor = '#FF0000';
	newButton.number = this.id;
	newButton.onclick = function() {
		if (confirm('Are you sure you want to delete this change?')) {
			orbygraph.deleteChange(this);
			orbygraph.go();
		}
	};

	newBr = document.createElement('br');
	this.controlDiv.appendChild(newBr);

	this.newTable = document.createElement('table');
	this.newTable.id = 'changeTable' + this.id;
	this.controlDiv.appendChild(this.newTable);

	orbygraph.makeControl(this, 'changeTable' + this.id, '', 'pa', 1, 0, 100, 1);
};

Orbygraph.prototype.Change.prototype.updateProperty = function(name, value, go) {
	var span;

	if (this[name + 'min'] != null && value < this[name + 'min']) {
		value = this[name + 'min'];
	}
	if (this[name + 'max'] != null && value > this[name + 'max']) {
		value = this[name + 'max'];
	}
	this[name] = value;
	span = document.getElementById(name + 'Span' + this.id);
	span.innerHTML = value.toFixed(5);

	if (go) {
		orbygraph.go();
	}
};

// a special control "row" that lets you choose a particle and property
Orbygraph.prototype.Change.prototype.makeSelectControl = function() {
	var newCell, newRow, that = this, partParams, i;

	// for selecting a particle
	this.particleSelect = document.createElement('select');
	this.controlDiv.appendChild(this.particleSelect);
	this.particleSelect.onchange = function() {
		orbygraph.go();
	};
	// the default empty selection
	newOption = document.createElement('option');
	this.particleSelect.appendChild(newOption);
	for ( i = 0; i < orbygraph.particles.length; i++) {
		newOption = document.createElement('option');
		this.particleSelect.appendChild(newOption);
		newOption.label = orbygraph.particles[i].id;
	}

	// parameter select
	partParams = [
		{value:'xp', label:'X Position', defaultVal:10, min:null, max:null, step:10, fixed:5, smax:null, smin:0, sfixed:5},
		{value:'yp', label:'Y Position', defaultVal:10, min:null, max:null, step:10, fixed:5, smax:null, smin:0, sfixed:5},
		{value:'dr', label:'Direction', defaultVal:Math.PI / 20, min:null, max:null, step:Math.PI / 20, fixed:5, smax:null, smin:0, sfixed:5},
		{value:'mg', label:'Magnitude', defaultVal:1, min:null, max:null, step:1, fixed:5, smax:null, smin:0, sfixed:5},
		{value:'ms', label:'Mass', defaultVal:1, min:null, max:null, step:1, fixed:5, smax:null, smin:null, sfixed:5},
		{value:'cc', label:'Cyan', defaultVal:0.1, min:-1, max:1, step:0.1, fixed:5, smax:1, smin:0.00001, sfixed:5},
		{value:'cm', label:'Magenta', defaultVal:0.1, min:-1, max:1, step:0.1, fixed:5, smax:1, smin:0.00001, sfixed:5},
		{value:'cy', label:'Yellow', defaultVal:0.1, min:-1, max:1, step:0.1, fixed:5, smax:1, smin:0.00001, sfixed:5},
		{value:'ck', label:'Black', defaultVal:0.1, min:-1, max:1, step:0.1, fixed:5, smax:1, smin:0.00001, sfixed:5},
		{value:'so', label:'Stroke Opacity', defaultVal:0.1, min:null, max:1, step:0.1, fixed:5, smax:null, smin:0, sfixed:5},
		{value:'sw', label:'Stroke Width', defaultVal:1, min:null, max:null, step:1, fixed:5, smax:null, smin:null, sfixed:5}
	];
	this.parameterSelect = document.createElement('select');
	this.controlDiv.appendChild(this.parameterSelect);
	// The empty default selection
	newOption = document.createElement('option');
	this.parameterSelect.appendChild(newOption);
	for ( i = 0; i < partParams.length; i++) {
		newOption = document.createElement('option');
		this.parameterSelect.appendChild(newOption);
		newOption.value = partParams[i].value;
		newOption.parameter = partParams[i].value;
		newOption.label = partParams[i].label;
		newOption.defaultVal = partParams[i].defaultVal;
		newOption.min = partParams[i].min;
		newOption.max = partParams[i].max;
		newOption.step = partParams[i].step;
		newOption.fixed = partParams[i].fixed;
		newOption.smax = partParams[i].smax;
		newOption.smin = partParams[i].smin;
		newOption.sfixed = partParams[i].sfixed;
	}
	this.parameterSelect.onchange = function() {
		return that.chooseParameter();
	};
};

Orbygraph.prototype.Change.prototype.chooseParameter = function() {
	var parent, child, op;

	parent = document.getElementById('changeTable' + this.id);
	child = document.getElementById('paRow' + this.id);
	if(child != null) parent.removeChild(child);
	op = this.parameterSelect.selectedOptions[0]; 
	if(op.label != '') {
		orbygraph.makeControl(
			this,                     // passed in object reference
			'changeTable' + this.id,  // tableId
			op.label, // label
			'pa', // name of the parameter
	
			// default value for change
			op.defaultVal,
			op.min,
			op.max,
			op.step,
			op.fixed,
			op.smax,
			op.smin,
			op.sfixed
		);
	}
	orbygraph.go();
};
