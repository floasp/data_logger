class Histogram{
	constructor(posx, posy, width, height){
		this.posx = posx;
		this.posy = posy;
		this.width = width;
		this.height = height;
		this.unit = "";
		
		this.originalData = undefined;
		this.originalAxeNameX = undefined;
		this.originalAxeNameY = undefined;
		this.min = undefined;
		this.max = undefined;
		this.n = undefined;
		
		this.barchart = new BarChart(this.posx, this.posy, this.width, this.height);
	}

    resize(posx, posy, width, height){
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;

		this.barchart.resize(this.posx, this.posy, this.width, this.height);
    }
	
    setOrientation(orientation){
        this.barchart.setOrientation(orientation);
		if (orientation == "horizontal"){
			this.barchart.setData(this.barchart.data, this.barchart.axeNameX, this.barchart.axeNameY, this.barchart.unit);
		}
		else{ // switch axes here
			this.barchart.setData(this.barchart.data, this.barchart.axeNameY, this.barchart.axeNameX, this.barchart.unit);
		}
    }
	
    setIntervals(n){
		this.n = n;
		if (this.originalData != undefined){
			this.setData(this.originalData, this.originalAxeNameX, this.originalAxeNameY, this.barchart.unit);
		}
    }
	
    setIntervalsWithLimit(min, max, n){
        this.min = min;
		this.max = max;
		this.n = n;
    }

    setData(data, axeNameX, axeNameY, unit){
		
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
					let value = values[vi];
					if(value < min || value > max){
						continue;
					}
					let i = Math.floor((value - min)*this.n / (max - min));
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
    }

    setLineColor(color_array){
        this.barchart.setLineColor(color_array);
    }

    setLineColorStyle(style){
        this.barchart.setLineColorStyle(style);
    }

    setColorMap(color_map){
        this.barchart.setColorMap(color_map);
    }

    draw(offx, offy, draw_mouse, mouse_x, mouse_y){
		this.barchart.draw(offx, offy, draw_mouse, mouse_x, mouse_y);
    }

    getDrawArea(offx, offy){
		this.barchart.getDrawArea(offx, offy);
    }

    drawAreaContains(mouse_x, mouse_y, offx, offy){
		this.barchart.drawAreaContains(mouse_x, mouse_y, offx, offy);
    }

    getmax(numbers){
		let m = numbers[0];
		for(let i = 0; i < numbers.length; i++){
			if (numbers[i] > m){
				m = numbers[i]
			}
		}
		return m;
	}
    getmin(numbers){
		let m = numbers[0];
		for(let i = 0; i < numbers.length; i++){
			if (numbers[i] < m){
				m = numbers[i]
			}
		}
		return m;
	}
}