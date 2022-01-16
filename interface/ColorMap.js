function ColorMap(style){
    this.colors = [];
    this.positions = [];

    this.addColor = function(rel_position, color){
        this.positions.push(rel_position);
        this.colors.push(color);
    };

    this.getColorPairs = function(){
        let that = this;
        let result = this.positions.map(function(e, i) {
            return [e, that.colors[i]];
        });
        return result;
    };
};
