function WidgetManager(canSizex, canSizey, basesize){
    const GRID_BASE_SIZE = basesize; // 200
    const PADDING = basesize / 20; // 10

    this.x_count = int(canSizex/GRID_BASE_SIZE);
    this.y_count = int(canSizey/GRID_BASE_SIZE);

    this.grid = new Array(this.x_count);

    for(var x = 0; x < this.x_count; x++){
        this.grid[x] = [];
        for(var y = 0; y < this.y_count; y++){
            this.grid[x][y] = new WidgetContainer();
        }
    }

    this.addWidget = function(widget, gridx, gridy){
        let sizex = widget.gridSpanX;
        let sizey = widget.gridSpanY;
        if(gridx >= 0 && gridy >= 0 && gridx + sizex - 1 < this.x_count && gridy + sizey - 1 < this.y_count){
            if(this.grid[gridx][gridy].isFree()){
                if(sizex == 1 && sizey == 1){
                    this.grid[gridx][gridy].widget = widget;
                }
                else{
                    let free = true;
                    for(let y = 0; y < this.sizey; y++){
                        for(let x = 0; x < this.sizex; x++){
                            free &= this.grid[gridx + x][gridy + y];
                        }
                    }

                    if(free){
                        for(let y = 0; y < sizey; y++){
                            for(let x = 0; x < sizex; x++){
                                this.grid[gridx + x][gridy + y].setReserved();
                            }
                        }
                        this.grid[gridx][gridy].widget = widget;
                    }
                    else{
                        console.log("Failed to add widget. Space already used.");
                    }
                }
            }
            else{
                console.log("Failed to add widget. Space already used.");
            }
        }
    };

    this.removeWidget = function(x, y){
        let ylim = y+1;
        while(this.grid[x][ylim].reserved == true && this.grid[x][ylim].widget == undefined){
            ylim++;
        }
        ylim--;
        let xlim = x+1;
        while(this.grid[xlim][y].reserved == true && this.grid[xlim][y].widget == undefined){
            xlim++;
        }
        xlim--;

        for(let yy = y; yy < ylim+1; yy++){
            for(let xx = x; xx < xlim+1; xx++){
                this.grid[xx][yy].setFree();
            }
        }
    };

    this.drawWidget = function(x, y, mouse_x, mouse_y){
        if(this.grid[x][y].isWidget()){
            this.grid[x][y].draw(GRID_BASE_SIZE * x, GRID_BASE_SIZE * y, mouse_x, mouse_y);
        }
    };

    this.drawAll = function(mouse_x, mouse_y){
        for(let y = 0; y < this.y_count; y++){
            for(let x = 0; x < this.x_count; x++){
                this.drawWidget(x, y, mouse_x, mouse_y);
            }
        }
    };

    this.windowResize = function(canSizex, canSizey){

    };
};

function WidgetContainer(){
    this.widget = undefined;
    this.reserved = false;

    this.isFree = function(){
        return (this.widget == undefined && !this.reserved);
    };

    this.isWidget = function(){
        return this.widget != undefined;
    };

    this.setReserved = function(){
        this.reserved = true;
        this.widget = undefined;
    };

    this.setFree = function(){
        this.reserved = false;
        this.widget = undefined;
    };

    this.draw = function(offx, offy, mouse_x, mouse_y){
        this.widget.draw(offx, offy, mouse_x, mouse_y);
    };
}
