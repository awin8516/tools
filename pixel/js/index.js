window.onload = function () {


    var ob = {
        html: document.querySelector("html"),
        file: document.querySelector("#file"),
        toleranceX: document.querySelector("#toleranceX"),
        toleranceY: document.querySelector("#toleranceY"),
        contrastColor: Array.prototype.slice.call(document.querySelectorAll("[name=contrastColor]")),
        button: document.querySelector("#button"),
        img: document.querySelector("#img"),
        canvas: document.querySelector("#canvas"),
        result: document.querySelector("#result"),
        save: document.querySelector("#save"),
        preview: document.querySelector("#preview"),
        previewBox: document.querySelector("#previewBox"),
        previewImg: document.querySelector("#previewImg"),
        previewClose: document.querySelector("#previewClose"),
        btnTips: document.querySelector("#btnTips"),
        tips: document.querySelector("#tips"),
        blockSelected:null
    }

    var IMGS = [];
    var imgIndex = 0;
    var listData = [];
    var JSONData = [];


    ob.file.onchange = function (e) {
        if (this.files && this.files[0]) {
            IMGS = [];
            IMGS = Array.prototype.slice.call(this.files);
            ob.button.disabled = "";
        }
    }

    ob.button.onclick = function () {
        imgIndex = 0;
        ob.result.innerHTML = "";
        listData = [];
        mapFiles();
    }
    ob.save.onclick = function(){
        copy2Clipboard(JSONData);
    }
    ob.result.addEventListener("click", preview, false);
    ob.preview.addEventListener("click", editPos, false);
    ob.previewClose.onclick = function () { ob.preview.classList.remove("show") }
    ob.btnTips.onclick = function () { ob.tips.classList.add("show") };
    ob.tips.onclick = function () { ob.tips.classList.remove("show") };

    function preview(e) {
        // console.log(e.target.dataset.index);
        var index = e.target.dataset.index;
        if (index != undefined && e.target.tagName == 'BUTTON') {
            var html = '<img class="preview-img" src="' + window.URL.createObjectURL(IMGS[index]) + '">';
            JSONData[index].forEach((block, i) => {
                var s = formatStyle(block);
                html += '<div class="preview-block" data-img="'+index+'" data-block="'+i+'" style="' + s.style + '" title="'+s.title+'"><b></b><b></b><b></b><b></b></div>'
            });
            ob.previewBox.innerHTML = html;
            ob.blocks = Array.prototype.slice.call(document.querySelectorAll(".preview-block"))
            ob.preview.classList.add("show")
        }
    }

    function formatStyle(block){
        return {
            style:'left:' + block.left + 'px;top:' + block.top + 'px;width:' + block.width + 'px;height:' + block.height + 'px;center:' + block.center + ';',
            title:'坐标：\n'+'left: ' + block.left + 'px\ntop: ' + block.top + 'px\nwidth: ' + block.width + 'px\nheight: ' + block.height + 'px\ncenter: ' + block.center
        }
    }
    
    function editPos(e) {
        var index = e.target.dataset.block;
        if (index != undefined) {
            if(e.target !== ob.blockSelected){
                ob.blocks.forEach(b=>{
                    b.classList.remove("selected")
                })
                ob.blockSelected = e.target
                ob.blockSelected.classList.add("selected")
                ob.html.classList.add("editing")
                editEvent.on(ob.blockSelected);
            }
        }else{
            if(ob.blockSelected){
                ob.blockSelected.classList.remove("selected")
                ob.blockSelected = null
                editEvent.off(ob.blockSelected);
                ob.html.classList.remove("editing")
            }
        }
    }

    var editEvent = {
        on :function(el){
            document.onkeydown = function(e){
                // console.log(e);
                var code = e.key || e.keyCode || e.which;
                if(code == "w" || code == 87){
                    gradually(ob.blockSelected, "top", -1);
                }
                if(code == "a" || code == 65){
                    gradually(ob.blockSelected, "left", -1);
                }
                if(code == "s" || code == 83){
                    gradually(ob.blockSelected, "top", 1);
                }
                if(code == "d" || code == 68){
                    gradually(ob.blockSelected, "left", 1);
                };
                updateJSON(ob.blockSelected)
            }

            document.onmousewheel = function(e){
                // console.log(e);
                var delta = e.deltaY;
                blockResize(ob.blockSelected, delta)
                updateJSON(ob.blockSelected)
            }
        },
        off:function(el){
            document.onkeydown = null
            document.onmousewheel = null
        }
    }

    function gradually(el, name, step){
        el.style[name] = (parseInt(el.style[name]) + step) +"px";
    }
    function blockResize(el, delta){
        var x = 4;
        var y = parseInt(parseInt(el.style.height) / parseInt(el.style.width) * x );
        if(delta>0){
            gradually(el, "width", x);
            gradually(el, "height", y);
            gradually(el, "left", -x/2);
            gradually(el, "top", -y/2);
        }else{
            gradually(el, "width", -x);
            gradually(el, "height", -y);
            gradually(el, "left", x/2);
            gradually(el, "top", y/2);
        }
    }
    function updateJSON(el){
        var style = el.style;
        var img = el.dataset.img;
        var block = el.dataset.block;

        JSONData[img][block].left = parseInt(style.left);
        JSONData[img][block].top = parseInt(style.top);
        JSONData[img][block].width = parseInt(style.width);
        JSONData[img][block].height = parseInt(style.height);
        JSONData[img][block].center = [parseInt(style.left) + parseInt(style.width)/2, parseInt(style.top) + parseInt(style.height)/2];

        var s = formatStyle(JSONData[img][block]);
        el.title = s.title;
    }

    function mapFiles() {
        if (IMGS.length <= 0) {
            alert("请选择素材图片");
            return false;
        }
        if (imgIndex < IMGS.length) {
            ob.img.src = window.URL.createObjectURL(IMGS[imgIndex]);
            var li = document.createElement("li");
            li.innerHTML = "<s>【" + (imgIndex + 1) + "】</s> <span>loading...</span>";
            ob.result.appendChild(li);

            ob.img.onload = function () {
                getPos(ob.img, function (data) {
                    li.className = "completed"
                    li.innerHTML = "<s>【" + (imgIndex + 1) + "】</s> <span>已完成，查找到" + data.length + "个区域块</span><button class='button' data-index='" + imgIndex + "'>预览</button>";
                    listData.push(data)
                });
                imgIndex++;
                mapFiles()
            }
        } else {
            // ob.button.disabled = "disabled";
            ob.save.disabled = "";
            JSONData = Object.assign([], listData);
        }
    }

    function getPos(img, callback) {
        ob.canvas.width = img.width;
        ob.canvas.height = img.height;
        var ctx = ob.canvas.getContext("2d");                  // 设置在画布上绘图的环境
        var contrastColor = ob.contrastColor.find(c => c.checked ).value.split(",").map(Number);
        var colorRange = getRange(contrastColor, 5, 10);
        // console.log(colorRange);
        ctx.fillStyle = 'rgb(' + contrastColor[0] + ',' + contrastColor[1] + ',' + contrastColor[2] + ')';
        ctx.fillRect(0, 0, ob.canvas.width, ob.canvas.height);
        ctx.drawImage(img, 0, 0);                           // 将图片绘制到画布上

        var tolerance =  {x:2,y:2}
        tolerance.x = ob.toleranceX.value || tolerance.x;
        tolerance.y = ob.toleranceY.value || tolerance.y;

        // 获取画布上的图像像素矩阵
        // 获取到的数据为一维数组，包含图像的RGBA四个通道数据
        var imgData = ctx.getImageData(0, 0, ob.canvas.width, ob.canvas.height).data;

        // console.log(imgData);

        // 将获取到的图像数据去除A通道
        var imgArr = [];
        for (var i = 0; i < imgData.length; i += 4) {
            imgArr.push([imgData[i], imgData[i + 1], imgData[i + 2]])
        }
        // console.log(imgArr)

        //找到符合像素点集
        var pixels = []
        for (var i = 0; i < imgArr.length; i++) {
            if (colorRange.includes(imgArr[i].join("-"))) {
                pixels.push({ rgb: imgArr[i], index: i, left: i % ob.canvas.width, top: parseInt(i / ob.canvas.width) })
            }
        }
        // console.log(pixels)


        /********************
         * 像素集按同块分隔
         ********************/
        var pixellines = [];
        var lineIndex = -1;
        var currentPixel = null;
        var pixelRects = [];
        var rectIndex = -1;
        var currentLine = null;
        var resultData = []

        //新的像素条
        function newLine(pixel) {
            lineIndex++;
            pixellines[lineIndex] = [];
            currentPixel = pixel;
            pixellines[lineIndex].push(currentPixel);
        }

        //新的像素块
        function newRect(line) {
            rectIndex++;
            pixelRects[rectIndex] = [];
            currentLine = line;
            pixelRects[rectIndex].push(currentLine);
        }

        //当前像素点是否属于已存在的像素块
        function findRectByLine(line) {
            var res = null;
            for (var i = 0; i < pixelRects.length; i++) {
                var rect = pixelRects[i];
                var lastLine = rect[rect.length - 1]
                if (line[0].top - lastLine[0].top <= tolerance.y &&
                    line[0].left < lastLine[lastLine.length - 1].left &&
                    line[line.length - 1].left > lastLine[0].left) {
                    res = i;
                    break;
                } else {
                    res = null;
                }
            }
            return res;
        }

        for (var i = 0; i < pixels.length; i++) {
            var pixel = pixels[i];
            if (pixellines.length == 0) {//记录首个顶点
                newLine(pixel);
                currentPixel = pixel;
                continue;
            }
            if (pixel.index - currentPixel.index <= tolerance.x) {//横向相邻的点
                pixellines[lineIndex].push(pixel);
            } else {
                newLine(pixel);
            }
            currentPixel = pixel;
        }
        // return false;
        // console.log(pixellines)


        for (var i = 0; i < pixellines.length; i++) {
            var line = pixellines[i];
            if(line.length > 8){
                // ctx.fillStyle = '#ff0000';
                // ctx.fillRect(line[0].left, line[0].top, line.length, 1);
                if (pixelRects.length == 0) {//记录首个色条
                    newRect(line);
                    // ctx.fillStyle = '#ff8800';
                    // ctx.fillRect(line[0].left, line[0].top, line.length, 1);
                    currentLine = line;
                    continue;
                };
                if(i > 318){

                }
                if (line[0].top - currentLine[0].top <= tolerance.y &&
                    line[0].left < currentLine[currentLine.length - 1].left &&
                    line[line.length - 1].left > currentLine[0].left) {//
                    pixelRects[rectIndex].push(line);
                    // ctx.fillStyle = '#0000ff';
                    // ctx.fillRect(line[0].left, line[0].top, line.length, 1);
                } else {
                    //新块
                    var aa = findRectByLine(line)
                    if (aa != null) {
                        rectIndex = aa;
                        pixelRects[rectIndex].push(line);
                        // ctx.fillStyle = '#ff0000';
                        // ctx.fillRect(line[0].left, line[0].top, line.length, 1);
                    } else {
                        newRect(line);
                        // ctx.fillStyle = '#ffffff';
                        // ctx.fillRect(line[0].left, line[0].top, line.length, 1);
                    }
                }
                currentLine = line;
            }
        }
        // return false;
        // console.log(pixelRects)

        for (var i = 0; i < pixelRects.length; i++) {
            var rect = pixelRects[i];
            if (rect.length > 4) {//过滤掉非常小的块；
                var indexOfMax = 0;
                var max = rect.reduce((a, c, i) => c.length > a ? (indexOfMax = i, c.length) : a, 0)
                var data = {
                    left: rect[indexOfMax][0].left,
                    top: rect[0][0].top,
                    width: max,
                    height: rect.length
                }
                // ctx.fillStyle = '#ff0000';
                // ctx.fillRect(data.left, rect[0][0].top, data.max, rect.length);
                data.center = [data.left + data.width / 2, data.top + data.height / 2];
                resultData.push(data);
            }
        }
        // console.log(resultData);
        callback && callback(resultData);


    };
};

