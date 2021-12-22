function SourceManager(){
    this.sources = [];

    this.addSource = function(){

    };

    this.getDescriptions = function(){
        let currentSource = 0;

        if(sources[currentSource].hasDescription == false && sources[currentSource].waitingForData == false){
            sources[currentSource].getDescription();
        }
    }
};
