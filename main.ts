import Editor from "./editor/Editor";

export default function main(args: string[]) {
  if (!args[0]) return console.error("Must use supply filename");
  const [
    path
  ] = args;

  console.log(args);
  
  
  new Editor(path);
}