function copy2Clipboard(data) {
    // console.log(JSON.stringify(data))
    var textarea = document.createElement("textarea");
    textarea.className = "clipboard-textarea"
    textarea.value = JSON.stringify(data)
    document.body.appendChild(textarea);
    textarea.select(); // 选择对象
    document.execCommand("Copy");
    alert("复制成功")
}



function getRange(color, range1, range2) {
    var range1 = range1 || 5;
    var range2 = range2 || 100;
    var r = [];
    var index = color.findIndex(c => c==255 );
    var o1 = color.findIndex(c => c==0);
    var o2 = 3-o1-index;
    // console.log(index,o1,o2)

    for (var i = 0; i < range1; i++) {
        /*-*/ /*  255-- */
        var rgb = Object.assign([], color);
        // console.log(color[index])
        rgb[index] = color[index] - i;
        r.push(rgb.join("-"));

        for (var k = 0; k < range2; k++) {
            /*-+-*/
            rgb[o1] = color[o1] + k;
            rgb[o2] = color[o2];
            r.push(rgb.join("-"));

            /*--+*/
            rgb[o1] = color[o1];
            rgb[o2] = color[o2] + k;
            r.push(rgb.join("-"));

            /*-++*/
            rgb[o1] = color[o1] + k;
            rgb[o2] = color[o2] + k;
            r.push(rgb.join("-"));
        }
    }
    return r;
}