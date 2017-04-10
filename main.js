var orbygraph;

// Constructor function
var Orbygraph = function() {
	var addParticleButton, addChangeButton, i, newParticle, pwInput, phInput,
		ppiInput, dimensionSelect, totalFrames;

	this.CENTIMETERS_PER_INCH = 2.54;

	this.particles = [], this.changes = [];
	this.svgViewport = document.getElementById('svgViewport');
	this.svgGroup = document.getElementById('svgGroup');
	this.svgViewport.style.width = window.innerWidth - 395;
	this.svgViewport.style.height = window.innerHeight - 75;
	pwInput = document.getElementById('pwInput');
	phInput = document.getElementById('phInput');
	pwInput.value = parseInt(this.svgViewport.style.width);
	phInput.value = parseInt(this.svgViewport.style.height);
	ppiInput = document.getElementById('ppiInput');
	ppiInput.value = 300;
	this.updateOutputDimensions();
	this.id = 'Global';
	
	// trying to make this function accessible from any object so I need to pass
	//  the object into it and not use this internally in the function
	this.makeControl(this, 'controlTable', 'Change Loop', 'cli', 1, 1, null, 1, 0,
	 null, 1, 0);
	this.makeControl(this, 'controlTable', 'Orbit Loop', 'oli', 20, 1, null, 10,
		0, null, 1, 0);
	this.makeControl(this, 'controlTable', 'Cyan',    'cc', 0, 0, 1, 0.1, 5, 1, 0, 5);
	this.makeControl(this, 'controlTable', 'Magenta', 'cm', 0, 0, 1, 0.1, 5, 1, 0, 5);
	this.makeControl(this, 'controlTable', 'Yellow',  'cy', 0, 0, 1, 0.1, 5, 1, 0, 5);
	this.makeControl(this, 'controlTable', 'Black',   'ck', 1, 0, 1, 0.1, 5, 1, 0, 5);
	this.Color.makeColorControl(this, 'controlTable', 'cc', 'cm', 'cy', 'ck');

	addParticleButton = document.getElementById('addParticleButton');
	addParticleButton.onclick = function() {
		orbygraph.addParticle();
	};
	addChangeButton = document.getElementById('addChangeButton');
	addChangeButton.onclick = function() {
		orbygraph.addChange();
	};
	dimensionSelect = document.getElementById('dimensionSelect');
	dimensionSelect.onchange = function() {
		orbygraph.selectDimension();
	};
	
	this.go();
	this.textClick(document.getElementById('about'));
};

Orbygraph.prototype.toggleGeneral = function() {
	var generalSettingsSpan;
	
	generalSettingsSpan = document.getElementById('generalSettingsSpan');
	if(generalSettingsSpan.style.display != 'none') {
		generalSettingsSpan.style.display = 'none';
		generalSettingsSpan.style.visibility = 'hidden';
	} else {
		generalSettingsSpan.style.display = 'inline';
		generalSettingsSpan.style.visibility = 'visible';		
	}
};

Orbygraph.prototype.textClick = function(bo) {
	// bo is button object
	// span style
	var undisplay, display;
	
	undisplay = function(bid) {
		var bs, ss;
		
		bs = document.getElementById(bid).style;
		bs.backgroundColor = '#FFFFFF';
		bs.color = '#000000';
		ss = document.getElementById(bid + 'Span').style;
		ss.display = 'none';
		ss.visibility = 'hidden';
	};
	
	display = function(bid) {
		var bs, ss;
		
		bs = document.getElementById(bid).style;
		bs.backgroundColor = '#000000';
		bs.color = '#FFFFFF';
		ss = document.getElementById(bid + 'Span').style;
		ss.display = 'inline';
		ss.visibility = 'visible';
	};
	
	// if the span associated with the button that was pressed, is currently
	//  displayed then just undisplay it.  This assumes that only one span is
	//  displayed at any one time.
	if(document.getElementById(bo.id + 'Span').style.display === 'inline') {
		undisplay(bo.id);
	} else {
		// undisplay everything
		undisplay('about');
		undisplay('chooseSize');
		undisplay('background');
		undisplay('addParticles');
		undisplay('addChange');
		undisplay('saveImage');
		// ..and then display the button span
		display(bo.id);
	}	
};

