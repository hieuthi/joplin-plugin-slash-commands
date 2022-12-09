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
            let supps = [];
            for (let i=0; i<cm.state.slashCommands.length; i++){
              var command = cm.state.slashCommands[i];
              let keyword = command.keyword_;
              let icon    = command.icon_;
              hints = hints.concat(command.getHints(token))
              if (token == keyword.substring(0,token.length)){
                supps.push({
                  text: keyword,
                  displayText: icon + '\t' + keyword,
                  hint: async (cm, data, completion) => {
                    const from = completion.from || data.from;
                    cm.replaceRange(keyword, from, cm.getCursor(), "complete");
                  },
                })
              }
            }
            hints = hints.concat(supps);
            callback({
              list: hints,
              from: change.from,
              to  : change.to,
            });
          };

          CodeMirror.showHint(cm, hintFunc, {
            completeSingle: false,
            closeOnUnfocus: true,
            completeSingle: false,
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