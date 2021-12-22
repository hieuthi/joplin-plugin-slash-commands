const dateFormat = require('./date.format.js');

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

  var sign=0, offsetD=0, offsetH=0, offsetM=0;
  var offset = token.slice(this.keyword_.length);
  if (offset.length > 0){
    sign = offset[0] == '+' ? 1 : offset[0] == '-' ? -1 : 0;
    if (sign==0) { return [] };
    if (offset.length > 1 ){
      offset = offset.slice(1);
      if (offset.indexOf('-') > 0){ // ['d-h:m','d-h']
        var params = offset.split('-');
        offsetD = parseInt(params[0]) || 0;
        if (params.length > 1) {
          params = params[1].split(':');
          offsetH = parseInt(params[0]) || 0;
          offsetM = params.length > 1 ? parseInt(params[1]) || 0 : offsetM;
        }
      } else { // ['h:m','d']
        var params = offset.split(':');
        if (params.length > 1 ) {
          offsetH = parseInt(params[0]) || 0;
          offsetM = parseInt(params[1]) || 0;
        } else {
          offsetD = parseInt(params[0]) || 0;
        }
      }
    }
  }

  let hints = [];
  const ts = new Date().getTime();
  const dt = new Date(ts + sign*(offsetD*8.64e+7 + offsetH*3.6e+6 + offsetM*0.6e+5))
  this.options_.forEach(option => {
    let text = dateFormat(dt, option);
    hints.push({
      text: text,
      displayText: '📅\t' + text + ' ',
      hint: async (cm, data, completion) => {
        const from = completion.from || data.from;
        cm.replaceRange(text, from, cm.getCursor(), "complete");
      },
    })
  })
  return hints;
};

module.exports = Command;