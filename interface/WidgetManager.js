
class WidgetManager{
    constructor(){
        // const GRID_BASE_SIZE = basesize; // 200
        // const PADDING = basesize / 20; // 10

        this.x_count = GRID_NCOLS;
        this.y_count = GRID_NROWS;

        this.grid = new Array(this.x_count);

        for(let x = 0; x < this.x_count; x++){
            this.grid[x] = [];
            for(let y = 0; y < this.y_count; y++){
                this.grid[x][y] = new WidgetContainer(x, y, 1, 1);
            }
        }
    }

    addWidget(widget, gridx, gridy, gridsizex, gridsizey){
        let sizex = gridsizex;
        let sizey = gridsizey;

        let widgetSize = createWidgetSize(sizex, sizey);
        widget.resize(widgetSize[0], widgetSize[1], widgetSize[2], widgetSize[3]);

        // resize grid if widget is out of current bounds
        if(gridx >= 0 && gridy >= 0){
            let xdiff = (gridx + sizex) - this.x_count;
            let ydiff = (gridy + sizey) - this.y_count;
            if(xdiff > 0){
                resizeCanvas(width + xdiff * GRID_BASE_SIZE_X, height);
                for(let x = this.x_count; x < this.x_count + xdiff; x++){
                    this.grid[x] = [];
                    for(let y = 0; y < this.y_count; y++){
                        this.grid[x][y] = new WidgetContainer(x, y, 1, 1);
                    }
                }
                this.x_count += xdiff;
            }
            if(ydiff > 0){
                resizeCanvas(width, height + ydiff * GRID_BASE_SIZE_Y);
                for(let x = 0; x < this.x_count; x++){
                    for(let y = this.y_count; y < this.y_count + ydiff; y++){
                        this.grid[x][y] = new WidgetContainer(x, y, 1, 1);
                    }
                }
                this.y_count += ydiff;
            }
        }
        if(gridx >= 0 && gridy >= 0 && gridx + sizex - 1 < this.x_count && gridy + sizey - 1 < this.y_count){
            if(this.grid[gridx][gridy].isFree()){
                if(sizex == 1 && sizey == 1){
                    this.grid[gridx][gridy].gw = sizex;
                    this.grid[gridx][gridy].gh = sizey;
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
                        this.grid[gridx][gridy].gw = sizex;
                        this.grid[gridx][gridy].gh = sizey;
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
    }

    removeWidget(x, y){
        let ylim = y+1;
        while(this.grid[x][ylim] != undefined && this.grid[x][ylim].reserved == true && this.grid[x][ylim].widget == undefined){
            ylim++;
        }
        ylim--;
        let xlim = x+1;
        while(this.grid[xlim] != undefined && this.grid[xlim][y].reserved == true && this.grid[xlim][y].widget == undefined){
            xlim++;
        }
        xlim--;

        for(let yy = y; yy < ylim+1; yy++){
            for(let xx = x; xx < xlim+1; xx++){
                this.grid[xx][yy].setFree();
            }
        }
    }

    drawWidget(x, y, mouse_x, mouse_y, offx, offy){
        if(this.grid[x][y].isWidget()){
            this.grid[x][y].draw(GRID_BASE_SIZE_X * x + offx, GRID_BASE_SIZE_Y * y + offy, mouse_x, mouse_y);
        }
    }

    drawAll(mouse_x, mouse_y, offx, offy){
        for(let y = 0; y < this.y_count; y++){
            for(let x = 0; x < this.x_count; x++){
                this.drawWidget(x, y, mouse_x, mouse_y, offx, offy);
            }
        }
    }

    resize(){
        for(let y = 0; y < this.y_count; y++){
            for(let x = 0; x < this.x_count; x++){
                this.grid[x][y].resize();
            }
        }
    }

    clearWidgets(){
        for(let y = 0; y < this.y_count; y++){
            for(let x = 0; x < this.x_count; x++){
                this.removeWidget(x, y);
            }
        }
    }
}

class WidgetContainer{
    constructor(gx, gy, gw, gh){
        this.widget = undefined;
        this.reserved = false;
        this.gx = gx;
        this.gy = gy;
        this.gw = gw;
        this.gh = gh;
    }
    
    resize(){
        if (this.widget != undefined){
            let widgetSize = createWidgetSize(this.gw, this.gh);
            this.widget.resize(widgetSize[0], widgetSize[1], widgetSize[2], widgetSize[3]);
            this.widget.updatePending = true;
        }
    }

    isFree(){
        return (this.widget == undefined && !this.reserved);
    }

    isWidget(){
        return this.widget != undefined;
    }

    setReserved(){
        this.reserved = true;
        this.widget = undefined;
    }

    setFree(){
        this.reserved = false;
        this.widget = undefined;
        this.gw = 1;
        this.gh = 1;
    }

    draw(offx, offy, mouse_x, mouse_y){
        this.widget.draw(offx, offy, mouse_x, mouse_y);
    }
}
