function Widget(pos_array){
    this.posx = pos_array[0];
    this.posy = pos_array[1];
    this.width = pos_array[2];
    this.height = pos_array[3];
    this.gridSpanX = pos_array[4];
    this.gridSpanY = pos_array[5];
    this.gridPos = undefined;
    this.updatePending = true;

    // observer pattern, gets called by the observable
    this.notify = function(timestamps, values, name, datatype, unit){
        this.updatePending = true;
    };

    this.draw = function(offx, offy, mouse_x, mouse_y){
        if(this.updatePending){
            // drawingContext.shadowOffsetX = 5;
            // drawingContext.shadowOffsetY = 5;
            // drawingContext.shadowBlur = 2;
            // drawingContext.shadowColor = 'black';
            fill('#111921');
            rect(this.posx + offx, this.posy + offy, this.width, this.height, 20)
            this.updatePending = false;
        }
    };
};
