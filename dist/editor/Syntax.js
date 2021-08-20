"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageName = void 0;
require("colors");
const Colors_1 = __importDefault(require("./Colors"));
function createFunc(...functions) {
    return (line, i) => {
        functions.forEach(func => line = func(line, i));
        return line;
    };
}
class Syntax {
    constructor() {
        //# Common Regexes
        this.__SHEBANG = (line, i) => i === 0 ? line.replace(/^#!.*/, "$&".gray) : line;
        // Quotes
        this.__DOUBLE_QUOTES = (line) => line.replace(/"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"/sg, "$&".gray);
        this.__SINGLE_QUOTES = (line) => line.replace(/'[^'\\\\]*(?:\\\\.[^'\\\\]*)*'/sg, "$&".gray);
        // Comments
        this.__BACKTICK_QUOTES = (line) => line.replace(/`[^`\\\\]*(?:\\\\.[^`\\\\]*)*`/sg, "$&".gray);
        this.__SLASH_STAR_BLOCK_COMMENT = (line) => line.replace(/\/\*.*\*\//g, "$&".green);
        this.__DOUBLE_SLASH_LINE_COMMENT = (line) => line.replace(/\/\/.*/g, "$&".green);
        this.__DOUBLE_DASH_LINE_COMMENT = (line) => line.replace(/\-\-.*/g, "$&".green);
        this.__POUNDSIGN_LINE_COMMENT = (line) => line.replace(/#.*/g, "$&".green);
        this.__FUNCTIONS = (line) => line.replace(/[^\.\s\(\)]+(?=\()/g, Colors_1.default.BrightYellow("$&"));
        this.__OOP_KEYWORDS = (line) => line.replace(/(\b|^|\s+)(else|if|import|from|export|default|this|class|delete|public|private|protected|function|return|for|in|of|switch|case|break|continue|interface|namespace|use|using|type|as|static|unsigned|signed)\b/g, Colors_1.default.Cyan("$&"));
        this.__DYNAMIC_KEYWORDS = (line) => line.replace(/(\b|^|\s+)(var|let|const)\b/g, "$&".cyan);
        this.__STATIC_KEYWORDS = (line) => line.replace(/(\b|^|\s+)(int|string|bool|boolean|char|long)\b/g, "$&".cyan);
        this.__PRIMITIVE_VALUES = (line) => line.replace(/(\b|^|\s+)(\d+(?:\.\d+)?|true|false|null|undefined|void)\b/g, "$&".blue);
        this.__DASH_PARAMETER = (line) => line.replace(/(\b|^|\s+)(-[\S]*)\b/g, "$&".gray);
        this.__REGEXP = (line) => line.replace(/(\b|^|\s+)(\/.+\/([gis]*))(\b|$|\s+)/g, Colors_1.default.BrightRed("$&"));
        // Languages
        /**
         * JavaScript Objection Notation
         */
        this.json = createFunc(this.__DOUBLE_SLASH_LINE_COMMENT, this.__DOUBLE_QUOTES, this.__PRIMITIVE_VALUES);
        /**
         * TypeScript
         */
        this.ts = createFunc(this.__SHEBANG, this.__DOUBLE_SLASH_LINE_COMMENT, this.__SLASH_STAR_BLOCK_COMMENT, this.__DOUBLE_QUOTES, this.__SINGLE_QUOTES, this.__BACKTICK_QUOTES, this.__OOP_KEYWORDS, this.__DYNAMIC_KEYWORDS, this.__STATIC_KEYWORDS, this.__PRIMITIVE_VALUES, this.__FUNCTIONS, this.__REGEXP);
        /**
         * JavaScript.
         *
         * Based of TypeScript
         */
        this.js = this.ts;
        /**
         * C#/CSharp
         */
        this.cs = createFunc(this.__DOUBLE_SLASH_LINE_COMMENT, this.__SLASH_STAR_BLOCK_COMMENT, this.__DOUBLE_QUOTES, this.__SINGLE_QUOTES, this.__OOP_KEYWORDS, this.__DYNAMIC_KEYWORDS, this.__STATIC_KEYWORDS, this.__PRIMITIVE_VALUES, this.__FUNCTIONS);
        /**
         * C/C++/ino
         */
        this.c = createFunc(this.__DOUBLE_SLASH_LINE_COMMENT, this.__SLASH_STAR_BLOCK_COMMENT, this.__DOUBLE_QUOTES, this.__SINGLE_QUOTES, this.__OOP_KEYWORDS, this.__DYNAMIC_KEYWORDS, this.__STATIC_KEYWORDS, this.__PRIMITIVE_VALUES, this.__FUNCTIONS);
        this.cc = this.c;
        this.cpp = this.c;
        this.ino = this.c;
        /**
         * Bourne-again shell / Bash
         */
        this.sh = createFunc(this.__POUNDSIGN_LINE_COMMENT, this.__PRIMITIVE_VALUES, this.__DASH_PARAMETER);
        /**
         * LUA
         */
        this.lua = createFunc(this.__DOUBLE_DASH_LINE_COMMENT, this.__OOP_KEYWORDS, (line) => line.replace(// adds more lua keyword highlighting
        /(\b|^|\s+)(local|then|end)\b/g, Colors_1.default.BrightCyan("$&")), this.__PRIMITIVE_VALUES, this.__FUNCTIONS, this.__DOUBLE_QUOTES, this.__SINGLE_QUOTES);
        /**
         * Python
         */
        this.py = createFunc(this.__POUNDSIGN_LINE_COMMENT, this.__OOP_KEYWORDS, (line) => line.replace(// adds more lua keyword highlighting
        /(\b|^|\s+)(local|then|end)\b/g, Colors_1.default.BrightCyan("$&")), this.__PRIMITIVE_VALUES, line => line.replace(/(\b|^|\s+)(def|define)\b/g, "$&".cyan), this.__FUNCTIONS, this.__DOUBLE_QUOTES, this.__SINGLE_QUOTES);
        /**
         * Ini data file
         */
        this.ini = createFunc(this.__POUNDSIGN_LINE_COMMENT, line => line.replace(/^\s*\[.*?\]/g, "$&".bgBlue), line => line.replace(/^\s*\w+/g, "$&".cyan));
        this.inf = this.ini;
        /**
         * HTML file
         */
        this.html = createFunc(this.__SINGLE_QUOTES, this.__DOUBLE_QUOTES, line => line.replace(/(?<=<)\/?[-\w]+(?=.*?>)?/g, "$&".cyan));
        /**
         * HTM file
         */
        this.htm = this.html;
        /**
         * PHP file
         */
        this.php = createFunc(this.html, this.__SHEBANG, this.__DOUBLE_SLASH_LINE_COMMENT, this.__SLASH_STAR_BLOCK_COMMENT, this.__BACKTICK_QUOTES, this.__OOP_KEYWORDS, this.__DYNAMIC_KEYWORDS, this.__STATIC_KEYWORDS, this.__PRIMITIVE_VALUES, this.__FUNCTIONS, this.__REGEXP);
    }
}
exports.default = new Syntax();
function getLanguageName(lang) {
    switch (lang) {
        case "c": return "C";
        case "ino":
        case "cpp":
        case "cc": return "C++";
        case "cs": return "C#";
        case "htm":
        case "html": return "HTML (HyperText Markdown Language)";
        case "inf":
        case "ini": return "INI";
        case "js": return "JavaScript";
        case "ts": return "TypeScript";
        case "json": return "JSON (JavaScript Object Notation)";
        case "lua": return "LUA";
        case "php": return "PHP (Php Hypertext Preprocessor)";
        case "py": return "Python";
        case "sh": return "Shell Script / Bash";
    }
    return null;
}
exports.getLanguageName = getLanguageName;
//# sourceMappingURL=Syntax.js.map