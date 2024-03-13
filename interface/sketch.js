
var GRID_BASE_SIZE_X = 50;
var GRID_BASE_SIZE_Y = 50;
var PADDING = GRID_BASE_SIZE_X / 20;

var fullWidth;
var fullHeight;
var titleHeight;
var titleWidth;
var drawWidth;
var drawHeight;

function calculateSizes(windowWidth, windowHeight){
    fullWidth = windowWidth - 40;
    fullHeight = windowHeight - 20;
    titleWidth = fullWidth;
    drawWidth = fullWidth;

    if(windowWidth > windowHeight){
        titleHeight = fullHeight / 20;
        drawHeight = fullHeight - titleHeight;

        GRID_BASE_SIZE_X = Math.floor(drawWidth / 20);
        GRID_BASE_SIZE_Y = Math.floor(drawHeight / 10);
        PADDING = GRID_BASE_SIZE_X / 20;
        this.layout = new DesktopLayout();
    }
    else{
        titleHeight = fullWidth / 20;
        drawHeight = fullHeight - titleHeight;

        GRID_BASE_SIZE_X = Math.floor(drawWidth / 10);
        GRID_BASE_SIZE_Y = Math.floor(drawHeight / 20);
        PADDING = GRID_BASE_SIZE_X / 20;
        this.layout = new MobileLayout();
    }
}

let titlebar;
let drawArea;

function setup() {
    document.body.style.background = DLI_COLOR_BG;
    frameRate(10);

    calculateSizes(windowWidth, windowHeight);

    createCanvas(fullWidth, fullHeight);

    titlebar = new Titlebar(0, 0, titleWidth, titleHeight, "Data-Logger Interface");

    //setGridSize(actualwidth, actualHeight);

    manager = new WidgetManager(drawWidth, drawHeight, GRID_BASE_SIZE_X, GRID_BASE_SIZE_Y);
    
    drawArea = new DrawArea(0, titleHeight, drawWidth, drawHeight, manager);

    // layout = new DesktopLayout();
    this.layout.addToManager(manager);

    server_url = "server url";

    dataSource_air = new DataSource(server_url);
    dataSource_air.setupSource(48, "time", "from=2023-06-01 00:00:00&to=2024-12-31 23:59:59");
    //dataSource_air.setupSource(48, "time", "from=2023-05-01 00:00:00&to=2024-12-31 23:59:59");
    //dataSource_air.setupSource(48, "top", "top=50000");

    dataSource_temhum = new DataSource(server_url);
    dataSource_temhum.setupSource(50, "top", "top=1440");

    this.layout.setupDatasource(dataSource_air, dataSource_temhum);
	
    sourceManager = new SourceManager();
    sourceManager.addSource(dataSource_air);
    sourceManager.addSource(dataSource_temhum);
}

function createWidgetSize(gridSpanX, gridSpanY){
    widgetWidth = GRID_BASE_SIZE_X - 2 * PADDING;
    widgetHeight = GRID_BASE_SIZE_Y - 2 * PADDING;
    return [PADDING, PADDING, widgetWidth + (gridSpanX-1) * GRID_BASE_SIZE_X, widgetHeight + (gridSpanY-1) * GRID_BASE_SIZE_Y, gridSpanX, gridSpanY]
}

function draw() {
    titlebar.draw();
    //manager.drawAll(mouseX, mouseY);
    drawArea.draw(mouseX, mouseY);

    sourceManager.nextStep();
}

// that's fucked up. but it works. also I should definitely rewrite this (someday)
function windowResized() {
    //clear();
    calculateSizes(windowWidth, windowHeight);
    resizeCanvas(fullWidth, fullHeight);
    manager.clearWidgets();
    //setGridSize(actualwidth, actualHeight);

    titlebar = new Titlebar(0, 0, titleWidth, titleHeight, "Data-Logger Interface");
    manager = new WidgetManager(drawWidth, drawHeight, GRID_BASE_SIZE_X, GRID_BASE_SIZE_Y);
    drawArea = new DrawArea(0, titleHeight, drawWidth, drawHeight, manager);

    this.layout.addToManager(manager);
    dataSource_air = new DataSource(server_url);
    dataSource_air.setupSource(48, "time", "from=2023-06-01 00:00:00&to=2024-12-31 23:59:59");
    dataSource_temhum = new DataSource(server_url);
    dataSource_temhum.setupSource(50, "time", "from=2023-06-01 00:00:00&to=2024-12-31 23:59:59");
    this.layout.setupDatasource(dataSource_air, dataSource_temhum);
    sourceManager.reloadDescription();
    sourceManager = new SourceManager();
    sourceManager.addSource(dataSource_air);
    sourceManager.addSource(dataSource_temhum);
    clear();
}
