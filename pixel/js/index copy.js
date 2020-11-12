window.onload = function () {


    var ob = {
        html: document.querySelector("html"),
        file: document.querySelector("#file"),
        toleranceX: parseInt(document.querySelector("#toleranceX")),
        toleranceY: parseInt(document.querySelector("#toleranceY")),
        toleranceColor: parseInt(document.querySelector("#toleranceColor")),
        contrastColor: Array.prototype.slice.call(document.querySelectorAll("[name=contrastColor]")),
        button: document.querySelector("#button"),
        progressCompleted: document.querySelector("#progressCompleted"),
        progressTotal: document.querySelector("#progressTotal"),
        img: document.querySelector("#img"),
        canvas: document.querySelector("#canvas"),
        result: document.querySelector("#result"),
        save: document.querySelector("#save"),
        preview: document.querySelector("#preview"),
        previewScroll: document.querySelector("#previewScroll"),
        previewBox: document.querySelector("#previewBox"),
        previewImg: document.querySelector("#previewImg"),
        previewClose: document.querySelector("#previewClose"),
        btnTips: document.querySelector("#btnTips"),
        tips: document.querySelector("#tips"),
        contextmenuBox: document.querySelector("#contextmenuBox"),
        contextmenuActive: null,
        blockSelected: null
    }

    var CONFIG = {};
    var IMGS = [];
    var imgIndex = 0;
    var previewImgIndex = null;
    var listData = [];
    var JSONData = [];
    var keyShift = false;


    ob.file.onchange = function (e) {
        if (this.files && this.files[0]) {
            IMGS = [];
            IMGS = Array.prototype.slice.call(this.files);
            ob.button.disabled = "";
            ob.progressCompleted.innerHTML = 0;
            ob.progressTotal.innerHTML = IMGS.length;
        }
    };

    $('#colorPicker').ColorPicker({
        color: '#349f4d',
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            $('#colorPicker b').css('backgroundColor', '#' + hex);
            console.log(rgb)
            document.querySelector("#customColor").value = Object.values(rgb)
        }
    });


    ob.button.onclick = function () {
        CONFIG = getConfig();
        if (IMGS.length <= 0) {
            alert("请选择素材图片");
            return false;
        }
        ob.html.classList.add("tasking");
        imgIndex = 0;
        ob.result.innerHTML = "";
        listData = [];
        mapFiles(function (data) {
            ob.save.disabled = "";
            JSONData = Object.assign([], data);
            ob.progressCompleted.innerHTML = "任务完成";
            console.log("任务完成")
        });
    }
    ob.save.onclick = function () {
        copy2Clipboard(JSONData);
    }
    ob.result.addEventListener("click", preview, false);
    ob.preview.addEventListener("click", editPos, false);
    ob.previewClose.onclick = function () { ob.preview.classList.remove("show");previewImgIndex = null;}
    ob.btnTips.onclick = function () { ob.tips.classList.add("show") };
    ob.tips.onclick = function () { ob.tips.classList.remove("show") };
    document.oncontextmenu = contextmenu;
    document.addEventListener("click", menuCommon, false);

    function getConfig(){
        CONFIG.imgs = IMGS
    }

    /**
     * 预览&修正
     * @param {*} e 
     */
    function preview(e) {
        var index = e.target.dataset.index;
        if (index != undefined && e.target.tagName == 'BUTTON') {
            previewImgIndex = index;
            var html = '<img class="preview-img" src="' + window.URL.createObjectURL(IMGS[index]) + '">';
            html += createImgBlockHtml(index)
            ob.previewBox.innerHTML = html;
            ob.blocks = Array.prototype.slice.call(document.querySelectorAll(".preview-block"))
            ob.preview.classList.add("show")
        }
    }

    /**
     * 创建图片中色块HTML
     * @param {*} e 
     */
    function createImgBlockHtml(index) {
        var html = ""
        JSONData[index].forEach((block, i) => {
            html += createBlockHtml(block,index,i);
        });
        return html
    }
    
    /**
     * 创建色块HTML
     * @param {*} e 
     */
    function createBlockHtml(block,index,i) {
        var s = formatStyle(block);
        return '<div class="preview-block" data-img="' + index + '" data-block="' + i + '" style="' + s.style + '" title="' + s.title + '"><p>' + (i+1) + '</p><b></b><b></b><b></b><b></b><s></s></div>'
    }

    function updateProgress(num){
        ob.progressCompleted.innerHTML = num;
        ob.progressCompleted.style.width = (num / IMGS.length * 100) + "%";
        ob.result.scrollTo(0,100000);
    }

    /**
     * 开始任务
     * @param {*} callback 
     */
    function mapFiles(callback) {
        if (imgIndex < IMGS.length) {
            ob.img.src = window.URL.createObjectURL(IMGS[imgIndex]);
            var li = document.createElement("li");
            li.innerHTML = "<s>【" + (imgIndex + 1) + "】</s> <span>loading...</span>";
            ob.result.appendChild(li);

            ob.img.onload = function () {
                getPos(ob.img, function (data) {
                    li.className = "completed"
                    li.innerHTML = "<s>【" + (imgIndex + 1) + "】</s> <span>已完成，查找到" + data.length + "个坐标区域</span><button class='button' data-index='" + imgIndex + "'>预览</button>";
                    listData.push(data);
                    imgIndex++;
                    updateProgress(imgIndex);
                    // console.log(imgIndex)
                    mapFiles(callback)
                });
            }
        } else {
            callback && callback(listData);
        }
    }

    /**
     * 查找像素块
     * @param {*} img 
     * @param {*} callback 
     */
    function getPos(img, callback) {
        ob.canvas.width = img.width;
        ob.canvas.height = img.height;
        var ctx = ob.canvas.getContext("2d");                  // 设置在画布上绘图的环境
        var contrastColor = ob.contrastColor.find(c => c.checked).value;
        if(contrastColor == "transparent"){
            contrastColor = [255,0,0];
            // console.log('rgb(' + contrastColor[0] + ',' + contrastColor[1] + ',' + contrastColor[2] + ')')
            ctx.fillStyle = 'rgb(' + contrastColor[0] + ',' + contrastColor[1] + ',' + contrastColor[2] + ')';
            ctx.fillRect(0, 0, ob.canvas.width, ob.canvas.height);
        }else{
            contrastColor = contrastColor.split(",").map(Number);
        }
        
        // ctx.fillStyle = 'rgb(' + contrastColor[0] + ',' + contrastColor[1] + ',' + contrastColor[2] + ')';
        // ctx.fillRect(0, 0, ob.canvas.width, ob.canvas.height);
        var colorRange = getRange(contrastColor, ob.toleranceColor, ob.toleranceColor * 2);
        // var colorRange = getRange(contrastColor, 5, 10);
        ctx.drawImage(img, 0, 0);                           // 将图片绘制到画布上

        // console.log(colorRange)
        var tolerance = { x: 2, y: 2 }
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
            if (line.length > 8) {
                // ctx.fillStyle = '#ff0000';
                // ctx.fillRect(line[0].left, line[0].top, line.length, 1);
                if (pixelRects.length == 0) {//记录首个色条
                    newRect(line);
                    // ctx.fillStyle = '#ff8800';
                    // ctx.fillRect(line[0].left, line[0].top, line.length, 1);
                    currentLine = line;
                    continue;
                };
                if (i > 318) {

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

    /**
     * 编辑已生成的像素块
     * @param {*} e 
     */
    function editPos(e) {
        // console.log(e)
        var index = e.target.dataset.block;
        if (index != undefined) {//选中块
            if (e.target !== ob.blockSelected) {
                selectBlock(index);
            }
        } else if (e.target.tagName == "S") {//删除块
            if (ob.blockSelected) {
                if (confirm('确认删除当前坐标吗')) {
                    var imgIndex = ob.blockSelected.dataset.img;
                    var blockIndex = ob.blockSelected.dataset.block;
                    delBlock(imgIndex, blockIndex);
                }
            }
        } else {//取消选中
            if (ob.blockSelected) {
                unSelectBlock(ob.blockSelected.dataset.block)
            }
        }
    }

    function createBlock(imgIndex, data){        
        var html = createBlockHtml(data,imgIndex,JSONData[imgIndex].length);
        var newBlock = document.createElement("div")
        newBlock.innerHTML = html
        ob.previewBox.appendChild(newBlock.children[0])
        JSONData[imgIndex].push(data);
        ob.blocks = Array.prototype.slice.call(document.querySelectorAll(".preview-block"))
    }

    function selectBlock(index){        
        ob.blocks.forEach(b => {b.classList.remove("selected");})
        ob.blocks[index].classList.add("selected");
        ob.html.classList.add("editing");
        editEvent.on(ob.blocks[index]);
        ob.blockSelected = ob.blocks[index];
    }

    function unSelectBlock(index){
        var block = ob.blocks[index];
        var isblockSelected = (block == ob.blockSelected);    
        editEvent.off(block);
        block.classList.remove("selected")
        ob.html.classList.remove("editing")
        isblockSelected && (ob.blockSelected = null)
    }

    function delBlock(imgIndex, blockIndex){
        var block = ob.blocks[blockIndex];
        var isblockSelected = (block == ob.blockSelected);
        JSONData[imgIndex].splice(blockIndex, 1);
        editEvent.off(block);
        block.parentElement.removeChild(block);
        ob.blocks = Array.prototype.slice.call(document.querySelectorAll(".preview-block"));
        ob.blocks.forEach((b,i) => {b.dataset.block = i;})
        ob.html.classList.remove("editing")
        isblockSelected && (ob.blockSelected = null)
    }


    var editEvent = {
        on: function (el) {
            document.onkeydown = function (e) {
                // console.log(e)
                var code = e.key || e.keyCode || e.which;
                if (code == "Shift" || code == 16) {
                    // console.log("Shift - down")
                    !keyShift && ob.blockSelected.classList.add("shift-down")
                    keyShift = true;
                } else {
                    if (e.shiftKey) {
                        // console.log("Shift - true")
                        if (code == "W" || code == "w" || code == 87) {
                            css(el, { "height": "-1" });
                        }
                        if (code == "A" || code == "a" || code == 65) {
                            css(el, { "width": "-1" });
                        }
                        if (code == "S" || code == "s" || code == 83) {
                            css(el, { "height": "+1" });
                        }
                        if (code == "D" || code == "d" || code == 68) {
                            css(el, { "width": "+1" });
                        };
                    } else {
                        // console.log("Shift - false")
                        if (code == "W" || code == "w" || code == 87) {
                            css(el, { "top": "-1" });
                        }
                        if (code == "A" || code == "a" || code == 65) {
                            css(el, { "left": "-1" });
                        }
                        if (code == "S" || code == "s" || code == 83) {
                            css(el, { "top": "+1" });
                        }
                        if (code == "D" || code == "d" || code == 68) {
                            css(el, { "left": "+1" });
                        };
                    }
                    updateJSON(el)
                }
            }
            document.onkeyup = function (e) {
                var code = e.key || e.keyCode || e.which;
                if (code == "Shift" || code == 16) {
                    // console.log("Shift - up")
                    ob.blockSelected.classList.remove("shift-down")
                    keyShift = false;
                }
            }

            document.onmousewheel = function (e) {
                var delta = e.deltaY;
                blockScale(el, delta)
                updateJSON(el)
            }
        },
        off: function (el) {
            document.onkeydown = null
            document.onmousewheel = null
        }
    }

    function css(el, style) {
        for (var key in style) {
            var value = style[key];
            if (typeof value == "string") {
                if (/\+|\-/.test(value)) {
                    el.style[key] = (parseInt(el.style[key]) + parseInt(value)) + "px";
                } else {
                    el.style[key] = parseInt(value) + "px";
                }
            } else {
                el.style[key] = style[key] + "px";
            }
        }
    }

    function blockScale(el, delta) {
        var x = 4;
        var y = parseInt(parseInt(el.style.height) / parseInt(el.style.width) * x);
        if (delta > 0) {
            css(el, {
                "width": "+" + x,
                "height": "+" + y,
                "left": "-" + (x / 2),
                "top": "-" + (y / 2)
            })
        } else {
            css(el, {
                "width": "-" + x,
                "height": "-" + y,
                "left": "+" + (x / 2),
                "top": "+" + (y / 2)
            })
        }
    }
    function updateJSON(el) {
        var style = el.style;
        var img = el.dataset.img;
        var block = el.dataset.block;

        JSONData[img][block].left = parseInt(style.left);
        JSONData[img][block].top = parseInt(style.top);
        JSONData[img][block].width = parseInt(style.width);
        JSONData[img][block].height = parseInt(style.height);
        JSONData[img][block].center = [parseInt(style.left) + parseInt(style.width) / 2, parseInt(style.top) + parseInt(style.height) / 2];

        var s = formatStyle(JSONData[img][block]);
        el.title = s.title;
    }

    function contextmenu(e) {
        console.log(e)
        var e = e || event;
        e.preventDefault();
        var temp = e.target;
        while (temp && (!temp.dataset || (temp.dataset && !temp.dataset.contextmenu))){
            temp = temp.parentElement;
        }
        if (temp && temp.dataset && temp.dataset.contextmenu) {
            console.log(e)
            ob.contextmenuActive && ob.contextmenuActive.classList.remove("show");
            ob.contextmenuActive = document.querySelector("#" + temp.dataset.contextmenu);
            css(ob.contextmenuActive, {
                left: e.pageX,
                top: e.pageY
            })
            ob.contextmenuActive.dataset.offsetX = e.pageX - ob.previewBox.offsetLeft + ob.previewScroll.scrollLeft;
            ob.contextmenuActive.dataset.offsetY = e.pageY - ob.previewBox.offsetTop + ob.previewScroll.scrollTop;
            ob.contextmenuActive.classList.add("show");
        }
    }

    function menuCommon(e) {
        // console.log(e)
        var e = e || event;
        var common = e.target.dataset.common;
        if (common != undefined) {
            contextmenuCommon[common]();
            ob.contextmenuActive.classList.remove("show");
            ob.contextmenuActive = null;
        }else{
            ob.contextmenuActive && ob.contextmenuActive.classList.remove("show");
            ob.contextmenuActive = null;
        }
    }

    var contextmenuCommon = {
        m_createBlock: function (e) {
            var e = e || event;
            // console.log("新建坐标")
            var x = e.target.parentElement.dataset.offsetX
            var y = e.target.parentElement.dataset.offsetY;
            var block = {
                left : x,
                top : y,
                width : 50,
                height : 50,
                center: [x+25, y+25]
            }
            createBlock(previewImgIndex, block);
        },
        m_editBlock: function () {
            console.log("编辑坐标")
        },
        m_delBlock: function () {
            console.log("删除坐标")
        }
    }
};

function copy2Clipboard(data) {
    var textarea = document.createElement("textarea");
    textarea.className = "clipboard-textarea"
    textarea.value = JSON.stringify(data)
    document.body.appendChild(textarea);
    textarea.select(); // 选择对象
    document.execCommand("Copy");
    alert("复制成功")
}

function formatStyle(block) {
    return {
        style: 'left:' + block.left + 'px;top:' + block.top + 'px;width:' + block.width + 'px;height:' + block.height + 'px;center:' + block.center + ';',
        title: '坐标：\n' + 'left: ' + block.left + 'px\ntop: ' + block.top + 'px\nwidth: ' + block.width + 'px\nheight: ' + block.height + 'px\ncenter: ' + block.center
    }
}

function getRange(color, range1, range2) {
    var range1 = range1 || 5;
    var range2 = range2 || 100;
    range1 = parseInt(range1);
    range2 = parseInt(range2);
    var r = [];

    var _max = Math.max(...color);
    var index = color.findIndex(c => c == _max);
    var o1 = index == 0 ? 1 : 0;


    // var index = color.findIndex(c => c == 255);
    // var o1 = color.findIndex(c => c == 0);
    var o2 = 3 - o1 - index;

    for (var i = -range1; i < range1; i++) {
        /*-*/ /*  255-- */
        var rgb = Object.assign([], color);
        rgb[index] = color[index] + i;
        if(rgb[index] >=0 && rgb[index] <=255){
            r.push(rgb.join("-"));

            for (var k = -range2; k < range2; k++) {
                /*-+-*/
                rgb[o1] = color[o1] + k;
                rgb[o2] = color[o2];
                if(rgb[o1] >=0 && rgb[o1] <=255){
                    r.push(rgb.join("-"));
                }

                /*--+*/
                rgb[o1] = color[o1];
                rgb[o2] = color[o2] + k;
                if(rgb[o2] >=0 && rgb[o2] <=255){
                    r.push(rgb.join("-"));
                }

                /*-++*/
                rgb[o1] = color[o1] + k;
                rgb[o2] = color[o2] + k;
                if(rgb[o1] >=0 && rgb[o1] <=255 && rgb[o2] >=0 && rgb[o2] <=255){
                    r.push(rgb.join("-"));
                }
            }
        }
        
    }
    return r;
}