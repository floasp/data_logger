class BarChart{

    constructor(posx, posy, width, height){
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
        this.orientation = "horizontal";
    }
	
    setOrientation(orientation){
        this.orientation = orientation;
    }

	// placement of axeNames depends on orientation and is not automatically updated when orientation is changed
    setData(data, axeNameX, axeNameY, unit){
        this.data = data;
        this.axeNameX = axeNameX;
        this.axeNameY = axeNameY;
        this.unit = unit;
    }

    setLineColor(color_array){
        this.line_color = color_array;
    }

    setLineColorStyle(style){
        this.line_color_style = style;
    }

    setColorMap(color_map){
        this.color_map = color_map;
    }

    draw(offx, offy, draw_mouse, mouse_x, mouse_y){
        // fill('#111921');
        // rect(posx + offx, posy + offy, width, height, 20)
        this.drawAxes(this.axeNameX, this.axeNameY, offx, offy);
        if(this.data != undefined && this.data[0] != undefined && this.data[1] != undefined){
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
        let yTextSize = Math.max(this.height / 20, 12);
        textSize(yTextSize);
        // fill(180, 200, 235);
        // fill(120, 130, 155);
        fill(145, 155, 180);

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
        let axes0y = axeYdpos
        let axesXx = axeXrpos;
        let axesXy = axeYdpos
        let axesYx = axeXlpos;
        let axesYy = axeYupos

        line(axes0x + offx, axes0y + offy, axesXx + offx, axesXy + offy);
        line(axes0x + offx, axes0y + offy, axesYx + offx, axesYy + offy);
    }

    drawData(offx, offy, draw_mouse, mouse_x, mouse_y){

		draw_mouse = false;
	
        // var startTime = performance.now();
        let xData = this.data[0];
        let yData = this.data[1];

        let drawArea = this.getDrawArea();
        let gWidth = drawArea[1] - drawArea[0];
        let gHeight = drawArea[3] - drawArea[2];

        let minX = this.min(xData);
        let maxX = this.max(xData);

        //minVal = Math.min(...yData);
        //maxVal = Math.max(...yData);
		let minVal = this.min(yData);
		let maxVal = this.max(yData);
        let y_diff = maxVal - minVal;
		
        let rel_x_values = [];
        let rel_y_values = [];

        let actual_y_up = drawArea[3] - gHeight / 10;
        let actual_y_down = drawArea[2] + gHeight / 10;

        let mouse_y_data = 0;
        let mouse_x_data_pos = 0;
        let mouse_highlight_value = 0;
        let mouse_highlight_pos = 0;
        let min_mousedist = gWidth;

        for(let i = 0; i < xData.length; i++){
            rel_x_values[i] = this.map_range(i, 0, xData.length, drawArea[0], drawArea[1]);
            rel_y_values[i] = this.map_range(yData[i], minVal, maxVal, 0, -gHeight);
            //if(draw_mouse && Math.abs(Math.round(rel_x_values[i] + offx) - mouse_x) < min_mousedist){
            //    mouse_y_data = rel_y_values[i];
            //    mouse_x_data_pos = rel_x_values[i] + offx;
            //    mouse_highlight_pos = xData[i];
            //    mouse_highlight_value = yData[i];
            //    min_mousedist = Math.abs(Math.round(rel_x_values[i] + offx) - mouse_x)
            //}
            //console.log(Math.round(rel_x_values[i]));
        }

        let prev_stroke_style = drawingContext.strokeStyle;
        let prev_fill_style = drawingContext.fillStyle;
		let grad = undefined;
		let color_pairs = undefined;

        switch(this.line_color_style){
            case DLI_STATIC_COLOR:
                stroke(this.line_color[0], this.line_color[1], this.line_color[2]);
                fill(this.line_color[0], this.line_color[1], this.line_color[2]);
                break;
            case DLI_REL_MAP_COLOR:
                grad = drawingContext.createLinearGradient(drawArea[1] + offx, 0, drawArea[0] + offx, 0);
                color_pairs = this.color_map.getColorPairs();

                for(let i = 0; i < color_pairs.length; i++){
                    grad.addColorStop(color_pairs[i][0], color_pairs[i][1]);
                };
                drawingContext.strokeStyle = grad;
                drawingContext.fillStyle = grad;
                break;
            case DLI_ABS_MAP_COLOR:
                grad = drawingContext.createLinearGradient(drawArea[1] + offx, 0, drawArea[0] + offx, 0);
                color_pairs = this.color_map.getColorPairs();

                for(let i = 0; i < color_pairs.length; i++){
                    grad.addColorStop(1-this.map_range_hard(color_pairs[i][0], minX, maxX, 0, 1), color_pairs[i][1]);
                };
                drawingContext.strokeStyle = grad;
                drawingContext.fillStyle = grad;
                break;
        }

        //noFill();

		if(rel_x_values.length > 1){
			for(let i = 0; i < xData.length; i++){
				
				let x = rel_x_values[i] + offx;
				let w = gWidth / rel_x_values.length;
				let y = drawArea[3] + offy;
				let h = (rel_y_values[i]);
				
				rect(x, y, w, h);
			}
		}

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
                let text_size = Math.max(this.height / 30, 10);
                textSize(text_size);
                fill(120, 130, 155);
                stroke(120, 130, 155);

                let highlight_text = this.trim_number_to_string(mouse_highlight_value) + " " + this.unit;
                let t_width = textWidth(highlight_text);

                // draw line
                stroke(0);
                line(mouse_x_data_pos + offx, drawArea[3] + offy, mouse_x_data_pos + offx, drawArea[3] - text_size + offy);
                stroke(120, 130, 155);
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
		let minVal = this.min(yData);
		let maxVal = this.max(yData);

        let yTextX = Math.max(this.posx + this.width / 15, axeXlpos - this.width / 100);

        textAlign(RIGHT);
        let text_size = Math.max(this.height / 30, 10);
        textSize(text_size);
        fill(120, 130, 155);

        text(this.trim_number_to_string(minVal), yTextX + offx, drawArea[3] - gHeight / 10 + offy);
        text(this.trim_number_to_string(maxVal), yTextX + offx, drawArea[2] + gHeight / 10 + offy);

    }

    drawAreaContains(mouse_x, mouse_y, offx, offy){
        let drawArea = this.getDrawArea();
        let axeXlpos = drawArea[0];
        let axeXrpos = drawArea[1];
        let axeYupos = drawArea[2];
        let axeYdpos = drawArea[3];
        return (mouse_x >= axeXlpos + offx && mouse_x <= axeXrpos + offx && mouse_y >= axeYupos + offy && mouse_y <= axeYdpos + offy);
    }

    trim_number_to_string(number){
        if(typeof(number) == "number" && number.toString().length > 6){
            number = number.toString().split(".");
            if(number[0].length >= 6){
                number = number[0];
            }
            else if (number.length > 1){
                let len = number[0].length;
                let float_len = number[1].length;
                number = number[0] + "." + number[1].substring(0, Math.min(float_len, 6-len));
            }
        }
		
        return number.toString();
    }

    map_range(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }
    map_range_hard(value, low1, high1, low2, high2) {
        return Math.max(Math.min(low2 + (high2 - low2) * (value - low1) / (high1 - low1), high2), low2);
    }


    max(numbers){
		let m = numbers[0];
		for(let i = 0; i < numbers.length; i++){
			if (numbers[i] > m){
				m = numbers[i]
			}
		}
		return m;
	}
    min(numbers){
		let m = numbers[0];
		for(let i = 0; i < numbers.length; i++){
			if (numbers[i] < m){
				m = numbers[i]
			}
		}
		return m;
	}
}