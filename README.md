# Svan

    Svan is a small vanilla jquery-like lib for web purpose.
    small : 7.2 ko in normal version, 3.4 ko in minified version
    it intends to produce more usefull jquery api in pur javascript.
    
    var s = $(selector);

### traversing

    s.first()
    s.last()
    s.index(i)         // svan specific return node matching selector at given index i
    s.each(fn)
    s.find(selector)
    s.all()            // svan specific return nodes matching selector as array


### dom

    s.append(htmlStr)
    s.html(htmlStr)
    s.html()
    s.val()
    s.val(data)
    s.attr(key)
    s.attr(key, value)


### css

    s.hasClass(cssName)
    s.addClass(cssName)
    s.removeClass(cssName)
    s.toggle(cssName)


### event

    $(document).ready
    s.on(type, handler, capture)


### effects

    s.fadeIn()
    s.fadeIn(duration, callback)
    s.fadeOut()
    s.fadeOut(duration, callback)


### ajax (currently in dev)

    $.ajax({
        async   : bool,
        url     : string,
        method  : GET|POST,
        data    : object,
        done    : function,
        fail    : function,
        always  : function,
        before  : function,
        timeout : int,
    })
