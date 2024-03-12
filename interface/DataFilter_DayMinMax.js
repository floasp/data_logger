class DataFilter_DayMinMax{
	constructor(){
		// works like a datasource for widgets but gets its data from a real Datasource.
		// after modifying the data (filtering) it notifies the observer widgets
		// creates list of min and max values for each day
		
		this.observers = [];
	}
    
    // observer pattern, gets called by the observable (DataSource or another Filter)
    notify(timestamps, values, name, datatype, unit, typename){
		
        let data = [];
		let new_timestamps = [];
		let maxs = [];
		let mins = [];
		let day_index = 0;
		let prev_dmy = [-1, -1, -1];
		
		let current_ts = undefined;
		let current_min = 0;
		let current_max = 0;
		
		for (let i = 0; i < timestamps.length; i++){
			
			let current_dmy = this.getDayMonthYear(timestamps[i]);
			
			if(this.isSameDay(prev_dmy, current_dmy)){
				let temp_val = values[i];
				if (temp_val < current_min){
					current_min = temp_val;
				}
				if (temp_val > current_max){
					current_max = temp_val;
				}
			}
			else{
				if(current_ts != undefined){
					new_timestamps.push(current_ts);
					maxs.push(current_max);
					mins.push(current_min);
				}
				
				current_ts = ("0000" + current_dmy[2]).slice (-4) + "-" + 
							 ("00" + current_dmy[1]).slice (-2) + "-" + 
							 ("00" + current_dmy[0]).slice (-2) + "-00:00:00";
				current_max = values[i];
				current_min = values[i];
				
				prev_dmy = current_dmy;
			}
		}
		
		if(current_ts != undefined){
			new_timestamps.push(current_ts);
			maxs.push(current_max);
			mins.push(current_min);
		}
		
		data = [maxs, mins];
		
		this.notifyObservers(new_timestamps, data, name, datatype, unit, typename);
    }
	
	
    addObserver(observer){
        this.observers.push(observer);
    }
    removeObserver(observer){
        let index = this.observers.indexOf(observer);
        this.observers.splice(index, 1);
    }
    notifyObservers(timestamps, values, name, datatype, unit, typename){
        for(var i = 0; i < this.observers.length; i++){
            this.observers[i].notify(timestamps, values, name, datatype, unit, typename);
        }
    }
	
	isSameDay(dmy1, dmy2){
		return dmy1[0] == dmy2[0] && dmy1[1] == dmy2[1] && dmy1[2] == dmy2[2];
	}
	
	getDayMonthYear(timestamp){
		let year_str = timestamp.substring(0, 4);
		let year_int = int(year_str);
		let month_str = timestamp.substring(5, 7);
		let month_int = int(month_str);
		let day_str = timestamp.substring(8, 10);
		let day_int = int(day_str);
		return [day_int, month_int, year_int];
	}
}
