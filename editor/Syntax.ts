import "colors";

export default new class Syntax implements LanguageFunctions {
  // Common Regexes
  private __DOUBLE_QUOTES = (line: string) => line.replace(/"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"/sg, "$&".gray);
  private __SINGLE_QUOTES = (line: string) => line.replace(/'[^'\\\\]*(?:\\\\.[^'\\\\]*)*'/sg, "$&".gray);
  private __BACKTICK_QUOTES = (line: string) => line.replace(/`[^`\\\\]*(?:\\\\.[^`\\\\]*)*`/sg, "$&".gray);
  private __SLASH_STAR_BLOCK_COMMENT = (line: string) => line.replace(/\/\*.*\*\//g, "$&".green);
  private __DOUBLE_SLASH_LINE_COMMENT = (line: string) => line.replace(/\/\/.*/g, "$&".green);
  private __POUNDSIGN_LINE_COMMENT = (line: string) => line.replace(/#.*/g, "$&".green);
  private __FUNCTIONS = (line: string) => line.replace(/[^\.\s]+(?=\()/g, "$&".red);
  private __OOP_KEYWORDS = (line: string) => line.replace(
    /(\b|^|\s+)(else|if|import|from|export|default|this|class|delete|public|private|protected|function|return|for|in|of|switch|case|break|continue|interface|type|as)\b/g,
    "$&".cyan);
  private __DYNAMIC_KEYWORDS = (line: string) => line.replace(
    /(\b|^|\s+)(var|let|const)\b/g,
    "$&".cyan);
  private __STATIC_KEYWORDS = (line: string) => line.replace(
    /(\b|^|\s+)(int|string|bool|boolean|char)\b/g,
    "$&".cyan);
  private __PRIMITIVE_VALUES = (line: string) => line.replace(
    /(\b|^|\s+)(\d+(?:\.\d+)?|true|false|null|undefined|void)\b/g,
    "$&".blue);
  private __DASH_PARAMETER = (line: string) => line.replace(
    /(\b|^|\s+)(-[\S]*)\b/g,
    "$&".gray);

  // Languages
  /**
   * JavaScript Objection Notation
   */
  public json(line: string) {
    ([
      this.__DOUBLE_SLASH_LINE_COMMENT,
      this.__DOUBLE_QUOTES,
      this.__PRIMITIVE_VALUES,
    ] as LanguageFunction[]).forEach(
      func => line = func(line)
    );

    return line;
  }

  /**
   * JavaScript
   */
  public js(line: string) {
    return this.ts(line);
  }

  /**
   * TypeScript
   */
  public ts(line: string) {
    ([
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
    ] as LanguageFunction[]).forEach(
      func => line = func(line)
    );

    return line;
  }
  
  public sh(line: string) {
    ([
      this.__POUNDSIGN_LINE_COMMENT,
      this.__PRIMITIVE_VALUES,
      this.__DASH_PARAMETER,
    ] as LanguageFunction[]).forEach(
      func => line = func(line)
    );

    return line;
  }
}

type LanguageFunction = (line: string) => string;

interface LanguageFunctions {
  json: LanguageFunction;
  ts: LanguageFunction;
  js: LanguageFunction;
  sh: LanguageFunction;
}