import model from "./model";
import jsplumb from 'jsplumb';

const ju = jsplumb.jsPlumbUtil;
const jp = jsplumb.jsPlumb;

//数据处理
let handleData = (function () {
    function handleData(params) {
        this.array = [];
        this.x = params.x;
        this.y = params.y;
        this.flowchartData = {};
    }
    handleData.prototype.add = function (data, id) {
        //对新增的节点进行初始化，将新增的节点加入到array中
        //判断data是否为开始节点,若是，在节点后添加一个blank节点
        //若不是开始节点，再判断是否是判断节点
        //若是判断节点，在添加节点后还需要加上空白节点
        //若不是判断节点，添加节点
        //添加新增节点和空白节点到array中
        //计算位置
        window.console.log(data, '添加数据');
        window.console.log(id);
        let newNode = data,
            parentData, parentNode, index;

        if (id) {
            parentData = this.findParent(id);
            parentNode = parentData[0];
            index = parentData[1];
        }

        //新增节点初始化
        initNode(newNode);

        //添加到渲染数组中
        this.array.push(newNode);

        //判断是否为开始节点
        if (newNode.node_executor == 'play') {
            let blank = new model.Blank();
            initNode(blank);

            newNode.next.push(blank.id);
            this.array.push(blank)
        } else {
            if (newNode.node_type == 'condition_controller') {

                newNode.next.push(parentNode.splice(index, 1, newNode.id).id)
                for (let i = 1; i < newNode.judgement.branchs.length; i++) {
                    let blank = new model.Blank();
                    initNode(blank);

                    newNode.next.push(blank.id);
                    this.array.push(blank)
                }

            } else {
                newNode.next.push(parentNode.splice(index, 1, newNode.id).id)
            }
        }

        //处理位置
        this.handlePosition(parentNode ? parentNode : newNode);

        function initNode(data) {
            data.position = {};
            data.next = [];
            data.id = ju.uuid();
        }

    };
    handleData.prototype.delete = function (id) {
        //获取要删除节点的id
        //获取节点在array中的位置，splice删除
        //判断被删除节点的next节点，递归删除
        let _delete = (id) => {
            for (let i = 0; i < this.array.length; i++) {
                if (this.array[i].id == id) {
                    let next = this.array.splice(i, 1).next;
                    next.forEach((item) => {
                        _delete(item);
                    })
                }
            }
        }
        _delete(id);
    };
    handleData.prototype.modify = function (data) {
        window.console.log(data, '修改数据')
        let node = this.check(data.id);
        Object.assign(node, data);
    };
    handleData.prototype.getFlowchartData = function (data) {
        this.flowchartData = new model.flowchartData(data);
    };
    handleData.prototype.handlePosition = function (node) {
        //先计算位置，然后判断x轴的是否重叠，如果重叠则调整位置
        let _this = this,
            end = [];
        //判断node是否为开始节点,计算位置
        if (node.id == this.array[0].id) {
            _calculatePosition(node, {
                x: 0,
                y: 0
            });
        } else {
            _calculatePosition(node, node.position);
        }

        //判断是否调整位置
        _judgeIsAdjust(_adjustPosition)

        function _calculatePosition(node, position) {
            let firstNode = node,
                firstPositon = position,
                next = firstNode.next;

            //给第一个节点位置进行赋值
            Object.assign(firstNode.position, firstPositon);
            //算出总长度，给next节点位置进行赋值
            let length = (next.length - 1) * _this.x / 2,
                y = firstPositon.y + _this.y;

            next.forEach((item, index) => {
                let nextNode = _this.check(item),
                    nextPosition = {};

                nextPosition.x = index * _this.x - length;
                nextPosition.y = y;
                _calculatePosition(nextNode, nextPosition);
            })
            if (!next.length) {
                end.push(firstNode)
            }
        }

        function _judgeIsAdjust(fn) {
            let judge = false;

            for (let i = 0; i < end.length - 1; i++) {
                let distance = end[i + 1].position.x - end[i].position.x;
                if (distance < this.x) {
                    judge = true;
                    end[i + 1].position.x = end[i].position.x + this.x;
                }
            }

            if (judge) {
                this.array.forEach((item) => {
                    if (item.node_executor != 'blank' || item.node_executor != 'ending_controller') {
                        item.position.x = -1;
                    }
                })
                fn();
            }
        }

        function _adjustPosition() {
            let index = 0;
            let adjust = function (node) {
                let next = node.next,
                    a = 0;

                next.forEach((item) => {
                    let nextNode = this.check(item);
                    if (node.position.x == -1) {
                        adjust(nextNode)
                    }
                    a += item.position.x;
                })
                node.position.x = a / next.length;
            }
            while (this.array[0].position.x == -1) {
                adjust();
                index++;
                if (index > 100) {
                    window.console.log('error')
                    this.array[0].position.x == 0
                }
            }
            window.console.log('循环了' + index + '次')
        }
    };
    handleData.prototype.findParent = function (id) {
        let arr = [];
        for (let i = 0; i < this.array.length; i++) {
            let index = this.array[i].next.indexOf(id);
            if (index > -1) {
                arr.push(this.array[i], index)
            }
        }
        return arr;
    }
    handleData.prototype.restore = function () {
        let data = {};
        Object.assign(data, this.flowchartData, model.assign(this.array[0]));
        data.process_nodes = [];
        let _restore = (firstNode, ary) => {
            let node = this.check(firstNode);
            if (node.node_executor == 'blank') {
                return;
            }

            ary.push(model.assign(node));
            let next = node.next;
            if (next.length && next.length > 1) {
                next.forEach((item, index) => {
                    node.judgement.branchs[index].process_nodes = [];
                    _restore(item, node.judgement.branchs[index].process_nodes);
                })
            } else if (next.length && next.length == 1) {
                _restore(next[0], ary)
            }
        }
        _restore(this.array[0].next[0], data.process_nodes);
        return data;
    };
    handleData.prototype.transform = function (data) {
        let initNode = (data) => {
            data.position = {};
            data.id = ju.uuid();
            data.next = [];
        }
        let _concat = (ary) => {
            let a = []
            if (ary.length) {
                ary.forEach((item) => {
                    let node = new model.assign(item, true);
                    a.push(node);
                    initNode(node);
                    this.array.push(item);
                })
            } else {
                let blank = new model.Blank();
                a.push(blank);
                initNode(blank);
                this.array.push(blank);
            }

            for (let i = 0; i < a.length - 1; i++) {
                a[i].next.push(a[i + 1].id)
            }
            return a;
        }
        let _transform = (node, next) => {
            initNode(node);
            this.array.push(node);

            next.forEach((item) => {
                let newArray = _concat(item),
                    next = [];
                
                node.next.push(newArray[0].id);

                if (newArray[newArray.length - 1].node_type == 'condition_controller') {
                    newArray.judgement.branchs.forEach((item) => {
                        next.push(item.process_nodes)
                    })
                    _transform(newArray[newArray.length - 1], next)
                }
            })

        }
        let a = ju.clone(data); //拷贝
        a.node_executor = 'play';
        let play = model.assign(a,false),
            next = [];
        next.push(a.process_nodes)
        _transform(play, next);
    };
    handleData.prototype.init = function (data) {
        this.transform(data);
        this.handlePosition(this.array[0]);
        window.console.log(this.array)
        return this.array
    };
    handleData.prototype.check = function (id) {
        let length = this.array.length;
        for (let i = 0; i < length; i++) {
            if (this.array[i].id == id) {
                return this.array[i]
            }
        }
    };
    return handleData;
}())

