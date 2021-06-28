import Editor from "./editor/Editor";
import Syntax from "./editor/Syntax";

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
      return console.log(
        [
          "Supported Languages".underline.bold,
          ...(() => {
            const langs: string[] = [];
            let key: string;
            for (key in Syntax) {
              if (!(key in Syntax) || key.startsWith("__") || typeof (Syntax as any)[key] !== "function") continue;
              langs.push(key);
            }
            return langs;
          })()
        ].join("\n")
      )
    }
  }

  const [
    path
  ] = args;  
  
  new Editor(path, args);
}