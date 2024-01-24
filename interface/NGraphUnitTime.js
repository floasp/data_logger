class NGraphUnitTime{
    constructor(posx, posy, width, height){
        // Graph that displays multiple datasets with the same unit and timerange,
        // to, for example, compare day and night mean temperatures over a certain period
        
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.gridPos = undefined;
        this.data = undefined;
        this.datamin = undefined;
        this.datamax = undefined;
        this.useContinousSpline = false;
        this.axeNameX = "";
        this.axeNameY = "";
        this.unit = "";
        this.line_color = [0, 255, 255];
        this.line_color_style = DLI_STATIC_COLOR;
        this.color_map = undefined;
    }

	// set every parameter as an array of individual values 
	// (e.g. if you have graph with 2 datasets, setLineColor() 
	// takes an array of 2 line color arrays: [color_array_1, color_array_2])
    setContinousSpline(isSpline){
        this.useContinousSplines = [undefined];
		
		for(let i = 0; i < isSpline.length; i++){
			this.useContinousSplines.push(isSpline[i]);
		}
    }

    setData(data, axeNameX, axeNameY, unit){
        this.data = data;
        this.axeNameX = axeNameX;
        this.axeNameY = axeNameY;
        this.unit = unit;
    }

	// set values with undefined at index 0 because data array starts at 1 (0 is timestamps)
    setLineColor(color_array){
        this.line_color = [undefined];
		
		for(let i = 0; i < color_array.length; i++){
			this.line_color.push(color_array[i]);
		}
    }

    setLineColorStyle(style){
        this.line_color_style = [undefined];
		
		for(let i = 0; i < style.length; i++){
			this.line_color_style.push(style[i]);
		}
    }

    setColorMap(color_map){
        this.color_map = [undefined];
		
		for(let i = 0; i < color_map.length; i++){
			this.color_map.push(color_map[i]);
		}
    }

    draw(offx, offy, draw_mouse, mouse_x, mouse_y){
        // fill('#111921');
        // rect(posx + offx, posy + offy, width, height, 20)
        this.drawAxes(this.axeNameX, this.axeNameY, offx, offy);
        if(this.data != undefined && this.data[0][0] != undefined && this.data[0][1] != undefined){
            this.drawData(offx, offy, draw_mouse, mouse_x, mouse_y);
            this.drawYLim(offx, offy);
        }
    }

    getDrawArea(offx, offy){
        let axeXlpos = this.posx + this.width / 10;
        let axeXrpos = this.posx + this.width - this.width / 10;
        let axeYupos = this.posy + this.height / 5;
        let axeYdpos = this.posy + this.height - this.height / 5;

        return [axeXlpos, axeXrpos, axeYupos, axeYdpos];
    }

    drawAxes(xtxt, ytxt, offx, offy){
        textAlign(CENTER);
        let yTextSize = max(this.height / 20, 12);
        textSize(yTextSize);
        // fill(180, 200, 235);
        // fill(120, 130, 155);
        fill(DLI_TEXT_SMALL_COLOR);

        let xTextX = this.posx + this.width / 2 + offx;
        let xTextY = this.posy + this.height - this.height / 30 + offy;
        let yTextX = this.posx + this.width / 25 + offx;
        let yTextY = this.posy + this.height - this.height / 2 + offy;

        textStyle(ITALIC);
        text(xtxt, xTextX, xTextY);
        translate(yTextX, yTextY);
        rotate(-PI/2);
        textStyle(NORMAL);
        text(ytxt, 0, 0);
        rotate(PI/2);
        translate(-(yTextX), -(yTextY));

        let drawArea = this.getDrawArea();
        let axeXlpos = drawArea[0];
        let axeXrpos = drawArea[1];
        let axeYupos = drawArea[2];
        let axeYdpos = drawArea[3];

        let axes0x = axeXlpos;
        let axes0y = axeYdpos;
        let axesXx = axeXrpos;
        let axesXy = axeYdpos;
        let axesYx = axeXlpos;
        let axesYy = axeYupos;

        fill(DLI_GRAPH_COLOR_BG);
        noStroke();
        rect(axes0x + offx, axes0y + offy, axesXx - axes0x, axesYy - axes0y);
        stroke(DLI_GRAPH_STROKE_COLOR);

        line(axes0x + offx, axes0y + offy, axesXx + offx, axesXy + offy);
        line(axes0x + offx, axes0y + offy, axesYx + offx, axesYy + offy);
    }

    drawData(offx, offy, draw_mouse, mouse_x, mouse_y){

        let xData = this.data[0];
		let yData = [];

		let drawArea = this.getDrawArea();
		let gWidth = drawArea[1] - drawArea[0];
		let gHeight = drawArea[3] - drawArea[2];
        let actual_y_up = drawArea[3] - gHeight / 10;
        let actual_y_down = drawArea[2] + gHeight / 10;
		
        let mouse_y_data = 0;
        let mouse_x_data_pos = 0;
        let mouse_highlight_value = 0;
        let mouse_highlight_pos = 0;
        let min_mousedist = gWidth;

        let MinMaxDates = getMinMaxDate(xData);
        let minDate = MinMaxDates[0];
        let maxDate = MinMaxDates[1];

		let minVal = undefined;
		let maxVal = undefined;
		let y_diff = undefined;
			
		let rel_x_values = [];
		let rel_y_values = [];
		
        // var startTime = performance.now();
		for(let id = 1; id < this.data.length; id++){
			yData[id] = this.data[id];
			
			let tempMinVal = min(yData[id]);
			let tempMaxVal = max(yData[id]);
			
			if(minVal == undefined){
				minVal = tempMinVal;
			}
			if(maxVal == undefined){
				maxVal = tempMaxVal;
			}
			if (tempMinVal < minVal){
				minVal = tempMinVal;
			}
			if (tempMaxVal > maxVal){
				maxVal = tempMaxVal;
			}
			
			rel_y_values[id] = [];
		}
		
		y_diff = maxVal - minVal;
		

        // performance optimization
        // only every n_th number gets drawn. n is defined as the values per pixel. Such that for every pixel no more than ~1 value is drawn.
        let n = Math.ceil(xData.length / gWidth);

        for(let i = 0; i < xData.length / n; i++){
            let x_value = datetime_to_int(xData[i*n]);
            rel_x_values[i] = map_range(x_value, datetime_to_int(minDate), datetime_to_int(maxDate), drawArea[0], drawArea[1]);
			for(let id = 1; id < this.data.length; id++){
				rel_y_values[id][i] = map_range(yData[id][i*n], minVal, maxVal, actual_y_up, actual_y_down);
			}
            
			//TODO later
            if(Math.abs(Math.round(rel_x_values[i] + offx) - mouse_x) < min_mousedist){
                mouse_y_data = rel_y_values[i];
                mouse_x_data_pos = rel_x_values[i] + offx;
                mouse_highlight_pos = xData[i*n];
                mouse_highlight_value = yData[i*n];
                min_mousedist = Math.abs(Math.round(rel_x_values[i] + offx) - mouse_x)
            }
            //console.log(Math.round(rel_x_values[i]));
        }
        if(!Number.isInteger(xData.length / n)){ // to include the last number
            let x_value = datetime_to_int(xData[xData.length-1]);
            rel_x_values.push(map_range(x_value, datetime_to_int(minDate), datetime_to_int(maxDate), drawArea[0], drawArea[1]));
			for(let id = 1; id < this.data.length; id++){
				rel_y_values.push(map_range(yData[id][xData.length-1], minVal, maxVal, actual_y_up, actual_y_down));
			}
			//TODO later
            if(Math.abs(Math.round(rel_x_values[rel_x_values.length - 1] + offx) - mouse_x) < min_mousedist){
                mouse_y_data = rel_y_values[rel_x_values.length - 1];
                mouse_x_data_pos = rel_x_values[rel_x_values.length - 1] + offx;
                mouse_highlight_pos = xData[xData.length-1];
                mouse_highlight_value = yData[yData.length - 1];
            }
        }

        let prev_stroke_style = drawingContext.strokeStyle;
        let prev_fill_style = drawingContext.fillStyle;
		let grad = undefined;
		let color_pairs = undefined;
		
		for(let id = 1; id < this.data.length; id++){

			switch(this.line_color_style[id]){
				case DLI_STATIC_COLOR:
					stroke(this.line_color[id][0], this.line_color[id][1], this.line_color[id][2]);
					fill(this.line_color[id][0], this.line_color[id][1], this.line_color[id][2]);
					break;
				case DLI_REL_MAP_COLOR:
					grad = drawingContext.createLinearGradient(0, actual_y_down + offy, 0, actual_y_up + offy);
					color_pairs = this.color_map[id].getColorPairs();

					for(let i = 0; i < color_pairs.length; i++){
						grad.addColorStop(color_pairs[i][0], color_pairs[i][1]);
					};
					// grad.addColorStop(0.5, 'lime');
					// grad.addColorStop(0.25, 'yellow');
					// grad.addColorStop(0, 'red');
					// grad.addColorStop(0.75, 'blue');
					// grad.addColorStop(1, 'purple');
					drawingContext.strokeStyle = grad;
					drawingContext.fillStyle = grad;
					break;
				case DLI_ABS_MAP_COLOR:
					grad = drawingContext.createLinearGradient(0, actual_y_down + offy, 0, actual_y_up + offy);
					color_pairs = this.color_map[id].getColorPairs();

					for(let i = 0; i < color_pairs.length; i++){
						grad.addColorStop(1-map_range_hard(color_pairs[i][0], minVal, maxVal, 0, 1), color_pairs[i][1]);
					};
					drawingContext.strokeStyle = grad;
					drawingContext.fillStyle = grad;
					break;
			}

			//noFill();

			if(this.useContinousSpline[id]){
				if(rel_x_values.length > 1){
					beginShape();
					curveVertex(rel_x_values[0] + offx, rel_y_values[id][0] + offy);
					curveVertex(rel_x_values[0] + offx, rel_y_values[id][0] + offy);
					for(let i = 1; i < xData.length - 1; i++){
						curveVertex(rel_x_values[i] + offx, rel_y_values[id][i] + offy);
					}
					curveVertex(rel_x_values[xData.length - 1] + offx, rel_y_values[id][xData.length - 1] + offy);
					curveVertex(rel_x_values[xData.length - 1] + offx, rel_y_values[id][xData.length - 1] + offy);
					endShape();
				}
			}
			else{
				if(rel_x_values.length > 1){
					for(let i = 1; i < xData.length; i++){
						line(rel_x_values[i-1] + offx, rel_y_values[id][i-1] + offy, rel_x_values[i] + offx, rel_y_values[id][i] + offy);
					}
				}
			}
		}

		// TODO figure out later (maybe like a tooltip)
		draw_mouse = false;
		if(draw_mouse){
			if(this.drawAreaContains(mouse_x, mouse_y, offx, offy)){
				// draw dot
				ellipse(mouse_x_data_pos, mouse_y_data + offy, 10);

				drawingContext.strokeStyle = prev_stroke_style;
				drawingContext.fillStyle = prev_fill_style;
				stroke(0);

				let textY = drawArea[2] + offy - gHeight / 10;

				let height_diff = textY - mouse_y_data - offy - gHeight / 5;
				let pad = Math.abs(height_diff / 10);
				let textX = mouse_x_data_pos + height_diff;

				// setup text
				textAlign(LEFT);
				let text_size = max(this.height / 30, 10);
				textSize(text_size);
				fill(DLI_TEXT_DARKER_COLOR);
				stroke(DLI_TEXT_DARKER_COLOR);

				let highlight_text = trim_number_to_string(mouse_highlight_value) + " " + this.unit;
				let t_width = textWidth(highlight_text);

				// draw line
				stroke(0);
				line(mouse_x_data_pos + offx, drawArea[3] + offy, mouse_x_data_pos + offx, drawArea[3] - text_size + offy);
				stroke(DLI_TEXT_DARKER_COLOR);
				line(mouse_x_data_pos - pad - 3, mouse_y_data + offy - pad - 3, textX + t_width / 2 + pad, textY + pad);
				stroke(0);
				// draw value text
				text(highlight_text, textX, textY);

				// draw position text
				textAlign(CENTER);
				textX = mouse_x_data_pos
				textY = drawArea[3] + offy + gHeight / 10;
				text(mouse_highlight_pos, textX, textY);
			}
		}

		drawingContext.strokeStyle = prev_stroke_style;
		drawingContext.fillStyle = prev_fill_style;
		stroke(0);
		// var endTime = performance.now();
		// console.log(`${endTime - startTime} milliseconds for drawing ${this.axeNameY}`);
    }

    drawYLim(offx, offy){

        let yData = this.data[1];

        let drawArea = this.getDrawArea();
        let axeXlpos = drawArea[0];
        let axeXrpos = drawArea[1];
        let axeYupos = drawArea[2];
        let axeYdpos = drawArea[3];
        let gHeight = axeYdpos - axeYupos;

        //let minVal = Math.min(...yData);
        //let maxVal = Math.max(...yData);
		let minVal = min(yData);
		let maxVal = max(yData);

        let yTextX = max(this.posx + this.width / 15, axeXlpos - this.width / 100);

        textAlign(RIGHT);
        let text_size = max(this.height / 30, 10);
        textSize(text_size);
        fill(DLI_TEXT_DARKER_COLOR);

        text(trim_number_to_string(minVal) + " " + this.unit, yTextX + offx, drawArea[3] - gHeight / 10 + offy);
        text(trim_number_to_string(maxVal) + " " + this.unit, yTextX + offx, drawArea[2] + gHeight / 10 + offy);

    }

    drawAreaContains(mouse_x, mouse_y, offx, offy){
        let drawArea = this.getDrawArea();
        let axeXlpos = drawArea[0];
        let axeXrpos = drawArea[1];
        let axeYupos = drawArea[2];
        let axeYdpos = drawArea[3];
        return (mouse_x >= axeXlpos + offx && mouse_x <= axeXrpos + offx && mouse_y >= axeYupos + offy && mouse_y <= axeYdpos + offy);
    }
}
