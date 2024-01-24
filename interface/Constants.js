//DLI ... datalogger interface

// GRAPH COLORING TYPES
const DLI_STATIC_COLOR = 0; // graph line has fixed avlue, default
const DLI_REL_MAP_COLOR = 1; // graph line color changes relative to position in graph
const DLI_ABS_MAP_COLOR = 2; // graph line color changes relative to data values

// [STYLE]
// COLORS
const DLI_COLOR_BG = '#121212';
const DLI_WIDGET_COLOR_BG = '#1d1d1d';
const DLI_TEXT_COLOR = '#dedede'; // 180, 200, 235
const DLI_TEXT_SMALL_COLOR = '#9b9b9b'; // 145, 155, 180
const DLI_TEXT_DARKER_COLOR = '#797979'; // 120, 130, 155

// WIDGETS
const DLI_WIDGET_HAS_BORDER = false;
const DLI_WIDGET_EDGE_RADIUS = 5;

// GRAPHS & CHARTS
const DLI_GRAPH_COLOR_BG = '#1d1d1d';//'#13202C';
const DLI_GRAPH_STROKE_COLOR = '#000000';

const DLI_PASTEL_BLUE = [160, 180, 255];
const DLI_PASTEL_BLUE_DARKER = [120, 140, 255];
const DLI_PASTEL_GREEN = [180, 255, 180];
const DLI_PASTEL_GREEN_DARKER = [120, 220, 140];

// COLORMAP
const DLI_PASTEL_TEMP_COLORMAP = new ColorMap();
DLI_PASTEL_TEMP_COLORMAP.addColor(20, '#6677FF');
DLI_PASTEL_TEMP_COLORMAP.addColor(22.5, '#BB66BB');
DLI_PASTEL_TEMP_COLORMAP.addColor(25, '#FF8888');
DLI_PASTEL_TEMP_COLORMAP.addColor(27.5, '#FFAA88');

const DLI_PASTEL_HUM_COLORMAP = new ColorMap();
DLI_PASTEL_HUM_COLORMAP.addColor(30, rgbToHex(180, 200, 240));
DLI_PASTEL_HUM_COLORMAP.addColor(40, rgbToHex(160, 180, 255));
DLI_PASTEL_HUM_COLORMAP.addColor(50, rgbToHex(120, 140, 255));