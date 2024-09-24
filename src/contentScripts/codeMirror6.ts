import { ContentScriptContext } from "api/types";
import {
  Completion,
  CompletionContext,
  CompletionResult,
  insertCompletionText,
} from '@codemirror/autocomplete';
const Command = require("../command");

export default (pluginContext: ContentScriptContext) => {
  return {
    plugin: async (codeMirror: any) => {
      if (!codeMirror.cm6) {
        return; // Handled by ./codeMirror5.js
      }

      let commands: any[] = [];
      const provideCompletions = async (context: CompletionContext): Promise<CompletionResult> => {
        // Start on slash, match any characters that aren't in ()\[\]{};>,.`'"
        const prefix = context.matchBefore(/\/[^()\[\]{};>,.`'" ]*/);
        if (!prefix) {
          return null;
        }

        const searchText = prefix.text;
        // Completions generated from commands
        const commandCompletions: Completion[] = [];
        // Suggestions for commands
        const suggestions: Completion[] = [];

        for (const command of commands) {
          const hints = command.getHints(searchText);
          for (const hint of hints) {
            commandCompletions.push({
              label: hint.displayText,
              apply: (view, _completion, from, to) => {
                view.dispatch(
                  insertCompletionText(view.state, hint.text, from, to)
                );
              },
            });
          }

          if (command.keyword_.indexOf(searchText) === 0) {
            suggestions.push({
              label: `${command.icon_} ${command.keyword_}`,
              apply: (view, _completion, from, to) => {
                // The input.type userEvent allows the completion dialog to stay open
                // and provide suggestions for he completed command.
                const userEvent = 'input.type';

                view.dispatch({
                  changes: { insert: command.keyword_, from, to },
                }, { userEvent });
              },
            });
          }
        }

        return {
          from: prefix.from,
          options: commandCompletions.concat(suggestions),
          filter: false,
        };
      };

      codeMirror.addExtension([
        codeMirror.joplinExtensions.completionSource(provideCompletions),
      ]);

      codeMirror.registerCommand('updateSlashDefinitions', (definitions: any[]) => {
        commands = [];
        for (const definition of definitions) {
          const command = Command.create(definition);
          if (command) {
            commands.push(command);
          }
        }
      });
      pluginContext.postMessage('request-slash-definitions');
    }
  }
};
