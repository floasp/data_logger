
function trim_number_to_string(number){
    if(typeof(number) == "number" && number.toString().length > 6){
        number = number.toString().split(".");
        if(number[0].length >= 6){
            number = number[0];
        }
        else if (number.length > 1){
            let len = number[0].length;
            let float_len = number[1].length;
            number = number[0] + "." + number[1].substring(0, Math.min(float_len, 6-len));
        }
    }
    return number.toString();
}

// datetime is formatted in the SQL DATETIME Format
function datetime_to_int(datetime){
    return Math.floor(new Date(datetime).getTime() / 1000);
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
function map_range_hard(value, low1, high1, low2, high2) {
    return Math.max(Math.min(low2 + (high2 - low2) * (value - low1) / (high1 - low1), high2), low2);
}

function date_to_array(datetime){
    let year_str = datetime.substring(0, 4);
    let year_int = int(year_str);
    let month_str = datetime.substring(5, 7);
    let month_int = int(month_str);
    let day_str = datetime.substring(8, 10);
    let day_int = int(day_str);
    let h_str = datetime.substring(11, 13);
    let h_int = int(h_str);
    let m_str = datetime.substring(14, 16);
    let m_int = int(m_str);
    let s_str = datetime.substring(17, 19);
    let s_int = int(s_str);

    return [year_int, month_int, day_int, h_int, m_int, s_int];
}

function createWidgetSize(gridSpanX, gridSpanY){
    let widgetWidth = GRID_BASE_SIZE_X - 2 * PADDING;
    let widgetHeight = GRID_BASE_SIZE_Y - 2 * PADDING;
    return [PADDING, PADDING, widgetWidth + (gridSpanX-1) * GRID_BASE_SIZE_X, widgetHeight + (gridSpanY-1) * GRID_BASE_SIZE_Y]
}

// timestamps is an array of strings formatted in the SQL DATETIME Format
function getMinMaxDate(timestamps){
    mindate = datetime_to_int(timestamps[0]);
    minindex = 0;
    maxdate = datetime_to_int(timestamps[0]);
    maxindex = 0;

    for(let i = 0; i < timestamps.length; i++){
        date = datetime_to_int(timestamps[i]);
        if(date < mindate){
            mindate = date;
            minindex = i;
        }
        if(date > maxdate){
            maxdate = date;
            maxindex = i;
        }
    
    }

    return [timestamps[minindex], timestamps[maxindex]];
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    return [Number("0x" + hex.slice(1, 3)), Number("0x" + hex.slice(3, 5)), Number("0x" + hex.slice(5, 7))];
}

function dateTimeToLocale(timestamp){
    let date = new Date(timestamp + " UTC");
    let datestring = date.toLocaleDateString("de-DE");
    let timestring = date.toLocaleTimeString("de-DE");
    let datetimestring = datestring + " " + timestring;

    return datetimestring;
}