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

    getColor(position){
        let pos1 = -1;
        let pos2 = -1;
        for(let i = 0; i < this.positions.length; i++){
            if (this.positions[i] > position){
                pos1 = i-1;
                pos2 = i;
                if (pos1 < 0){
                    pos1 = 0
                }
                if (pos2 > this.positions.length){
                    pos2 = this.positions.length
                }

                break;
            }
        }
        
        if(pos1 == -1){
            pos1 = this.positions.length - 1;
        }
        if(pos2 == -1){
            pos2 = this.positions.length - 1;
        }

        let percentage;
        if(pos1 == pos2){
            percentage = 0;
        }
        else{
            percentage = (position - this.positions[pos1]) / (this.positions[pos2] - this.positions[pos1]);
        }

        return this.lerpColors(this.colors[pos1], this.colors[pos2], percentage);
    }

    lerpColors(color1, color2, percentage){
        let rgb1 = hexToRgb(color1);
        let rgb2 = hexToRgb(color2);

        let r = Math.floor(this.lerpValue(rgb1[0], rgb2[0], percentage));
        let g = Math.floor(this.lerpValue(rgb1[1], rgb2[1], percentage));
        let b = Math.floor(this.lerpValue(rgb1[2], rgb2[2], percentage));

        return rgbToHex(r, g, b);
    }

    lerpValue(v1, v2, percentage){
        return v1 + (v2 - v1) * percentage;
    }
}
