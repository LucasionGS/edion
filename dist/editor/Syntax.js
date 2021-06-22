"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
exports.default = new class Syntax {
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
        this.__FUNCTIONS = (line) => line.replace(/[^\.\s\(\)]+(?=\()/g, "$&".yellow);
        this.__OOP_KEYWORDS = (line) => line.replace(/(\b|^|\s+)(else|if|import|from|export|default|this|class|delete|public|private|protected|function|return|for|in|of|switch|case|break|continue|interface|namespace|use|using|type|as|static|unsigned|signed|long)\b/g, "$&".cyan);
        this.__DYNAMIC_KEYWORDS = (line) => line.replace(/(\b|^|\s+)(var|let|const)\b/g, "$&".cyan);
        this.__STATIC_KEYWORDS = (line) => line.replace(/(\b|^|\s+)(int|string|bool|boolean|char)\b/g, "$&".cyan);
        this.__PRIMITIVE_VALUES = (line) => line.replace(/(\b|^|\s+)(\d+(?:\.\d+)?|true|false|null|undefined|void)\b/g, "$&".blue);
        this.__DASH_PARAMETER = (line) => line.replace(/(\b|^|\s+)(-[\S]*)\b/g, "$&".gray);
        // Languages
        /**
         * JavaScript Objection Notation
         */
        this.json = (line) => {
            [
                this.__DOUBLE_SLASH_LINE_COMMENT,
                this.__DOUBLE_QUOTES,
                this.__PRIMITIVE_VALUES,
            ].forEach(func => line = func(line));
            return line;
        };
        /**
         * TypeScript
         */
        this.ts = (line, i) => {
            [
                this.__SHEBANG,
                this.__DOUBLE_SLASH_LINE_COMMENT,
                this.__SLASH_STAR_BLOCK_COMMENT,
                this.__DOUBLE_QUOTES,
                this.__SINGLE_QUOTES,
                this.__BACKTICK_QUOTES,
                this.__OOP_KEYWORDS,
                this.__DYNAMIC_KEYWORDS,
                this.__STATIC_KEYWORDS,
                this.__PRIMITIVE_VALUES,
                this.__FUNCTIONS,
                line => line.replace(/(?<=\w+\s*:\s*)\w+/g, "$&".cyan) // TypeScript explicit types
            ].forEach(func => line = func(line, i));
            return line;
        };
        /**
         * JavaScript.
         *
         * Based of TypeScript
         */
        this.js = this.ts;
        /**
         * C#/CSharp
         */
        this.cs = (line) => {
            [
                this.__DOUBLE_SLASH_LINE_COMMENT,
                this.__SLASH_STAR_BLOCK_COMMENT,
                this.__DOUBLE_QUOTES,
                this.__SINGLE_QUOTES,
                this.__OOP_KEYWORDS,
                this.__DYNAMIC_KEYWORDS,
                this.__STATIC_KEYWORDS,
                this.__PRIMITIVE_VALUES,
                this.__FUNCTIONS
            ].forEach(func => line = func(line));
            return line;
        };
        /**
         * C/C++/ino
         */
        this.c = (line) => {
            [
                this.__DOUBLE_SLASH_LINE_COMMENT,
                this.__SLASH_STAR_BLOCK_COMMENT,
                this.__DOUBLE_QUOTES,
                this.__SINGLE_QUOTES,
                this.__OOP_KEYWORDS,
                this.__DYNAMIC_KEYWORDS,
                this.__STATIC_KEYWORDS,
                this.__PRIMITIVE_VALUES,
                this.__FUNCTIONS
            ].forEach(func => line = func(line));
            return line;
        };
        this.cpp = this.c;
        this.ino = this.c;
        /**
         * Bourne-again shell / Bash
         */
        this.sh = (line) => {
            [
                this.__POUNDSIGN_LINE_COMMENT,
                this.__PRIMITIVE_VALUES,
                this.__DASH_PARAMETER,
            ].forEach(func => line = func(line));
            return line;
        };
        /**
         * LUA
         */
        this.lua = (line) => {
            [
                this.__DOUBLE_DASH_LINE_COMMENT,
                this.__OOP_KEYWORDS,
                (line) => line.replace(// adds more lua keyword highlighting
                /(\b|^|\s+)(local|then|end)\b/g, "$&".cyan),
                this.__PRIMITIVE_VALUES,
                this.__FUNCTIONS,
                this.__DOUBLE_QUOTES,
                this.__SINGLE_QUOTES,
            ].forEach(func => line = func(line));
            return line;
        };
        /**
         * Ini data file
         */
        this.ini = (line) => {
            [
                this.__POUNDSIGN_LINE_COMMENT,
                line => line.replace(/^\s*\[.*?\]/g, "$&".bgBlue),
                line => line.replace(/^\s*\w+/g, "$&".cyan),
            ].forEach(func => line = func(line));
            return line;
        };
        this.inf = this.ini;
    }
};
//# sourceMappingURL=Syntax.js.map