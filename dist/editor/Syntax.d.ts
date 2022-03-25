import "colors";
declare class Syntax {
    private SHEBANG;
    private DOUBLE_QUOTES;
    private SINGLE_QUOTES;
    private BACKTICK_QUOTES;
    private SLASH_STAR_BLOCK_COMMENT;
    private DOUBLE_SLASH_LINE_COMMENT;
    private DOUBLE_DASH_LINE_COMMENT;
    private POUNDSIGN_LINE_COMMENT;
    private FUNCTIONS;
    private OOP_KEYWORDS;
    private DYNAMIC_KEYWORDS;
    private STATIC_KEYWORDS;
    private PRIMITIVE_VALUES;
    private DASH_PARAMETER;
    private REGEXP;
    /**
     * JavaScript Objection Notation
     */
    json: (line: string, i: number) => string;
    /**
     * TypeScript
     */
    ts: (line: string, i: number) => string;
    /**
     * JavaScript.
     *
     * Based of TypeScript
     */
    js: (line: string, i: number) => string;
    /**
     * C#/CSharp
     */
    cs: (line: string, i: number) => string;
    /**
     * C/C++/ino
     */
    c: (line: string, i: number) => string;
    cc: (line: string, i: number) => string;
    cpp: (line: string, i: number) => string;
    ino: (line: string, i: number) => string;
    /**
     * Bourne-again shell / Bash
     */
    sh: (line: string, i: number) => string;
    /**
     * LUA
     */
    lua: (line: string, i: number) => string;
    /**
     * Python
     */
    py: (line: string, i: number) => string;
    /**
     * Ini data file
     */
    ini: (line: string, i: number) => string;
    inf: (line: string, i: number) => string;
    /**
     * HTML file
     */
    html: (line: string, i: number) => string;
    /**
     * HTM file
     */
    htm: (line: string, i: number) => string;
    /**
     * PHP file
     */
    php: (line: string, i: number) => string;
}
declare const _default: Syntax;
export default _default;
export declare function getLanguageName(lang: keyof Syntax): "C" | "C++" | "C#" | "HTML (HyperText Markdown Language)" | "INI" | "JavaScript" | "TypeScript" | "JSON (JavaScript Object Notation)" | "LUA" | "PHP (Php Hypertext Preprocessor)" | "Python" | "Shell Script / Bash";
