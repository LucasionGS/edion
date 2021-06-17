import Editor from "./editor/Editor";

const {stdin, stdout } = process;

export default function main(args: string[]) {
  if (!args[0]) return console.error("Must use args[0]");
  const [
    path
  ] = args;

  console.log(args);
  
  
  new Editor(path);
}

export const write: typeof stdout.write = function(...args: any[]) {
  return stdout.write(args[0], args[1], args[2]);
}