let handleJp = (function () {
    function handleJp() {

    }
    handleJp.prototype.draggable = function (el, params) {
        let ele = el;
        if (ju.isString(el)) {
            ele = document.querySelectorAll(el)
        }
        jp.draggable(ele, {
            scope: params.scope,
            clone: params.clone,
            start: params.start,
            stop: params.stop,
            drag: params.drag,
            selector: params.selector,
        })
    };
    handleJp.prototype.droppable = function (el, params) {
        let ele = el;
        if (ju.isString(el)) {
            ele = document.querySelectorAll(el)
        }
        jp.droppable(ele, {
            scope: params.scope,
            hoverclass: params.hoverclass,
            drop: params.drop,
        })
    };
    return handleJp;
}())

let Handle = function () {
    this.handledata = new handleData({
        x: 80,
        y: 80
    });
    this.handlejp = new handleJp();
    this.renderArray = this.handledata.array;

    Handle.prototype.add = function (data, id) {
        this.handledata.add(data, id)
    };
    Handle.prototype.modify = function (data) {
        this.handledata.modify(data);
    };
    Handle.prototype.getFlowchartData = function (data) {
        this.handledata.getFlowchartData(data)
    };
    Handle.prototype.init = function (data) {
        this.getFlowchartData(data)
        this.renderArray = this.handledata.init(data);

        jp.ready(() => {
            this.handlejp.draggable('.drag-item-img', {
                scope: 'drag',
                clone: true,
            })
            this.handlejp.droppable('.drop', {
                scope: 'drag',
                drop: (e) => {
                    window.console.log(e)
                }
            })
        })
    };
    Handle.prototype.restore = function () {
        let data = this.handledata.restore()
        return data;
    };
    Handle.prototype.clear = function(){
        this.renderArray.splice(0)
    }   
}

export default new Handle;