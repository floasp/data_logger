class MobileLayout{
    constructor(){
        // gwidget_air_temp = new GraphWidget(createWidgetSize(3, 2), undefined);
        // gwidget_air_pres = new GraphWidget(createWidgetSize(3, 2), undefined);
        // gwidget_air_humi = new GraphWidget(createWidgetSize(3, 2), undefined);
        // gwidget_air_eco2 = new GraphWidget(createWidgetSize(3, 2), undefined);
        // gwidget_air_tvoc = new GraphWidget(createWidgetSize(3, 2), undefined);
    
        this.gwidget_air_temp = new GraphWidget(createWidgetSize(8, 2), undefined);
        this.gwidget_air_pres = new GraphWidget(createWidgetSize(8, 2), undefined);
        this.gwidget_air_humi = new GraphWidget(createWidgetSize(8, 2), undefined);
        this.gwidget_air_eco2 = new GraphWidget(createWidgetSize(8, 2), undefined);
        this.gwidget_air_tvoc = new GraphWidget(createWidgetSize(8, 2), undefined);
        
        this.ngwidget_air_temp_minmax = new NGraphWidget(createWidgetSize(8, 2), undefined);
    
        this.lvwidget_air_temp = new LatestValueWidget(createWidgetSize(2, 2), undefined);
        this.lvwidget_air_pres = new LatestValueWidget(createWidgetSize(2, 2), undefined);
        this.lvwidget_air_humi = new LatestValueWidget(createWidgetSize(2, 2), undefined);
        this.lvwidget_air_eco2 = new LatestValueWidget(createWidgetSize(2, 2), undefined);
        this.lvwidget_air_tvoc = new LatestValueWidget(createWidgetSize(2, 2), undefined);
    
        this.hwidget_air_temp = new HistogramWidget(createWidgetSize(2, 2), undefined);
        this.hwidget_air_pres = new HistogramWidget(createWidgetSize(2, 2), undefined);
        this.hwidget_air_humi = new HistogramWidget(createWidgetSize(2, 2), undefined);
        this.hwidget_air_eco2 = new HistogramWidget(createWidgetSize(2, 2), undefined);
        this.hwidget_air_tvoc = new HistogramWidget(createWidgetSize(2, 2), undefined);
        this.hwidget_air_temp.setIntervals(20);
        this.hwidget_air_pres.setIntervalsWithLimit(111000, 117000, 10);
        this.hwidget_air_humi.setIntervalsWithLimit(0, 100, 20);
        this.hwidget_air_eco2.setIntervalsWithLimit(0, 10000, 10);
        this.hwidget_air_tvoc.setIntervals(10);
    
        //gwidget_air_temp.setLineColor([255, 0, 0]);
        this.gwidget_air_temp.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.hwidget_air_temp.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.temp_map = new ColorMap();
        this.temp_map.addColor(20, '#4466FF');
        this.temp_map.addColor(22.5, '#BB44BB');
        this.temp_map.addColor(25, '#FF6666');
        this.gwidget_air_temp.setColorMap(this.temp_map);
        this.hwidget_air_temp.setColorMap(this.temp_map);
	
        // min max widget
        this.ngwidget_air_temp_minmax.setLineColorStyle([DLI_ABS_MAP_COLOR, DLI_ABS_MAP_COLOR]);
        this.ngwidget_air_temp_minmax.setColorMap([this.temp_map, this.temp_map]);
    
        this.gwidget_air_pres.setLineColor([160, 180, 255]);
        this.gwidget_air_humi.setLineColor([160, 180, 255]);
        this.gwidget_air_eco2.setLineColor([180, 255, 180]);
        this.gwidget_air_tvoc.setLineColor([180, 255, 180]);
        this.hwidget_air_pres.setLineColor([160, 180, 255]);
        this.hwidget_air_humi.setLineColor([160, 180, 255]);
        this.hwidget_air_eco2.setLineColor([180, 255, 180]);
        this.hwidget_air_tvoc.setLineColor([180, 255, 180]);
    }

    addToManager(widgetmanager){
        widgetmanager.addWidget(this.gwidget_air_temp, 0, 2)
        widgetmanager.addWidget(this.gwidget_air_pres, 0, 4)
        widgetmanager.addWidget(this.gwidget_air_humi, 0, 6)
        widgetmanager.addWidget(this.gwidget_air_eco2, 0, 8)
        widgetmanager.addWidget(this.gwidget_air_tvoc, 0, 10)
        // gwidget_air_temp.setContinousSpline(true);
    
        widgetmanager.addWidget(this.lvwidget_air_temp, 0, 0);
        widgetmanager.addWidget(this.lvwidget_air_pres, 2, 0);
        widgetmanager.addWidget(this.lvwidget_air_humi, 4, 0);
        widgetmanager.addWidget(this.lvwidget_air_eco2, 6, 0);
        widgetmanager.addWidget(this.lvwidget_air_tvoc, 8, 0);
    
        widgetmanager.addWidget(this.hwidget_air_temp, 8, 2);
        widgetmanager.addWidget(this.hwidget_air_pres, 8, 4);
        widgetmanager.addWidget(this.hwidget_air_humi, 8, 6);
        widgetmanager.addWidget(this.hwidget_air_eco2, 8, 8);
        widgetmanager.addWidget(this.hwidget_air_tvoc, 8, 10);
        
        widgetmanager.addWidget(this.ngwidget_air_temp_minmax, 0, 12);
    }

    setupDatasource(dataSource){
        dataSource.addObserver(this.gwidget_air_temp, 0);
        dataSource.addObserver(this.gwidget_air_pres, 1);
        dataSource.addObserver(this.gwidget_air_humi, 2);
        dataSource.addObserver(this.gwidget_air_eco2, 3);
        dataSource.addObserver(this.gwidget_air_tvoc, 4);
    
        dataSource.addObserver(this.lvwidget_air_temp, 0);
        dataSource.addObserver(this.lvwidget_air_pres, 1);
        dataSource.addObserver(this.lvwidget_air_humi, 2);
        dataSource.addObserver(this.lvwidget_air_eco2, 3);
        dataSource.addObserver(this.lvwidget_air_tvoc, 4);
    
        dataSource.addObserver(this.hwidget_air_temp, 0);
        dataSource.addObserver(this.hwidget_air_pres, 1);
        dataSource.addObserver(this.hwidget_air_humi, 2);
        dataSource.addObserver(this.hwidget_air_eco2, 3);
        dataSource.addObserver(this.hwidget_air_tvoc, 4);
        
        this.minmax_filter = new DataFilter_DayMinMax();
        dataSource.addObserver(this.minmax_filter, 0);
        this.minmax_filter.addObserver(this.ngwidget_air_temp_minmax);
    }
}