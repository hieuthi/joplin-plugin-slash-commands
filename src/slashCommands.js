const Command = require('./command.js');

const COMMAND_PREFIX = '/';

module.exports = {
  default: function(_context) { 

    function plugin(CodeMirror) {

      function createCommands(definitions) {
        const commands = [];
        for (let i=0; i<definitions.length; i++) {
          var command = Command.create(definitions[i]);
          if (command) {commands.push(command)};
        }
        return commands;
      }

      async function showSlashHints(cm, change){
        if (!cm.state.completionActive && cm.state.slashCommands && change.text[0] == COMMAND_PREFIX) {
          const hintFunc = async function(cm, callback) {
            const cursor = cm.getCursor();
            const token  = cm.getRange(change.from, cursor);
            let hints = [];
            for (let i=0; i<cm.state.slashCommands.length; i++){
              hints = hints.concat(cm.state.slashCommands[i].getHints(token))
            }
            callback({
              list: hints,
              from: change.from,
              to  : change.to,
            });
          };

          CodeMirror.showHint(cm, hintFunc, {
            completeSingle: false,
            closeOnUnfocus: true,
            async: true,
            closeCharacters: /[()\[\]{};>,.`'"]/
          });
        }
      }

      CodeMirror.defineOption("slashCommands", false, async function(cm, val, old) {
        if (old && old != CodeMirror.Init) {
          cm.state.slashCommands = null;
          cm.off('inputRead', showSlashHints );
        }
        if (val){
          cm.on('inputRead', showSlashHints);
          setTimeout( async function() {
            const definitions = await _context.postMessage("get-definitions");
            if (definitions && definitions.length > 0){
              cm.state.slashCommands = createCommands(definitions);
            }
          }, 1000);
        }
      });
    };

    return {
      plugin: plugin,
      codeMirrorResources: [ 'addon/hint/show-hint' ],
      codeMirrorOptions: {'slashCommands': false},
      assets: function() {
        return [ { name: './hints.css'} ];
      }
    }
  },
}