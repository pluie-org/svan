/*!
 * @author        : a-Sansara <dev]]@[[a-sansara]]dot[[net>
 * @url           : https://github.com/pluie-org/svan
 * @contributors  :
 * @copyright     : pluie.org
 * @date          : 2015-12-14 02:45:17
 * @version       : 0.4
 * @license       : MIT
 * @require       : html5
 * @desc          : Small vanilla jquery-like lib
 */
(function() {

    var is  = function(o, intent) { return typeof o == intent; },
    Svan    = function (selector, context) {
        return new Svan.init(selector, context);
    },
    isNone  = Svan.isNone = function(o) { return is(o, 'undefined'); },
    isStr   = Svan.isStr  = function(o) { return is(o, 'string'); },
    isFunc  = Svan.isFunc = function(o) { return is(o, 'function'); },
    isObj   = Svan.isObj  = function(o) { return is(o, 'object'); },
    isNode  = Svan.isNode = function(o) { return isObj(o) && !isNone(o.nodeType) ; },
    isWin   = Svan.isWin  = function(o) { return isObj(o) && !isNone(o.window) && o.window == o; };

    Svan.prototype = {
        regsan       : function (v) {
            return v.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        },
        first        : function() {
            return this.found ? this.list[0] : null;
        },
        last         : function() {
            return this.found ? this.list[this.list.length-1] : b;
        },
        index        : function(i) {
            return this.found && i > 0 && i < this.list.length ? this.list[i] : b;
        },
        all          : function(i) {
            return this.list;
        },
        // assume uniq selector
        find         : function(s) {
            return this.found ? new Svan.init(s, this.list[0]) : new Svan.init('');
        },
        each      : function(f) {
            if (this.found) this.list.forEach(f);
        },
        // Living Standard cf https://w3c.github.io/DOM-Parsing/#innerhtml
        html         : function(data) {
            if (!data) return this.found ? this.list[0].innerHTML : ''; // assume uniq selector
            else this.each(function(node) {
                node.innerHTML = data;
            });
        },
        append       : function(data) {
            this.each(function(node) {
                node.innerHTML += data;
            });
        },
        prepend      : function(data) {
            if (this.found) { 
                if (isStr(data)) {
                    var div = document.createElement('div');
                    div.innerHTML = data;
                    while(div.lastChild != null) {
                        this.first().insertBefore(div.lastChild, this.first().firstChild);
                    }
                }
                else {
                    var div = isStr(data) ? document.createElement('div') : data;
                    this.first().insertBefore(data, this.first().firstChild);
                }
            }
        },
        on           : function(type, fn, capture) {
            this.each(function(node) {
                node.addEventListener(type, fn, capture===true);
            });
        },
        val          : function(data) {
            if (!data) return this.found ? ( this.list[0].nodeName.toLowerCase() == 'select' ? this.list[0].options[this.list[0].selectedIndex].value : this.list[0].value) : null; // assume uniq selector
            else this.each(function(node) {
                if (node.nodeName.toLowerCase() == 'select') {
                    for(var i=0, lim = node.options.length; i < lim; i++) {
                        if (node.options[i].value == data) {
                            node.options[i].selected = true;
                            break;
                        }
                    }
                }
                else {
                    node.value = data;
                }
            });
        },
        attr         : function(key, value) {
            if (arguments.length == 1) return this.found ? ( key == "disabled" ? this.list[0].disabled : this.list[0].getAttribute(key)) : null; // assume uniq selector
            else this.each(function(node) {
                if (key == "disabled") {
                    node.disabled = value;
                }
                else {
                    node.setAttribute(key, value);
                }
            });
        },
        toggle       : function(cssName) {
            this.each(function(node) {
                node.classList.toggle(cssName);
            });
        },
        // assume uniq selector
        hasClass    : function(cssName) {
            return this.found ? this.list[0].classList.contains(cssName) : this.found;
        },
        removeClass : function(cssName) {
            this.each(function(node) {
                if (node.classList.contains(cssName)) node.classList.toggle(cssName);
            });
        },
        addClass    : function(cssName) {
            this.each(function(node) {
                if (!node.classList.contains(cssName)) node.classList.toggle(cssName);
            });
        },
        fadeIn      : function(duration, fn, display) {
            if (this.found) { 
                if (!duration) duration = this.FADE_DURATION;
                var inc = parseFloat(1.0/duration*20);
                var n  = this.first();
                n.style.opacity = 0;
                n.style.display = display || "block";
                (function fade(duration) {
                    var val = parseFloat(n.style.opacity);
                    if ((val += inc) < 1) {
                        n.style.opacity = val;
                        requestAnimationFrame(fade);
                    }
                    else if (typeof fn == "function") fn.call(n);
                }(duration));
            }
        },
        fadeOut     : function(duration, fn) {
            if (this.found) {
                if (!duration) duration = this.FADE_DURATION;
                var inc = parseFloat(1.0/duration*20);
                var n  = this.first();
                n.style.opacity = 1;
                (function fade(duration) {
                    var val = parseFloat(n.style.opacity);
                    if ((val -= inc) < 0) {
                        n.style.display = "none";
                        if (typeof fn == "function") fn.call(n);
                    } else {
                        n.style.opacity = val;
                        requestAnimationFrame(fade);
                    }
                }(duration));
            }
        },
        ready       : function(fn) {
            this.context.addEventListener('DOMContentLoaded', fn);
        }
    };
    Svan.eachObj = function(obj, fn, context) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                fn.call(context, prop, obj[prop]);
            }
        }
    };
    Svan.ajax   = function(def) {
        this.eachObj(def, function(k, v) {
            console.log(k);
            console.log(v);
        });
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(data) {
            if (this.readyState == 4) {
                if(this.status==200) {
                    if (isFunc(def.done)) def.done.call(def.context, this.responseText, this.status);
                }
                else if (isFunc(def.fail)) def.fail.call(def.context, this.responseText, this.status);
                if (isFunc(def.always)) def.always.call(def.context, this.responseText, this.status);
            }
        }
        if (!isNone(def.timeout) && def.async) xhr.timeout = def.timeout;
        if (isFunc(def.before)) def.before.call(xhr);
        xhr.open(def.method, def.url, def.async);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var qs = '';
        if (isObj(def.data)) {
            this.eachObj(def.data, function(k, v) {
                qs += k+'='+encodeURIComponent(v);
            });
        }
        xhr.send(qs);
    }

    var init = Svan.init   = function(selector, context) {
        this.FADE_DURATION = 700;
        this.VERSION       = 0.5;
        this.context       = isNone(context) ? document : context;
        this.list          = isStr(selector) ? [].slice.call(this.context.querySelectorAll(selector)) 
                                             : ((isNode(selector) || isWin(selector)) ? [selector] : []);
        this.found         = this.list.length > 0;
        return this;
    };

    init.prototype = Svan.prototype;
    window.Svan = Svan;
    if (isNone(window.$)) window.$ = Svan;

}());
