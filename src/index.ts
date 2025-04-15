import joplin from 'api';
import { ContentScriptType } from 'api/types';
import { SettingItemType } from 'api/types';

const DEFAULT_DEFINITIONS = '[ ["datetime", "now", [ "dd/mm/yyyy HH:MM", "yyyy-mm-dd\\\"T\\\"HH:MM:ss" ] ], ["datetime", "date", [ "dd/mm/yyyy", "yyyy-mm-dd" ] ], ["datetime", "time", [ "HH:MM", "HH:MM:ss" ] ], ["datetime", "jdate", [ "yyyy年mm月dd日（ddd）"], { "dayNames": ["日", "月", "火", "水", "木", "金", "土", "日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"], "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]}], ["string", "greet", [ "Hello", "你好", "Bonjour", "Hallo", "नमस्ते", "こんにちは", "안녕하세요", "Hola", "Xin chào" ] ], ["string", "task", [ "- [ ] " ] ], ["string", "todotxt", [ "```todotxt sort:default\\n\\n```" ] ], ["datetime", "todoa", [ "\\\"(A)\\\" yyyy-mm-dd " ] ], ["datetime", "todob", [ "\\\"(B)\\\" yyyy-mm-dd " ] ], ["datetime", "todoc", [ "\\\"(C)\\\" yyyy-mm-dd " ] ], ["datetime", "todod", [ "\\\"(D)\\\" yyyy-mm-dd " ] ], ["datetime", "todoe", [ "\\\"(E)\\\" yyyy-mm-dd " ] ], ["calendar", "calendar", [null,"en-US","ja-JP"]] ]';

joplin.plugins.register({
  onStart: async function() {
    await joplin.settings.registerSection('settings.slashCommands', {
      label: 'Slash Commands',
      iconName: 'fas fa-exclamation'
    });
    await joplin.settings.registerSettings({
      'slash_definitions': {
        value: '',
        type: SettingItemType.String,
        section: 'settings.slashCommands',
        public: true,
        label: 'Slash Command Definitions',
        description: `You can customize the commands to your need but 
                      it has a very specific structure and one mistake will break the plugin completely.
                      Please check plugin github page for details.`
      },
    });

    async function updateDefinitions() {
     var defstring = await joplin.settings.value('slash_definitions') as string;
      if (defstring.length < 1){
        defstring = DEFAULT_DEFINITIONS;
        joplin.settings.setValue('slash_definitions', DEFAULT_DEFINITIONS);
      }
      try {
        const definitions = JSON.parse(defstring);
        console.log("Slash Commands: Sucessfully loaded " + defstring);
        await joplin.commands.execute('editor.execCommand', {name: 'updateSlashDefinitions', args: [definitions]});
      } catch (error) {
        console.log("ERROR: Slash Commands Plugin has failed to parse commands definition, please check your syntax");
        console.log("ERROR: " + error);
      }
    }
    await joplin.settings.onChange(updateDefinitions);
    setTimeout(updateDefinitions, 1000);

    const registerSlashCommandsContentScript = async (id: string, path: string) => {
      await joplin.contentScripts.register(
        ContentScriptType.CodeMirrorPlugin,
        id,
        path,
      );

      // Each CodeMirror plugin needs its own ID, and thus, its own event listener.
      await joplin.contentScripts.onMessage(id, async (message: any) => {
        if (message == "request-slash-definitions") {
          await updateDefinitions();
        }
        return null;
      });
    };

    // await registerSlashCommandsContentScript(
    //   'slashCommands-cm5',
    //   './contentScripts/codeMirror5.js'
    // );
    await registerSlashCommandsContentScript(
      'slashCommands-cm6',
      './contentScripts/codeMirror6.js'
    );
  },
});
