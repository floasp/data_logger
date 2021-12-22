function SourceManager(){
    this.sources = [];
    this.hasDescriptions = false;
    this.waitingToFinish = false;
    this.currentSource = 0;
    this.framesPerCheck = 10; // check every 10 frames or 1s
    this.frame_counter = 0;
    this.finishedEveryOnce = false;

    this.addSource = function(data_source){
        this.sources.push(data_source);
        this.hasDescriptions = false;
    };
    this.removeSource = function(data_source){
        index = this.sources.indexOf(data_source);
        this.sources.splice(index, 1);
    }

    // called to initiate an update of the descriptions
    this.updateDescriptions = function(){
        this.hasDescriptions = false;
        this.currentSource = 0;
    }

    // only called from within the nextStep function
    this.getDescriptions = function(){
        // if it's not in the range, reset it
        if(this.currentSource >= 0 && this.currentSource < this.sources.length){
            // state 0: uninitialized
            if(this.sources[this.currentSource].hasDescription == false && this.sources[this.currentSource].waitingForData == false){
                this.sources[this.currentSource].getDescription();
            }

            // state 1: got description
            // setup next source
            if(this.sources[this.currentSource].hasDescription == true && this.sources[this.currentSource].waitingForData == false){
                if(this.currentSource < this.sources.length -1){
                    this.currentSource += 1;
                }
                // end of this procedure
                else{
                    this.hasDescriptions = true;
                    this.currentSource = 0;
                }
            }
        }
        else{
            this.currentSource = 0;
        }
    }

    this.getAllData = function(){
        // if it's not in the range, reset it
        if(this.currentSource >= 0 && this.currentSource < this.sources.length){
            // wasn't updated
            if(this.sources[this.currentSource].waitingForData == false && this.sources[this.currentSource].changed == false){
                this.sources[this.currentSource].checkForData();
            }
            // got new data, get to next source
            else if(this.sources[this.currentSource].waitingForData == false && this.sources[this.currentSource].changed == true){
                if(this.currentSource < this.sources.length -1){
                    this.currentSource += 1;
                }
                // end of this procedure, start from 0 again
                else{
                    this.hasDescriptions = true;
                    this.currentSource = 0;
                    this.finishedEveryOnce = true;
                }
                // set it false for the next round
                this.sources[this.currentSource].changed = false;
            }

        }
        else{
            this.currentSource = 0;
        }
    }

    this.nextStep = function(){
        if(this.frame_counter >= this.framesPerCheck-1 || this.finishedEveryOnce == false){
            this.frame_counter = 0;

            if(this.sources.length > 0){
                // if we haven't got every description then do this
                if(this.hasDescriptions == false){
                    this.getDescriptions();
                }
                else{
                    this.getAllData();
                }
            }
        }
        else{
            this.frame_counter += 1;
        }
    }
};
