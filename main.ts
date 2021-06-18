import Editor from "./editor/Editor";

export default function main(args: string[]) {
  if (!args[0]) return import("./package.json").then(pg => {
    console.error(
      [
        `Edion CLI Text Editor - Version ${pg.version} by Lucasion`,
        "",
        "Usage: edi <filename> [--debug]",
        "All parameters must come after the filename",
      ].join("\n")
    );
  })
  const [
    path
  ] = args;

  console.log(args);
  
  
  new Editor(path, args);
}