Orbygraph.prototype.selectDimension = function() {
	var dimensionSelect, pwInput, phInput;
	
	pwInput = document.getElementById('pwInput');
	phInput = document.getElementById('phInput');
	dimensionSelect = document.getElementById('dimensionSelect');
	
	pwInput.value = JSON.parse(dimensionSelect.selectedOptions[0].value).w;
	phInput.value = JSON.parse(dimensionSelect.selectedOptions[0].value).h;
	orbygraph.updateDimensions(dimensionSelect);
};

Orbygraph.prototype.updateDimensions = function(input) {
	var cmInput, owInput, ohInput, ppiInput, pwInput, phInput, w, h,
		resizeViewport, dimensionSelect;
	
	cmInput = document.getElementById('cmInput');
	owInput = document.getElementById('owInput');
	ohInput = document.getElementById('ohInput');
	ppiInput = document.getElementById('ppiInput');
	pwInput = document.getElementById('pwInput');
	phInput = document.getElementById('phInput');
	dimensionSelect = document.getElementById('dimensionSelect');
	
	w = parseInt(this.svgViewport.style.width);
	h = parseInt(this.svgViewport.style.height);
	
	resizeViewport = function(w, h) {
		var widthLimit, heightLimit;
		
		widthLimit = window.innerWidth - 395;
		heightLimit = window.innerHeight - 75;
		
		if(widthLimit * (h / w) > heightLimit) {
			this.svgViewport.style.height = heightLimit;			
			this.svgViewport.style.width = Math.round(heightLimit * (w / h));  
		} else {
			this.svgViewport.style.width = widthLimit;			
			this.svgViewport.style.height = Math.round(widthLimit * (h / w));  
		}
	};

	switch(input) {
		case cmInput:
			this.updateOutputDimensions();
		break;
		case ppiInput:
			this.updatePixelDimensions();
			dimensionSelect.value = '';
		break;
		case owInput:
			// no decimal values accepted
			owInput.value = Math.floor(owInput.value);
			this.updatePixelDimensions();
			resizeViewport(pwInput.value, phInput.value);
			dimensionSelect.value = '';
		break;
		case ohInput:
			ohInput.value = Math.floor(ohInput.value);
			this.updatePixelDimensions();
			resizeViewport(pwInput.value, phInput.value);
			dimensionSelect.value = '';
		break;
		case pwInput:
			pwInput.value = Math.floor(pwInput.value);
			this.updateOutputDimensions();
			resizeViewport(pwInput.value, phInput.value);
			dimensionSelect.value = '';
		break;
		case phInput:
			phInput.value = Math.floor(phInput.value);
			this.updateOutputDimensions();
			resizeViewport(pwInput.value, phInput.value);
			dimensionSelect.value = '';
		break;
		case dimensionSelect:
			pwInput.value = Math.floor(pwInput.value);
			this.updateOutputDimensions();
			resizeViewport(pwInput.value, phInput.value);		
		break;
		default:
			alert("I don't know what kind of input called this function. *shrug*");
	}
	this.go();
};

Orbygraph.prototype.updateOutputDimensions = function() {
	owInput.value = Math.round(pwInput.value / ppiInput.value);
	ohInput.value = Math.round(phInput.value / ppiInput.value);
	if(cmInput.checked === true) {
		owInput.value = Math.round(owInput.value * this.CENTIMETERS_PER_INCH); 
		ohInput.value = Math.round(ohInput.value * this.CENTIMETERS_PER_INCH); 
	}
};

