class Graph{
    constructor(posx, posy, width, height){
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
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

    resize(posx, posy, width, height){
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
    }

    setContinousSpline(isSpline){
        this.useContinousSpline = isSpline;
    }

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

        // var startTime = performance.now();
        let xData = this.data[0];
        let yData = this.data[1];

        let drawArea = this.getDrawArea();
        let gWidth = drawArea[1] - drawArea[0];
        let gHeight = drawArea[3] - drawArea[2];

        let MinMaxDates = getMinMaxDate(xData);
        let minDate = MinMaxDates[0];
        let maxDate = MinMaxDates[1];

        //minVal = Math.min(...yData);
        //maxVal = Math.max(...yData);
		let minVal = min(yData);
		let maxVal = max(yData);
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

        // performance optimization
        // only every n_th number gets drawn. n is defined as the values per pixel. Such that for every pixel no more than ~1 value is drawn.
        let n = Math.ceil(xData.length / gWidth);

        for(let i = 0; i < xData.length / n; i++){
            let x_value = datetime_to_int(xData[i*n]);
            rel_x_values[i] = map_range(x_value, datetime_to_int(minDate), datetime_to_int(maxDate), drawArea[0], drawArea[1]);
            rel_y_values[i] = map_range(yData[i*n], minVal, maxVal, actual_y_up, actual_y_down);
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
            rel_y_values.push(map_range(yData[xData.length-1], minVal, maxVal, actual_y_up, actual_y_down));
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

        switch(this.line_color_style){
            case DLI_STATIC_COLOR:
                stroke(this.line_color[0], this.line_color[1], this.line_color[2]);
                fill(this.line_color[0], this.line_color[1], this.line_color[2]);
                break;
            case DLI_REL_MAP_COLOR:
                grad = drawingContext.createLinearGradient(0, actual_y_down + offy, 0, actual_y_up + offy);
                color_pairs = this.color_map.getColorPairs();

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
                color_pairs = this.color_map.getColorPairs();

                for(let i = 0; i < color_pairs.length; i++){
                    grad.addColorStop(1-map_range_hard(color_pairs[i][0], minVal, maxVal, 0, 1), color_pairs[i][1]);
                };
                drawingContext.strokeStyle = grad;
                drawingContext.fillStyle = grad;
                break;
        }

        //noFill();

        if(this.useContinousSpline){
            if(rel_x_values.length > 1){
                beginShape();
                curveVertex(rel_x_values[0] + offx, rel_y_values[0] + offy);
                curveVertex(rel_x_values[0] + offx, rel_y_values[0] + offy);
                for(let i = 1; i < xData.length - 1; i++){
                    curveVertex(rel_x_values[i] + offx, rel_y_values[i] + offy);
                }
                curveVertex(rel_x_values[xData.length - 1] + offx, rel_y_values[xData.length - 1] + offy);
                curveVertex(rel_x_values[xData.length - 1] + offx, rel_y_values[xData.length - 1] + offy);
                endShape();
            }
        }
        else{
            if(rel_x_values.length > 1){
                for(let i = 1; i < xData.length; i++){
                    line(rel_x_values[i-1] + offx, rel_y_values[i-1] + offy, rel_x_values[i] + offx, rel_y_values[i] + offy);
                }
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
