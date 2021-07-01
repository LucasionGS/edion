export default new class Colors {
  
  
  private _Reset = "\u001b[0m";
  Reset(str: string) {
    return this._Reset + str + this._Reset;
  }

  // Regular colors
  private _Black = "\u001b[30m";
  Black(str: string) {
    return this._Black + str + this._Reset;
  }

  private _Red = "\u001b[31m";
  Red(str: string) {
    return this._Red + str + this._Reset;
  }

  private _Green = "\u001b[32m";
  Green(str: string) {
    return this._Green + str + this._Reset;
  }

  private _Yellow = "\u001b[33m";
  Yellow(str: string) {
    return this._Yellow + str + this._Reset;
  }

  private _Blue = "\u001b[34m";
  Blue(str: string) {
    return this._Blue + str + this._Reset;
  }

  private _Magenta = "\u001b[35m";
  Magenta(str: string) {
    return this._Magenta + str + this._Reset;
  }

  private _Cyan = "\u001b[36m";
  Cyan(str: string) {
    return this._Cyan + str + this._Reset;
  }

  private _White = "\u001b[37m";
  White(str: string) {
    return this._White + str + this._Reset;
  }

  // Bright colors
  private _BrightBlack = "\u001b[30;1m";
  BrightBlack(str: string) {
    return this._BrightBlack + str + this._Reset;
  }
  
  private _BrightRed = "\u001b[31;1m";
  BrightRed(str: string) {
    return this._BrightRed + str + this._Reset;
  }
  
  private _BrightGreen = "\u001b[32;1m";
  BrightGreen(str: string) {
    return this._BrightGreen + str + this._Reset;
  }
  
  private _BrightYellow = "\u001b[33;1m";
  BrightYellow(str: string) {
    return this._BrightYellow + str + this._Reset;
  }
  
  private _BrightBlue = "\u001b[34;1m";
  BrightBlue(str: string) {
    return this._BrightBlue + str + this._Reset;
  }
  
  private _BrightMagenta = "\u001b[35;1m";
  BrightMagenta(str: string) {
    return this._BrightMagenta + str + this._Reset;
  }
  
  private _BrightCyan = "\u001b[36;1m";
  BrightCyan(str: string) {
    return this._BrightCyan + str + this._Reset;
  }
  
  private _BrightWhite = "\u001b[37;1m";
  BrightWhite(str: string) {
    return this._BrightWhite + str + this._Reset;
  }
}