Orbygraph.prototype.updatePixelDimensions = function() {
	pwInput.value = Math.round(owInput.value * ppiInput.value);
	phInput.value = Math.round(ohInput.value * ppiInput.value);
	if(cmInput.checked === true) {
		pwInput.value = Math.round(pwInput.value / this.CENTIMETERS_PER_INCH); 
		phInput.value = Math.round(phInput.value / this.CENTIMETERS_PER_INCH); 
	}	
};

Orbygraph.prototype.saveAsPNG = function() {
	var svgString, canvas, context, domURL, image, svg, url, imageDiv, pw, ph,
		ppi, scaleFactor, newWindow;
	
	pw = document.getElementById('pwInput').value;
	ph = document.getElementById('phInput').value;
	
	canvas = document.createElement('canvas');
	// prepares a canvas sized to contain the image.  This canvas will never be
	//  displayed and will go away after this function returns and memory is
	//  garbage collected
	canvas.width = pw;
	canvas.height = ph;
	context = canvas.getContext('2d');
	domURL = self.URL || self.webkitURL || self;
	
	// make an image to dump the svg image.  No need to display it. 
	image = new Image();
	
	// Scale the group the elements are contained in.  Since these images will 
	//  always scale the same in x and y I only one scale factor and it does not
	//  matter which one I use.
	scaleFactor = pw / this.svgViewport.width.baseVal.value;
	this.svgGroup.setAttribute("transform", "scale(" + scaleFactor + ", " +
		scaleFactor + ")");
	
	// Temporarily scale the viewport to show the elements in their proper context  
	this.svgViewport.style.width = Math.round(this.svgViewport.style.width *
		scaleFactor);
	this.svgViewport.style.height = Math.round(this.svgViewport.style.height *
		scaleFactor);
	svgString = new XMLSerializer().serializeToString(this.svgViewport);
	svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
	url = domURL.createObjectURL(svg);
	image.onload = function() {
		var png, a;
		
		// the image is loaded into the canvas
		context.drawImage(image, 0, 0);
		// the canvas outputs a base 64 encoded string version of the image
//		png = canvas.toDataURL('image/png');
//		domURL.revokeObjectURL(png);
		
//		a = document.createElement('a');
//		a.download = 'image.png';
//		a.href = png;
		newWindow = window.open();
		newWindow.document.body.appendChild(canvas);
		//a.click();
		
		// set the elements back the way they were
		orbygraph.svgGroup.setAttribute("transform", "scale(1, 1)");
		
		// put the viewport back the way it was too
		orbygraph.svgViewport.style.width =
			Math.round(orbygraph.svgViewport.style.width / scaleFactor);
		orbygraph.svgViewport.height.baseVal.value =
			Math.round(orbygraph.svgViewport.style.height / scaleFactor);
	};
	image.src = url;
};

