class DataSource{
    constructor(url){
        // source url for the getValues call
        this.datasource = "";
        // source url for the getSensor and getDatatypes call
        this.descriptionCall = "";
        // true when description is received
        this.hasDescription = false;
        // true if waiting for api response
        this.waitingForData = false;
        // true if new data arrived, set false by the source manager
        this.changed = false;
        // contains the data timestamps after receiving it
        this.timestamps = [];
        // contains the data after receiving it
        this.values = [];
        // contains the most recent timestamp
        this.mostRecentTS = "";
        // observers that will be notified when the data changes
        this.observers = [];
        // tells which data from the sensor to use if it has more than one value. if there's only 1 value this should be 0
        this.observerDataIndexes = [];
        // Name of the Sensor, received after the description call
        this.name = "";
        // IDs of the Datatypes, to get the datatypes the getDataTypes function is used.
        this.datatypeIDs = [];
        // datatypes of the sensor. To access the datatype of a specific observer use datatypes[observerDataIndexes[observer]]
        this.datatypes = [];
        // displayed names for the sensor values, if none are available they're set to undefined.
        this.typenames = undefined;
        // units for the datatypes. Same as above
        this.units = [];
        // with the top filter, the data is received in reversed order and needs to be reversed again in the dataReceived function.
        this.reversed = false;
        // url of the server e.g. "http://domain.name""
        this.url = url;
    }

    addObserver(observer, dataIndex){
        this.observers.push(observer);
        this.observerDataIndexes.push(dataIndex);
    }
    removeObserver(observer){
        let index = this.observers.indexOf(observer);
        this.observers.splice(index, 1);
        this.observerDataIndexes.splice(index, 1);
    }
    notifyObservers(){
        for(let i = 0; i < this.observers.length; i++){
            this.observers[i].notify(this.timestamps, this.values[this.observerDataIndexes[i]], this.name, this.datatypes[i], this.units[i], this.typenames[this.observerDataIndexes[i]]);
        }
    }
    clearObservers(){
        this.observers = [];
        this.observerDataIndexes = [];
    }

    getDescription(){

        let that = this;
        if(!this.waitingForData){
            $.ajax({
                url: this.descriptionCall,
                success: function(data) { that.receivedDescription(data) }
            });
            this.waitingForData = true;
        }

    }

    receivedDescription(data){

        // console.log(data);
        let obj = JSON.parse(data);
        this.name = obj.name;
        this.datatypeIDs = obj.datatypes.split(";");
        this.typenames = obj.typenames.split(";");
        if (this.typenames.length == 0){
            this.typenames = undefined;
        }
        // console.log(datatypes);
        //console.log(this.typenames);
        this.waitingForData = false;
        this.getDatatypes();
    }

    getDatatypes(){

        let dataCall = this.url + "/api/getDataTypes.php";

        let that = this;
        if(!this.waitingForData){
            $.ajax({
                url: dataCall,
                success: function(data) { that.receivedDatatypes(data) }
            });
            this.waitingForData = true;
        }

    }

    receivedDatatypes(data){
        // console.log(data);
        // console.log(this.datatypeIDs);

        let data_array = data.split("</br>");

        for(let i = 0; i < this.observerDataIndexes.length; i++){
            let valueIndex = this.observerDataIndexes[i];
            let datatype = this.datatypeIDs[valueIndex];

            for(let j = 0; j < data_array.length-1; j++){
                let obj = JSON.parse(data_array[j]);
                let dtID = obj.typeID;

                if(dtID == datatype){
                    this.datatypes[i] = obj.name;
                    this.units[i] = obj.unit;
                    break;
                }
            }
        }

        // console.log(this.datatypes);
        // console.log(this.units);
        this.notifyObservers();

        this.waitingForData = false;
        this.hasDescription = true;
    }

    setupSource(sensorID, filter, selector){
        this.datasource = this.url + "/api/getValues.php?sensorID=" + sensorID + "&filter=" + filter + "&" + selector;
        this.descriptionCall = this.url + "/api/getSensor.php?sensorID=" + sensorID;
        // sql query comes back in reversed order
        if (filter == "top"){
            this.reversed = true;
        }
        //this.getDescription();
    }

    checkForData(){
        // stupid but works
        let that = this;
        if(!this.waitingForData){
            $.ajax({
                url: this.datasource,
                success: function(data) { that.dataReceived(data) }
            });
            this.waitingForData = true;
        }
    }

    dataReceived(data){
        //console.log(data);
        let data_array = data.split("</br>")

        if(this.isNew(data_array)){

            let times = [];

            let obj = JSON.parse(data_array[0]);
            let n_values = Object.keys(obj).length - 1;
            let data = [];

            for(let i = 0; i < n_values; i++){
                data[i] = [];
            }

            for(let i = 0; i < data_array.length - 1; i++){
                obj = JSON.parse(data_array[i]);
                // console.log(Object.keys(obj).length);
                // console.log(obj);
                // console.log(obj["value0"]);

                times[i] = obj.timestamp;

                for(let j = 0; j < n_values; j++){
                    data[j][i] = Number(obj["value" + str(j)]);
                }
            }

            if(this.reversed){
                times = times.reverse();
                for(let j = 0; j < n_values; j++){
                    data[j] = data[j].reverse();
                }
            }

            this.timestamps = times;
            this.values = data;

            this.notifyObservers();

            this.changed = true;
            this.waitingForData = false;
        }
    }

    isNew(data_array){
        //console.log(data_array[data_array.length - 2]);
        let obj = JSON.parse(data_array[data_array.length - 2]);
        let ts = obj.timestamp;
        return ts != this.mostRecentTS;
    }
}
