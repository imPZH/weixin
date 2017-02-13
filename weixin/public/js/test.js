var debounce = function (func, wait, immediate) { var timeout = {}; return function () { var context = this, args = arguments; var later = function () { timeout = {}; if (!immediate) func.apply(context, args); }; var callNow = immediate && !timeout; clearRequestTimeout(timeout); timeout = requestTimeout(later, wait); if (callNow) func.apply(context, args); }; }; window.requestAnimFrame = (function () { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) { window.setTimeout(callback, 16.667); }; })(); window.requestInterval = function (fn, delay) {
    if (!window.requestAnimationFrame && !window.webkitRequestAnimationFrame && !window.mozRequestAnimationFrame && !window.oRequestAnimationFrame && !window.msRequestAnimationFrame) { return window.setInterval(fn, delay); }
    var start = new Date().getTime(), handle = {}; function loop() {
        var current = new Date().getTime(), delta = current - start; if (delta >= delay) { fn.call(); start = new Date().getTime(); }
        handle.value = requestAnimFrame(loop);
    }
    handle.value = requestAnimFrame(loop); return handle;
}; window.clearRequestInterval = function (handle) { window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) : window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) : window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) : window.msCancelRequestAnimationFrame ? msCancelRequestAnimationFrame(handle.value) : clearInterval(handle); }; window.requestTimeout = function (fn, delay) {
    if (!window.requestAnimationFrame && !window.webkitRequestAnimationFrame && !window.mozRequestAnimationFrame && !window.oRequestAnimationFrame && !window.msRequestAnimationFrame) { return window.setTimeout(fn, delay); }
    var start = new Date().getTime(), handle = {}; function loop() { var current = new Date().getTime(), delta = current - start; if (delta >= delay) { fn.call(); } else { handle.value = requestAnimFrame(loop); } }
    handle.value = requestAnimFrame(loop); return handle;
}; window.clearRequestTimeout = function (handle) { window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) : window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) : window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) : window.msCancelRequestAnimationFrame ? msCancelRequestAnimationFrame(handle.value) : clearTimeout(handle); };/*!
 * pickadate.js v3.5.6, 2015/04/20
 * By Amsul, http://amsul.ca
 * Hosted on http://amsul.github.io/pickadate.js
 * Licensed under MIT
 */(function (factory) {
    if (typeof define == 'function' && define.amd)
        define('picker', ['jquery'], factory)
    else if (typeof exports == 'object')
        module.exports = factory(require('jquery'))
    else this.Picker = factory(jQuery)
}(function ($) {
    var $window = $(window)
    var $document = $(document)
    var $html = $(document.documentElement)
    var supportsTransitions = document.documentElement.style.transition != null
    function PickerConstructor(ELEMENT, NAME, COMPONENT, OPTIONS) {
        if (!ELEMENT) return PickerConstructor
        var
            IS_DEFAULT_THEME = false, STATE = { id: ELEMENT.id || 'P' + Math.abs(~~(Math.random() * new Date())) }, SETTINGS = COMPONENT ? $.extend(true, {}, COMPONENT.defaults, OPTIONS) : OPTIONS || {}, CLASSES = $.extend({}, PickerConstructor.klasses(), SETTINGS.klass), $ELEMENT = $(ELEMENT), PickerInstance = function () { return this.start() }, P = PickerInstance.prototype = {
                constructor: PickerInstance, $node: $ELEMENT, start: function () {
                    if (STATE && STATE.start) return P
                    STATE.methods = {}
                    STATE.start = true
                    STATE.open = false
                    STATE.type = ELEMENT.type
                    ELEMENT.autofocus = ELEMENT == getActiveElement()
                    ELEMENT.readOnly = !SETTINGS.editable
                    ELEMENT.id = ELEMENT.id || STATE.id
                    if (ELEMENT.type != 'text') { ELEMENT.type = 'text' }
                    P.component = new COMPONENT(P, SETTINGS)
                    P.$root = $('<div class="' + CLASSES.picker + '" id="' + ELEMENT.id + '_root" />')
                    prepareElementRoot()
                    P.$holder = $(createWrappedComponent()).appendTo(P.$root)
                    prepareElementHolder()
                    if (SETTINGS.formatSubmit) { prepareElementHidden() }
                    prepareElement()
                    if (SETTINGS.containerHidden) $(SETTINGS.containerHidden).append(P._hidden)
                    else $ELEMENT.after(P._hidden)
                    if (SETTINGS.container) $(SETTINGS.container).append(P.$root)
                    else $ELEMENT.after(P.$root)
                    P.on({ start: P.component.onStart, render: P.component.onRender, stop: P.component.onStop, open: P.component.onOpen, close: P.component.onClose, set: P.component.onSet }).on({ start: SETTINGS.onStart, render: SETTINGS.onRender, stop: SETTINGS.onStop, open: SETTINGS.onOpen, close: SETTINGS.onClose, set: SETTINGS.onSet })
                    IS_DEFAULT_THEME = isUsingDefaultTheme(P.$holder[0])
                    if (ELEMENT.autofocus) { P.open() }
                    return P.trigger('start').trigger('render')
                }, render: function (entireComponent) {
                    if (entireComponent) {
                        P.$holder = $(createWrappedComponent())
                        prepareElementHolder()
                        P.$root.html(P.$holder)
                    }
                    else P.$root.find('.' + CLASSES.box).html(P.component.nodes(STATE.open))
                    return P.trigger('render')
                }, stop: function () {
                    if (!STATE.start) return P
                    P.close()
                    if (P._hidden) { P._hidden.parentNode.removeChild(P._hidden) }
                    P.$root.remove()
                    $ELEMENT.removeClass(CLASSES.input).removeData(NAME)
                    setTimeout(function () { $ELEMENT.off('.' + STATE.id) }, 0)
                    ELEMENT.type = STATE.type
                    ELEMENT.readOnly = false
                    P.trigger('stop')
                    STATE.methods = {}
                    STATE.start = false
                    return P
                }, open: function (dontGiveFocus) {
                    if (STATE.open) return P
                    $ELEMENT.addClass(CLASSES.active)
                    aria(ELEMENT, 'expanded', true)
                    setTimeout(function () {
                        P.$root.addClass(CLASSES.opened)
                        aria(P.$root[0], 'hidden', false)
                    }, 0)
                    if (dontGiveFocus !== false) {
                        STATE.open = true
                        if (IS_DEFAULT_THEME) { $html.css('overflow', 'hidden').css('padding-right', '+=' + getScrollbarWidth()) }
                        focusPickerOnceOpened()
                        $document.on('click.' + STATE.id + ' focusin.' + STATE.id, function (event) {
                            var target = event.target
                            if (target != ELEMENT && target != document && event.which != 3) { P.close(target === P.$holder[0]) }
                        }).on('keydown.' + STATE.id, function (event) {
                            var
                                keycode = event.keyCode, keycodeToMove = P.component.key[keycode], target = event.target
                            if (keycode == 27) { P.close(true) }
                            else if (target == P.$holder[0] && (keycodeToMove || keycode == 13)) {
                                event.preventDefault()
                                if (keycodeToMove) { PickerConstructor._.trigger(P.component.key.go, P, [PickerConstructor._.trigger(keycodeToMove)]) }
                                else if (!P.$root.find('.' + CLASSES.highlighted).hasClass(CLASSES.disabled)) {
                                    P.set('select', P.component.item.highlight)
                                    if (SETTINGS.closeOnSelect) { P.close(true) }
                                }
                            }
                            else if ($.contains(P.$root[0], target) && keycode == 13) {
                                event.preventDefault()
                                target.click()
                            }
                        })
                    }
                    return P.trigger('open')
                }, close: function (giveFocus) {
                    if (giveFocus) {
                        if (SETTINGS.editable) { ELEMENT.focus() }
                        else {
                            P.$holder.off('focus.toOpen').focus()
                            setTimeout(function () { P.$holder.on('focus.toOpen', handleFocusToOpenEvent) }, 0)
                        }
                    }
                    $ELEMENT.removeClass(CLASSES.active)
                    aria(ELEMENT, 'expanded', false)
                    setTimeout(function () {
                        P.$root.removeClass(CLASSES.opened + ' ' + CLASSES.focused)
                        aria(P.$root[0], 'hidden', true)
                    }, 0)
                    if (!STATE.open) return P
                    STATE.open = false
                    if (IS_DEFAULT_THEME) { $html.css('overflow', '').css('padding-right', '-=' + getScrollbarWidth()) }
                    $document.off('.' + STATE.id)
                    return P.trigger('close')
                }, clear: function (options) { return P.set('clear', null, options) }, set: function (thing, value, options) {
                    var thingItem, thingValue, thingIsObject = $.isPlainObject(thing), thingObject = thingIsObject ? thing : {}
                    options = thingIsObject && $.isPlainObject(value) ? value : options || {}
                    if (thing) {
                        if (!thingIsObject) { thingObject[thing] = value }
                        for (thingItem in thingObject) {
                            thingValue = thingObject[thingItem]
                            if (thingItem in P.component.item) {
                                if (thingValue === undefined) thingValue = null
                                P.component.set(thingItem, thingValue, options)
                            }
                            if (thingItem == 'select' || thingItem == 'clear') { $ELEMENT.val(thingItem == 'clear' ? '' : P.get(thingItem, SETTINGS.format)).trigger('change') }
                        }
                        P.render()
                    }
                    return options.muted ? P : P.trigger('set', thingObject)
                }, get: function (thing, format) {
                    thing = thing || 'value'
                    if (STATE[thing] != null) { return STATE[thing] }
                    if (thing == 'valueSubmit') {
                        if (P._hidden) { return P._hidden.value }
                        thing = 'value'
                    }
                    if (thing == 'value') { return ELEMENT.value }
                    if (thing in P.component.item) {
                        if (typeof format == 'string') {
                            var thingValue = P.component.get(thing)
                            return thingValue ? PickerConstructor._.trigger(P.component.formats.toString, P.component, [format, thingValue]) : ''
                        }
                        return P.component.get(thing)
                    }
                }, on: function (thing, method, internal) {
                    var thingName, thingMethod, thingIsObject = $.isPlainObject(thing), thingObject = thingIsObject ? thing : {}
                    if (thing) {
                        if (!thingIsObject) { thingObject[thing] = method }
                        for (thingName in thingObject) {
                            thingMethod = thingObject[thingName]
                            if (internal) { thingName = '_' + thingName }
                            STATE.methods[thingName] = STATE.methods[thingName] || []
                            STATE.methods[thingName].push(thingMethod)
                        }
                    }
                    return P
                }, off: function () {
                    var i, thingName, names = arguments; for (i = 0, namesCount = names.length; i < namesCount; i += 1) {
                        thingName = names[i]
                        if (thingName in STATE.methods) { delete STATE.methods[thingName] }
                    }
                    return P
                }, trigger: function (name, data) {
                    var _trigger = function (name) {
                        var methodList = STATE.methods[name]
                        if (methodList) { methodList.map(function (method) { PickerConstructor._.trigger(method, P, [data]) }) }
                    }
                    _trigger('_' + name)
                    _trigger(name)
                    return P
                }
            }
        function createWrappedComponent() { return PickerConstructor._.node('div', PickerConstructor._.node('div', PickerConstructor._.node('div', PickerConstructor._.node('div', P.component.nodes(STATE.open), CLASSES.box), CLASSES.wrap), CLASSES.frame), CLASSES.holder, 'tabindex="-1"') }
        function prepareElement() {
            $ELEMENT.data(NAME, P).addClass(CLASSES.input).val($ELEMENT.data('value') ? P.get('select', SETTINGS.format) : ELEMENT.value)
            if (!SETTINGS.editable) {
                $ELEMENT.on('focus.' + STATE.id + ' click.' + STATE.id, function (event) {
                    event.preventDefault()
                    P.open()
                }).on('keydown.' + STATE.id, handleKeydownEvent)
            }
            aria(ELEMENT, { haspopup: true, expanded: false, readonly: false, owns: ELEMENT.id + '_root' })
        }
        function prepareElementRoot() { aria(P.$root[0], 'hidden', true) }
        function prepareElementHolder() {
            P.$holder.on({
                keydown: handleKeydownEvent, 'focus.toOpen': handleFocusToOpenEvent, blur: function () { $ELEMENT.removeClass(CLASSES.target) }, focusin: function (event) {
                    P.$root.removeClass(CLASSES.focused)
                    event.stopPropagation()
                }, 'mousedown click': function (event) {
                    var target = event.target
                    if (target != P.$holder[0]) {
                        event.stopPropagation()
                        if (event.type == 'mousedown' && !$(target).is('input, select, textarea, button, option')) {
                            event.preventDefault()
                            P.$holder[0].focus()
                        }
                    }
                }
            }).on('click', '[data-pick], [data-nav], [data-clear], [data-close]', function () {
                var $target = $(this), targetData = $target.data(), targetDisabled = $target.hasClass(CLASSES.navDisabled) || $target.hasClass(CLASSES.disabled), activeElement = getActiveElement()
                activeElement = activeElement && (activeElement.type || activeElement.href)
                if (targetDisabled || activeElement && !$.contains(P.$root[0], activeElement)) { P.$holder[0].focus() }
                if (!targetDisabled && targetData.nav) { P.set('highlight', P.component.item.highlight, { nav: targetData.nav }) }
                else if (!targetDisabled && 'pick' in targetData) {
                    P.set('select', targetData.pick)
                    if (SETTINGS.closeOnSelect) { P.close(true) }
                }
                else if (targetData.clear) {
                    P.clear()
                    if (SETTINGS.closeOnClear) { P.close(true) }
                }
                else if (targetData.close) { P.close(true) }
            })
        }
        function prepareElementHidden() {
            var name
            if (SETTINGS.hiddenName === true) {
                name = ELEMENT.name
                ELEMENT.name = ''
            }
            else {
                name = [typeof SETTINGS.hiddenPrefix == 'string' ? SETTINGS.hiddenPrefix : '', typeof SETTINGS.hiddenSuffix == 'string' ? SETTINGS.hiddenSuffix : '_submit']
                name = name[0] + ELEMENT.name + name[1]
            }
            P._hidden = $('<input ' + 'type=hidden ' + 'name="' + name + '"' +
                ($ELEMENT.data('value') || ELEMENT.value ? ' value="' + P.get('select', SETTINGS.formatSubmit) + '"' : '') + '>')[0]
            $ELEMENT.on('change.' + STATE.id, function () { P._hidden.value = ELEMENT.value ? P.get('select', SETTINGS.formatSubmit) : '' })
        }
        function focusPickerOnceOpened() {
            if (IS_DEFAULT_THEME && supportsTransitions) { P.$holder.find('.' + CLASSES.frame).one('transitionend', function () { P.$holder[0].focus() }) }
            else { P.$holder[0].focus() }
        }
        function handleFocusToOpenEvent(event) {
            event.stopPropagation()
            $ELEMENT.addClass(CLASSES.target)
            P.$root.addClass(CLASSES.focused)
            P.open()
        }
        function handleKeydownEvent(event) {
            var keycode = event.keyCode, isKeycodeDelete = /^(8|46)$/.test(keycode)
            if (keycode == 27) {
                P.close(true)
                return false
            }
            if (keycode == 32 || isKeycodeDelete || !STATE.open && P.component.key[keycode]) {
                event.preventDefault()
                event.stopPropagation()
                if (isKeycodeDelete) { P.clear().close() }
                else { P.open() }
            }
        }
        return new PickerInstance()
    }
    PickerConstructor.klasses = function (prefix) {
        prefix = prefix || 'picker'
        return { picker: prefix, opened: prefix + '--opened', focused: prefix + '--focused', input: prefix + '__input', active: prefix + '__input--active', target: prefix + '__input--target', holder: prefix + '__holder', frame: prefix + '__frame', wrap: prefix + '__wrap', box: prefix + '__box' }
    }
    function isUsingDefaultTheme(element) {
        var theme, prop = 'position'
        if (element.currentStyle) { theme = element.currentStyle[prop] }
        else if (window.getComputedStyle) { theme = getComputedStyle(element)[prop] }
        return theme == 'fixed'
    }
    function getScrollbarWidth() {
        if ($html.height() <= $window.height()) { return 0 }
        var $outer = $('<div style="visibility:hidden;width:100px" />').appendTo('body')
        var widthWithoutScroll = $outer[0].offsetWidth
        $outer.css('overflow', 'scroll')
        var $inner = $('<div style="width:100%" />').appendTo($outer)
        var widthWithScroll = $inner[0].offsetWidth
        $outer.remove()
        return widthWithoutScroll - widthWithScroll
    }
    PickerConstructor._ = {
        group: function (groupObject) {
            var
                loopObjectScope, nodesList = '', counter = PickerConstructor._.trigger(groupObject.min, groupObject)
            for (; counter <= PickerConstructor._.trigger(groupObject.max, groupObject, [counter]); counter += groupObject.i) {
                loopObjectScope = PickerConstructor._.trigger(groupObject.item, groupObject, [counter])
                nodesList += PickerConstructor._.node(groupObject.node, loopObjectScope[0], loopObjectScope[1], loopObjectScope[2])
            }
            return nodesList
        }, node: function (wrapper, item, klass, attribute) {
            if (!item) return ''
            item = $.isArray(item) ? item.join('') : item
            klass = klass ? ' class="' + klass + '"' : ''
            attribute = attribute ? ' ' + attribute : ''
            return '<' + wrapper + klass + attribute + '>' + item + '</' + wrapper + '>'
        }, lead: function (number) { return (number < 10 ? '0' : '') + number }, trigger: function (callback, scope, args) { return typeof callback == 'function' ? callback.apply(scope, args || []) : callback }, digits: function (string) { return (/\d/).test(string[1]) ? 2 : 1 }, isDate: function (value) { return {}.toString.call(value).indexOf('Date') > -1 && this.isInteger(value.getDate()) }, isInteger: function (value) { return {}.toString.call(value).indexOf('Number') > -1 && value % 1 === 0 }, ariaAttr: ariaAttr
    }
    PickerConstructor.extend = function (name, Component) {
        $.fn[name] = function (options, action) {
            var componentData = this.data(name)
            if (options == 'picker') { return componentData }
            if (componentData && typeof options == 'string') { return PickerConstructor._.trigger(componentData[options], componentData, [action]) }
            return this.each(function () {
                var $this = $(this)
                if (!$this.data(name)) { new PickerConstructor(this, name, Component, options) }
            })
        }
        $.fn[name].defaults = Component.defaults
    }
    function aria(element, attribute, value) {
        if ($.isPlainObject(attribute)) { for (var key in attribute) { ariaSet(element, key, attribute[key]) } }
        else { ariaSet(element, attribute, value) }
    }
    function ariaSet(element, attribute, value) { element.setAttribute((attribute == 'role' ? '' : 'aria-') + attribute, value) }
    function ariaAttr(attribute, data) {
        if (!$.isPlainObject(attribute)) { attribute = { attribute: data } }
        data = ''
        for (var key in attribute) {
            var attr = (key == 'role' ? '' : 'aria-') + key, attrVal = attribute[key]
            data += attrVal == null ? '' : attr + '="' + attribute[key] + '"'
        }
        return data
    }
    function getActiveElement() { try { return document.activeElement } catch (err) { } }
    return PickerConstructor
}));/*!
 * Date picker for pickadate.js v3.5.6
 * http://amsul.github.io/pickadate.js/date.htm
 */(function (factory) {
    if (typeof define == 'function' && define.amd)
        define(['picker', 'jquery'], factory)
    else if (typeof exports == 'object')
        module.exports = factory(require('./picker.js'), require('jquery'))
    else factory(Picker, jQuery)
}(function (Picker, $) {
    var DAYS_IN_WEEK = 7, WEEKS_IN_CALENDAR = 6, _ = Picker._
    function DatePicker(picker, settings) {
        var calendar = this, element = picker.$node[0], elementValue = element.value, elementDataValue = picker.$node.data('value'), valueString = elementDataValue || elementValue, formatString = elementDataValue ? settings.formatSubmit : settings.format, isRTL = function () { return element.currentStyle ? element.currentStyle.direction == 'rtl' : getComputedStyle(picker.$root[0]).direction == 'rtl' }
        calendar.settings = settings
        calendar.$node = picker.$node
        calendar.queue = { min: 'measure create', max: 'measure create', now: 'now create', select: 'parse create validate', highlight: 'parse navigate create validate', view: 'parse create validate viewset', disable: 'deactivate', enable: 'activate' }
        calendar.item = {}
        calendar.item.clear = null
        calendar.item.disable = (settings.disable || []).slice(0)
        calendar.item.enable = -(function (collectionDisabled) { return collectionDisabled[0] === true ? collectionDisabled.shift() : -1 })(calendar.item.disable)
        calendar.set('min', settings.min).set('max', settings.max).set('now')
        if (valueString) { calendar.set('select', valueString, { format: formatString, defaultValue: true }) }
        else { calendar.set('select', null).set('highlight', calendar.item.now) }
        calendar.key = {
            40: 7, 38: -7, 39: function () { return isRTL() ? -1 : 1 }, 37: function () { return isRTL() ? 1 : -1 }, go: function (timeChange) {
                var highlightedObject = calendar.item.highlight, targetDate = new Date(highlightedObject.year, highlightedObject.month, highlightedObject.date + timeChange)
                calendar.set('highlight', targetDate, { interval: timeChange })
                this.render()
            }
        }
        picker.on('render', function () {
            picker.$root.find('.' + settings.klass.selectMonth).on('change', function () {
                var value = this.value
                if (value) {
                    picker.set('highlight', [picker.get('view').year, value, picker.get('highlight').date])
                    picker.$root.find('.' + settings.klass.selectMonth).trigger('focus')
                }
            })
            picker.$root.find('.' + settings.klass.selectYear).on('change', function () {
                var value = this.value
                if (value) {
                    picker.set('highlight', [value, picker.get('view').month, picker.get('highlight').date])
                    picker.$root.find('.' + settings.klass.selectYear).trigger('focus')
                }
            })
        }, 1).on('open', function () {
            var includeToday = ''
            if (calendar.disabled(calendar.get('now'))) { includeToday = ':not(.' + settings.klass.buttonToday + ')' }
            picker.$root.find('button' + includeToday + ', select').attr('disabled', false)
        }, 1).on('close', function () { picker.$root.find('button, select').attr('disabled', true) }, 1)
    }
    DatePicker.prototype.set = function (type, value, options) {
        var calendar = this, calendarItem = calendar.item
        if (value === null) {
            if (type == 'clear') type = 'select'
            calendarItem[type] = value
            return calendar
        }
        calendarItem[(type == 'enable' ? 'disable' : type == 'flip' ? 'enable' : type)] = calendar.queue[type].split(' ').map(function (method) {
            value = calendar[method](type, value, options)
            return value
        }).pop()
        if (type == 'select') { calendar.set('highlight', calendarItem.select, options) }
        else if (type == 'highlight') { calendar.set('view', calendarItem.highlight, options) }
        else if (type.match(/^(flip|min|max|disable|enable)$/)) {
            if (calendarItem.select && calendar.disabled(calendarItem.select)) { calendar.set('select', calendarItem.select, options) }
            if (calendarItem.highlight && calendar.disabled(calendarItem.highlight)) { calendar.set('highlight', calendarItem.highlight, options) }
        }
        return calendar
    }
    DatePicker.prototype.get = function (type) { return this.item[type] }
    DatePicker.prototype.create = function (type, value, options) {
        var isInfiniteValue, calendar = this
        value = value === undefined ? type : value
        if (value == -Infinity || value == Infinity) { isInfiniteValue = value }
        else if ($.isPlainObject(value) && _.isInteger(value.pick)) { value = value.obj }
        else if ($.isArray(value)) {
            value = new Date(value[0], value[1], value[2])
            value = _.isDate(value) ? value : calendar.create().obj
        }
        else if (_.isInteger(value) || _.isDate(value)) { value = calendar.normalize(new Date(value), options) }
        else { value = calendar.now(type, value, options) }
        return { year: isInfiniteValue || value.getFullYear(), month: isInfiniteValue || value.getMonth(), date: isInfiniteValue || value.getDate(), day: isInfiniteValue || value.getDay(), obj: isInfiniteValue || value, pick: isInfiniteValue || value.getTime() }
    }
    DatePicker.prototype.createRange = function (from, to) {
        var calendar = this, createDate = function (date) {
            if (date === true || $.isArray(date) || _.isDate(date)) { return calendar.create(date) }
            return date
        }
        if (!_.isInteger(from)) { from = createDate(from) }
        if (!_.isInteger(to)) { to = createDate(to) }
        if (_.isInteger(from) && $.isPlainObject(to)) { from = [to.year, to.month, to.date + from]; }
        else if (_.isInteger(to) && $.isPlainObject(from)) { to = [from.year, from.month, from.date + to]; }
        return { from: createDate(from), to: createDate(to) }
    }
    DatePicker.prototype.withinRange = function (range, dateUnit) {
        range = this.createRange(range.from, range.to)
        return dateUnit.pick >= range.from.pick && dateUnit.pick <= range.to.pick
    }
    DatePicker.prototype.overlapRanges = function (one, two) {
        var calendar = this
        one = calendar.createRange(one.from, one.to)
        two = calendar.createRange(two.from, two.to)
        return calendar.withinRange(one, two.from) || calendar.withinRange(one, two.to) || calendar.withinRange(two, one.from) || calendar.withinRange(two, one.to)
    }
    DatePicker.prototype.now = function (type, value, options) {
        value = new Date()
        if (options && options.rel) { value.setDate(value.getDate() + options.rel) }
        return this.normalize(value, options)
    }
    DatePicker.prototype.navigate = function (type, value, options) {
        var targetDateObject, targetYear, targetMonth, targetDate, isTargetArray = $.isArray(value), isTargetObject = $.isPlainObject(value), viewsetObject = this.item.view
        if (isTargetArray || isTargetObject) {
            if (isTargetObject) {
                targetYear = value.year
                targetMonth = value.month
                targetDate = value.date
            }
            else {
                targetYear = +value[0]
                targetMonth = +value[1]
                targetDate = +value[2]
            }
            if (options && options.nav && viewsetObject && viewsetObject.month !== targetMonth) {
                targetYear = viewsetObject.year
                targetMonth = viewsetObject.month
            }
            targetDateObject = new Date(targetYear, targetMonth + (options && options.nav ? options.nav : 0), 1)
            targetYear = targetDateObject.getFullYear()
            targetMonth = targetDateObject.getMonth()
            while (new Date(targetYear, targetMonth, targetDate).getMonth() !== targetMonth) { targetDate -= 1 }
            value = [targetYear, targetMonth, targetDate]
        }
        return value
    }
    DatePicker.prototype.normalize = function (value) {
        value.setHours(0, 0, 0, 0)
        return value
    }
    DatePicker.prototype.measure = function (type, value) {
        var calendar = this
        if (!value) { value = type == 'min' ? -Infinity : Infinity }
        else if (typeof value == 'string') { value = calendar.parse(type, value) }
        else if (_.isInteger(value)) { value = calendar.now(type, value, { rel: value }) }
        return value
    }
    DatePicker.prototype.viewset = function (type, dateObject) { return this.create([dateObject.year, dateObject.month, 1]) }
    DatePicker.prototype.validate = function (type, dateObject, options) {
        var calendar = this, originalDateObject = dateObject, interval = options && options.interval ? options.interval : 1, isFlippedBase = calendar.item.enable === -1, hasEnabledBeforeTarget, hasEnabledAfterTarget, minLimitObject = calendar.item.min, maxLimitObject = calendar.item.max, reachedMin, reachedMax, hasEnabledWeekdays = isFlippedBase && calendar.item.disable.filter(function (value) {
            if ($.isArray(value)) {
                var dateTime = calendar.create(value).pick
                if (dateTime < dateObject.pick) hasEnabledBeforeTarget = true
                else if (dateTime > dateObject.pick) hasEnabledAfterTarget = true
            }
            return _.isInteger(value)
        }).length
        if (!options || (!options.nav && !options.defaultValue)) if ((!isFlippedBase && calendar.disabled(dateObject)) || (isFlippedBase && calendar.disabled(dateObject) && (hasEnabledWeekdays || hasEnabledBeforeTarget || hasEnabledAfterTarget)) || (!isFlippedBase && (dateObject.pick <= minLimitObject.pick || dateObject.pick >= maxLimitObject.pick))) {
            if (isFlippedBase && !hasEnabledWeekdays && ((!hasEnabledAfterTarget && interval > 0) || (!hasEnabledBeforeTarget && interval < 0))) { interval *= -1 }
            while (calendar.disabled(dateObject)) {
                if (Math.abs(interval) > 1 && (dateObject.month < originalDateObject.month || dateObject.month > originalDateObject.month)) {
                    dateObject = originalDateObject
                    interval = interval > 0 ? 1 : -1
                }
                if (dateObject.pick <= minLimitObject.pick) {
                    reachedMin = true
                    interval = 1
                    dateObject = calendar.create([minLimitObject.year, minLimitObject.month, minLimitObject.date + (dateObject.pick === minLimitObject.pick ? 0 : -1)])
                }
                else if (dateObject.pick >= maxLimitObject.pick) {
                    reachedMax = true
                    interval = -1
                    dateObject = calendar.create([maxLimitObject.year, maxLimitObject.month, maxLimitObject.date + (dateObject.pick === maxLimitObject.pick ? 0 : 1)])
                }
                if (reachedMin && reachedMax) { break }
                dateObject = calendar.create([dateObject.year, dateObject.month, dateObject.date + interval])
            }
        }
        return dateObject
    }
    DatePicker.prototype.disabled = function (dateToVerify) {
        var
            calendar = this, isDisabledMatch = calendar.item.disable.filter(function (dateToDisable) {
                if (_.isInteger(dateToDisable)) { return dateToVerify.day === (calendar.settings.firstDay ? dateToDisable : dateToDisable - 1) % 7 }
                if ($.isArray(dateToDisable) || _.isDate(dateToDisable)) { return dateToVerify.pick === calendar.create(dateToDisable).pick }
                if ($.isPlainObject(dateToDisable)) { return calendar.withinRange(dateToDisable, dateToVerify) }
            })
        isDisabledMatch = isDisabledMatch.length && !isDisabledMatch.filter(function (dateToDisable) { return $.isArray(dateToDisable) && dateToDisable[3] == 'inverted' || $.isPlainObject(dateToDisable) && dateToDisable.inverted }).length
        return calendar.item.enable === -1 ? !isDisabledMatch : isDisabledMatch || dateToVerify.pick < calendar.item.min.pick || dateToVerify.pick > calendar.item.max.pick
    }
    DatePicker.prototype.parse = function (type, value, options) {
        var calendar = this, parsingObject = {}
        if (!value || typeof value != 'string') { return value }
        if (!(options && options.format)) {
            options = options || {}
            options.format = calendar.settings.format
        }
        calendar.formats.toArray(options.format).map(function (label) {
            var
                formattingLabel = calendar.formats[label], formatLength = formattingLabel ? _.trigger(formattingLabel, calendar, [value, parsingObject]) : label.replace(/^!/, '').length
            if (formattingLabel) { parsingObject[label] = value.substr(0, formatLength) }
            value = value.substr(formatLength)
        })
        return [parsingObject.yyyy || parsingObject.yy, +(parsingObject.mm || parsingObject.m) - 1, parsingObject.dd || parsingObject.d]
    }
    DatePicker.prototype.formats = (function () {
        function getWordLengthFromCollection(string, collection, dateObject) {
            var word = string.match(/[^\x00-\x7F]+|\w+/)[0]
            if (!dateObject.mm && !dateObject.m) { dateObject.m = collection.indexOf(word) + 1 }
            return word.length
        }
        function getFirstWordLength(string) { return string.match(/\w+/)[0].length }
        return {
            d: function (string, dateObject) { return string ? _.digits(string) : dateObject.date }, dd: function (string, dateObject) { return string ? 2 : _.lead(dateObject.date) }, ddd: function (string, dateObject) { return string ? getFirstWordLength(string) : this.settings.weekdaysShort[dateObject.day] }, dddd: function (string, dateObject) { return string ? getFirstWordLength(string) : this.settings.weekdaysFull[dateObject.day] }, m: function (string, dateObject) { return string ? _.digits(string) : dateObject.month + 1 }, mm: function (string, dateObject) { return string ? 2 : _.lead(dateObject.month + 1) }, mmm: function (string, dateObject) {
                var collection = this.settings.monthsShort
                return string ? getWordLengthFromCollection(string, collection, dateObject) : collection[dateObject.month]
            }, mmmm: function (string, dateObject) {
                var collection = this.settings.monthsFull
                return string ? getWordLengthFromCollection(string, collection, dateObject) : collection[dateObject.month]
            }, yy: function (string, dateObject) { return string ? 2 : ('' + dateObject.year).slice(2) }, yyyy: function (string, dateObject) { return string ? 4 : dateObject.year }, toArray: function (formatString) { return formatString.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g) }, toString: function (formatString, itemObject) {
                var calendar = this
                return calendar.formats.toArray(formatString).map(function (label) { return _.trigger(calendar.formats[label], calendar, [0, itemObject]) || label.replace(/^!/, '') }).join('')
            }
        }
    })()
    DatePicker.prototype.isDateExact = function (one, two) {
        var calendar = this
        if ((_.isInteger(one) && _.isInteger(two)) || (typeof one == 'boolean' && typeof two == 'boolean')) { return one === two }
        if ((_.isDate(one) || $.isArray(one)) && (_.isDate(two) || $.isArray(two))) { return calendar.create(one).pick === calendar.create(two).pick }
        if ($.isPlainObject(one) && $.isPlainObject(two)) { return calendar.isDateExact(one.from, two.from) && calendar.isDateExact(one.to, two.to) }
        return false
    }
    DatePicker.prototype.isDateOverlap = function (one, two) {
        var calendar = this, firstDay = calendar.settings.firstDay ? 1 : 0
        if (_.isInteger(one) && (_.isDate(two) || $.isArray(two))) {
            one = one % 7 + firstDay
            return one === calendar.create(two).day + 1
        }
        if (_.isInteger(two) && (_.isDate(one) || $.isArray(one))) {
            two = two % 7 + firstDay
            return two === calendar.create(one).day + 1
        }
        if ($.isPlainObject(one) && $.isPlainObject(two)) { return calendar.overlapRanges(one, two) }
        return false
    }
    DatePicker.prototype.flipEnable = function (val) {
        var itemObject = this.item
        itemObject.enable = val || (itemObject.enable == -1 ? 1 : -1)
    }
    DatePicker.prototype.deactivate = function (type, datesToDisable) {
        var calendar = this, disabledItems = calendar.item.disable.slice(0)
        if (datesToDisable == 'flip') { calendar.flipEnable() }
        else if (datesToDisable === false) {
            calendar.flipEnable(1)
            disabledItems = []
        }
        else if (datesToDisable === true) {
            calendar.flipEnable(-1)
            disabledItems = []
        }
        else {
            datesToDisable.map(function (unitToDisable) {
                var matchFound
                for (var index = 0; index < disabledItems.length; index += 1) {
                    if (calendar.isDateExact(unitToDisable, disabledItems[index])) {
                        matchFound = true
                        break
                    }
                }
                if (!matchFound) { if (_.isInteger(unitToDisable) || _.isDate(unitToDisable) || $.isArray(unitToDisable) || ($.isPlainObject(unitToDisable) && unitToDisable.from && unitToDisable.to)) { disabledItems.push(unitToDisable) } }
            })
        }
        return disabledItems
    }
    DatePicker.prototype.activate = function (type, datesToEnable) {
        var calendar = this, disabledItems = calendar.item.disable, disabledItemsCount = disabledItems.length
        if (datesToEnable == 'flip') { calendar.flipEnable() }
        else if (datesToEnable === true) {
            calendar.flipEnable(1)
            disabledItems = []
        }
        else if (datesToEnable === false) {
            calendar.flipEnable(-1)
            disabledItems = []
        }
        else {
            datesToEnable.map(function (unitToEnable) {
                var matchFound, disabledUnit, index, isExactRange
                for (index = 0; index < disabledItemsCount; index += 1) {
                    disabledUnit = disabledItems[index]
                    if (calendar.isDateExact(disabledUnit, unitToEnable)) {
                        matchFound = disabledItems[index] = null
                        isExactRange = true
                        break
                    }
                    else if (calendar.isDateOverlap(disabledUnit, unitToEnable)) {
                        if ($.isPlainObject(unitToEnable)) {
                            unitToEnable.inverted = true
                            matchFound = unitToEnable
                        }
                        else if ($.isArray(unitToEnable)) {
                            matchFound = unitToEnable
                            if (!matchFound[3]) matchFound.push('inverted')
                        }
                        else if (_.isDate(unitToEnable)) { matchFound = [unitToEnable.getFullYear(), unitToEnable.getMonth(), unitToEnable.getDate(), 'inverted'] }
                        break
                    }
                }
                if (matchFound) for (index = 0; index < disabledItemsCount; index += 1) {
                    if (calendar.isDateExact(disabledItems[index], unitToEnable)) {
                        disabledItems[index] = null
                        break
                    }
                }
                if (isExactRange) for (index = 0; index < disabledItemsCount; index += 1) {
                    if (calendar.isDateOverlap(disabledItems[index], unitToEnable)) {
                        disabledItems[index] = null
                        break
                    }
                }
                if (matchFound) { disabledItems.push(matchFound) }
            })
        }
        return disabledItems.filter(function (val) { return val != null })
    }
    DatePicker.prototype.nodes = function (isOpen) {
        var
            calendar = this, settings = calendar.settings, calendarItem = calendar.item, nowObject = calendarItem.now, selectedObject = calendarItem.select, highlightedObject = calendarItem.highlight, viewsetObject = calendarItem.view, disabledCollection = calendarItem.disable, minLimitObject = calendarItem.min, maxLimitObject = calendarItem.max, tableHead = (function (collection, fullCollection) {
                if (settings.firstDay) {
                    collection.push(collection.shift())
                    fullCollection.push(fullCollection.shift())
                }
                return _.node('thead', _.node('tr', _.group({ min: 0, max: DAYS_IN_WEEK - 1, i: 1, node: 'th', item: function (counter) { return [collection[counter], settings.klass.weekdays, 'scope=col title="' + fullCollection[counter] + '"'] } })))
            })((settings.showWeekdaysFull ? settings.weekdaysFull : settings.weekdaysShort).slice(0), settings.weekdaysFull.slice(0)), createMonthNav = function (next) {
                return _.node('div', ' ', settings.klass['nav' + (next ? 'Next' : 'Prev')] + ((next && viewsetObject.year >= maxLimitObject.year && viewsetObject.month >= maxLimitObject.month) || (!next && viewsetObject.year <= minLimitObject.year && viewsetObject.month <= minLimitObject.month) ? ' ' + settings.klass.navDisabled : ''), 'data-nav=' + (next || -1) + ' ' +
                    _.ariaAttr({ role: 'button', controls: calendar.$node[0].id + '_table' }) + ' ' + 'title="' + (next ? settings.labelMonthNext : settings.labelMonthPrev) + '"')
            }, createMonthLabel = function () {
                var monthsCollection = settings.showMonthsShort ? settings.monthsShort : settings.monthsFull
                if (settings.selectMonths) {
                    return _.node('select', _.group({
                        min: 0, max: 11, i: 1, node: 'option', item: function (loopedMonth) {
                            return [monthsCollection[loopedMonth], 0, 'value=' + loopedMonth +
                                (viewsetObject.month == loopedMonth ? ' selected' : '') +
                                (((viewsetObject.year == minLimitObject.year && loopedMonth < minLimitObject.month) || (viewsetObject.year == maxLimitObject.year && loopedMonth > maxLimitObject.month)) ? ' disabled' : '')]
                        }
                    }), settings.klass.selectMonth, (isOpen ? '' : 'disabled') + ' ' +
                    _.ariaAttr({ controls: calendar.$node[0].id + '_table' }) + ' ' + 'title="' + settings.labelMonthSelect + '"')
                }
                return _.node('div', monthsCollection[viewsetObject.month], settings.klass.month)
            }, createYearLabel = function () {
                var focusedYear = viewsetObject.year, numberYears = settings.selectYears === true ? 5 : ~~(settings.selectYears / 2)
                if (numberYears) {
                    var
                        minYear = minLimitObject.year, maxYear = maxLimitObject.year, lowestYear = focusedYear - numberYears, highestYear = focusedYear + numberYears
                    if (minYear > lowestYear) {
                        highestYear += minYear - lowestYear
                        lowestYear = minYear
                    }
                    if (maxYear < highestYear) {
                        var availableYears = lowestYear - minYear, neededYears = highestYear - maxYear
                        lowestYear -= availableYears > neededYears ? neededYears : availableYears
                        highestYear = maxYear
                    }
                    return _.node('select', _.group({ min: lowestYear, max: highestYear, i: 1, node: 'option', item: function (loopedYear) { return [loopedYear, 0, 'value=' + loopedYear + (focusedYear == loopedYear ? ' selected' : '')] } }), settings.klass.selectYear, (isOpen ? '' : 'disabled') + ' ' + _.ariaAttr({ controls: calendar.$node[0].id + '_table' }) + ' ' + 'title="' + settings.labelYearSelect + '"')
                }
                return _.node('div', focusedYear, settings.klass.year)
            }
        return _.node('div', (settings.selectYears ? createYearLabel() + createMonthLabel() : createMonthLabel() + createYearLabel()) +
            createMonthNav() + createMonthNav(1), settings.klass.header) + _.node('table', tableHead +
                _.node('tbody', _.group({
                    min: 0, max: WEEKS_IN_CALENDAR - 1, i: 1, node: 'tr', item: function (rowCounter) {
                        var shiftDateBy = settings.firstDay && calendar.create([viewsetObject.year, viewsetObject.month, 1]).day === 0 ? -7 : 0
                        return [_.group({
                            min: DAYS_IN_WEEK * rowCounter - viewsetObject.day + shiftDateBy + 1, max: function () { return this.min + DAYS_IN_WEEK - 1 }, i: 1, node: 'td', item: function (targetDate) {
                                targetDate = calendar.create([viewsetObject.year, viewsetObject.month, targetDate + (settings.firstDay ? 1 : 0)])
                                var isSelected = selectedObject && selectedObject.pick == targetDate.pick, isHighlighted = highlightedObject && highlightedObject.pick == targetDate.pick, isDisabled = disabledCollection && calendar.disabled(targetDate) || targetDate.pick < minLimitObject.pick || targetDate.pick > maxLimitObject.pick, formattedDate = _.trigger(calendar.formats.toString, calendar, [settings.format, targetDate])
                                return [_.node('div', targetDate.date, (function (klasses) {
                                    klasses.push(viewsetObject.month == targetDate.month ? settings.klass.infocus : settings.klass.outfocus)
                                    if (nowObject.pick == targetDate.pick) { klasses.push(settings.klass.now) }
                                    if (isSelected) { klasses.push(settings.klass.selected) }
                                    if (isHighlighted) { klasses.push(settings.klass.highlighted) }
                                    if (isDisabled) { klasses.push(settings.klass.disabled) }
                                    return klasses.join(' ')
                                })([settings.klass.day]), 'data-pick=' + targetDate.pick + ' ' + _.ariaAttr({ role: 'gridcell', label: formattedDate, selected: isSelected && calendar.$node.val() === formattedDate ? true : null, activedescendant: isHighlighted ? true : null, disabled: isDisabled ? true : null })), '', _.ariaAttr({ role: 'presentation' })]
                            }
                        })]
                    }
                })), settings.klass.table, 'id="' + calendar.$node[0].id + '_table' + '" ' + _.ariaAttr({ role: 'grid', controls: calendar.$node[0].id, readonly: true })) +
            _.node('div', _.node('button', settings.today, settings.klass.buttonToday, 'type=button data-pick=' + nowObject.pick +
                (isOpen && !calendar.disabled(nowObject) ? '' : ' disabled') + ' ' +
                _.ariaAttr({ controls: calendar.$node[0].id })) +
                _.node('button', settings.clear, settings.klass.buttonClear, 'type=button data-clear=1' +
                    (isOpen ? '' : ' disabled') + ' ' +
                    _.ariaAttr({ controls: calendar.$node[0].id })) +
                _.node('button', settings.close, settings.klass.buttonClose, 'type=button data-close=true ' +
                    (isOpen ? '' : ' disabled') + ' ' +
                    _.ariaAttr({ controls: calendar.$node[0].id })), settings.klass.footer)
    }
    DatePicker.defaults = (function (prefix) { return { labelMonthNext: 'Next month', labelMonthPrev: 'Previous month', labelMonthSelect: 'Select a month', labelYearSelect: 'Select a year', monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], weekdaysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], today: 'Today', clear: 'Clear', close: 'Close', closeOnSelect: true, closeOnClear: true, format: 'd mmmm, yyyy', klass: { table: prefix + 'table', header: prefix + 'header', navPrev: prefix + 'nav--prev', navNext: prefix + 'nav--next', navDisabled: prefix + 'nav--disabled', month: prefix + 'month', year: prefix + 'year', selectMonth: prefix + 'select--month', selectYear: prefix + 'select--year', weekdays: prefix + 'weekday', day: prefix + 'day', disabled: prefix + 'day--disabled', selected: prefix + 'day--selected', highlighted: prefix + 'day--highlighted', now: prefix + 'day--today', infocus: prefix + 'day--infocus', outfocus: prefix + 'day--outfocus', footer: prefix + 'footer', buttonClear: prefix + 'button--clear', buttonToday: prefix + 'button--today', buttonClose: prefix + 'button--close' } } })(Picker.klasses().picker + '__')
    Picker.extend('pickadate', DatePicker)
}));; (function ($, undefined) {
    'use strict'; var currentIdx = 0, interval = {}, total = 0, $current = null, $gallery = $('.js-carousel'), CLICK = 'click', ON = 'on', SLIDE_SELECTOR = '.slide', TIMING = 6000; function init() { total = $gallery.find(SLIDE_SELECTOR).length; $current = $gallery.find(SLIDE_SELECTOR + ':first'); var $el; interval = requestInterval(onNext, TIMING); }
    function restartCycle() { }
    function onNext() {
        ++currentIdx; if (currentIdx === total) { currentIdx = 0; }
        show();
    }
    function show() { var $targ = $current; $current.stop().fadeTo(600, 0, function () { $targ.hide(); }); $current = $gallery.find(SLIDE_SELECTOR + ':nth-child(' + (currentIdx + 1) + ')'); $current.stop().fadeTo(600, 1); }
    $(init);
}(jQuery)); (function ($, undefined) {
    function getCookie(name) {
        var cookieValue = null; if (document.cookie && document.cookie !== '') { var cookies = document.cookie.split(';'); for (var i = 0; i < cookies.length; i++) { var cookie = jQuery.trim(cookies[i]); if (cookie.substring(0, name.length + 1) == (name + '=')) { cookieValue = decodeURIComponent(cookie.substring(name.length + 1)); break; } } }
        return cookieValue;
    }
    var CSRF_TOKEN = getCookie('csrftoken'); function csrfSafeMethod(method) { return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method)); }
    function sameOrigin(url) { var host = document.location.host, protocol = document.location.protocol, sr_origin = '//' + host, origin = protocol + sr_origin; return (url == origin || url.slice(0, origin.length + 1) == origin + '/') || (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') || !(/^(\/\/|http:|https:).*/.test(url)); }
    $.ajaxSetup({ beforeSend: function (xhr, settings) { if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) { xhr.setRequestHeader("X-CSRFToken", CSRF_TOKEN); } } });
}(jQuery));; (function ($, undefined) {
    $.filerWrapper = function (el, $el, options) {
        var _this = this, img; _this.$el = $el; _this.el = el; function init() { _this.options = $.extend({}, $.filerWrapper.defaults, options); _this.img = _this.$el.find('img'); _this.img.load(function () { _this.setWidth(); }); }
        _this.setWidth = function (e) { _this.$el.width(_this.img.width()); }; init();
    }; $.filerWrapper.defaults = {}; $.fn.filerWrapper = function (options) { return this.each(function (idx, el) { var $el = $(el), key = 'filerWrapper'; if (!$el.data(key)) { $el.data(key, new $.filerWrapper(el, $el, options)); } }); };
})(jQuery);; (function ($, undefined) {
    $.mobileNav = function (el, $el, options) {
        var _this = this, target, $target, dataAttr, openerVal, closerVal, $subnavOpener = $('.main-nav .mobile-expand'); _this.$el = $el; _this.el = el; function init() { _this.options = $.extend({}, $.mobileNav.defaults, options); _this.$target = $(_this.options.target); _this.$el.click(_this.toggleNav); getScreenSize(); $(window).resize(getScreenSize); }
        function getScreenSize() { if (window.innerWidth < 750) { setListeners(); } else { removeListeners(); } }
        function setListeners() { $subnavOpener.unbind('click').click(_this.toggleSubnav); }
        function removeListeners() { $subnavOpener.unbind('click'); }
        _this.toggleNav = function (e) { e.preventDefault(); if (_this.$target.attr(_this.options.dataAttr) === 'open') { _this.$target.attr(_this.options.dataAttr, 'closed'); } else { _this.$target.attr(_this.options.dataAttr, 'open'); } }; _this.toggleSubnav = function (e) { var $parent = $(this).parent(); var $menu = $parent.find('ul'); if ($parent.hasClass('active')) { $menu.animate({ opacity: 0, }, 100, function () { $parent.removeClass('active'); }); } else { $parent.siblings().removeClass('active'); $menu.animate({ opacity: 1, }, 100, function () { $parent.addClass('active'); }); } }; init();
    }; $.mobileNav.defaults = { dataAttr: 'data-mobile-nav', openerVal: 'opener', closerVal: 'closer', }; $.fn.mobileNav = function (options) { return this.each(function (idx, el) { var $el = $(el), key = 'mobileNav'; if (!$el.data(key)) { $el.data(key, new $.mobileNav(el, $el, options)); } }); };
})(jQuery);; (function ($, undefined) {
    var $menuItems = $('.main-nav > li'), $newItem, newLabel, debounceEnterMenuItem = debounce(enterMenuItem, 100), debounceLeaveMenuItem = debounce(leaveMenuItem, 100), current = { 'item': '', 'label': '', 'mouseover': '', }; function init() { getScreenSize(); $(window).resize(getScreenSize); }
    function getScreenSize() { if (window.innerWidth > 750) { setListeners(); } else { removeListeners(); } }
    function setListeners() { $menuItems.mouseenter(function () { $newItem = $(this); newLabel = $newItem.find('> a').text(); current.mouseover = newLabel; debounceEnterMenuItem(); }).mouseleave(function () { current.mouseover = ''; debounceLeaveMenuItem(); }); }
    function removeListeners() { $menuItems.unbind(); }
    function enterMenuItem() { showMegaMenu($newItem); current.item = $newItem; current.label = newLabel; }
    function leaveMenuItem() { if (current.mouseover !== current.label) { hideMegaMenu(current.item); } }
    function showMegaMenu($item) { var $menu = $item.find('ul'); $menu.animate({ opacity: 1 }, 100); $item.addClass('active'); }
    function hideMegaMenu($item) { var $menu = $item.find('ul'); $menu.animate({ opacity: 0 }, 100); $item.removeClass('active'); }
    $(init);
}(jQuery)); (function ($, undefined) {
    var $body = $('body'), $search = $('.main-nav .search-bar'), $input = $search.find('input[type="text"]'), $btn = $search.find('button[type="submit"]'), open = false; function init() { $btn.click(openOrSearch); }
    function openOrSearch(e) { e.preventDefault(); if (open) { if ($input.val() === '' || $input.val() === $input.attr('placeholder')) { return } else { $search.submit(); } } else { $search.addClass('open'); open = true; $body.click(closeSearch); } }
    function closeSearch(e) { if ($(e.target).closest($search).length === 0) { $search.removeClass('open'); open = false; $body.off(); } }
    $(init);
}(jQuery));; (function ($, undefined) {
    $.toggleTarget = function (el, $el, options) {
        var _this = this, target, $target, dataAttr, openVal, closedVal; _this.$el = $el; _this.el = el; function init() { _this.options = $.extend({}, $.toggleTarget.defaults, options); _this.$target = $(_this.options.target); _this.$ancestor = $(_this.options.ancestor); _this.$el.click(_this.toggler); }
        _this.toggler = function (e) { e.preventDefault(); if (_this.$el.hasClass(_this.options.openVal)) { _this.$target.fadeOut('medium'); _this.$target.attr(_this.options.dataAttr, _this.options.closedVal); _this.$el.removeClass(_this.options.openVal); if (_this.$ancestor) { _this.$ancestor.removeClass(_this.options.openVal); } } else { _this.$target.fadeIn('medium'); _this.$target.attr(_this.options.dataAttr, _this.options.openVal); _this.$el.addClass(_this.options.openVal); if (_this.$ancestor) { _this.$ancestor.addClass(_this.options.openVal); } } }; init();
    }; $.toggleTarget.defaults = { dataAttr: 'data-is-open', openVal: 'open', closedVal: 'closed', ancestor: '.js-toggle-wrap', target: '.js-toggle-target' }; $.fn.toggleTarget = function (options) { return this.each(function (idx, el) { var $el = $(el), key = 'toggleTarget'; if (!$el.data(key)) { $el.data(key, new $.toggleTarget(el, $el, options)); } }); };
})(jQuery); var APP = (function ($, undefined) {
    'use strict'; var app = {}, $el; function init() {
        $('a[href=#]').attr('href', 'javascript:;'); $("a[href^=http]").click(open); $.ajaxSetup({ cache: false, error: function errorLog(x, e) { if (typeof console !== 'undefined') { console.log(x, e); } }, type: 'POST' }); if (!Modernizr.input.placeholder) { placeholder(); }
        $('.js-datepicker').pickadate(); $('.js-filer-image-wrapper').filerWrapper(); $('.mobile-nav-btn').mobileNav({ target: 'body', })
        $('.js-toggle').toggleTarget();
    }
    function open(e) { var href = this.getAttribute('href'); if (window.location.host !== href.split('/')[2]) { e.preventDefault(); window.open(href); } }
    function placeholder() {
        var attr = 'placeholder'; $('input[' + attr + '!=""]').each(function (idx, el) {
            $el = $(el); var d = $el.attr(attr); if (d === undefined || $el.attr('type') === 'password') { return; }
            $el.focus(function onFocus() { $(this).removeClass(attr); if (this.value === d) { this.value = ''; } }).blur(function onBlur() { if ($.trim(this.value) === '') { $(this).addClass(attr); this.value = d; } }).blur();
        });
    }
    $(init); return app;
}(jQuery));