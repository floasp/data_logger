class NGraphWidget{
    constructor(pos_array, data){
        this.posx = pos_array[0];
        this.posy = pos_array[1];
        this.width = pos_array[2];
        this.height = pos_array[3];
        this.gridSpanX = pos_array[4];
        this.gridSpanY = pos_array[5];
        this.gridPos = undefined;
        this.updatePending = true;
        this.name = "";
        this.datatype = "";
        this.typename = "";
        this.unit = "";
        this.axeNameX = "";
        this.axeNameY = "";
        this.prev_mouseX = 0;
        this.prev_mouseY = 0;

        this.graph = new NGraphUnitTime(this.posx + 20, this.posy + 20, this.width - 40, this.height - 40);
        this.graph.setData(data, this.axeNameX, this.axeNameY, this.unit);
    }

    // observer pattern, gets called by the observable
    notify(timestamps, values_array, name, datatype, unit, typename){
        this.name = name;
        this.datatype = datatype;
        this.typename = typename;
        this.unit = unit;
        this.axeNameX = timestamps[0] + " - " + timestamps[timestamps.length-1];
        this.axeNameY = datatype;
		
        let data = [timestamps];
		for(let id = 0; id < values_array.length; id++){
			data.push(values_array[id]);
		}
		
        this.graph.setData(data, this.axeNameX, this.axeNameY, this.unit);
        this.updatePending = true;
        //console.log([timestamps, values]);
    }

    setContinousSpline(isSpline){
        this.graph.setContinousSpline(isSpline);
    }

    setData(data){
        this.graph.setData(data);
    }

    setLineColor(color_array){
        this.graph.setLineColor(color_array);
    }

    setLineColorStyle(style){
        this.graph.setLineColorStyle(style);
    }

    setColorMap(color_map){
        this.graph.setColorMap(color_map);
    }

    draw(offx, offy, mouse_x, mouse_y){
        let draw_mouse = this.contains(mouse_x - offx, mouse_y - offy);
        if(this.updatePending || draw_mouse && (this.prev_mouseX != mouse_x || this.prev_mouseY != mouse_y)){
            fill(DLI_WIDGET_COLOR_BG);
            if(!DLI_WIDGET_HAS_BORDER){
                noStroke();
            }
            rect(this.posx + offx, this.posy + offy, this.width, this.height, DLI_WIDGET_EDGE_RADIUS);
            stroke(0, 0, 0);
            // noFill();
            // rect(posx + offx + 20, posy + offx + 20, width - 40, height - 40);

            textAlign(CENTER);
            textSize(this.height / 15);
            fill(DLI_TEXT_COLOR);
            text(this.name + " - " + this.typename, this.posx + this.width / 2 + offx, this.posy + this.height / 7 + offy);

            this.graph.draw(offx, offy, draw_mouse, mouse_x, mouse_y);

            this.updatePending = false;
            this.prev_mouseX = mouse_x;
            this.prev_mouseY = mouse_y;
        }
    }

    contains(mouse_x, mouse_y){
        return (mouse_x >= this.posx && mouse_x <= this.posx + this.width && mouse_y >= this.posy && mouse_y <= this.posy + this.height);
    }
}
