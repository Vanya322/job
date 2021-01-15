
const canvasElem = document.querySelectorAll('canvas');

var transformador = new CanvasImage(canvasElem,'thumb.jpg');

var srcRGBA = 
    {
        cb: function(r, g, b, a, factor) {
            return [r + factor, g + factor, b + factor, 255];
        }
    };

function CanvasImage(canvas, src) {
    for(let i = 0; i < canvas.length; i++){
        let context = canvas[i].getContext('2d');
        let img = new Image();
        let that = this;
        img.onload = function(){
            canvas[i].width = img.width;
            canvas[i].height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);
            that.original = that.getData();
        };
        img.src = src;
        this.context = context;
        this.image = img;
        if(i === 1) {
            setTimeout(() => {
                transformador.transform(srcRGBA.cb, 111);
            },100);
        }
    }
}

CanvasImage.prototype.getData = function() {
    return this.context.getImageData(0, 0, this.image.width, this.image.height);
};
CanvasImage.prototype.setData = function(data) {
    return this.context.putImageData(data, 0, 0);
};

CanvasImage.prototype.transform = function(fn, factor) {
    var olddata = this.original;
    var oldpx = olddata.data;
    var newdata = this.context.createImageData(olddata);
    var newpx = newdata.data
    var res = [];
    var len = newpx.length;
    for (var i = 0; i < len; i += 4) {
        res = fn.call(this, oldpx[i], oldpx[i+1], oldpx[i+2], oldpx[i+3], factor, i);
        newpx[i]   = res[0]; // r
        newpx[i+1] = res[1]; // g
        newpx[i+2] = res[2]; // b
        newpx[i+3] = res[3]; // a
    }
    this.setData(newdata);
};