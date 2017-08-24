var include = (function () {
    String.prototype.matchAll = function(regexp) {
        var matches = [];
        this.replace(regexp, function() {
            var arr = ([]).slice.call(arguments, 0);
            var extras = arr.splice(-2);
            arr.index = extras[0];
            arr.input = extras[1];
            matches.push(arr);
        });
        return matches.length ? matches : null;
    };


    var included = {}, includes = [], html, reg = /<include>(.*?)<\/include>/g;
    var each = function (obj,fn) {
        if(!(obj instanceof Object)) return;
        if(obj.length === undefined){
            for(var i in obj){
                if(fn(obj[i]) === false) return false;
            }
        }else{
            for(var i = 0, j = obj.length; i< j; i++){
                if(fn(obj[i]) === false) return false;
            }
        }
    }
    
    var load = function (url, complete) {
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function () {
            complete.apply(this,arguments);
            preg(this.responseText)
        });
        oReq.open("GET", url);
        oReq.send();
        return oReq;
    }

    var checkLoaded = function () {
        if(each(included,function (xhr) {
                return xhr.readyState === 4;
            }) === false){ return false};
        return true;
    }

    var render = function () {
        console.log(html);
    }
    
    var preg = function (txt) {
        each(txt.matchAll(reg),function (inc) {
            include(inc[1],function () {
                
            });
        });
    }


    document.addEventListener('DOMContentLoaded',function(){ return;
        var tags = document.getElementsByTagName('include');
        each(tags,function (tag) {
            include(tag, tag.innerHTML);
        });
        var tags = document.getElementsByTagName('include_one');
        each(tags,function (tag) {
            console.log(tag);
        });
    });
    included['~'] = load('',function () {
        html = this.responseText;
    });
    return function(node, file){
        included[file] = included[file] || load(file,function () {
            switch (this.status){
                case 404:
                    this.responseText = '"' + file + '" is not found!';
                    break;
                case 200:
                    break;
            }
            if(checkLoaded()) render();
        });
        includes.push(included[file]);
        return included[file];
    }
})();
