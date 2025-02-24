class MobileLayout_new{
    constructor(){
        this.gwidget_temp = new GraphWidget();
        this.gwidget_humi = new GraphWidget();
        
        this.ngwidget_temp_minmax = new NGraphWidget();
    
        this.lvwidget_temp = new LatestValueWidget();
        this.lvwidget_humi = new LatestValueWidget();

        this.lvwidget_temp.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.lvwidget_temp.setColorMap(DLI_PASTEL_TEMP_COLORMAP);
        this.lvwidget_humi.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.lvwidget_humi.setColorMap(DLI_PASTEL_HUM_COLORMAP);
    
        this.hwidget_temp = new HistogramWidget();
        this.hwidget_humi = new HistogramWidget();
        this.hwidget_temp.setIntervals(20);
        this.hwidget_humi.setIntervalsWithLimit(0, 100, 20);
    
        this.gwidget_temp.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.hwidget_temp.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.gwidget_temp.setColorMap(DLI_PASTEL_TEMP_COLORMAP);
        this.hwidget_temp.setColorMap(DLI_PASTEL_TEMP_COLORMAP);
	
        this.ngwidget_temp_minmax.setLineColorStyle([DLI_ABS_MAP_COLOR, DLI_ABS_MAP_COLOR]);
        this.ngwidget_temp_minmax.setColorMap([DLI_PASTEL_TEMP_COLORMAP, DLI_PASTEL_TEMP_COLORMAP]);
    
        this.gwidget_humi.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.hwidget_humi.setLineColorStyle(DLI_ABS_MAP_COLOR);
        this.gwidget_humi.setColorMap(DLI_PASTEL_HUM_COLORMAP);
        this.hwidget_humi.setColorMap(DLI_PASTEL_HUM_COLORMAP);
    }

    addToManager(widgetmanager){
        widgetmanager.addWidget(this.gwidget_temp, 0, 8, 10, 4)
        widgetmanager.addWidget(this.gwidget_humi, 0, 12, 10, 4)
    
        widgetmanager.addWidget(this.lvwidget_temp, 0, 0, 5, 4);
        widgetmanager.addWidget(this.lvwidget_humi, 0, 4, 5, 4);
    
        widgetmanager.addWidget(this.hwidget_temp, 5, 0, 5, 4);
        widgetmanager.addWidget(this.hwidget_humi, 5, 4, 5, 4);
        
        widgetmanager.addWidget(this.ngwidget_temp_minmax, 0, 16, 10, 4);
    }

    clearDataSources(dataSource){
        dataSource.clearObservers();
    }

    setupDatasource(dataSource){
        dataSource.addObserver(this.gwidget_temp, 1);
        dataSource.addObserver(this.gwidget_humi, 0);
    
        dataSource.addObserver(this.lvwidget_temp, 1);
        dataSource.addObserver(this.lvwidget_humi, 0);
    
        dataSource.addObserver(this.hwidget_temp, 1);
        dataSource.addObserver(this.hwidget_humi, 0);
        
        this.minmax_filter = new DataFilter_DayMinMax();
        dataSource.addObserver(this.minmax_filter, 1);
        this.minmax_filter.addObserver(this.ngwidget_temp_minmax);
    }
}