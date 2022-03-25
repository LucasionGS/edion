export default class Colors {
  
  
  private static _reset = "\u001b[0m";
  public static reset(str: string) {
    return Colors._reset + str + Colors._reset;
  }

  // Regular colors
  private static _black = "\u001b[30m";
  public static black(str: string) {
    return Colors._black + str + Colors._reset;
  }

  private static _red = "\u001b[31m";
  public static red(str: string) {
    return Colors._red + str + Colors._reset;
  }

  private static _green = "\u001b[32m";
  public static green(str: string) {
    return Colors._green + str + Colors._reset;
  }

  private static _yellow = "\u001b[33m";
  public static yellow(str: string) {
    return Colors._yellow + str + Colors._reset;
  }

  private static _blue = "\u001b[34m";
  public static blue(str: string) {
    return Colors._blue + str + Colors._reset;
  }

  private static _magenta = "\u001b[35m";
  public static magenta(str: string) {
    return Colors._magenta + str + Colors._reset;
  }

  private static _cyan = "\u001b[36m";
  public static cyan(str: string) {
    return Colors._cyan + str + Colors._reset;
  }

  private static _white = "\u001b[37m";
  public static white(str: string) {
    return Colors._white + str + Colors._reset;
  }

  // Bright colors
  private static _brightBlack = "\u001b[30;1m";
  public static brightBlack(str: string) {
    return Colors._brightBlack + str + Colors._reset;
  }
  
  private static _brightRed = "\u001b[31;1m";
  public static brightRed(str: string) {
    return Colors._brightRed + str + Colors._reset;
  }
  
  private static _brightGreen = "\u001b[32;1m";
  public static brightGreen(str: string) {
    return Colors._brightGreen + str + Colors._reset;
  }
  
  private static _brightYellow = "\u001b[33;1m";
  public static brightYellow(str: string) {
    return Colors._brightYellow + str + Colors._reset;
  }
  
  private static _brightBlue = "\u001b[34;1m";
  public static brightBlue(str: string) {
    return Colors._brightBlue + str + Colors._reset;
  }
  
  private static _brightMagenta = "\u001b[35;1m";
  public static brightMagenta(str: string) {
    return Colors._brightMagenta + str + Colors._reset;
  }
  
  private static _brightCyan = "\u001b[36;1m";
  public static brightCyan(str: string) {
    return Colors._brightCyan + str + Colors._reset;
  }
  
  private static _brightWhite = "\u001b[37;1m";
  public static brightWhite(str: string) {
    return Colors._brightWhite + str + Colors._reset;
  }
}