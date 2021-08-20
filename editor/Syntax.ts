import "colors";
import Colors from "./Colors";

function createFunc(...functions: LanguageFunction[]) {
  return (line: string, i: number) => {
    functions.forEach(func => line = func(line, i));
    return line;
  }
}

type LanguageFunction = (line: string, i?: number) => string;

class Syntax {
  //# Common Regexes
  private __SHEBANG = (line: string, i: number) => i === 0 ? line.replace(/^#!.*/, "$&".gray) : line;

  // Quotes
  private __DOUBLE_QUOTES = (line: string) => line.replace(/"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"/sg, "$&".gray);
  private __SINGLE_QUOTES = (line: string) => line.replace(/'[^'\\\\]*(?:\\\\.[^'\\\\]*)*'/sg, "$&".gray);
  // Comments
  private __BACKTICK_QUOTES = (line: string) => line.replace(/`[^`\\\\]*(?:\\\\.[^`\\\\]*)*`/sg, "$&".gray);
  private __SLASH_STAR_BLOCK_COMMENT = (line: string) => line.replace(/\/\*.*\*\//g, "$&".green);
  private __DOUBLE_SLASH_LINE_COMMENT = (line: string) => line.replace(/\/\/.*/g, "$&".green);
  private __DOUBLE_DASH_LINE_COMMENT = (line: string) => line.replace(/\-\-.*/g, "$&".green);

  private __POUNDSIGN_LINE_COMMENT = (line: string) => line.replace(/#.*/g, "$&".green);
  private __FUNCTIONS = (line: string) => line.replace(/[^\.\s\(\)]+(?=\()/g, Colors.BrightYellow("$&"));
  private __OOP_KEYWORDS = (line: string) => line.replace(
    /(\b|^|\s+)(else|if|import|from|export|default|this|class|delete|public|private|protected|function|return|for|in|of|switch|case|break|continue|interface|namespace|use|using|type|as|static|unsigned|signed)\b/g,
    Colors.Cyan("$&"));
  private __DYNAMIC_KEYWORDS = (line: string) => line.replace(
    /(\b|^|\s+)(var|let|const)\b/g,
    "$&".cyan);
  private __STATIC_KEYWORDS = (line: string) => line.replace(
    /(\b|^|\s+)(int|string|bool|boolean|char|long)\b/g,
    "$&".cyan);
  private __PRIMITIVE_VALUES = (line: string) => line.replace(
    /(\b|^|\s+)(\d+(?:\.\d+)?|true|false|null|undefined|void)\b/g,
    "$&".blue);
  private __DASH_PARAMETER = (line: string) => line.replace(
    /(\b|^|\s+)(-[\S]*)\b/g,
    "$&".gray);
  private __REGEXP = (line: string) => line.replace(
    /(\b|^|\s+)(\/.+\/([gis]*))(\b|$|\s+)/g,
    Colors.BrightRed("$&"));
    
  // Languages
  /**
   * JavaScript Objection Notation
   */
  public json = createFunc(
    this.__DOUBLE_SLASH_LINE_COMMENT,
    this.__DOUBLE_QUOTES,
    this.__PRIMITIVE_VALUES,
  );

  /**
   * TypeScript
   */
  public ts = createFunc(
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
    this.__REGEXP,
  )

  /**
   * JavaScript.
   * 
   * Based of TypeScript
   */
  public js = this.ts;

  /**
   * C#/CSharp
   */
  public cs = createFunc(
    this.__DOUBLE_SLASH_LINE_COMMENT,
    this.__SLASH_STAR_BLOCK_COMMENT,
    this.__DOUBLE_QUOTES,
    this.__SINGLE_QUOTES,
    this.__OOP_KEYWORDS,
    this.__DYNAMIC_KEYWORDS,
    this.__STATIC_KEYWORDS,
    this.__PRIMITIVE_VALUES,
    this.__FUNCTIONS
  )

  /**
   * C/C++/ino
   */
  public c = createFunc(
    this.__DOUBLE_SLASH_LINE_COMMENT,
    this.__SLASH_STAR_BLOCK_COMMENT,
    this.__DOUBLE_QUOTES,
    this.__SINGLE_QUOTES,
    this.__OOP_KEYWORDS,
    this.__DYNAMIC_KEYWORDS,
    this.__STATIC_KEYWORDS,
    this.__PRIMITIVE_VALUES,
    this.__FUNCTIONS,
  )

  public cc = this.c;
  public cpp = this.c;
  public ino = this.c;

  /**
   * Bourne-again shell / Bash
   */
  public sh = createFunc(
    this.__POUNDSIGN_LINE_COMMENT,
    this.__PRIMITIVE_VALUES,
    this.__DASH_PARAMETER,
  )

  /**
   * LUA
   */
  public lua = createFunc(
    this.__DOUBLE_DASH_LINE_COMMENT,
    this.__OOP_KEYWORDS,
    (line: string) => line.replace( // adds more lua keyword highlighting
      /(\b|^|\s+)(local|then|end)\b/g,
      Colors.BrightCyan("$&")),
    this.__PRIMITIVE_VALUES,
    this.__FUNCTIONS,
    this.__DOUBLE_QUOTES,
    this.__SINGLE_QUOTES,
  )

  /**
   * Python
   */
  public py = createFunc(
    this.__POUNDSIGN_LINE_COMMENT,
    this.__OOP_KEYWORDS,
    (line: string) => line.replace( // adds more lua keyword highlighting
      /(\b|^|\s+)(local|then|end)\b/g,
      Colors.BrightCyan("$&")),
    this.__PRIMITIVE_VALUES,
    line => line.replace(
      /(\b|^|\s+)(def|define)\b/g,
      "$&".cyan),
    this.__FUNCTIONS,
    this.__DOUBLE_QUOTES,
    this.__SINGLE_QUOTES,
  )

  /**
   * Ini data file
   */
  public ini = createFunc(
    this.__POUNDSIGN_LINE_COMMENT,
    line => line.replace(/^\s*\[.*?\]/g, "$&".bgBlue),
    line => line.replace(/^\s*\w+/g, "$&".cyan),
  )

  public inf = this.ini;

  /**
   * HTML file
   */
  public html = createFunc(
    this.__SINGLE_QUOTES,
    this.__DOUBLE_QUOTES,
    line => line.replace(/(?<=<)\/?[-\w]+(?=.*?>)?/g, "$&".cyan),
  )

  /**
   * HTM file
   */
  public htm = this.html;

  /**
   * PHP file
   */
  public php = createFunc(
    this.html,
    this.__SHEBANG,
    this.__DOUBLE_SLASH_LINE_COMMENT,
    this.__SLASH_STAR_BLOCK_COMMENT,
    this.__BACKTICK_QUOTES,
    this.__OOP_KEYWORDS,
    this.__DYNAMIC_KEYWORDS,
    this.__STATIC_KEYWORDS,
    this.__PRIMITIVE_VALUES,
    this.__FUNCTIONS,
    this.__REGEXP,
  );
}

export default new Syntax();

export function getLanguageName(lang: keyof Syntax) {
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