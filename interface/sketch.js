
var GRID_BASE_SIZE = 50;
var PADDING = GRID_BASE_SIZE / 20;

// makes GRID_BASE_SIZE so that the smaller side contains 8 Squares.
function setGridSize(windowWidth, windowHeight){
    if(windowWidth > windowHeight){
        GRID_BASE_SIZE = Math.floor(windowWidth / 20);
        PADDING = GRID_BASE_SIZE / 20;
        this.layout = new DesktopLayout();
    }
    else{
        GRID_BASE_SIZE = Math.floor(windowWidth / 10);
        PADDING = GRID_BASE_SIZE / 20;
        this.layout = new MobileLayout();
    }
}

function setup() {
    document.body.style.background = DLI_COLOR_BG;
    frameRate(10);
    createCanvas(windowWidth - 20, windowHeight - 20);

    setGridSize(windowWidth - 20, windowHeight - 20);

    manager = new WidgetManager(windowWidth - 20, windowHeight - 20, GRID_BASE_SIZE)

    // layout = new DesktopLayout();
    this.layout.addToManager(manager);

    server_url = "server url";

    dataSource_air = new DataSource(server_url);
    dataSource_air.setupSource(48, "time", "from=2023-06-01 00:00:00&to=2024-12-31 23:59:59");
    //dataSource_air.setupSource(48, "time", "from=2023-05-01 00:00:00&to=2024-12-31 23:59:59");
    //dataSource_air.setupSource(48, "top", "top=50000");

    this.layout.setupDatasource(dataSource_air);
	
    sourceManager = new SourceManager();
    sourceManager.addSource(dataSource_air);
}

function createWidgetSize(gridSpanX, gridSpanY){
    widgetWidth = GRID_BASE_SIZE - 2 * PADDING;
    return [PADDING, PADDING, widgetWidth + (gridSpanX-1) * GRID_BASE_SIZE, widgetWidth + (gridSpanY-1) * GRID_BASE_SIZE, gridSpanX, gridSpanY]
}

function draw() {
    manager.drawAll(mouseX, mouseY);

    sourceManager.nextStep();
}

function windowResized() {
    clear();
    resizeCanvas(windowWidth - 20, windowHeight - 20);
    manager.clearWidgets();
    setGridSize(windowWidth - 20, windowHeight - 20);
    manager = new WidgetManager(windowWidth - 20, windowHeight - 20, GRID_BASE_SIZE)
    this.layout.addToManager(manager);
    dataSource_air = new DataSource(server_url);
    dataSource_air.setupSource(48, "time", "from=2023-06-01 00:00:00&to=2024-12-31 23:59:59");
    this.layout.setupDatasource(dataSource_air);
    sourceManager.reloadDescription();
    sourceManager = new SourceManager();
    sourceManager.addSource(dataSource_air);
}
