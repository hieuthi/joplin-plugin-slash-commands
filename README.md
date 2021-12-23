# Slash Commands: Datetime & More

This plugin is a collection of utility commands that can be executed by typing corresponding keywords, which start with a slash ('/'). Current version only supports two type of commands but more might be added in the future.


![screencap](https://raw.githubusercontent.com/hieuthi/joplin-plugin-slash-commands/main/docs/slash-commands-v1.0.0-screencap.gif)


## Usage
### String Command
- String commands simply replace a keyword with one of the predefined strings.
- **Built-in**: `/greet`, `/task`, `todotxt`
- **Definition**: `[ "string" , "<keyword>", ["<string1>", "<string2" ] ]`

### Datetime Command
- Datetime commands print out the current now with one of the predefined datestring format. Optionally you can offset the time by day, hour, and minutes
- **Built-in**: `/now`, `/date`, `/time`, `/todoa`, `/todob`, `/todoc`, `/todod`, `/todoe`
- **Offset examples**: adding `/now+d-H:M`, subtracting `/now-d-H:M`
- **Offset formats**: `d-H:M`, `d-H`, `H:M`, `d`
- **Definition**: `[ "string" , "<keyword>", ["<format1>", "<format2>" ] ]`
- This command uses [Javascript Date Format](https://blog.stevenlevithan.com/archives/date-time-format) to parse datestring. You can check the original library on how to form your own `format`.

### Customization
Even though there is only several types of commands, you can create many useful commands to serve your needs by setting the command definitions in the plugin setting by yourself. The commands definitions is an array of array but due to some awkwardness with Javascript and JSON string parse you need to carefully escape it.

```
[
  ["datetime", "now", [ "dd/mm/yyyy HH:MM", "yyyy-mm-dd\"T\"HH:MM:ss" ] ],
  ["datetime", "date", [ "dd/mm/yyyy", "yyyy-mm-dd" ] ],
  ["datetime", "time", [ "HH:MM", "HH:MM:ss" ] ],
  ["string", "greet", [ "Hello World" ] ],
  ["string", "task", [ "- [ ] " ] ],
  ["string", "todotxt", [ "```todotxt sort:default\n\n```" ] ],
  ["datetime", "todoa", [ "\"(A)\" yyyy-mm-dd " ] ],
  ["datetime", "todob", [ "\"(B)\" yyyy-mm-dd " ] ],
  ["datetime", "todoc", [ "\"(C)\" yyyy-mm-dd " ] ],
  ["datetime", "todod", [ "\"(D)\" yyyy-mm-dd " ] ],
  ["datetime", "todoe", [ "\"(E)\" yyyy-mm-dd " ] ]
]
```

There is another awkwardness with Joplin Plugin Setting that only accept a single line value so you need to minify it like this.

```
[["datetime", "now", [ "dd/mm/yyyy HH:MM", "yyyy-mm-dd\"T\"HH:MM:ss" ] ], ["datetime", "date", [ "dd/mm/yyyy", "yyyy-mm-dd" ] ], ["datetime", "time", [ "HH:MM", "HH:MM:ss" ] ], ["string", "greet", [ "Hello World" ] ], ["string", "task", [ "- [ ] " ] ], ["string", "todotxt", [ "```todotxt sort:default\n\n```" ] ], ["datetime", "todoa", [ "\"(A)\" yyyy-mm-dd " ] ], ["datetime", "todob", [ "\"(B)\" yyyy-mm-dd " ] ], ["datetime", "todoc", [ "\"(C)\" yyyy-mm-dd " ] ], ["datetime", "todod", [ "\"(D)\" yyyy-mm-dd " ] ], ["datetime", "todoe", [ "\"(E)\" yyyy-mm-dd " ] ] ]
```

I will try to improve the configuration process when I find a better solution. If you messed with the setting and the plugin is no longer work, try paste the above definitions to your setting.

## Acknowledgements
- Many thanks to @roman-r-m for the great [Quick Link](https://github.com/roman-r-m/joplin-plugin-quick-links) plugin which I used a lot and also a reference for this plugin
- And Steven Levithan for a simple and easy-to-use [JavaScript Date Format Library](https://blog.stevenlevithan.com/archives/date-time-format)

## License

[MIT](https://raw.githubusercontent.com/hieuthi/joplin-plugin-slash-commands/main/LICENSE)
