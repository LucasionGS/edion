import "colors";

export default new class Syntax {
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
  private __FUNCTIONS = (line: string) => line.replace(/[^\.\s\(\)]+(?=\()/g, "$&".yellow);
  private __OOP_KEYWORDS = (line: string) => line.replace(
    /(\b|^|\s+)(else|if|import|from|export|default|this|class|delete|public|private|protected|function|return|for|in|of|switch|case|break|continue|interface|namespace|use|using|type|as|static|unsigned|signed|long)\b/g,
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
  public json = (line: string) => {
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
   * TypeScript
   */
  public ts = (line: string, i: number) => {
    ([
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
    ] as LanguageFunction[]).forEach(
      func => line = func(line, i)
    );

    return line;
  }

  /**
   * JavaScript.
   * 
   * Based of TypeScript
   */
  public js = this.ts;

  /**
   * C#/CSharp
   */
  public cs = (line: string) => {
    ([
      this.__DOUBLE_SLASH_LINE_COMMENT,
      this.__SLASH_STAR_BLOCK_COMMENT,
      this.__DOUBLE_QUOTES,
      this.__SINGLE_QUOTES,
      this.__OOP_KEYWORDS,
      this.__DYNAMIC_KEYWORDS,
      this.__STATIC_KEYWORDS,
      this.__PRIMITIVE_VALUES,
      this.__FUNCTIONS
    ] as LanguageFunction[]).forEach(
      func => line = func(line)
    );

    return line;
  }
  
  /**
   * C/C++/ino
   */
  public c = (line: string) => {
    ([
      this.__DOUBLE_SLASH_LINE_COMMENT,
      this.__SLASH_STAR_BLOCK_COMMENT,
      this.__DOUBLE_QUOTES,
      this.__SINGLE_QUOTES,
      this.__OOP_KEYWORDS,
      this.__DYNAMIC_KEYWORDS,
      this.__STATIC_KEYWORDS,
      this.__PRIMITIVE_VALUES,
      this.__FUNCTIONS
    ] as LanguageFunction[]).forEach(
      func => line = func(line)
    );

    return line;
  }

  public cpp = this.c;
  public ino = this.c;

  /**
   * Bourne-again shell / Bash
   */
  public sh = (line: string) => {
    ([
      this.__POUNDSIGN_LINE_COMMENT,
      this.__PRIMITIVE_VALUES,
      this.__DASH_PARAMETER,
    ] as LanguageFunction[]).forEach(
      func => line = func(line)
    );

    return line;
  }

  /**
   * LUA
   */
  public lua = (line: string) => {
    ([
      this.__DOUBLE_DASH_LINE_COMMENT,
      this.__OOP_KEYWORDS,
      (line: string) => line.replace( // adds more lua keyword highlighting
        /(\b|^|\s+)(local|then|end)\b/g,
        "$&".cyan),
      this.__PRIMITIVE_VALUES,
      this.__FUNCTIONS,
      this.__DOUBLE_QUOTES,
      this.__SINGLE_QUOTES,
    ] as LanguageFunction[]).forEach(
      func => line = func(line)
    );

    return line;
  }

  /**
   * Ini data file
   */
  public ini = (line: string) => {
    ([
      this.__POUNDSIGN_LINE_COMMENT,
      line => line.replace(/^\s*\[.*?\]/g, "$&".bgBlue),
      line => line.replace(/^\s*\w+/g, "$&".cyan),
    ] as LanguageFunction[]).forEach(
      func => line = func(line)
    );

    return line;
  }

  public inf = this.ini;
}

type LanguageFunction = (line: string, i?: number) => string;