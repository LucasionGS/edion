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
  private SHEBANG = (line: string, i: number) => i === 0 ? line.replace(/^#!.*/, "$&".gray) : line;

  // Quotes
  private DOUBLE_QUOTES = (line: string) => line.replace(/"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"/sg, "$&".gray);
  private SINGLE_QUOTES = (line: string) => line.replace(/'[^'\\\\]*(?:\\\\.[^'\\\\]*)*'/sg, "$&".gray);
  // Comments
  private BACKTICK_QUOTES = (line: string) => line.replace(/`[^`\\\\]*(?:\\\\.[^`\\\\]*)*`/sg, "$&".gray);
  private SLASH_STAR_BLOCK_COMMENT = (line: string) => line.replace(/\/\*.*\*\//g, "$&".green);
  private DOUBLE_SLASH_LINE_COMMENT = (line: string) => line.replace(/\/\/.*/g, "$&".green);
  private DOUBLE_DASH_LINE_COMMENT = (line: string) => line.replace(/\-\-.*/g, "$&".green);

  private POUNDSIGN_LINE_COMMENT = (line: string) => line.replace(/#.*/g, "$&".green);
  private FUNCTIONS = (line: string) => line.replace(/[^\.\s\(\)]+(?=\()/g, Colors.brightYellow("$&"));
  private OOP_KEYWORDS = (line: string) => line.replace(
    /(\b|^|\s+)(else|if|import|from|export|default|this|class|delete|public|private|protected|function|return|for|in|of|switch|case|break|continue|interface|namespace|use|using|type|as|static|unsigned|signed)\b/g,
    Colors.cyan("$&"));
  private DYNAMIC_KEYWORDS = (line: string) => line.replace(
    /(\b|^|\s+)(var|let|const)\b/g,
    "$&".cyan);
  private STATIC_KEYWORDS = (line: string) => line.replace(
    /(\b|^|\s+)(int|string|bool|boolean|char|long)\b/g,
    "$&".cyan);
  private PRIMITIVE_VALUES = (line: string) => line.replace(
    /(\b|^|\s+)(\d+(?:\.\d+)?|true|false|null|undefined|void)\b/g,
    "$&".blue);
  private DASH_PARAMETER = (line: string) => line.replace(
    /(\b|^|\s+)(-[\S]*)\b/g,
    "$&".gray);
  private REGEXP = (line: string) => line.replace(
    /(\b|^|\s+)(\/.+\/([gis]*))(\b|$|\s+)/g,
    Colors.brightRed("$&"));
    
  // Languages
  /**
   * JavaScript Objection Notation
   */
  public json = createFunc(
    this.DOUBLE_SLASH_LINE_COMMENT,
    this.DOUBLE_QUOTES,
    this.PRIMITIVE_VALUES,
  );

  /**
   * TypeScript
   */
  public ts = createFunc(
    this.SHEBANG,
    this.DOUBLE_SLASH_LINE_COMMENT,
    this.SLASH_STAR_BLOCK_COMMENT,
    this.DOUBLE_QUOTES,
    this.SINGLE_QUOTES,
    this.BACKTICK_QUOTES,
    this.OOP_KEYWORDS,
    this.DYNAMIC_KEYWORDS,
    this.STATIC_KEYWORDS,
    this.PRIMITIVE_VALUES,
    this.FUNCTIONS,
    this.REGEXP,
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
    this.DOUBLE_SLASH_LINE_COMMENT,
    this.SLASH_STAR_BLOCK_COMMENT,
    this.DOUBLE_QUOTES,
    this.SINGLE_QUOTES,
    this.OOP_KEYWORDS,
    this.DYNAMIC_KEYWORDS,
    this.STATIC_KEYWORDS,
    this.PRIMITIVE_VALUES,
    this.FUNCTIONS
  )

  /**
   * C/C++/ino
   */
  public c = createFunc(
    this.DOUBLE_SLASH_LINE_COMMENT,
    this.SLASH_STAR_BLOCK_COMMENT,
    this.DOUBLE_QUOTES,
    this.SINGLE_QUOTES,
    this.OOP_KEYWORDS,
    this.DYNAMIC_KEYWORDS,
    this.STATIC_KEYWORDS,
    this.PRIMITIVE_VALUES,
    this.FUNCTIONS,
  )

  public cc = this.c;
  public cpp = this.c;
  public ino = this.c;

  /**
   * Bourne-again shell / Bash
   */
  public sh = createFunc(
    this.POUNDSIGN_LINE_COMMENT,
    this.PRIMITIVE_VALUES,
    this.DASH_PARAMETER,
  )

  /**
   * LUA
   */
  public lua = createFunc(
    this.DOUBLE_DASH_LINE_COMMENT,
    this.OOP_KEYWORDS,
    (line: string) => line.replace( // adds more lua keyword highlighting
      /(\b|^|\s+)(local|then|end)\b/g,
      Colors.brightCyan("$&")),
    this.PRIMITIVE_VALUES,
    this.FUNCTIONS,
    this.DOUBLE_QUOTES,
    this.SINGLE_QUOTES,
  )

  /**
   * Python
   */
  public py = createFunc(
    this.POUNDSIGN_LINE_COMMENT,
    this.OOP_KEYWORDS,
    (line: string) => line.replace( // adds more lua keyword highlighting
      /(\b|^|\s+)(local|then|end)\b/g,
      Colors.brightCyan("$&")),
    this.PRIMITIVE_VALUES,
    line => line.replace(
      /(\b|^|\s+)(def|define)\b/g,
      "$&".cyan),
    this.FUNCTIONS,
    this.DOUBLE_QUOTES,
    this.SINGLE_QUOTES,
  )

  /**
   * Ini data file
   */
  public ini = createFunc(
    this.POUNDSIGN_LINE_COMMENT,
    line => line.replace(/^\s*\[.*?\]/g, "$&".bgBlue),
    line => line.replace(/^\s*\w+/g, "$&".cyan),
  )

  public inf = this.ini;

  /**
   * HTML file
   */
  public html = createFunc(
    this.SINGLE_QUOTES,
    this.DOUBLE_QUOTES,
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
    this.SHEBANG,
    this.DOUBLE_SLASH_LINE_COMMENT,
    this.SLASH_STAR_BLOCK_COMMENT,
    this.BACKTICK_QUOTES,
    this.OOP_KEYWORDS,
    this.DYNAMIC_KEYWORDS,
    this.STATIC_KEYWORDS,
    this.PRIMITIVE_VALUES,
    this.FUNCTIONS,
    this.REGEXP,
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

    default: return null;
  }
}