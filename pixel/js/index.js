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
        contextmenuBox: document.querySelector("#contextmenuBox"),
        contextmenuActive: null,
        blockSelected: null
    }

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
        }
    }
    ob.button.onclick = function () {
        imgIndex = 0;
        ob.result.innerHTML = "";
        listData = [];
        mapFiles(function (data) {
            ob.save.disabled = "";
            JSONData = Object.assign([], data);
            alert("任务完成")
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

    /**
     * 预览&修正
     * @param {*} e 
     */
    function preview(e) {
        var index = e.target.dataset.index;
        if (index != undefined && e.target.tagName == 'BUTTON') {
            previewImgIndex = index;
            var html = '<img class="preview-img" src="' + window.URL.createObjectURL(IMGS[index]) + '">';
            html += createImgBlock(index)
            ob.previewBox.innerHTML = html;
            ob.blocks = Array.prototype.slice.call(document.querySelectorAll(".preview-block"))
            ob.preview.classList.add("show")
        }
    }

    /**
     * 生成色块HTML
     * @param {*} e 
     */
    function createImgBlock(index) {
        var html = ""
        JSONData[index].forEach((block, i) => {
            html += createBlock(block,index,i);
        });
        return html
    }
    
    /**
     * 生成色块HTML
     * @param {*} e 
     */
    function createBlock(block,index,i) {
        var s = formatStyle(block);
        return '<div class="preview-block" data-img="' + index + '" data-block="' + i + '" style="' + s.style + '" title="' + s.title + '"><b></b><b></b><b></b><b></b><s></s></div>'
    }

    /**
     * 开始任务
     * @param {*} callback 
     */
    function mapFiles(callback) {
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
                    li.innerHTML = "<s>【" + (imgIndex + 1) + "】</s> <span>已完成，查找到" + data.length + "个坐标区域</span><button class='button' data-index='" + imgIndex + "'>预览</button>";
                    listData.push(data)
                });
                imgIndex++;
                mapFiles(callback)
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
        var contrastColor = ob.contrastColor.find(c => c.checked).value.split(",").map(Number);
        var colorRange = getRange(contrastColor, 5, 10);
        // console.log(colorRange);
        ctx.fillStyle = 'rgb(' + contrastColor[0] + ',' + contrastColor[1] + ',' + contrastColor[2] + ')';
        ctx.fillRect(0, 0, ob.canvas.width, ob.canvas.height);
        ctx.drawImage(img, 0, 0);                           // 将图片绘制到画布上

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
                ob.blocks.forEach(b => {
                    b.classList.remove("selected")
                })
                e.target.classList.add("selected")
                ob.html.classList.add("editing")
                editEvent.on(e.target);
                ob.blockSelected = e.target
            }
        } else if (e.target.tagName == "S") {//删除块
            if (ob.blockSelected) {
                if (confirm('确认删除当前坐标吗')) {
                    var img = ob.blockSelected.dataset.img;
                    var block = ob.blockSelected.dataset.block;
                    JSONData[img].splice(block, 1);
                    editEvent.off(ob.blockSelected);
                    ob.blockSelected.parentElement.removeChild(ob.blockSelected);
                    ob.html.classList.remove("editing")
                    ob.blockSelected = null
                }
            }
        } else {//取消选中
            if (ob.blockSelected) {
                editEvent.off(ob.blockSelected);
                ob.blockSelected.classList.remove("selected")
                ob.html.classList.remove("editing")
                ob.blockSelected = null
            }
        }
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
        // console.log(e)
        var e = e || event;
        e.preventDefault();
        var temp = e.target;
        while (temp && (!temp.dataset || (temp.dataset && !temp.dataset.contextmenu))){
            temp = temp.parentElement;
        }
        if (temp && temp.dataset && temp.dataset.contextmenu) {
            ob.contextmenuActive && ob.contextmenuActive.classList.remove("show");
            ob.contextmenuActive = document.querySelector("#" + temp.dataset.contextmenu);
            css(ob.contextmenuActive, {
                left: e.pageX,
                top: e.pageY
            })
            ob.contextmenuActive.dataset.offsetX = e.offsetX;
            ob.contextmenuActive.dataset.offsetY = e.offsetY;
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
            var y = e.target.parentElement.dataset.offsetY
            var block = {
                left : x,
                top : y,
                width : 50,
                height : 50,
                center: [x+25, y+25]
            }
            var html = createBlock(block,previewImgIndex,JSONData[previewImgIndex].length);
            var newBlock = document.createElement("div")
            newBlock.innerHTML = html
            ob.previewBox.appendChild(newBlock.children[0])
            JSONData[previewImgIndex].push(block)
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
    var r = [];
    var index = color.findIndex(c => c == 255);
    var o1 = color.findIndex(c => c == 0);
    var o2 = 3 - o1 - index;

    for (var i = 0; i < range1; i++) {
        /*-*/ /*  255-- */
        var rgb = Object.assign([], color);
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