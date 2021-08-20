# Edion CLI editor
Edion is a text editor for the Terminal, tested and working on Windows and Linux.

It has a couple programming langages with Syntax highlighting, and more will be added over time.

## Install CLI
```bash
npm install -g edion
```

## Usage
Open any text file with the command
```bash
edi <path>
```

See the list of supported extensions with Syntax highlighting
```
edi --langs
```

Force a language to use for syntax highlighting, regardless of the path's extension.
```bash
edi <path> --lang=<extension>
```

## Supported Syntax Highlighting
```
json       | JSON (JavaScript Object Notation)
ts         | TypeScript
js         | JavaScript
cs         | C#
c          | C
cc/cpp/ino | C++
sh         | Shell Script / Bash
lua        | LUA
py         | Python
ini/inf    | INI
html/htm   | HTML (HyperText Markdown Language)
php        | PHP (Php Hypertext Preprocessor)
```