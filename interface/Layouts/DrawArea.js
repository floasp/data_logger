class DrawArea{
    constructor(xpos, ypos, width, height, widgetManager){
        this.xpos = xpos;
        this.ypos = ypos;
        this.width = width;
        this.height = height;
        this.widgetManager = widgetManager;
    }

    draw(mousex, mousey){
        fill(DLI_GRAPH_COLOR_BG);
        noStroke();
        this.widgetManager.drawAll(mousex, mousey, this.xpos, this.ypos);
    }
}