import joplin from 'api';
import { ContentScriptType } from 'api/types';
import { SettingItemType } from 'api/types';

const DEFAULT_DEFINITIONS = '[["datetime", "now", [ "dd/mm/yyyy HH:MM", "yyyy-mm-dd\\"T\\"HH:MM:ss" ] ], ["datetime", "date", [ "dd/mm/yyyy", "yyyy-mm-dd" ] ], ["datetime", "time", [ "HH:MM", "HH:MM:ss" ] ], ["string", "greet", [ "Hello World" ] ], ["string", "task", [ "- [ ] " ] ], ["string", "todotxt", [ "```todotxt sort:default\\n\\n```" ] ], ["datetime", "todoa", [ "\\"(A)\\" yyyy-mm-dd " ] ], ["datetime", "todob", [ "\\"(B)\\" yyyy-mm-dd " ] ], ["datetime", "todoc", [ "\\"(C)\\" yyyy-mm-dd " ] ], ["datetime", "todod", [ "\\"(D)\\" yyyy-mm-dd " ] ], ["datetime", "todoe", [ "\\"(E)\\" yyyy-mm-dd " ] ] ]';

joplin.plugins.register({
  onStart: async function() {
    async function updateSlashCommands(){
      const defstring   = await joplin.settings.value('slash_definitions') as string;
      try {
        const definitions = JSON.parse(defstring);
        await joplin.commands.execute('editor.execCommand', {name: "setOption", args: ["slashCommands", definitions]});
        console.log("Slash Commands: Sucessfully loaded " + defstring);
      } catch (error) {
        console.log("ERROR: Slash Commands Plugin has failed to parse commands definition, please check your syntax");
        console.log("ERROR: " + error);
      }
    }

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
    await joplin.settings.onChange(updateSlashCommands);

    updateSlashCommands();
  },
});
