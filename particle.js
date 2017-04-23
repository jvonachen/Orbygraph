Orbygraph.prototype.Particle = function() {
	var particleDiv, newBr, newButton,
	// static scope
	ss,
	i, newOption, that = this;

	ss = Orbygraph.prototype.Particle;
	
	// attracted to checkbox and span array
	this.atsca = [];

	// initialize a variable attached to the constructor function and not this
	if (ss.nextId === undefined) {
		ss.nextId = 0;
	}

	// unique identifier for this particle
	this.id = ss.nextId++;

	particleDiv = document.getElementById('particleDiv');
	this.toggleButton = document.createElement('button');
	particleDiv.appendChild(this.toggleButton);
	this.toggleButton.innerHTML = this.id;
	this.toggleButton.id = 'particleToggleButton' + this.id;

	this.controlDiv = document.createElement('div');
	this.controlDiv.id = 'partContDiv' + this.id;
	this.controlDiv.style.display = 'inline';
	this.controlDiv.style.visible = 'visible';
	this.toggleButton.onclick = function() {
		return orbygraph.toggleButton(that);
	};
	particleDiv.appendChild(this.controlDiv);

	// Delete button
	newButton = document.createElement('button');
	this.controlDiv.appendChild(newButton);
	newButton.innerHTML = 'X';
	newButton.style.backgroundColor = '#FF0000';
	newButton.number = this.id;
	newButton.onclick = function() {
		if (confirm('Are you sure you want to delete this particle?')) {
			orbygraph.deleteParticle(this);
			orbygraph.go();
		}
	};

	newBr = document.createElement('br');
	this.controlDiv.appendChild(newBr);

	this.newTable = document.createElement('table');
	this.newTable.id = 'partTable' + this.id;
	this.controlDiv.appendChild(this.newTable);

	orbygraph.makeControl(this, 'partTable' + this.id, 'X Position', 'xp',
		parseInt(orbygraph.svgViewport.width.baseVal.value) / 2, null, null, 10, 5,
		null, null, 5);
	orbygraph.makeControl(this, 'partTable' + this.id, 'Y Position', 'yp',
		parseInt(orbygraph.svgViewport.height.baseVal.value) / 2, null, null, 10, 5,
		null, null, 5);
	orbygraph.makeControl(this, 'partTable' + this.id, 'Direction', 'dr', 0, null,
		null, (Math.PI * 2) / 36, 5, null, null, 5);
	orbygraph.makeControl(this, 'partTable' + this.id, 'Magnitude', 'mg', 0, null,
		null, 1, 5, null, null, 5);
	orbygraph.makeControl(this, 'partTable' + this.id, 'Mass', 'ms', 1, null,
		null, 1, 5, null, null, 5);
	orbygraph.makeControl(this, 'partTable' + this.id, 'Cyan', 'cc', 0, 0, 1,
		0.1, 5, 1, 0, 5);
	orbygraph.makeControl(this, 'partTable' + this.id, 'Magenta', 'cm', 0, 0, 1,
		0.1, 5, 1, 0, 5);
	orbygraph.makeControl(this, 'partTable' + this.id, 'Yellow', 'cy', 0, 0, 1,
		0.1, 5, 1, 0, 5);
	orbygraph.makeControl(this, 'partTable' + this.id, 'Black', 'ck', 0, 0, 1,
		0.1, 5, 1, 0, 5);
	orbygraph.Color.makeColorControl(this, 'partTable' + this.id, 'cc', 'cm',
		'cy', 'ck');
	orbygraph.makeControl(this, 'partTable' + this.id, 'Opacity', 'so', 1,
		0, 1, 0.1, 2, 1, 0.01, 2);
	orbygraph.makeControl(this, 'partTable' + this.id, 'Width', 'sw', 10,
		0, null, 1, 5, 100, null, 5);
	this.makeAttractedToControl();
	
	// update existing change selects
	for ( i = 0; i < orbygraph.changes.length; i++) {
		newOption = document.createElement('option');
		orbygraph.changes[i].particleSelect.appendChild(newOption);
		newOption.label = this.id;
	}
};

Orbygraph.prototype.Particle.prototype.makeAttractedToControl = function() {
	var i, table, newRow, newCell, LABEL_WIDTH = '120px', newInput, newSpan,
		atCell, p;
	
	table = document.getElementById('partTable' + this.id);
	newRow = document.createElement('tr');
	table.appendChild(newRow);
	newRow.style.backgroundColor = '#f0f0f0';

	newCell = document.createElement('td');
	newRow.appendChild(newCell);
	newCell.innerHTML = 'Influenced by';
	newCell.style.width = LABEL_WIDTH;

	newCell = document.createElement('td');
	newRow.appendChild(newCell);
	newCell.colSpan = 6;
	newCell.id = 'atCell' + this.id;
	for(i = 0; i < orbygraph.particles.length; i++) {
		p = orbygraph.particles[i];
		// Add checkboxes to this particle for each particle that already exists
		newSpan = document.createElement('span');
		newCell.appendChild(newSpan);
		newSpan.innerHTML = p.id;
		newInput = document.createElement('input');
		newCell.appendChild(newInput);
		newInput.type = 'checkbox';
		newInput.onchange = function() {
			orbygraph.go();
		};
		this.atsca.push({s:newSpan, i:newInput});
		// Add a checkbox to each of the other already existing particles
		atCell = document.getElementById('atCell' + p.id);
		newSpan = document.createElement('span');
		atCell.appendChild(newSpan);
		newSpan.innerHTML = this.id;
		newInput = document.createElement('input');
		newInput.onchange = function() {
			orbygraph.go();
		};
		atCell.appendChild(newInput);
		newInput.type = 'checkbox';
		p.atsca.push({s:newSpan, i:newInput});
	}
	// Add a checkbox for this particle but disabled and unchecked because it
	//  doesn't make sense for a particle to be attracted to itself. 
	newSpan = document.createElement('span');
	newCell.appendChild(newSpan);
	newSpan.innerHTML = this.id;
	newInput = document.createElement('input');
	newCell.appendChild(newInput);
	newInput.type = 'checkbox';
	newInput.disabled = true;
	this.atsca.push({s:newSpan, i:newInput});
};
