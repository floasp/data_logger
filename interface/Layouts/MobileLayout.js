class MobileLayout{
    constructor(){
        this.gwidget_air_temp = new GraphWidget();
        this.gwidget_air_pres = new GraphWidget();
        this.gwidget_air_humi = new GraphWidget();
        this.gwidget_air_eco2 = new GraphWidget();
        this.gwidget_air_tvoc = new GraphWidget();
        
        this.ngwidget_air_temp_minmax = new NGraphWidget();
    
        this.lvwidget_air_temp = new LatestValueWidget();
        this.lvwidget_air_pres = new LatestValueWidget();
        this.lvwidget_air_humi = new LatestValueWidget();
        this.lvwidget_air_eco2 = new LatestValueWidget();
        this.lvwidget_air_tvoc = new LatestValueWidget();
    
        this.hwidget_air_temp = new HistogramWidget();
        this.hwidget_air_pres = new HistogramWidget();
        this.hwidget_air_humi = new HistogramWidget();
        this.hwidget_air_eco2 = new HistogramWidget();
        this.hwidget_air_tvoc = new HistogramWidget();
        this.hwidget_air_temp.setIntervals(20);
        this.hwidget_air_pres.setIntervalsWithLimit(111000, 117000, 10);
        this.hwidget_air_humi.setIntervalsWithLimit(0, 100, 20);
        this.hwidget_air_eco2.setIntervalsWithLimit(0, 10000, 10);
        this.hwidget_air_tvoc.setIntervals(10);
    
        this.gwidget_air_temp.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.hwidget_air_temp.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.gwidget_air_temp.setColorMap(DLI_PASTEL_TEMP_COLORMAP);
        this.hwidget_air_temp.setColorMap(DLI_PASTEL_TEMP_COLORMAP);
	
        // min max widget
        this.ngwidget_air_temp_minmax.setLineColorStyle([DLI_ABS_MAP_COLOR, DLI_ABS_MAP_COLOR]);
        this.ngwidget_air_temp_minmax.setColorMap([DLI_PASTEL_TEMP_COLORMAP, DLI_PASTEL_TEMP_COLORMAP]);
    
        this.gwidget_air_pres.setLineColor(DLI_PASTEL_BLUE);
        this.gwidget_air_eco2.setLineColor(DLI_PASTEL_GREEN);
        this.gwidget_air_tvoc.setLineColor(DLI_PASTEL_GREEN_DARKER);
        this.hwidget_air_pres.setLineColor(DLI_PASTEL_BLUE);
        this.hwidget_air_eco2.setLineColor(DLI_PASTEL_GREEN);
        this.hwidget_air_tvoc.setLineColor(DLI_PASTEL_GREEN_DARKER);

        this.gwidget_air_humi.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.hwidget_air_humi.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.gwidget_air_humi.setColorMap(DLI_PASTEL_HUM_COLORMAP);
        this.hwidget_air_humi.setColorMap(DLI_PASTEL_HUM_COLORMAP);
        
        this.gwidget_tem1 = new GraphWidget();
        this.gwidget_tem2 = new GraphWidget();
        this.gwidget_hum1 = new GraphWidget();
        this.gwidget_hum2 = new GraphWidget();
        
        this.lvwidget_tem1 = new LatestValueWidget();
        this.lvwidget_tem2 = new LatestValueWidget();
        this.lvwidget_hum1 = new LatestValueWidget();
        this.lvwidget_hum2 = new LatestValueWidget();
        
        this.lvwidget_tem1.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.lvwidget_tem1.setColorMap(DLI_PASTEL_TEMP_COLORMAP);
        this.lvwidget_tem2.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.lvwidget_tem2.setColorMap(DLI_PASTEL_TEMP_COLORMAP);
        this.lvwidget_hum1.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.lvwidget_hum1.setColorMap(DLI_PASTEL_HUM_COLORMAP);
        this.lvwidget_hum2.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.lvwidget_hum2.setColorMap(DLI_PASTEL_HUM_COLORMAP);

        this.gwidget_tem1.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.gwidget_tem1.setColorMap(DLI_PASTEL_TEMP_COLORMAP);
        this.gwidget_tem2.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.gwidget_tem2.setColorMap(DLI_PASTEL_TEMP_COLORMAP);
        this.gwidget_hum1.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.gwidget_hum1.setColorMap(DLI_PASTEL_HUM_COLORMAP);
        this.gwidget_hum2.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.gwidget_hum2.setColorMap(DLI_PASTEL_HUM_COLORMAP);
    }

    addToManager(widgetmanager){
        widgetmanager.addWidget(this.gwidget_air_temp, 0, 2, 8, 2)
        widgetmanager.addWidget(this.gwidget_air_pres, 0, 4, 8, 2)
        widgetmanager.addWidget(this.gwidget_air_humi, 0, 6, 8, 2)
        widgetmanager.addWidget(this.gwidget_air_eco2, 0, 8, 8, 2)
        widgetmanager.addWidget(this.gwidget_air_tvoc, 0, 10, 8, 2)
        // gwidget_air_temp.setContinousSpline(true);
    
        widgetmanager.addWidget(this.lvwidget_air_temp, 0, 0, 2, 2);
        widgetmanager.addWidget(this.lvwidget_air_pres, 2, 0, 2, 2);
        widgetmanager.addWidget(this.lvwidget_air_humi, 4, 0, 2, 2);
        widgetmanager.addWidget(this.lvwidget_air_eco2, 6, 0, 2, 2);
        widgetmanager.addWidget(this.lvwidget_air_tvoc, 8, 0, 2, 2);
    
        widgetmanager.addWidget(this.hwidget_air_temp, 8, 2, 2, 2);
        widgetmanager.addWidget(this.hwidget_air_pres, 8, 4, 2, 2);
        widgetmanager.addWidget(this.hwidget_air_humi, 8, 6, 2, 2);
        widgetmanager.addWidget(this.hwidget_air_eco2, 8, 8, 2, 2);
        widgetmanager.addWidget(this.hwidget_air_tvoc, 8, 10, 2, 2);
        
        widgetmanager.addWidget(this.ngwidget_air_temp_minmax, 0, 12, 8, 2);

        widgetmanager.addWidget(this.gwidget_tem1, 0, 14, 3, 2);
        widgetmanager.addWidget(this.gwidget_tem2, 3, 14, 3, 2);
        widgetmanager.addWidget(this.gwidget_hum1, 0, 16, 3, 2);
        widgetmanager.addWidget(this.gwidget_hum2, 3, 16, 3, 2);
        
        widgetmanager.addWidget(this.lvwidget_tem1, 6, 14, 2, 2);
        widgetmanager.addWidget(this.lvwidget_tem2, 8, 14, 2, 2);
        widgetmanager.addWidget(this.lvwidget_hum1, 6, 16, 2, 2);
        widgetmanager.addWidget(this.lvwidget_hum2, 8, 16, 2, 2);
    }

    clearDataSources(dataSource, dataSource2){
        dataSource.clearObservers();
        dataSource2.clearObservers();
    }

    setupDatasource(dataSource, dataSource2){
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
        
        dataSource2.addObserver(this.gwidget_tem1, 1);
        dataSource2.addObserver(this.gwidget_tem2, 3);
        dataSource2.addObserver(this.gwidget_hum1, 0);
        dataSource2.addObserver(this.gwidget_hum2, 2);
        
        dataSource2.addObserver(this.lvwidget_tem1, 1);
        dataSource2.addObserver(this.lvwidget_tem2, 3);
        dataSource2.addObserver(this.lvwidget_hum1, 0);
        dataSource2.addObserver(this.lvwidget_hum2, 2);
    }
}