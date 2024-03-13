class LatestValueWidget{
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
        this.value = undefined;
        this.timestamp = undefined;

        this.colorstyle = DLI_STATIC_COLOR;
        this.color = DLI_TEXT_COLOR;
        this.colormap = undefined;
    }

    // observer pattern, gets called by the observable
    notify(timestamps, values, name, datatype, unit, typename){
        this.name = name;
        this.datatype = datatype;
        this.typename = typename;
        this.unit = unit;
        this.axeNameX = timestamps[0] + " - " + timestamps[timestamps.length-1];
        this.axeNameY = datatype;
        let data = [timestamps, values];
        if(values != undefined){
            this.value = values[values.length - 1];
        }
        this.timestamp = timestamps[timestamps.length - 1];
        // this.graph.setData(data, this.axeNameX, this.axeNameY, this.unit);
        this.updatePending = true;
        //console.log([timestamps, values]);
    }

    setLineColorArr(color_array){
        this.color = rgbToHex(color_array[0], color_array[1], color_array[2]);
    }
    setLineColor(color_hex_str){
        this.color = color_hex_str;
    }

    setLineColorStyle(style){
        this.colorstyle = style;
    }

    setColorMap(color_map){
        this.colormap = color_map;
    }

    draw(offx, offy, mouse_x, mouse_y){
        // let draw_mouse = this.contains(mouse_x - offx, mouse_y - offy);
        if(this.updatePending){
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
            text(this.typename, this.posx + this.width / 2 + offx, this.posy + this.height / 7 + offy);

            if(this.value != undefined){
            // fill(180, 200, 235);
            // fill(120, 130, 155);
                fill(DLI_TEXT_SMALL_COLOR);
                textSize(this.height / 10);
                text(this.datatype, this.posx + this.width / 2 + offx, this.posy + this.height / 11 * 4  + offy);
                
                switch(this.colorstyle){
                    case DLI_STATIC_COLOR:
                        fill(this.color);
                        break;
                    case DLI_ABS_MAP_COLOR:
                        fill(this.colormap.getColor(this.value));
                        break;
                }
                textSize(this.height / 5);
                text(this.trim_number_to_string(this.value) + " " + this.unit, this.posx + this.width / 2 + offx, this.posy + this.height / 5 * 3 + offy);
                fill(DLI_TEXT_SMALL_COLOR);
                textSize(this.height / 15);
                text(this.timestamp, this.posx + this.width / 2 + offx, this.posy + this.height / 5 * 4 + offy);
            }


            this.updatePending = false;
        }
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

    contains(mouse_x, mouse_y){
        return (mouse_x >= this.posx && mouse_x <= this.posx + this.width && mouse_y >= this.posy && mouse_y <= this.posy + this.height);
    }
}
