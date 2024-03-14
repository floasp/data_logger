class Widget{
    constructor(){
        this.posx = 0;
        this.posy = 0;
        this.width = 0;
        this.height = 0;
        this.updatePending = true;
    }

    // observer pattern, gets called by the observable
    notify(timestamps, values, name, datatype, unit, typename){
        this.updatePending = true;
    }

    draw(offx, offy, mouse_x, mouse_y){
        if(this.updatePending){
            // drawingContext.shadowOffsetX = 5;
            // drawingContext.shadowOffsetY = 5;
            // drawingContext.shadowBlur = 2;
            // drawingContext.shadowColor = 'black';
            fill(DLI_WIDGET_COLOR_BG);
            if(!DLI_WIDGET_HAS_BORDER){
                noStroke();
            }
            rect(this.posx + offx, this.posy + offy, this.width, this.height, DLI_WIDGET_EDGE_RADIUS);
            stroke(0, 0, 0);
            this.updatePending = false;
        }
    }

    resize(posx, posy, width, height){
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
    }
}
