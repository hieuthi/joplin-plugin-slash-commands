/* Modified for Joplin Slash Commands plugin and to
 * support explicit locale specifying
 *
 * Copyright (C) Hieu-Thi Luong
 * Released under MIT license
 */

const FWLOCALES_ = ["ja-JP", "zh-CN", "zh-HK", "zh-MO", "zh-SG", "zh-TW"];

/* Simple ASCII Calendar similar to Linux cal command
 *
 * Copyright (C) Jakub T. Jankiewicz <https://jcubic.pl>
 * Released under MIT license
 */

// base code from Codpen
// https://codepen.io/jcubic/pen/dyoJQQv?editors=1010

var cal = (function() {
    var SEPARATOR = '  ';
    var LANG = typeof window !== 'undefined' ? window.navigator.language : undefined;

    var shiftCharCode = Δ => c => String.fromCharCode(c.charCodeAt(0) + Δ);
    var toFullWidth = str => str.replace(/[!-~]/g, shiftCharCode(0xFEE0)).replace(/ /g, "　");
    var toHalfWidth = str => str.replace(/[!-～]/g, shiftCharCode(-0xFEE0)).replace(/　/g, " ");

    // ----------------------------------------------------------------------------------
    function get_day_count(year, month) {
        if (month === 1) {
            return is_leap(year) ? 29 : 28;
        } else if ((month <= 6 && month % 2 == 0) || (month >= 7 && month % 2 === 1)) {
            return 31;
        } else {
            return 30;
        }
    }

    // ----------------------------------------------------------------------------------
    function is_leap(year) {
        return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
    }

    // ----------------------------------------------------------------------------------
    function repeat(str, n) {
        return new Array(n + 1).join(str);
    }

    // ----------------------------------------------------------------------------------
    function center(text, length) {
        var rep = repeat.bind(null, ' ');
        var n = (length - text.length) / 2;
        if (n % 1 === 0) {
            return rep(n) + text + rep(n);
        } else {
            return rep(Math.floor(n)) + text + rep(Math.ceil(n));
        }
    }

    // ----------------------------------------------------------------------------------
    function week_days(lang) {
        var result = [];
        for (var i = 0; i <= 6; ++i) {
            var d  = new Date(1970, 1, 1 + i);
            switch (lang){
                case 'vi-VN':
                    var ds = d.toLocaleString(lang, {weekday: 'long'}).split(' ')[1].substring(0, 2);
                    break;
                default:
                    var ds = d.toLocaleString(lang, {weekday: 'short'}).substring(0, 2);
            }
            ds = ds.length < 2 ? ' ' + ds : ds;
            result.push(ds);
        }
        return result.join(SEPARATOR);
    }

    // ----------------------------------------------------------------------------------
    function days(year, month) {
        var date = new Date(year,month,1);
        var start = date.getDay();
        var end = get_day_count(year, month);
        var result = [];
        var line = [];
        var i;
        for (i = 0; i < start; ++i) {
            line.push('  ');
        }
        var k = start;
        for (i = 0; i < end; ++i) {
            line.push((i + 1).toString().padStart(2, ' '));
            if (++k > 6) {
                k = 0;
                result.push(line.join(SEPARATOR));
                line = [];
            }
        }
        if (k) {
            result.push(line.join(SEPARATOR));
        }
        return result.join('\n');
    }

    // ----------------------------------------------------------------------------------
    return function generate(year, month, lang=null) {
        lang = lang || LANG;
        var result = [];
        var week = week_days(lang);
        var date = new Date(year,month,1);
        var month_label = date.toLocaleString(lang, { month: 'long' });
        result.push(center(month_label + ' ' + year, week.length));
        result.push(week);
        result.push(days(year, month));

        ret = result.join('\n');
        if (FWLOCALES_.includes(lang)){
            ret = toFullWidth(ret);
        }
        return ret;
    };
})();

module.exports = cal;