// Make a control row for a value that's global or a particle or a chenge
Orbygraph.prototype.makeControl = function(o, tableId, label, name, defaultVal,
	min, max, step, fixed, smax, smin, sfixed) {
	var table, newRow, newCell, newButton, newSpan, LABEL_WIDTH = '120px';

	table = document.getElementById(tableId);
	newRow = document.createElement('tr');
	table.appendChild(newRow);
	newRow.id = name + 'Row' + o.id;

	newCell = document.createElement('td');
	newRow.appendChild(newCell);
	newRow.style.backgroundColor = '#f0f0f0';
	newCell.innerHTML = label;
	newCell.style.width = LABEL_WIDTH;

	newCell = document.createElement('td');
	newRow.appendChild(newCell);
	newSpan = document.createElement('span');
	newCell.style.width = '50px';
	newCell.style.textAlign = 'right';
	newCell.appendChild(newSpan);
	newSpan.id = name + 'Span' + o.id;

	newCell = document.createElement('td');
	newRow.appendChild(newCell);
	newButton = document.createElement('button');
	newCell.style.width = '25px';
	newCell.appendChild(newButton);
	newButton.id = name + 'IncButton' + o.id;
	newButton.className = 'value';
	newButton.innerHTML = '/\\';

	newCell = document.createElement('td');
	newRow.appendChild(newCell);
	newButton = document.createElement('button');
	newCell.appendChild(newButton);
	newCell.style.width = '25px';
	newButton.id = name + 'DecButton' + o.id;
	newButton.className = 'value';
	newButton.innerHTML = '\\/';

	newCell = document.createElement('td');
	newRow.appendChild(newCell);
	newButton = document.createElement('button');
	newCell.style.width = '25px';
	newCell.appendChild(newButton);
	newButton.id = name + 'sIncButton' + o.id;
	newButton.className = 'step';
	newButton.innerHTML = '/\\';

	newCell = document.createElement('td');
	newRow.appendChild(newCell);
	newButton = document.createElement('button');
	newCell.style.width = '25px';
	newCell.appendChild(newButton);
	newButton.id = name + 'sDecButton' + o.id;
	newButton.className = 'step';
	newButton.innerHTML = '\\/';

	newCell = document.createElement('td');
	newRow.appendChild(newCell);
	newSpan = document.createElement('span');
	newCell.style.width = '50px';
	newCell.appendChild(newSpan);
	newSpan.id = name + 'sSpan' + o.id;

	this.updateProperty(o, name, defaultVal, fixed, true);
	document.getElementById(name + 'DecButton' + o.id).onclick = function() {
		var newVal;
		
		newVal = o[name] - o[name + 's'];
		if(min !== null) {
			newVal = newVal < min ? min : newVal;
		}
		orbygraph.updateProperty(o, name, newVal, fixed, true);
	};
	document.getElementById(name + 'IncButton' + o.id).onclick = function() {
		var newVal;
		
		newVal = o[name] + o[name + 's'];
		if(max !== null) {
			newVal = newVal > max ? max : newVal;
		}
		orbygraph.updateProperty(o, name, newVal, fixed, true);
	};
	
	this.updateProperty(o, name + 's', step, sfixed, false);
	document.getElementById(name + 'sDecButton' + o.id).onclick = function() {
		var newStep;
		
		newStep = o[name + 's'] / 10;
		if(smin !== null) {
			newStep = newStep < smin ? smin : newStep;
		}
		orbygraph.updateProperty(o, name + 's', newStep, sfixed, false);
	};
	document.getElementById(name + 'sIncButton' + o.id).onclick = function() {
		var newStep;
		
		newStep = o[name + 's'] * 10;
		if(smax !== null) {
			newStep = newStep > smax ? smax : newStep;
		}
		orbygraph.updateProperty(o, name + 's', newStep, sfixed, false);
	};
};

// update any property belonging to any kind of object
Orbygraph.prototype.updateProperty = function(o, name, value, fixed, go) {
	var span, colorPicker;

	// This is where a new property is added to the passed in object
	o[name] = value;
	span = document.getElementById(name + 'Span' + o.id);
	span.innerHTML = value.toFixed(fixed);
	
	if(name == 'cc' || name == 'cm' || name == 'cy' || name == 'ck') {
		colorPicker = document.getElementById('colorPicker' + o.id);
		if(colorPicker != null) {
			colorPicker.value = orbygraph.Color.cmyk2rgb(o.cc, o.cm, o.cy, o.ck);
		}
	}

	if (go) {
		this.go();
	}
};

Orbygraph.prototype.addParticle = function() {
	var newParticle = new this.Particle();
	this.particles.push(newParticle);

	this.go();
};

Orbygraph.prototype.addChange = function() {
	var newChange = new this.Change();
	this.changes.push(newChange);

	this.go();
};

