import joplin from 'api';
import { ContentScriptType } from 'api/types';
import { SettingItemType } from 'api/types';

const DEFAULT_DEFINITIONS = '[["datetime", "now", [ "dd/mm/yyyy HH:MM", "yyyy-mm-dd\\"T\\"HH:MM:ss" ] ], ["datetime", "date", [ "dd/mm/yyyy", "yyyy-mm-dd" ] ], ["datetime", "time", [ "HH:MM", "HH:MM:ss" ] ], ["string", "greet", [ "Hello", "你好", "Bonjour", "Hallo", "नमस्ते", "こんにちは", "안녕하세요", "Hola", "Xin chào" ] ], ["string", "task", [ "- [ ] " ] ], ["string", "todotxt", [ "```todotxt sort:default\\n\\n```" ] ], ["datetime", "todoa", [ "\\"(A)\\" yyyy-mm-dd " ] ], ["datetime", "todob", [ "\\"(B)\\" yyyy-mm-dd " ] ], ["datetime", "todoc", [ "\\"(C)\\" yyyy-mm-dd " ] ], ["datetime", "todod", [ "\\"(D)\\" yyyy-mm-dd " ] ], ["datetime", "todoe", [ "\\"(E)\\" yyyy-mm-dd " ] ], ["calendar", "calendar", ["en-us"] ], ["calendar", "calendar", [null,"en-US","ja-JP"] ] ]';

joplin.plugins.register({
  onStart: async function() {

    await joplin.contentScripts.register(
      ContentScriptType.CodeMirrorPlugin,
      'slashCommands',
      './slashCommands.js'
    );
    await joplin.settings.registerSection('settings.slashCommands', {
      label: 'Slash Commands',
      iconName: 'fas fa-exclamation'
    });
    await joplin.settings.registerSettings({
      'slash_definitions': {
        value: DEFAULT_DEFINITIONS,
        type: SettingItemType.String,
        section: 'settings.slashCommands',
        public: true,
        label: 'Slash Command Definitions',
        description: `You can customize the commands to your need but 
                      it has a very specific structure and one mistake will break the plugin completely.
                      Please check plugin github page for details.`
      },
    });
    await joplin.settings.onChange(function(){
      joplin.commands.execute('editor.execCommand', {name: "setOption", args: ["slashCommands", true]});
    });

    await joplin.contentScripts.onMessage('slashCommands', async (message:any) => {
      if (message == "get-definitions") {
        const defstring = await joplin.settings.value('slash_definitions') as string;
        try {
          const definitions = JSON.parse(defstring);
          console.log("Slash Commands: Sucessfully loaded " + defstring);
          return definitions;
        } catch (error) {
          console.log("ERROR: Slash Commands Plugin has failed to parse commands definition, please check your syntax");
          console.log("ERROR: " + error);
          return [];
        }
      }
      return null;
    });
  },
});
