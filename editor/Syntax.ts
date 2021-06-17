import "colors";

export default new class Syntax implements LanguageFunctions {
  public json(line: string) {
    ([
      // Quotes
      line => line.replace(/"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"/sg, "$&".cyan)
    ] as LanguageFunction[]).forEach(
      func => line = func(line)
    );

    return line;
  }
}

type LanguageFunction = (line: string) => string;

interface LanguageFunctions {
  json: LanguageFunction;
}