Orbygraph.prototype.deleteParticle = function(bo) {
	var i, j, parent, child, thisP, thisC, thisCO;

	for(i = 0; i < this.particles.length; i++) {
		thisP = this.particles[i];
		for(j = 0; j < thisP.atsca.length; j++) {
			if(thisP.atsca[j].s.innerHTML == bo.number) {
			
				// delete the Attracted To checkbox in every particle
				parent = thisP.atsca[j].s.parentElement;
				child = thisP.atsca[j].s;
				parent.removeChild(child);
				child = thisP.atsca[j].i;
				parent.removeChild(child);
			}
		}
	}

	for(i = 0; i < this.changes.length; i++) {
		thisC = this.changes[i];
		thisCO = thisC.particleSelect.childNodes;
		for(j = 0; j < thisCO.length; j++) {
			if(thisCO[j].label == bo.number + '') {
				if(thisCO[j].selected == true) {
					
					// delete the option from any existing change particle selects
					parent = document.getElementById('changeDiv');
					child = document.getElementById('changeToggleButton' + thisC.id);
					parent.removeChild(child);
					child = document.getElementById('changeContDiv' + thisC.id);
					parent.removeChild(child);

					// delete any changes that do have the deleted particle selected
					this.changes.splice(i, 1);
					i--;
					break;
				}
				thisC.particleSelect.removeChild(thisCO[j]);
			}
		}
	}
	
	for(i = 0; i < this.particles.length; i++) {
		thisP = this.particles[i];
		if(thisP.id == bo.number) {

			// delete the controls for the particle
			parent = document.getElementById('particleDiv');
			child = document.getElementById('particleToggleButton' + thisP.id);
			parent.removeChild(child);
			child = document.getElementById('partContDiv' + thisP.id);
			parent.removeChild(child);
			
			// delete the model of the particle
			this.particles.splice(i, 1);
			break;
		}
	}
};

Orbygraph.prototype.deleteChange = function(bo) {
	var i,
	    parent,
	    child,
	    thisC;

	// delete the particle as well as the controls
	for ( i = 0; i < this.changes.length; i++) {
		thisC = this.changes[i];
		if (thisC.id == bo.number) {
			this.changes.splice(i, 1);
			parent = document.getElementById('changeDiv');
			child = document.getElementById('changeToggleButton' + thisC.id);
			parent.removeChild(child);
			child = document.getElementById('changeContDiv' + thisC.id);
			parent.removeChild(child);
		}
	}
};

Orbygraph.prototype.toggleButton = function(o) {
	if (o.controlDiv.style.display === 'inline') {
		o.controlDiv.style.display = 'none';
		o.controlDiv.style.visible = 'hidden';
	} else {
		o.controlDiv.style.display = 'inline';
		o.controlDiv.style.visible = 'visible';
	}
};

