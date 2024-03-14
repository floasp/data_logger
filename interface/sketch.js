
var GRID_BASE_SIZE_X = 50;
var GRID_BASE_SIZE_Y = 50;
var PADDING = GRID_BASE_SIZE_X / 20;
var GRID_NCOLS = 20;
var GRID_NROWS = 10;

var fullWidth;
var fullHeight;
var titleHeight;
var titleWidth;
var drawWidth;
var drawHeight;

let titlebar;
let drawArea;
let dataSource_air;
let dataSource_temhum;
let sourceManager;
let layout;
let layoutchange = false;

function calculateSizes(windowWidth, windowHeight){
    fullWidth = windowWidth - 40;
    fullHeight = windowHeight - 20;
    titleWidth = fullWidth;
    drawWidth = fullWidth;

    if(windowWidth > windowHeight){
        titleHeight = fullHeight / 20;
        drawHeight = fullHeight - titleHeight;
        GRID_NCOLS = 20;
        GRID_NROWS = 10;

        GRID_BASE_SIZE_X = Math.floor(drawWidth / GRID_NCOLS);
        GRID_BASE_SIZE_Y = Math.floor(drawHeight / GRID_NROWS);
        PADDING = GRID_BASE_SIZE_X / 20;
        if (layout instanceof DesktopLayout){
            layoutchange = false;
        }
        else{
            layoutchange = true;
        }
        layout = new DesktopLayout();
    }
    else{
        titleHeight = fullWidth / 20;
        drawHeight = fullHeight - titleHeight;
        GRID_NCOLS = 10;
        GRID_NROWS = 20;

        GRID_BASE_SIZE_X = Math.floor(drawWidth / GRID_NCOLS);
        GRID_BASE_SIZE_Y = Math.floor(drawHeight / GRID_NROWS);
        PADDING = GRID_BASE_SIZE_X / 20;
        if (layout instanceof MobileLayout){
            layoutchange = false;
        }
        else{
            layoutchange = true;
        }
        layout = new MobileLayout();
    }
}

function setup() {
    document.body.style.background = DLI_COLOR_BG;
    frameRate(10);

    calculateSizes(windowWidth, windowHeight);
    createCanvas(fullWidth, fullHeight);

    titlebar = new Titlebar(0, 0, titleWidth, titleHeight, "Data-Logger Interface");
    manager = new WidgetManager(drawWidth, drawHeight, GRID_BASE_SIZE_X, GRID_BASE_SIZE_Y);
    drawArea = new DrawArea(0, titleHeight, drawWidth, drawHeight, manager);

    layout.addToManager(manager);

    server_url = "server url";

    dataSource_air = new DataSource(server_url);
    dataSource_air.setupSource(48, "time", "from=2023-06-01 00:00:00&to=2024-12-31 23:59:59");
    //dataSource_air.setupSource(48, "time", "from=2023-05-01 00:00:00&to=2024-12-31 23:59:59");
    //dataSource_air.setupSource(48, "top", "top=50000");

    dataSource_temhum = new DataSource(server_url);
    dataSource_temhum.setupSource(50, "top", "top=1440");

    layout.setupDatasource(dataSource_air, dataSource_temhum);
	
    sourceManager = new SourceManager();
    sourceManager.addSource(dataSource_air);
    sourceManager.addSource(dataSource_temhum);
}

function draw() {
    titlebar.draw();
    drawArea.draw(mouseX, mouseY);

    sourceManager.nextStep();
}

function windowResized() {
    clear();
    calculateSizes(windowWidth, windowHeight);
    resizeCanvas(fullWidth, fullHeight);
    
    if(layoutchange){
        manager.clearWidgets();
        layout.addToManager(manager);
        layout.clearDataSources(dataSource_air, dataSource_temhum);
        layout.setupDatasource(dataSource_air, dataSource_temhum);
    }

    titlebar.resize(0, 0, titleWidth, titleHeight);
    drawArea.resize(0, titleHeight, drawWidth, drawHeight);
    drawArea.draw(mouseX, mouseY);
}
