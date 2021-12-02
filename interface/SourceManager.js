function SourceManager(){
    this.sources = [];

    this.addSource = function(){
        
    }

    // observer pattern, gets called by the observable
    this.notify = function(timestamps, values){
        this.updatePending = true;
    };
};