// This paints the picture
Orbygraph.prototype.go = function() {
	var i, j, k, l, m, p, q, newLine = [], svgNS, newXp = [], newYp = [], apc,
		apc2, distance, direction, force, newPoint, newRect, newMg, thisC, selPart,
		selParam, pass;

	svgNS = "http://www.w3.org/2000/svg";

	// clear the SVG viewport
	this.svgGroup.innerHTML = '';

	// append a background color rectangle
	newRect = document.createElementNS(svgNS, 'rect');
	newRect.style.fill = this.Color.cmyk2rgb(this.cc, this.cm, this.cy, this.ck);
	newRect.x.baseVal.value = 0;
	newRect.y.baseVal.value = 0;
	newRect.width.baseVal.value = parseInt(this.svgViewport.style.width);
	newRect.height.baseVal.value = parseInt(this.svgViewport.style.height);
	this.svgGroup.appendChild(newRect);

	// make clones and mess those up instead of messing up the original
	apc2 = JSON.parse(JSON.stringify(this.particles));

	// change loop
	for ( i = 0; i < this.cli; i++) {

		// make a clones and mess those up instead of messing up the original
		apc = JSON.parse(JSON.stringify(apc2));

		// Create the polylines and later accumulate coordinates in them
		for ( k = 0; k < apc.length; k++) {
			p = apc[k];
			newLine[k] = document.createElementNS(svgNS, 'polyline');
			this.svgGroup.appendChild(newLine[k]);
			newLine[k].style.stroke = this.Color.cmyk2rgb(p.cc, p.cm, p.cy, p.ck);
			this.particles[k].newTable.style.backgroundColor =
				newLine[k].style.stroke;
			newLine[k].style.strokeOpacity = p.so;
			newLine[k].style.strokeWidth = p.sw;
			newLine[k].style.strokeLinecap = 'round';
			newLine[k].style.strokeLinejoin = 'round';
			newLine[k].style.fill = 'none';
			newPoint = this.svgViewport.createSVGPoint();
			newLine[k].points.appendItem(newPoint);
			newPoint.x = p.xp;
			newPoint.y = p.yp;
		}

		// orbit loop
		for ( j = 0; j < this.oli; j++) {

			// figure out the next positions for particles
			for ( k = 0; k < apc.length; k++) {
				p = apc[k];

				// apply the particle's natural movement
				newXp[k] = p.xp + Math.cos(p.dr) * p.mg;
				newYp[k] = p.yp + Math.sin(p.dr) * p.mg;

				// apply the gravity of every other particle to the movement of this one
				for ( l = 0; l < apc.length; l++) {
					q = apc[l];
					
					// Check the check marks to see if this p is effected by q's mass
					pass = false;
					for(m = 0; m < p.atsca.length; m++) {
						if(
							// can't use the clone so use the real thing
							this.particles[k].atsca[m].s.innerHTML == q.id &&
							this.particles[k].atsca[m].i.checked == false
						) {
							pass = true;
							break;
						}						
					}
					if(pass) {
						continue;
					}
					
					distance = Math.sqrt(Math.pow(p.xp - q.xp, 2) + Math.pow(p.yp - q.yp, 2));
					direction = Math.atan2(q.yp - p.yp, q.xp - p.xp);
					force = 100 * ((p.ms * q.ms) / Math.pow(distance, 2));
					force /= p.ms;

					// apply the new vector
					newXp[k] += Math.cos(direction) * force;
					newYp[k] += Math.sin(direction) * force;
				}

				// update the new direction and magnitude based on the new positions
				p.dr = Math.atan2(newYp[k] - p.yp, newXp[k] - p.xp);
				p.mg = Math.sqrt(Math.pow(p.xp - newXp[k], 2) + Math.pow(p.yp -
					newYp[k], 2));
			}

			// set the new values as current values and add coordinates to the
			//  polyline points
			for ( k = 0; k < apc.length; k++) {
				p = apc[k];
				p.xp = newXp[k];
				p.yp = newYp[k];
				newPoint = this.svgViewport.createSVGPoint();
				newLine[k].points.appendItem(newPoint);
				newPoint.x = p.xp;
				newPoint.y = p.yp;
			}

			// end for orbit loop
		}

		// make changes
		for(k = 0; k < this.changes.length; k++) {
			thisC = this.changes[k];
			selParam = thisC.parameterSelect.selectedOptions[0];
			selPart = thisC.particleSelect.selectedOptions[0];
			if(selPart.label != '' && selParam.label != '') {
				for(l = 0; l < apc2.length; l++) {
					if(apc2[l].id == selPart.label) {
						apc2[l][selParam.parameter] += thisC.pa;
					}
				}
			}
		}

		// end for change loop
	}
};

window.onload = function() {
	var isOpera, isFirefox, isSafari, isIE, isEdge, isChrome, isBlink;
	
	// Opera 8.0+
	isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
  // Firefox 1.0+
	isFirefox = typeof InstallTrigger !== 'undefined';
  // Safari <= 9 "[object HTMLElementConstructor]" 
	isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
  // Internet Explorer 6-11
	isIE = /*@cc_on!@*/false || !!document.documentMode;
  // Edge 20+
	isEdge = !isIE && !!window.StyleMedia;
  // Chrome 1+
	isChrome = !!window.chrome && !!window.chrome.webstore;
  // Blink engine detection
	isBlink = (isChrome || isOpera) && !!window.CSS;

	if(isOpera || isChrome) {
		orbygraph = new Orbygraph();		
	} else {
		document.body.innerHTML = '';
		alert("Orbygraph only works on Chrome or Opera.  You should use one of those browsers. :)");
	}
};
