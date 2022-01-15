const dateFormat = require('./date.format.js');
const asciiCalendar = require('./ascii-calendar.js');

const LOCALES_ = ["af-ZA", "am-ET", "ar-AE", "ar-BH", "ar-DZ", "ar-EG", "ar-IQ", "ar-JO", "ar-KW", "ar-LB", "ar-LY", "ar-MA", "arn-CL", "ar-OM", "ar-QA", "ar-SA", "ar-SD", "ar-SY", "ar-TN", "ar-YE", "as-IN", "az-az", "az-Cyrl-AZ", "az-Latn-AZ", "ba-RU", "be-BY", "bg-BG", "bn-BD", "bn-IN", "bo-CN", "br-FR", "bs-Cyrl-BA", "bs-Latn-BA", "ca-ES", "co-FR", "cs-CZ", "cy-GB", "da-DK", "de-AT", "de-CH", "de-DE", "de-LI", "de-LU", "dsb-DE", "dv-MV", "el-CY", "el-GR", "en-029", "en-AU", "en-BZ", "en-CA", "en-cb", "en-GB", "en-IE", "en-IN", "en-JM", "en-MT", "en-MY", "en-NZ", "en-PH", "en-SG", "en-TT", "en-US", "en-ZA", "en-ZW", "es-AR", "es-BO", "es-CL", "es-CO", "es-CR", "es-DO", "es-EC", "es-ES", "es-GT", "es-HN", "es-MX", "es-NI", "es-PA", "es-PE", "es-PR", "es-PY", "es-SV", "es-US", "es-UY", "es-VE", "et-EE", "eu-ES", "fa-IR", "fi-FI", "fil-PH", "fo-FO", "fr-BE", "fr-CA", "fr-CH", "fr-FR", "fr-LU", "fr-MC", "fy-NL", "ga-IE", "gd-GB", "gd-ie", "gl-ES", "gsw-FR", "gu-IN", "ha-Latn-NG", "he-IL", "hi-IN", "hr-BA", "hr-HR", "hsb-DE", "hu-HU", "hy-AM", "id-ID", "ig-NG", "ii-CN", "in-ID", "is-IS", "it-CH", "it-IT", "iu-Cans-CA", "iu-Latn-CA", "iw-IL", "ja-JP", "ka-GE", "kk-KZ", "kl-GL", "km-KH", "kn-IN", "kok-IN", "ko-KR", "ky-KG", "lb-LU", "lo-LA", "lt-LT", "lv-LV", "mi-NZ", "mk-MK", "ml-IN", "mn-MN", "mn-Mong-CN", "moh-CA", "mr-IN", "ms-BN", "ms-MY", "mt-MT", "nb-NO", "ne-NP", "nl-BE", "nl-NL", "nn-NO", "no-no", "nso-ZA", "oc-FR", "or-IN", "pa-IN", "pl-PL", "prs-AF", "ps-AF", "pt-BR", "pt-PT", "qut-GT", "quz-BO", "quz-EC", "quz-PE", "rm-CH", "ro-mo", "ro-RO", "ru-mo", "ru-RU", "rw-RW", "sah-RU", "sa-IN", "se-FI", "se-NO", "se-SE", "si-LK", "sk-SK", "sl-SI", "sma-NO", "sma-SE", "smj-NO", "smj-SE", "smn-FI", "sms-FI", "sq-AL", "sr-BA", "sr-CS", "sr-Cyrl-BA", "sr-Cyrl-CS", "sr-Cyrl-ME", "sr-Cyrl-RS", "sr-Latn-BA", "sr-Latn-CS", "sr-Latn-ME", "sr-Latn-RS", "sr-ME", "sr-RS", "sr-sp", "sv-FI", "sv-SE", "sw-KE", "syr-SY", "ta-IN", "te-IN", "tg-Cyrl-TJ", "th-TH", "tk-TM", "tlh-QS", "tn-ZA", "tr-TR", "tt-RU", "tzm-Latn-DZ", "ug-CN", "uk-UA", "ur-PK", "uz-Cyrl-UZ", "uz-Latn-UZ", "uz-uz", "vi-VN", "wo-SN", "xh-ZA", "yo-NG", "zh-CN", "zh-HK", "zh-MO", "zh-SG", "zh-TW", "zu-ZA"];


// COMMAND Base Class
function Command(keyword, options) {
  this.keyword_ = keyword;
  this.options_ = options;
};
Command.prototype.getHints = function (token) {return null};
Command.create = function(definition, prefix='/') {
  if (definition.length < 3 ) { return null; }
  switch (definition[0]){
    case 'string':
      return new StringCommand(prefix + definition[1], definition[2]);
    case 'datetime':
      return new DatetimeCommand(prefix + definition[1], definition[2]);
    case 'calendar':
      return new CalendarCommand(prefix + definition[1], definition[2]);
    default:
      return null;
  }
}

// COMMAND: String
function StringCommand(keyword, options) { Command.call(this, keyword, options); };
StringCommand.prototype.getHints = function (token) {
  if (this.keyword_ !== token) {return [];}

  let hints = [];
  this.options_.forEach(option => {
    hints.push({
      text: option,
      displayText: '𝐓\t' + option.replace(/\n/gm,"⏎")  + ' ',
      hint: async (cm, data, completion) => {
        const from = completion.from || data.from;
        cm.replaceRange(option, from, cm.getCursor(), "complete");
      },
    })
  })
  return hints;
}

