function Histogram(posx, posy, width, height){
    this.posx = posx;
    this.posy = posy;
    this.width = width;
    this.height = height;
    this.gridPos = undefined;
    this.unit = "";
	
	this.originalData = undefined;
	this.originalAxeNameX = undefined;
	this.originalAxeNameY = undefined;
	this.min = undefined;
	this.max = undefined;
	this.n = undefined;
	
    this.barchart = new BarChart(this.posx, this.posy, this.width, this.height);
	
    this.setOrientation = function(orientation){
        this.barchart.setOrientation(orientation);
		if (orientation == "horizontal"){
			this.barchart.setData(this.barchart.data, this.barchart.axeNameX, this.barchart.axeNameY, this.barchart.unit);
		}
		else{ // switch axes here
			this.barchart.setData(this.barchart.data, this.barchart.axeNameY, this.barchart.axeNameX, this.barchart.unit);
		}
    };
	
    this.setIntervals = function(n){
		this.n = n;
		if (this.originalData != undefined){
			this.setData(this.originalData, this.originalAxeNameX, this.originalAxeNameY, this.barchart.unit);
		}
    };
	
    this.setIntervalsWithLimit = function(min, max, n){
        this.min = min;
		this.max = max;
		this.n = n;
    };

    this.setData = function(data, axeNameX, axeNameY, unit){
		
		this.originalData = data;
		this.originalAxeNameX = axeNameX;
		this.originalAxeNameY = axeNameY;
	
		let hist_data = undefined;
		let interval_names = undefined;
		if (data != undefined){
			let values = data[1];
			if (values != undefined && this.n != undefined){
				let min = undefined;
				let max = undefined;
				if (this.min != undefined && this.max != undefined){
					min = this.min;
					max = this.max;
				}
				else{
					min = this.getmin(values);
					max = this.getmax(values);
				}
				hist_data = Array(this.n).fill(0);
				interval_names = Array(this.n).fill(0);
				
				for(let i = 0; i < this.n; i++){
					interval_names[i] = ((min + (max - min)*i/this.n) + (min + (max - min)*(i+1)/this.n)) / 2;
				}
				
				for(let vi = 0; vi < values.length; vi++){
					value = values[vi];
					if(value < min || value > max){
						continue;
					}
					i = Math.floor((value - min)*this.n / (max - min));
					hist_data[i] += 1;
				}
			}
		}
		
		if (this.barchart.orientation == "horizontal"){
			this.barchart.setData([interval_names, hist_data], axeNameX, axeNameY, unit);
		}
		else{ // switch axes here
			this.barchart.setData([interval_names, hist_data], axeNameY, axeNameX, unit);
		}
    };

    this.setLineColor = function(color_array){
        this.barchart.setLineColor(color_array);
    }

    this.setLineColorStyle = function(style){
        this.barchart.setLineColorStyle(style);
    }

    this.setColorMap = function(color_map){
        this.barchart.setColorMap(color_map);
    }

    this.draw = function(offx, offy, draw_mouse, mouse_x, mouse_y){
		this.barchart.draw(offx, offy, draw_mouse, mouse_x, mouse_y);
    };

    this.getDrawArea = function(offx, offy){
		this.barchart.getDrawArea(offx, offy);
    };

    this.drawAreaContains = function(mouse_x, mouse_y, offx, offy){
		this.barchart.drawAreaContains(mouse_x, mouse_y, offx, offy);
    };

    this.getmax = function(numbers){
		let m = numbers[0];
		for(i = 0; i < numbers.length; i++){
			if (numbers[i] > m){
				m = numbers[i]
			}
		}
		return m;
	};
    this.getmin = function(numbers){
		let m = numbers[0];
		for(i = 0; i < numbers.length; i++){
			if (numbers[i] < m){
				m = numbers[i]
			}
		}
		return m;
	};
};