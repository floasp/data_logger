
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

    toUpdate = [];
    updateAll = true;

    // testXData = ["2020-12-31 19:00:00",
    //             "2020-12-31 20:01:01",
    //             "2020-12-31 21:02:02",
    //             "2020-12-31 22:03:03",
    //             "2020-12-31 23:04:04",
    //             "2021-01-01 00:05:05",
    //             "2021-01-01 01:06:06",
    //             "2021-01-01 02:07:07",
    //             "2021-01-01 03:08:08",
    //             "2021-01-01 04:09:09"];
    //
    // testYData = [10, 7, 5, 4, 3, 3, 4, 5, 7, 10];
    // testData = [testXData, testYData];

    // widget1 = new Widget(createWidgetSize(1, 1));
    // widget2 = new Widget(createWidgetSize(2, 1));
    // widget3 = new Widget(createWidgetSize(2, 2));
    // widget4 = new Widget(createWidgetSize(2, 3));

    // gwidget = new GraphWidget(createWidgetSize(2, 2), testData);
    // gwidget2 = new GraphWidget(createWidgetSize(3, 2), undefined);
    // gwidget3 = new GraphWidget(createWidgetSize(3, 2), undefined);

    // gwidget_air_temp = new GraphWidget(createWidgetSize(3, 2), undefined);
    // gwidget_air_pres = new GraphWidget(createWidgetSize(3, 2), undefined);
    // gwidget_air_humi = new GraphWidget(createWidgetSize(3, 2), undefined);
    // gwidget_air_eco2 = new GraphWidget(createWidgetSize(3, 2), undefined);
    // gwidget_air_tvoc = new GraphWidget(createWidgetSize(3, 2), undefined);

    gwidget_air_temp = new GraphWidget(createWidgetSize(8, 1), undefined);
    gwidget_air_pres = new GraphWidget(createWidgetSize(8, 1), undefined);
    gwidget_air_humi = new GraphWidget(createWidgetSize(8, 1), undefined);
    gwidget_air_eco2 = new GraphWidget(createWidgetSize(8, 1), undefined);
    gwidget_air_tvoc = new GraphWidget(createWidgetSize(8, 1), undefined);

    gwidget_air_temp.setLineColor([255, 0, 0]);
    gwidget_air_pres.setLineColor([255, 255, 0]);
    gwidget_air_humi.setLineColor([0, 255, 0]);
    gwidget_air_eco2.setLineColor([0, 255, 255]);
    gwidget_air_tvoc.setLineColor([0, 0, 255]);

    manager = new WidgetManager(windowWidth - 20, windowHeight - 20, GRID_BASE_SIZE)
    // manager.addWidget(widget1, 0, 0)
    // manager.addWidget(widget1, 0, 1)
    // manager.addWidget(widget1, 1, 0)
    // manager.addWidget(widget1, 1, 1)
    // manager.addWidget(widget2, 2, 0)
    // manager.addWidget(widget3, 0, 2)
    // manager.addWidget(widget4, 2, 1)

    // manager.removeWidget(0, 0);
    // manager.removeWidget(1, 0);
    // manager.removeWidget(0, 1);
    // manager.removeWidget(1, 1);
    // manager.removeWidget(2, 1);
    // manager.removeWidget(2, 0);

    // manager.addWidget(gwidget, 0, 0)
    // manager.addWidget(gwidget2, 2, 0)
    // manager.addWidget(gwidget3, 5, 0)
    manager.addWidget(gwidget_air_temp, 0, 0)
    manager.addWidget(gwidget_air_pres, 0, 1)
    manager.addWidget(gwidget_air_humi, 0, 2)
    manager.addWidget(gwidget_air_eco2, 0, 3)
    manager.addWidget(gwidget_air_tvoc, 0, 4)
    // gwidget2.setContinousSpline(true);
    // gwidget_air_temp.setContinousSpline(true);

    server_url = "http://asperger.home";

    // dataSource2 = new DataSource("http://asperger.home/api/getValues.php?sensorID=45&filter=top&top=9");
    // dataSource2 = new DataSource(server_url);
    // dataSource2.setupSource(45, "top", "top=9");
    // dataSource2.addObserver(gwidget2, 0);

    // dataSource3 = new DataSource("http://asperger.home/api/getValues.php?sensorID=44&filter=top&top=4");
    // dataSource3 = new DataSource(server_url);
    // dataSource3.setupSource(44, "top", "top=4");
    // dataSource3.addObserver(gwidget3, 0);

    dataSource_air = new DataSource(server_url);
    dataSource_air.setupSource(48, "time", "from=2022-01-01 00:00:00&to=2022-12-31 23:59:59");
    //dataSource_air.setupSource(48, "top", "top=4");
    dataSource_air.addObserver(gwidget_air_temp, 0);
    dataSource_air.addObserver(gwidget_air_pres, 1);
    dataSource_air.addObserver(gwidget_air_humi, 2);
    dataSource_air.addObserver(gwidget_air_eco2, 3);
    dataSource_air.addObserver(gwidget_air_tvoc, 4);

    sourceManager = new SourceManager();
    // sourceManager.addSource(dataSource2);
    // sourceManager.addSource(dataSource3);
    sourceManager.addSource(dataSource_air);
}

function createWidgetSize(gridSpanX, gridSpanY){
    widgetWidth = GRID_BASE_SIZE - 2 * PADDING;
    return [PADDING, PADDING, widgetWidth + (gridSpanX-1) * GRID_BASE_SIZE, widgetWidth + (gridSpanY-1) * GRID_BASE_SIZE, gridSpanX, gridSpanY]
}

function draw() {
    manager.drawAll();

    sourceManager.nextStep();
};

function windowResized() {
    resizeCanvas(windowWidth - 20, windowHeight - 20);
};
