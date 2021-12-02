
var GRID_BASE_SIZE = 50;
var PADDING = GRID_BASE_SIZE / 20;

// makes GRID_BASE_SIZE so that the smaller side contains 8 Squares.
function setGridSize(windowWidth, windowHeight){
    GRID_BASE_SIZE = Math.floor(Math.min(windowWidth, windowHeight) / 8);
    PADDING = GRID_BASE_SIZE / 20;
}

function setup() {
    frameRate(10);
    createCanvas(windowWidth - 20, windowHeight - 20);

    setGridSize(windowWidth, windowHeight);

    toUpdate = [];
    updateAll = true;

    testXData = ["2020-12-31 19:00:00",
                "2020-12-31 20:01:01",
                "2020-12-31 21:02:02",
                "2020-12-31 22:03:03",
                "2020-12-31 23:04:04",
                "2021-01-01 00:05:05",
                "2021-01-01 01:06:06",
                "2021-01-01 02:07:07",
                "2021-01-01 03:08:08",
                "2021-01-01 04:09:09"];

    testYData = [10, 7, 5, 4, 3, 3, 4, 5, 7, 10];
    testData = [testXData, testYData];

    widget1 = new Widget(createWidgetSize(1, 1));
    widget2 = new Widget(createWidgetSize(2, 1));
    widget3 = new Widget(createWidgetSize(2, 2));
    widget4 = new Widget(createWidgetSize(2, 3));

    gwidget = new GraphWidget(createWidgetSize(2, 2), testData);
    gwidget2 = new GraphWidget(createWidgetSize(3, 2), undefined);
    gwidget3 = new GraphWidget(createWidgetSize(3, 2), undefined);

    manager = new WidgetManager(windowWidth - 20, windowHeight - 20, GRID_BASE_SIZE)
    manager.addWidget(widget1, 0, 0)
    manager.addWidget(widget1, 0, 1)
    manager.addWidget(widget1, 1, 0)
    manager.addWidget(widget1, 1, 1)
    manager.addWidget(widget2, 2, 0)
    manager.addWidget(widget3, 0, 2)
    manager.addWidget(widget4, 2, 1)

    manager.removeWidget(0, 0);
    manager.removeWidget(1, 0);
    manager.removeWidget(0, 1);
    manager.removeWidget(1, 1);
    manager.removeWidget(2, 1);
    manager.removeWidget(2, 0);

    manager.addWidget(gwidget, 0, 0)
    manager.addWidget(gwidget2, 2, 0)
    manager.addWidget(gwidget3, 2, 2)
    gwidget2.setContinousSpline(true);

    // dataSource2 = new DataSource("http://asperger.home/api/getValues.php?sensorID=45&filter=top&top=9");
    dataSource2 = new DataSource();
    dataSource2.setupSource(45, "top", "top=9");
    dataSource2.addObserver(gwidget2, 0);

    // dataSource3 = new DataSource("http://asperger.home/api/getValues.php?sensorID=44&filter=top&top=4");
    dataSource3 = new DataSource();
    dataSource3.setupSource(44, "top", "top=4");
    dataSource3.addObserver(gwidget3, 0);

    counter = 0;

    // for(var y = 0; y < manager.y_count; y++){
    //     var text = "";
    //     for(var x = 0; x < manager.x_count; x++){
    //         text += manager.grid[x][y].isFree() + " ";
    //     }
    //     console.log(text);
    // }

    //manager.addWidget(widget3, 1, 3, 2, 2)
}

function createWidgetSize(gridSpanX, gridSpanY){
    widgetWidth = GRID_BASE_SIZE - 2 * PADDING;
    return [PADDING, PADDING, widgetWidth + (gridSpanX-1) * GRID_BASE_SIZE, widgetWidth + (gridSpanY-1) * GRID_BASE_SIZE, gridSpanX, gridSpanY]
}

function draw() {
    //widget1.draw();

    //manager.drawWidget(0, 0);

    // toUpdate.forEach(element => {
    //     manager.drawWidget(element[0], element[1])
    // });

    // if(updateAll){
        manager.drawAll();
    //     updateAll = false;
    // }
    // if(this.gw2Data != undefined){
    //     gwidget2.setData(this.gw2Data);
    //     updateAll = true;
    //     this.gw2Data = undefined;
    // }

    if(counter < 10){
        counter++;
    }
    else{
        counter = 0;
    }

    switch(counter){
        case 1:
            if(dataSource2.hasDescription == false){
                dataSource2.getDescription();
            }
            else{
                dataSource2.checkForData();
            }
            break;
        case 5:
            if(dataSource3.hasDescription == false){
                dataSource3.getDescription();
            }
            else{
                dataSource3.checkForData();
            }
            break;
        default:
            break;
    }

    // TODO: get data
    // set updates
};

function windowResized() {
    resizeCanvas(windowWidth - 20, windowHeight - 20);
};

// function dataReceived(data){
//     //console.log(data);
//     data_array = data.split("</br>")
//     var xData = [];
//     var yData = [];
//     for(var i = 0; i < data_array.length - 1; i++){
//         var obj = JSON.parse(data_array[i]);
//         // console.log(Object.keys(obj).length);
//         // console.log(obj);
//         // console.log(obj["value0"]);
//         xData[i] = obj.timestamp;
//         yData[i] = int(obj.value0);
//     }
//
//     this.gw2Data = [xData, yData];
// };
