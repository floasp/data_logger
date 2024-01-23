
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

function datetime_str_to_int(datetime_str){
    return this.datetime_to_int(this.date_to_array(datetime_str));
}

// datetime is an array with following format: [Y, M, D, h, m, s]
function datetime_to_int(datetime){
    let s = datetime[5];
    // console.log("  " + s);
    let m = datetime[4] * 60;
    // console.log("  " + m);
    let h = datetime[3] * 60 * 60;
    // console.log("  " + h);
    let D = datetime[2] * 60 * 60 * 24;
    // console.log("  " + D);
    let M = this.getMonthValue(datetime[1]) * 60 * 60 * 24;
    // console.log("  MV: " + getMonthValue(datetime[1]));
    // console.log("  " + M);
    let Y = datetime[0] * 60 * 60 * 24 * 366;
    // console.log("  " + Y);


    return s+m+h+D+M+Y;
}
// returns the number of days in a year prior to this month.
function getMonthValue(month){
    let result = 0;
    switch(month-1){
        case 12:
            result += 31;
        case 11:
            result += 30;
        case 10:
            result += 31;
        case 9:
            result += 30;
        case 8:
            result += 31; // fixed typo here
        case 7:
            result += 31;
        case 6:
            result += 30;
        case 5:
            result += 31;
        case 4:
            result += 30;
        case 3:
            result += 31;
        case 2:
            result += 29;
        case 1:
            result += 31;
        default:
    }
    return result;
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
function map_range_hard(value, low1, high1, low2, high2) {
    return Math.max(Math.min(low2 + (high2 - low2) * (value - low1) / (high1 - low1), high2), low2);
}


// function bigmax(numbers){
//     let m = numbers[0];
//     for(let i = 0; i < numbers.length; i++){
//         if (numbers[i] > m){
//             m = numbers[i]
//         }
//     }
//     return m;
// }
// function bigmin(numbers){
//     let m = numbers[0];
//     for(let i = 0; i < numbers.length; i++){
//         if (numbers[i] < m){
//             m = numbers[i]
//         }
//     }
//     return m;
// }

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

// timestamps is an array of strings formatted in the SQL DATETIME Format
function getMinMaxDate(timestamps){
    let minYear = 9999;
    let maxYear = 0;
    let minMonth = 12;
    let maxMonth = 1;
    let minDay = 366;
    let maxDay = 0;
    let minH = 24;
    let maxH = 0;
    let minM = 60;
    let maxM = 0;
    let minS = 60;
    let maxS = 0;

    for(let i = 0; i < timestamps.length; i++){
        let year_str = timestamps[i].substring(0, 4);
        let year_int = int(year_str);
        let month_str = timestamps[i].substring(5, 7);
        let month_int = int(month_str);
        let day_str = timestamps[i].substring(8, 10);
        let day_int = int(day_str);
        let h_str = timestamps[i].substring(11, 13);
        let h_int = int(h_str);
        let m_str = timestamps[i].substring(14, 16);
        let m_int = int(m_str);
        let s_str = timestamps[i].substring(17, 19);
        let s_int = int(s_str);

        if(year_int > maxYear){
            maxYear = year_int;
            maxMonth = 1;
            maxDay = 0;
            maxH = 0;
            maxM = 0;
            maxS = 0;
        }
        if(year_int == maxYear){
            if(month_int > maxMonth){
                maxMonth = month_int;
                maxDay = 0;
                maxH = 0;
                maxM = 0;
                maxS = 0;
            }
            if(month_int == maxMonth){
                if(day_int > maxDay){
                    maxDay = day_int;
                    maxH = 0;
                    maxM = 0;
                    maxS = 0;
                }
                if(day_int == maxDay){
                    if(h_int > maxH){
                        maxH = h_int;
                        maxM = 0;
                        maxS = 0;
                    }
                    if(h_int == maxH){
                        if(m_int > maxM){
                            maxM = m_int;
                            maxS = 0;
                        }
                        if(m_int == maxM){
                            if(s_int > maxS){
                                maxS = s_int;
                            }
                        }
                    }
                }
            }
        }
        if(year_int < minYear){
            minYear = year_int;
            minMonth = 12;
            minDay = 366;
            minH = 24;
            minM = 60;
            minS = 60;
        }
        if(year_int == minYear){
            if(month_int < minMonth){
                minMonth = month_int;
                minDay = 366;
                minH = 24;
                minM = 60;
                minS = 60;
            }
            if(month_int == minMonth){
                if(day_int < minDay){
                    minDay = day_int;
                    minH = 24;
                    minM = 60;
                    minS = 60;
                }
                if(day_int == minDay){
                    if(h_int < minH){
                        minH = h_int;
                        minM = 60;
                        minS = 60;
                    }
                    if(h_int == minH){
                        if(m_int < minM){
                            minM = m_int;
                            minS = 60;
                        }
                        if(m_int == minM){
                            if(s_int < minS){
                                minS = s_int;
                            }
                        }
                    }
                }
            }
        }
    }

    return [[minYear, minMonth, minDay, minH, minM, minS], [maxYear, maxMonth, maxDay, maxH, maxM, maxS]];
}