# Slash Commands: Datetime & More

This plugin is a collection of utility commands that can be executed by typing corresponding keywords, which start with a slash. Current version supports three type of commands but more may be added in the future.


![screencap](https://raw.githubusercontent.com/hieuthi/joplin-plugin-slash-commands/main/docs/slash-commands-v1.0.0-screencap.gif)


## Usage
### String Command
- String commands simply replace a keyword with one of the predefined strings.
- **Built-in**: `/greet`, `/task`, `/todotxt`
- **Definition**: `[ "string" , "<keyword>", ["<string1>", "<string2>" ] ]`

### Datetime Command
- Datetime commands print out the current time using a predefined datestring format. Optionally you can offset the time by day, hour, and minutes or query a specific weekday.
- **Built-in**: `/now`, `/date`, `/time`, `/todoa`, `/todob`, `/todoc`, `/todod`, `/todoe`
- **Offset examples**: adding `/now+d-H:M`, subtracting `/now-d-H:M`
- **Offset formats**: `d-H:M`, `d-H`, `H:M`, `d`
- **Weekday examples**: next monday `/date@mon` (exclude today), last monday (or today if today is Monday) `/date@mon-1`
- **Weekday keywords**: `@1` or `@sun` for Sunday, `@2` or `@mon` for Monday, `@3` or `@tue` for Tuesday, `@4` or `@wed` for Wednesday, `@5` or `@thu` for Thursday, `@6` or `@fri` for Friday, `@7` or `@sat` for Saturday
- **Definition**: `[ "datetime" , "<keyword>", ["<format1>", "<format2>" ] ]`
- **Definition with international day and month names**: `[ "datetime" , "<keyword>", ["<format1>", "<format2>" ], {"dayNames": ["<Sun>", "<Mon>", "<Tue>", "<Wed>", "<Thu>", "<Fri>", "<Sat>", "<Sunday>", "<Monday>", "<Tuesday>", "<Wednesday>", "<Thursday>", "<Friday>", "<Saturday>"], "monthNames": ["<Jan>", "<Feb>", "<Mar>", "<Apr>", "<May>", "<Jun>", "<Jul>", "<Aug>", "<Sep>", "<Oct>", "<Nov>", "<Dec>", "<January>", "<February>", "<March>", "<April>", "<May>", "<June>", "<July>", "<August>", "<September>", "<October>", "<November>", "<December>"] } ]`
- This command uses [Javascript Date Format](https://blog.stevenlevithan.com/archives/date-time-format) to parse datestring. You can check the original library on how to form your own `format`.

### Calendar Command
- Calendar commands print out an ascii calendar of the current month or a specified month.
- **Built-in**: `/calendar`
- **Examples**: current month `/calendar`, specified month of the current year `/calendar-3`, specified month `/calendar-1-2022`
- **Definition**: `["calendar", "<keyword>", ["<locale1>", "<locale2>"] ]`
- Locales are string such as `en-US` or `ja-JP`. Locale can also be `null` which force the plugin to use system locale.

```
      December 2021       
Su  Mo  Tu  We  Th  Fr  Sa
             1   2   3   4
 5   6   7   8   9  10  11
12  13  14  15  16  17  18
19  20  21  22  23  24  25
26  27  28  29  30  31
```

### Customization
Even though there is only several **types** of commands, you can create many commands by set the command definitions in the plugin setting by yourself. The commands definitions is an array of array but due to some awkwardness with Javascript and JSON string parse you need to carefully escape it.

```
[
  ["datetime", "now", [ "dd/mm/yyyy HH:MM", "yyyy-mm-dd\"T\"HH:MM:ss" ] ],
  ["datetime", "date", [ "dd/mm/yyyy", "yyyy-mm-dd" ] ],
  ["datetime", "time", [ "HH:MM", "HH:MM:ss" ] ],
  ["datetime", "jdate", [ "yyyy年mm月dd日(ddd)"], { "dayNames": ["日", "月", "火", "水", "木", "金", "土", "日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"], "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]}],
  ["string", "greet", [ "Hello", "你好", "Bonjour", "Hallo", "नमस्ते", "こんにちは", "안녕하세요", "Hola", "Xin chào" ] ],
  ["string", "task", [ "- [ ] " ] ],
  ["string", "todotxt", [ "```todotxt sort:default\n\n```" ] ],
  ["datetime", "todoa", [ "\"(A)\" yyyy-mm-dd " ] ],
  ["datetime", "todob", [ "\"(B)\" yyyy-mm-dd " ] ],
  ["datetime", "todoc", [ "\"(C)\" yyyy-mm-dd " ] ],
  ["datetime", "todod", [ "\"(D)\" yyyy-mm-dd " ] ],
  ["datetime", "todoe", [ "\"(E)\" yyyy-mm-dd " ] ],
  ["calendar", "calendar", [null,"en-US","ja-JP"] ]
]
```

There is another awkwardness with Joplin Plugin Setting that only accept a single line value so you need to minify it like this.

```
[ ["datetime", "now", [ "dd/mm/yyyy HH:MM", "yyyy-mm-dd\"T\"HH:MM:ss" ] ], ["datetime", "date", [ "dd/mm/yyyy", "yyyy-mm-dd" ] ], ["datetime", "time", [ "HH:MM", "HH:MM:ss" ] ], ["datetime", "jdate", [ "yyyy年mm月dd日(ddd)"], { "dayNames": ["日", "月", "火", "水", "木", "金", "土", "日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"], "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]}], ["string", "greet", [ "Hello", "你好", "Bonjour", "Hallo", "नमस्ते", "こんにちは", "안녕하세요", "Hola", "Xin chào" ] ], ["string", "task", [ "- [ ] " ] ], ["string", "todotxt", [ "```todotxt sort:default\n\n```" ] ], ["datetime", "todoa", [ "\"(A)\" yyyy-mm-dd " ] ], ["datetime", "todob", [ "\"(B)\" yyyy-mm-dd " ] ], ["datetime", "todoc", [ "\"(C)\" yyyy-mm-dd " ] ], ["datetime", "todod", [ "\"(D)\" yyyy-mm-dd " ] ], ["datetime", "todoe", [ "\"(E)\" yyyy-mm-dd " ] ], ["calendar", "calendar", [null,"en-US","ja-JP"]] ]
```

I will try to improve the configuration process when I find a better solution. If you messed with the setting and the plugin is no longer work, try paste the above definitions to your setting or just leave the setting **BLANK** the plugin will automatically revert it back to the DEFAULT definition.

## Acknowledgements
- Many thanks to @roman-r-m for the great [Quick Link](https://github.com/roman-r-m/joplin-plugin-quick-links) plugin which I used a lot and also a reference for this plugin
- And Steven Levithan for a simple and easy-to-use [JavaScript Date Format Library](https://blog.stevenlevithan.com/archives/date-time-format)
- The Calendar Command is based on Jakub T. Jankiewicz's [ascii-calendar](https://github.com/jcubic/calendar) code.

## License

[MIT](https://raw.githubusercontent.com/hieuthi/joplin-plugin-slash-commands/main/LICENSE)
