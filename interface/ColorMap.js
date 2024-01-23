class ColorMap{
    constructor(style){
        this.colors = [];
        this.positions = [];
    }

    addColor(rel_position, color){
        this.positions.push(rel_position);
        this.colors.push(color);
    }

    getColorPairs(){
        let that = this;
        let result = this.positions.map(function(e, i) {
            return [e, that.colors[i]];
        });
        return result;
    }
}
