class Titlebar{
    constructor(xpos, ypos, width, height, title){
        this.xpos = xpos;
        this.ypos = ypos;
        this.width = width;
        this.height = height;
        this.title = title;
    }

    draw(){
        fill(DLI_GRAPH_COLOR_BG);
        noStroke();
        rect(this.xpos + PADDING, this.ypos + PADDING, this.width - 2*PADDING, this.height - 2*PADDING, DLI_WIDGET_EDGE_RADIUS);

        textAlign(LEFT, CENTER);
        textSize(this.height * 0.35);
        fill(DLI_TEXT_COLOR);
        text(this.title, this.xpos + 3*PADDING, this.ypos + this.height / 2);
    }

    resize(xpos, ypos, width, height){
        this.xpos = xpos;
        this.ypos = ypos;
        this.width = width;
        this.height = height;
    }
}