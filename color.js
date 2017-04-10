Orbygraph.prototype.Color = {
	makeColorControl:function(o, tableId) {
		var table, newRow, newCell, newInput, LABEL_WIDTH = '120px';
		
		table = document.getElementById(tableId);
		newRow = document.createElement('tr');
		newRow.id = 'p2CYMKRow' + o.id;
		table.appendChild(newRow);
		
		newCell = document.createElement('td');
		newRow.appendChild(newCell);
		newRow.style.backgroundColor = '#f0f0f0';
		newCell.innerHTML = 'Color Picker';
		newCell.style.width = LABEL_WIDTH;

		newCell = document.createElement('td');
		newRow.appendChild(newCell);
		newInput = document.createElement('input');
		newCell.appendChild(newInput);
		newInput.style.width = '100%';
		newInput.style.height = '20px';
		newCell.colSpan = 6;
		newInput.type = 'color';
		newInput.id = 'colorPicker' + o.id;
		newInput.value = this.cmyk2rgb(o.cc, o.cm, o.cy, o.ck);
		
		newInput.onchange = function() {
			var returnVal;
			
			returnVal = orbygraph.Color.rgb2cmyk(
				parseInt('0x' + this.value.substring(1, 3)),
				parseInt('0x' + this.value.substring(3, 5)),
				parseInt('0x' + this.value.substring(5, 7))
			);
			orbygraph.updateProperty(o, 'cc', returnVal.c, 5, false);
			orbygraph.updateProperty(o, 'cm', returnVal.m, 5, false);
			orbygraph.updateProperty(o, 'cy', returnVal.y, 5, false);
			orbygraph.updateProperty(o, 'ck', returnVal.k, 5, false);
			orbygraph.go();
		};
	},
	
	cmyk2rgb:function(c, m, y, k) {
		var r, g, b;
		
		// these values can only be between 0 and 1
		if(c > 1) { c = 1; }
		if(c < 0) { c = 0; }
		if(m > 1) { m = 1; }
		if(m < 0) { m = 0; }
		if(y > 1) { y = 1; }
		if(y < 0) { y = 0; }
		if(k > 1) { k = 1; }
		if(k < 0) { k = 0; }
		
		// conversion to rgb
		r = Math.round(255 * (1 - c) * (1 - k));
		g = Math.round(255 * (1 - m) * (1 - k));
		b = Math.round(255 * (1 - y) * (1 - k));

		// convert to hex values with pre packed 0s
		r = r.toString(16);
		if(r.length < 2) r = '0' + r;
		g = g.toString(16);
		if(g.length < 2) g = '0' + g;
		b = b.toString(16);
		if(b.length < 2) b = '0' + b;
		
		return '#' + r + g + b;
	},
	
	rgb2cmyk:function(r, g, b) {
		var c, m, y, k;

		// these values can only be between 0 and 255
		if(r > 255) { r = 255; }
		if(r < 0) { r = 0; }
		if(g > 255) { g = 255; }
		if(g < 0) { g = 0; }
		if(b > 255) { b = 255; }
		if(b < 0) { b = 0; }		
		
		// convert to cmyk
		r = r / 255;
		g = g / 255;
		b = b / 255;
		k = 1 - this.max(r, g, b);
		c = (1 - r - k) / (1 - k);
		if(isNaN(c)) c = 0;
		m = (1 - g - k) / (1 - k);
		if(isNaN(m)) m = 0;
		y = (1 - b - k) / (1 - k);
		if(isNaN(y)) y = 0;
		
		return {'c':c, 'm':m, 'y':y, 'k':k};
	},
	
	max:function() {
		var i, returnVal;
		
		returnVal = arguments[0];
		for(i = 1; i < arguments.length; i++) {
			if(arguments[i] > returnVal) {
				returnVal = arguments[i];
			}	
		}
		return returnVal;
	}
};