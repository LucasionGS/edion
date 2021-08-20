import Editor from "./editor/Editor";
import History from "./editor/History";
import Syntax, { getLanguageName } from "./editor/Syntax";

export default async function main(args: string[]) {
  { // Block because why not
    const [first] = args;
    if (!first) return import("./package.json").then(pg => {
      console.error(
        [
          `Edion CLI Text Editor - Version ${pg.version} by Lucasion`,
          "",
          "Usage: edi <filename> [--debug]",
          "All parameters using the filename must come after the filename",
        ].join("\n")
      );
    });

    // Special params
    if (first == "--langs") {
      let longest = 0;
      return console.log(
        [
          "Supported Languages".underline.bold,
          ...(() => {
            const langs: [string, string][] = [];
            let key: keyof typeof Syntax;
            let keyPairValues: { [description: string]: string[] } = {};
            for (key in Syntax) {
              if (!(key in Syntax) || key.startsWith("__") || typeof Syntax[key] !== "function") continue;
              let desc = getLanguageName(key);
              if (!keyPairValues[desc]) keyPairValues[desc] = [];
              keyPairValues[desc].push(key);
            }
            
            for (let description in keyPairValues) {
              let languages = keyPairValues[description].join("/");
              if (languages.length > longest) longest = languages.length;
              langs.push([ languages, description ]);
            }
            return langs;
          })().map(l => l[0] + " ".repeat(longest - l[0].length) + " | " + l[1])
        ].join("\n")
      )
    }
    else if (first === "--history" || first === "-h") {
      const [,second] = args;
      const history = History.getHistory();
      if (
        second
        && !isNaN(+second)
        && +second >= 0
        && +second < history.length
        && +second < History.maxSize) {
        args[0] = history[+second];
      }
      else {
        return console.log(
          [
            "History".underline.bold,
            ...history.map((h, i) => `[${i}] ${h}`).reverse(),
            `Select an index number with: ${"edi -h <index>".gray}`,
          ].join("\n")
        );
      }
    }
  }

  const [
    path
  ] = args;  
  
  History.add(path);
  new Editor(path, args);
}