// COMMAND: Datetime 
function DatetimeCommand(keyword, options) {
  Command.call(this, keyword, options);
};
DatetimeCommand.prototype.getHints = function (token) {
  if (this.keyword_ > token.length) { return []; }
  if (this.keyword_ !== token.slice(0,this.keyword_.length)) {return [];}

  var weekday = 0;
  var sign=0, offsetD=0, offsetH=0, offsetM=0;
  var params = token.trim().slice(this.keyword_.length);

  var start = params.indexOf('@');
  if (start >= 0){
    for (var end = start+1; end<params.length; end++){
      var ch = params[end];
      if (/[a-zA-Z0-9]/.test(ch)==false){
        break;
      }
    }
    var query = params.slice(start+1,end)
    params = params.slice(0,start) + params.slice(end);
    switch (query.toLowerCase()){
      case '1':
      case 'sun':
        weekday=1; break;
      case '2':
      case 'mon':
        weekday=2; break;
      case '3':
      case 'tue':
        weekday=3; break;
      case '4':
      case 'wed':
        weekday=4; break;
      case '5':
      case 'thu':
        weekday=5; break;
      case '6':
      case 'fri':
        weekday=6; break;
      case '7':
      case 'sat':
        weekday=7; break;
      default:
        weekday=0;
    }
  }

  if (params.length > 0){
    sign = params[0] == '+' ? 1 : params[0] == '-' ? -1 : 0;
    if (sign==0) { return [] };
    if (params.length > 1 ){
      params = params.slice(1);
      if (params.indexOf('-') > 0){ // ['d-h:m','d-h']
        var args = params.split('-');
        offsetD = parseInt(args[0]) || 0;
        if (args.length > 1) {
          args = args[1].split(':');
          offsetH = parseInt(args[0]) || 0;
          offsetM = args.length > 1 ? parseInt(args[1]) || 0 : offsetM;
        }
      } else { // ['h:m','d']
        var args = params.split(':');
        if (args.length > 1 ) {
          offsetH = parseInt(args[0]) || 0;
          offsetM = parseInt(args[1]) || 0;
        } else {
          offsetD = parseInt(args[0]) || 0;
        }
      }
    }
  }

  let hints = [];
  const now = new Date();
  if (weekday==0){
    var dt = new Date(now.getTime() + sign*(offsetD*8.64e+7 + offsetH*3.6e+6 + offsetM*0.6e+5))
  } else {
    var offsetWD = ( weekday + 7 - 1 - now.getDay() ) % 7;
    offsetWD = offsetWD == 0 ? 7 : offsetWD;
    var dt = new Date(now.getTime() + offsetWD*8.64e+7 + sign*(offsetD*7*8.64e+7 + offsetH*3.6e+6 + offsetM*0.6e+5))
  }


  this.options_.forEach(option => {
    let text = dateFormat(dt, option);
    hints.push({
      text: text,
      displayText: '🕒\t' + text + ' ',
      hint: async (cm, data, completion) => {
        const from = completion.from || data.from;
        cm.replaceRange(text, from, cm.getCursor(), "complete");
      },
    })
  })
  return hints;
};


function CalendarCommand(keyword, options) { Command.call(this, keyword, options); };
CalendarCommand.prototype.getHints = function (token) {
  if (this.keyword_ > token.length) { return []; }
  if (this.keyword_ !== token.slice(0,this.keyword_.length)) {return [];}

  const now = new Date();
  var month = now.getMonth(),
      year  = now.getFullYear();

  var params = token.slice(this.keyword_.length);
  if (params.length > 0){
    if (params[0]!='-') { return []; }

    if (params.length > 1) {
      params = params.slice(1);
      args   = params.split('-');

      tmp   = parseInt(args[0]) || -1;
      month = tmp>0 && tmp<13 ? tmp - 1 : month;
      year  = args.length > 1 ? parseInt(args[1]) || year : year;
    }
  }

  let hints = [];
  let date = new Date(year,month,1);
  this.options_.forEach(option => {
    let text    = "";
    let display = "";

    if (option=="debug"){
      LOCALES_.forEach(lang => {
        text += `${lang}\n`;
        text += asciiCalendar(year, month, lang);
        text += "\n\n";
      })
      display = `📅\t${month+1} ${year} (DEBUG - all locales)`;
    } else if ( LOCALES_.includes(option) ){
      text    = asciiCalendar(year, month, option);
      display = `📅\t${date.toLocaleString(option, { month: 'long' })} ${year} (${option})`;
    } else {
      let lang = typeof window !== 'undefined' ? window.navigator.language : undefined
      text    = asciiCalendar(year, month, lang);
      display = `📅\t${date.toLocaleString(lang, { month: 'long' })} ${year} (${option} → ${lang})`;
    }
    hints.push({
      text: text,
      displayText: display,
      hint: async (cm, data, completion) => {
        const from = completion.from || data.from;
        cm.replaceRange(text, from, cm.getCursor(), "complete");
      },
    })
  })
  return hints;
}

module.exports = Command;