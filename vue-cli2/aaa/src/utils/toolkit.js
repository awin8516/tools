var toolkit = {};
//防抖
toolkit.debounce = function (func,wait,immediate){
    var timer;
    return function(){
        var content = this,
            args = arguments;
        
        if(timer) clearTimeout(timer);
        if(immediate){
            var callnow = !timer;

            timer = setTimeout(function (){
                timer = null;
            },wait)
    
            if(callnow) func.apply(content,args)
        }else{
            timer = setTimeout(function (){
                func.apply(content,args)
            },wait)
        }
    }
}
//节流
toolkit.throttle = function(func,wait,immediate){
    var timer;
    return function (){
        var content = this,
            args = arguments;
        
        if(!timer&&immediate){
            timer = setTimeout(function(){
                timer = null;
            },wait)
            func.apply(content,args)
        }else if(!timer&&!immediate){
            timer = setTimeout(function(){
                timer = null;
                func.apply(content,args)
            },wait)
        }
    }
}

export default toolkit;

