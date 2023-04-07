
var GRID_BASE_SIZE = 50;
var PADDING = GRID_BASE_SIZE / 20;

// makes GRID_BASE_SIZE so that the smaller side contains 8 Squares.
function setGridSize(windowWidth, windowHeight){
    GRID_BASE_SIZE = Math.floor(Math.min(windowWidth, windowHeight) / 6);
    PADDING = GRID_BASE_SIZE / 20;
}

function setup() {
    frameRate(10);
    createCanvas(windowWidth - 20, windowHeight - 20);

    setGridSize(windowWidth, windowHeight);

    // gwidget_air_temp = new GraphWidget(createWidgetSize(3, 2), undefined);
    // gwidget_air_pres = new GraphWidget(createWidgetSize(3, 2), undefined);
    // gwidget_air_humi = new GraphWidget(createWidgetSize(3, 2), undefined);
    // gwidget_air_eco2 = new GraphWidget(createWidgetSize(3, 2), undefined);
    // gwidget_air_tvoc = new GraphWidget(createWidgetSize(3, 2), undefined);

    gwidget_air_temp = new GraphWidget(createWidgetSize(7, 1), undefined);
    gwidget_air_pres = new GraphWidget(createWidgetSize(7, 1), undefined);
    gwidget_air_humi = new GraphWidget(createWidgetSize(7, 1), undefined);
    gwidget_air_eco2 = new GraphWidget(createWidgetSize(7, 1), undefined);
    gwidget_air_tvoc = new GraphWidget(createWidgetSize(7, 1), undefined);

    lvwidget_air_temp = new LatestValueWidget(createWidgetSize(1, 1), undefined);
    lvwidget_air_pres = new LatestValueWidget(createWidgetSize(1, 1), undefined);
    lvwidget_air_humi = new LatestValueWidget(createWidgetSize(1, 1), undefined);
    lvwidget_air_eco2 = new LatestValueWidget(createWidgetSize(1, 1), undefined);
    lvwidget_air_tvoc = new LatestValueWidget(createWidgetSize(1, 1), undefined);

    gwidget_air_temp.setLineColor([255, 0, 0]);
    gwidget_air_temp.setLineColorStyle(ABS_MAP_COLOR);
    temp_map = new ColorMap();
    temp_map.addColor(20, 'blue');
    temp_map.addColor(22.5, 'purple');
    temp_map.addColor(25, 'red');
    gwidget_air_temp.setColorMap(temp_map);

    gwidget_air_pres.setLineColor([255, 255, 0]);
    gwidget_air_humi.setLineColor([0, 255, 0]);
    gwidget_air_eco2.setLineColor([0, 255, 255]);

    gwidget_air_tvoc.setLineColor([0, 0, 255]);
    gwidget_air_tvoc.setLineColorStyle(REL_MAP_COLOR);
    tvoc_map = new ColorMap();
    tvoc_map.addColor(0, 'black');
    tvoc_map.addColor(1, 'white');
    gwidget_air_tvoc.setColorMap(tvoc_map);

    manager = new WidgetManager(windowWidth - 20, windowHeight - 20, GRID_BASE_SIZE)

    manager.addWidget(gwidget_air_temp, 0, 0)
    manager.addWidget(gwidget_air_pres, 0, 1)
    manager.addWidget(gwidget_air_humi, 0, 2)
    manager.addWidget(gwidget_air_eco2, 0, 3)
    manager.addWidget(gwidget_air_tvoc, 0, 4)
    // gwidget_air_temp.setContinousSpline(true);

    manager.addWidget(lvwidget_air_temp, 7, 0);
    manager.addWidget(lvwidget_air_pres, 7, 1);
    manager.addWidget(lvwidget_air_humi, 7, 2);
    manager.addWidget(lvwidget_air_eco2, 7, 3);
    manager.addWidget(lvwidget_air_tvoc, 7, 4);

    server_url = "http://asperger.home";

    dataSource_air = new DataSource(server_url);
    //dataSource_air.setupSource(48, "time", "from=2022-01-01 00:00:00&to=2022-12-31 23:59:59");
    dataSource_air.setupSource(48, "top", "top=50000");
    dataSource_air.addObserver(gwidget_air_temp, 0);
    dataSource_air.addObserver(gwidget_air_pres, 1);
    dataSource_air.addObserver(gwidget_air_humi, 2);
    dataSource_air.addObserver(gwidget_air_eco2, 3);
    dataSource_air.addObserver(gwidget_air_tvoc, 4);

    dataSource_air.addObserver(lvwidget_air_temp, 0);
    dataSource_air.addObserver(lvwidget_air_pres, 1);
    dataSource_air.addObserver(lvwidget_air_humi, 2);
    dataSource_air.addObserver(lvwidget_air_eco2, 3);
    dataSource_air.addObserver(lvwidget_air_tvoc, 4);

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
};

function windowResized() {
    resizeCanvas(windowWidth - 20, windowHeight - 20);
};
